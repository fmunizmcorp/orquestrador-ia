/**
 * Auth tRPC Router
 * Authentication and authorization endpoints
 * 5 endpoints
 */
import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
export const authRouter = router({
    /**
     * 1. Register new user
     */
    register: publicProcedure
        .input(z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1),
        username: z.string().min(3).optional(),
    }))
        .mutation(async ({ input }) => {
        // Check if user exists
        const [existing] = await db.select()
            .from(users)
            .where(eq(users.email, input.email))
            .limit(1);
        if (existing) {
            throw new Error('User already exists');
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, 10);
        // Create user
        const result = await db.insert(users).values({
            email: input.email,
            passwordHash: hashedPassword,
            name: input.name,
            username: input.username || input.email.split('@')[0],
        });
        const userId = result[0]?.insertId || result.insertId;
        // Fetch created user
        const [user] = await db.select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);
        // Generate token
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username,
            },
            token,
        };
    }),
    /**
     * 2. Login
     */
    login: publicProcedure
        .input(z.object({
        email: z.string().email(),
        password: z.string(),
    }))
        .mutation(async ({ input }) => {
        // Find user
        const [user] = await db.select()
            .from(users)
            .where(eq(users.email, input.email))
            .limit(1);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        // Check password
        const valid = await bcrypt.compare(input.password, user.passwordHash);
        if (!valid) {
            throw new Error('Invalid credentials');
        }
        // Update last login
        await db.update(users)
            .set({ lastLoginAt: new Date() })
            .where(eq(users.id, user.id));
        // Generate token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username,
            },
            token,
        };
    }),
    /**
     * 3. Verify token
     */
    verifyToken: publicProcedure
        .input(z.object({
        token: z.string(),
    }))
        .query(async ({ input }) => {
        try {
            const decoded = jwt.verify(input.token, JWT_SECRET);
            const [user] = await db.select()
                .from(users)
                .where(eq(users.id, decoded.userId))
                .limit(1);
            if (!user) {
                throw new Error('User not found');
            }
            return {
                success: true,
                valid: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    username: user.username,
                },
            };
        }
        catch (error) {
            return {
                success: false,
                valid: false,
                error: 'Invalid token',
            };
        }
    }),
    /**
     * 4. Refresh token
     */
    refreshToken: publicProcedure
        .input(z.object({
        token: z.string(),
    }))
        .mutation(async ({ input }) => {
        try {
            const decoded = jwt.verify(input.token, JWT_SECRET);
            const [user] = await db.select()
                .from(users)
                .where(eq(users.id, decoded.userId))
                .limit(1);
            if (!user) {
                throw new Error('User not found');
            }
            // Generate new token
            const newToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
            return {
                success: true,
                token: newToken,
            };
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }),
    /**
     * 5. Logout (client-side token removal mainly)
     */
    logout: publicProcedure
        .mutation(async () => {
        return {
            success: true,
            message: 'Logged out successfully',
        };
    }),
});
