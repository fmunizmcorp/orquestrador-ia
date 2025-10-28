import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { externalAPIAccounts, credentials } from '../db/schema.js';
import { eq, and, like, desc } from 'drizzle-orm';
import { idSchema, createExternalAPIAccountSchema, updateExternalAPIAccountSchema, searchSchema } from '../utils/validation';

export const externalAPIAccountsRouter = router({
  list: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      const { query, page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      let conditions = [eq(externalAPIAccounts.userId, 1)];
      if (query) {
        conditions.push(like(externalAPIAccounts.accountName, `%${query}%`));
      }

      const where = and(...conditions);

      const items = await db.select({
        id: externalAPIAccounts.id,
        userId: externalAPIAccounts.userId,
        provider: externalAPIAccounts.provider,
        accountName: externalAPIAccounts.accountName,
        credentialId: externalAPIAccounts.credentialId,
        creditBalance: externalAPIAccounts.creditBalance,
        creditLimit: externalAPIAccounts.creditLimit,
        usageThisMonth: externalAPIAccounts.usageThisMonth,
        alertThreshold: externalAPIAccounts.alertThreshold,
        isActive: externalAPIAccounts.isActive,
        lastSync: externalAPIAccounts.lastSync,
        createdAt: externalAPIAccounts.createdAt,
        updatedAt: externalAPIAccounts.updatedAt,
      })
        .from(externalAPIAccounts)
        .where(where)
        .orderBy(desc(externalAPIAccounts.createdAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: externalAPIAccounts.id })
        .from(externalAPIAccounts)
        .where(where);

      return {
        items,
        pagination: {
          page,
          limit,
          total: countResult?.count || 0,
          totalPages: Math.ceil((countResult?.count || 0) / limit),
        },
      };
    }),

  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input: id }) => {
      const [account] = await db.select()
        .from(externalAPIAccounts)
        .where(eq(externalAPIAccounts.id, id))
        .limit(1);

      if (!account) {
        throw new Error('Conta de API externa não encontrada');
      }

      return account;
    }),

  create: publicProcedure
    .input(createExternalAPIAccountSchema)
    .mutation(async ({ input }) => {
      const [account] = await db.insert(externalAPIAccounts)
        .values(input)
        .$returningId();

      return { id: account.id, success: true };
    }),

  update: publicProcedure
    .input(updateExternalAPIAccountSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      await db.update(externalAPIAccounts)
        .set(data)
        .where(eq(externalAPIAccounts.id, id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(externalAPIAccounts)
        .where(eq(externalAPIAccounts.id, id));

      return { success: true };
    }),

  toggleActive: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      const [account] = await db.select()
        .from(externalAPIAccounts)
        .where(eq(externalAPIAccounts.id, id))
        .limit(1);

      if (!account) {
        throw new Error('Conta de API externa não encontrada');
      }

      await db.update(externalAPIAccounts)
        .set({ isActive: !account.isActive })
        .where(eq(externalAPIAccounts.id, id));

      return { success: true, isActive: !account.isActive };
    }),
});
