/**
 * Users tRPC Router
 * User management endpoints
 * 8 endpoints
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq, like, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const usersRouter = router({
  /**
   * 1. Get user by ID
   */
  getById: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);

      if (!user) {
        throw new Error('User not found');
      }

      // Don't return password hash
      const { passwordHash, ...safeUser } = user;

      return { success: true, user: safeUser };
    }),

  /**
   * 2. Get current user profile
   */
  getProfile: publicProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .query(async ({ input }) => {
      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, input.userId))
        .limit(1);

      if (!user) {
        throw new Error('User not found');
      }

      const { passwordHash, ...safeUser } = user;

      return { success: true, profile: safeUser };
    }),

  /**
   * 3. Update user profile
   */
  updateProfile: publicProcedure
    .input(z.object({
      userId: z.number(),
      name: z.string().optional(),
      username: z.string().optional(),
      email: z.string().email().optional(),
      avatarUrl: z.string().optional(),
      bio: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { userId, ...updates } = input;

      const [updated] = await db.update(users)
        .set(updates)
        .where(eq(users.id, userId))
        .returning();

      const { passwordHash, ...safeUser } = updated;

      return { success: true, user: safeUser };
    }),

  /**
   * 4. Change password
   */
  changePassword: publicProcedure
    .input(z.object({
      userId: z.number(),
      currentPassword: z.string(),
      newPassword: z.string().min(8),
    }))
    .mutation(async ({ input }) => {
      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, input.userId))
        .limit(1);

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const valid = await bcrypt.compare(input.currentPassword, user.passwordHash!);

      if (!valid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(input.newPassword, 10);

      // Update password
      await db.update(users)
        .set({ passwordHash: hashedPassword })
        .where(eq(users.id, input.userId));

      return { success: true, message: 'Password changed successfully' };
    }),

  /**
   * 5. List users
   */
  list: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).optional().default(50),
      offset: z.number().min(0).optional().default(0),
    }))
    .query(async ({ input }) => {
      const allUsers = await db.select()
        .from(users)
        .limit(input.limit)
        .offset(input.offset);

      // Remove password hashes
      const safeUsers = allUsers.map(({ passwordHash, ...user }) => user);

      return { success: true, users: safeUsers };
    }),

  /**
   * 6. Search users
   */
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      limit: z.number().min(1).max(50).optional().default(20),
    }))
    .query(async ({ input }) => {
      const results = await db.select()
        .from(users)
        .where(or(
          like(users.name, `%${input.query}%`),
          like(users.username, `%${input.query}%`),
          like(users.email, `%${input.query}%`)
        ))
        .limit(input.limit);

      const safeUsers = results.map(({ passwordHash, ...user }) => user);

      return { success: true, users: safeUsers };
    }),

  /**
   * 7. Update user preferences
   */
  updatePreferences: publicProcedure
    .input(z.object({
      userId: z.number(),
      preferences: z.any(),
    }))
    .mutation(async ({ input }) => {
      const [updated] = await db.update(users)
        .set({
          preferences: JSON.stringify(input.preferences),
        })
        .where(eq(users.id, input.userId))
        .returning();

      return { success: true, preferences: updated.preferences };
    }),

  /**
   * 8. Delete user account
   */
  deleteAccount: publicProcedure
    .input(z.object({
      userId: z.number(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, input.userId))
        .limit(1);

      if (!user) {
        throw new Error('User not found');
      }

      // Verify password
      const valid = await bcrypt.compare(input.password, user.passwordHash!);

      if (!valid) {
        throw new Error('Password is incorrect');
      }

      // Delete user (cascades will handle related data)
      await db.delete(users).where(eq(users.id, input.userId));

      return { success: true, message: 'Account deleted successfully' };
    }),
});
