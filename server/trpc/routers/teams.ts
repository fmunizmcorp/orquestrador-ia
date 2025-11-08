/**
 * Teams tRPC Router
 * Team management endpoints
 * 7 endpoints
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { db } from '../../db/index.js';
import { teams, teamMembers, users } from '../../db/schema.js';
import { eq, desc, like, sql } from 'drizzle-orm';
import pino from 'pino';
import { env, isDevelopment } from '../../config/env.js';
import {
  createStandardError,
  handleDatabaseError,
  handleGenericError,
  ErrorCodes,
  notFoundError,
  forbiddenError,
  validationError,
} from '../../utils/errors.js';
import {
  paginationInputSchema,
  optionalPaginationInputSchema,
  createPaginatedResponse,
  applyPagination,
} from '../../utils/pagination.js';

const logger = pino({ level: env.LOG_LEVEL, transport: isDevelopment ? { target: 'pino-pretty' } : undefined });

export const teamsRouter = router({
  /**
   * 1. List all teams
   */
  list: publicProcedure
    .input(optionalPaginationInputSchema)
    .query(async ({ input }) => {
      try {
        // Count total teams
        const [{ count: total }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(teams);

        // Get paginated teams
        const { limit, offset } = applyPagination(input);
        const allTeams = await db.select()
          .from(teams)
          .orderBy(desc(teams.createdAt))
          .limit(limit)
          .offset(offset);

        return createPaginatedResponse(allTeams, total || 0, input);
      } catch (error) {
        logger.error({ error }, 'Error listing teams');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'Team',
          suggestion: 'Tente novamente ou contate o suporte',
        });
      }
    }),

  /**
   * 2. Get team by ID
   */
  getById: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      try {
        const [team] = await db.select()
          .from(teams)
          .where(eq(teams.id, input.id))
          .limit(1);

        if (!team) {
          throw notFoundError('Team', input.id, 'Verifique o ID ou acesse a lista de equipes');
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
      } catch (error) {
        logger.error({ error, teamId: input.id }, 'Error getting team by ID');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'Team',
          resourceId: input.id,
          suggestion: 'Verifique se a equipe existe',
        });
      }
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
      try {
        logger.info({ input }, 'Creating team with input');
        
        const result: any = await db.insert(teams).values({
          name: input.name,
          description: input.description,
          ownerId: input.ownerId,
        });

        logger.info({ result }, 'Insert result received');
        
        const teamId = result[0]?.insertId || result.insertId;
        logger.info({ teamId }, 'Team ID extracted');
        
        if (!teamId) {
          logger.error({ result }, 'Failed to get team ID from insert result');
          throw createStandardError(
            'INTERNAL_SERVER_ERROR',
            ErrorCodes.INTERNAL_DATABASE_ERROR,
            'Falha ao criar equipe no banco de dados',
            {
              context: { name: input.name, ownerId: input.ownerId },
              technicalMessage: 'Failed to get insertId after team insert',
              suggestion: 'Tente novamente ou contate o suporte',
            }
          );
        }
        
        const [team] = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1);
        logger.info({ team }, 'Team retrieved from database');
        
        if (!team) {
          throw createStandardError(
            'INTERNAL_SERVER_ERROR',
            ErrorCodes.INTERNAL_DATABASE_ERROR,
            'Equipe criada mas não encontrada',
            {
              context: { teamId },
              technicalMessage: 'Team inserted but not found in select',
              suggestion: 'Contate o suporte',
            }
          );
        }

        // Add owner as first member
        logger.info({ teamId: team.id, userId: input.ownerId }, 'Adding owner as team member');
        await db.insert(teamMembers).values({
          teamId: team.id,
          userId: input.ownerId,
          role: 'owner',
        });

        logger.info({ teamId: team.id }, 'Team created successfully');
        return { success: true, team };
      } catch (error) {
        logger.error({ error, input }, 'Error creating team');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'Team',
          context: { name: input.name },
          suggestion: 'Verifique se o nome não está duplicado',
        });
      }
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
      try {
        const { id, ...updates } = input;

        await db.update(teams)
          .set(updates)
          .where(eq(teams.id, id));

        const [updated] = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
        
        if (!updated) {
          throw notFoundError('Team', id, 'A equipe pode ter sido deletada');
        }

        return { success: true, team: updated };
      } catch (error) {
        logger.error({ error, teamId: input.id }, 'Error updating team');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'Team',
          resourceId: input.id,
          suggestion: 'Verifique se a equipe existe',
        });
      }
    }),

  /**
   * 5. Delete team
   */
  delete: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Verify team exists before deletion
        const [team] = await db.select().from(teams).where(eq(teams.id, input.id)).limit(1);
        
        if (!team) {
          throw notFoundError('Team', input.id, 'A equipe já foi deletada ou não existe');
        }
        
        await db.delete(teams).where(eq(teams.id, input.id));
        return { success: true, message: 'Team deleted' };
      } catch (error) {
        logger.error({ error, teamId: input.id }, 'Error deleting team');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'Team',
          resourceId: input.id,
          suggestion: 'Verifique se a equipe existe',
        });
      }
    }),

  /**
   * 6. Get team members
   */
  getMembers: publicProcedure
    .input(z.object({
      teamId: z.number(),
    }))
    .query(async ({ input }) => {
      try {
        // Verify team exists
        const [team] = await db.select().from(teams).where(eq(teams.id, input.teamId)).limit(1);
        
        if (!team) {
          throw notFoundError('Team', input.teamId, 'Verifique o ID da equipe');
        }
        
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
      } catch (error) {
        logger.error({ error, teamId: input.teamId }, 'Error getting team members');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'Team',
          resourceId: input.teamId,
          suggestion: 'Verifique se a equipe existe',
        });
      }
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
      try {
        // Verify team exists
        const [team] = await db.select().from(teams).where(eq(teams.id, input.teamId)).limit(1);
        
        if (!team) {
          throw notFoundError('Team', input.teamId, 'Verifique o ID da equipe');
        }
        
        // Verify user exists
        const [user] = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
        
        if (!user) {
          throw notFoundError('User', input.userId, 'Verifique o ID do usuário');
        }
        
        const result: any = await db.insert(teamMembers).values({
          teamId: input.teamId,
          userId: input.userId,
          role: input.role,
        });

        const memberId = result[0]?.insertId || result.insertId;
        
        if (!memberId) {
          throw createStandardError(
            'INTERNAL_SERVER_ERROR',
            ErrorCodes.INTERNAL_DATABASE_ERROR,
            'Falha ao adicionar membro na equipe',
            {
              context: { teamId: input.teamId, userId: input.userId },
              technicalMessage: 'Failed to get insertId after team member insert',
              suggestion: 'Tente novamente ou contate o suporte',
            }
          );
        }
        
        const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, memberId)).limit(1);

        return { success: true, member };
      } catch (error) {
        logger.error({ error, input }, 'Error adding team member');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'TeamMember',
          context: { teamId: input.teamId, userId: input.userId },
          suggestion: 'Verifique se o usuário já não é membro da equipe',
        });
      }
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
      try {
        await db.update(teamMembers)
          .set({ role: input.role })
          .where(eq(teamMembers.id, input.memberId));

        const [updated] = await db.select().from(teamMembers).where(eq(teamMembers.id, input.memberId)).limit(1);
        
        if (!updated) {
          throw notFoundError('TeamMember', input.memberId, 'O membro pode ter sido removido');
        }

        return { success: true, member: updated };
      } catch (error) {
        logger.error({ error, memberId: input.memberId }, 'Error updating member role');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'TeamMember',
          resourceId: input.memberId,
          suggestion: 'Verifique se o membro existe',
        });
      }
    }),

  /**
   * 9. Remove member from team
   */
  removeMember: publicProcedure
    .input(z.object({
      memberId: z.number(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Verify member exists
        const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, input.memberId)).limit(1);
        
        if (!member) {
          throw notFoundError('TeamMember', input.memberId, 'O membro já foi removido ou não existe');
        }
        
        await db.delete(teamMembers).where(eq(teamMembers.id, input.memberId));
        return { success: true, message: 'Member removed' };
      } catch (error) {
        logger.error({ error, memberId: input.memberId }, 'Error removing team member');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'TeamMember',
          resourceId: input.memberId,
          suggestion: 'Verifique se o membro existe',
        });
      }
    }),
});
