import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { credentials } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { idSchema, createCredentialSchema, updateCredentialSchema, searchSchema } from '../utils/validation.js';
import { encrypt, decrypt, encryptJSON, decryptJSON } from '../utils/encryption.js';

export const credentialsRouter = router({
  list: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      const { page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      const items = await db.select({
        id: credentials.id,
        userId: credentials.userId,
        service: credentials.service,
        credentialType: credentials.credentialType,
        metadata: credentials.metadata,
        isActive: credentials.isActive,
        expiresAt: credentials.expiresAt,
        createdAt: credentials.createdAt,
        updatedAt: credentials.updatedAt,
      })
        .from(credentials)
        .where(eq(credentials.userId, 1))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: credentials.id })
        .from(credentials)
        .where(eq(credentials.userId, 1));

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
      const [cred] = await db.select()
        .from(credentials)
        .where(eq(credentials.id, id))
        .limit(1);

      if (!cred) {
        throw new Error('Credencial não encontrada');
      }

      // Descriptografar dados
      try {
        const decryptedData = decryptJSON(cred.encryptedData);
        return {
          ...cred,
          data: decryptedData,
          encryptedData: undefined,
        };
      } catch (error) {
        console.error('Erro ao descriptografar:', error);
        return {
          ...cred,
          data: null,
          encryptedData: undefined,
        };
      }
    }),

  create: publicProcedure
    .input(createCredentialSchema)
    .mutation(async ({ input }) => {
      const { data, ...rest } = input;

      // Criptografar dados
      const encryptedData = encryptJSON(data);

      const [cred] = await db.insert(credentials)
        .values({
          ...rest,
          encryptedData,
        })
        .returning();

      return { id: cred.id, success: true };
    }),

  update: publicProcedure
    .input(updateCredentialSchema)
    .mutation(async ({ input }) => {
      const { id, data, ...rest } = input;

      const updateData: any = rest;

      // Se dados foram fornecidos, criptografar
      if (data) {
        updateData.encryptedData = encryptJSON(data);
      }

      await db.update(credentials)
        .set(updateData)
        .where(eq(credentials.id, id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(credentials)
        .where(eq(credentials.id, id));

      return { success: true };
    }),

  toggleActive: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      const [cred] = await db.select()
        .from(credentials)
        .where(eq(credentials.id, id))
        .limit(1);

      if (!cred) {
        throw new Error('Credencial não encontrada');
      }

      await db.update(credentials)
        .set({ isActive: !cred.isActive })
        .where(eq(credentials.id, id));

      return { success: true, isActive: !cred.isActive };
    }),
});
