/**
 * Teams tRPC Router
 * Team management endpoints
 * 7 endpoints
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { db } from '../../db/index.js';
import { teams, teamMembers, users } from '../../db/schema.js';
import { eq, desc, like } from 'drizzle-orm';

export const teamsRouter = router({
  /**
   * 1. List all teams
   */
  list: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).optional().default(50),
      offset: z.number().min(0).optional().default(0),
    }))
    .query(async ({ input }) => {
      const allTeams = await db.select()
        .from(teams)
        .orderBy(desc(teams.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return { success: true, teams: allTeams };
    }),

  /**
   * 2. Get team by ID
   */
  getById: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const [team] = await db.select()
        .from(teams)
        .where(eq(teams.id, input.id))
        .limit(1);

      if (!team) {
        throw new Error('Team not found');
      }

      // Get members
      const members = await db.select()
        .from(teamMembers)
        .where(eq(teamMembers.teamId, input.id));

      return {
        success: true,
        team: {
          ...team,
          memberCount: members.length,
        },
      };
    }),

  /**
   * 3. Create new team
   */
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      ownerId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const result: any = await db.insert(teams).values({
        name: input.name,
        description: input.description,
        ownerId: input.ownerId,
      });

      const teamId = result[0]?.insertId || result.insertId;
      const [team] = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1);

      // Add owner as first member
      await db.insert(teamMembers).values({
        teamId: team.id,
        userId: input.ownerId,
        role: 'owner',
      });

      return { success: true, team };
    }),

  /**
   * 4. Update team
   */
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;

      await db.update(teams)
        .set(updates)
        .where(eq(teams.id, id));

      const [updated] = await db.select().from(teams).where(eq(teams.id, id)).limit(1);

      return { success: true, team: updated };
    }),

  /**
   * 5. Delete team
   */
  delete: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.delete(teams).where(eq(teams.id, input.id));
      return { success: true, message: 'Team deleted' };
    }),

  /**
   * 6. Get team members
   */
  getMembers: publicProcedure
    .input(z.object({
      teamId: z.number(),
    }))
    .query(async ({ input }) => {
      const members = await db.select()
        .from(teamMembers)
        .where(eq(teamMembers.teamId, input.teamId));

      // Get user details for each member
      const membersWithDetails = await Promise.all(
        members.map(async (member) => {
          const [user] = await db.select()
            .from(users)
            .where(eq(users.id, member.userId))
            .limit(1);

          return {
            ...member,
            user: user ? {
              id: user.id,
              name: user.name,
              email: user.email,
              username: user.username,
            } : null,
          };
        })
      );

      return { success: true, members: membersWithDetails };
    }),

  /**
   * 7. Add member to team
   */
  addMember: publicProcedure
    .input(z.object({
      teamId: z.number(),
      userId: z.number(),
      role: z.enum(['owner', 'admin', 'member', 'viewer']).optional().default('member'),
    }))
    .mutation(async ({ input }) => {
      const result: any = await db.insert(teamMembers).values({
        teamId: input.teamId,
        userId: input.userId,
        role: input.role,
      });

      const memberId = result[0]?.insertId || result.insertId;
      const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, memberId)).limit(1);

      return { success: true, member };
    }),

  /**
   * 8. Update member role
   */
  updateMemberRole: publicProcedure
    .input(z.object({
      memberId: z.number(),
      role: z.enum(['owner', 'admin', 'member', 'viewer']),
    }))
    .mutation(async ({ input }) => {
      await db.update(teamMembers)
        .set({ role: input.role })
        .where(eq(teamMembers.id, input.memberId));

      const [updated] = await db.select().from(teamMembers).where(eq(teamMembers.id, input.memberId)).limit(1);

      return { success: true, member: updated };
    }),

  /**
   * 9. Remove member from team
   */
  removeMember: publicProcedure
    .input(z.object({
      memberId: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.delete(teamMembers).where(eq(teamMembers.id, input.memberId));
      return { success: true, message: 'Member removed' };
    }),
});
