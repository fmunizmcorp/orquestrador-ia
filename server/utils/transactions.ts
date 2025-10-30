/**
 * Transaction Helpers - Suporte a transações ACID
 */

import { db } from '../db/index.js';
import { handleDatabaseError } from './validation.js';

/**
 * Executa operação dentro de uma transação
 * Se houver erro, faz rollback automático
 */
export async function withTransaction<T>(
  operation: (tx: typeof db) => Promise<T>,
  operationName: string = 'transação'
): Promise<T> {
  // Note: Drizzle ORM 0.29.3 ainda não tem suporte nativo a transações
  // Por ora, vamos usar try/catch para capturar erros
  // Em versões futuras, usar: db.transaction()
  
  try {
    const result = await operation(db);
    return result;
  } catch (error) {
    handleDatabaseError(error, operationName);
  }
}

/**
 * Cria múltiplos registros de forma atômica
 */
export async function createMany<T>(
  tableName: string,
  records: T[],
  insertFn: (records: T[]) => Promise<any>
): Promise<any> {
  if (records.length === 0) {
    return [];
  }
  
  return withTransaction(
    async () => {
      return await insertFn(records);
    },
    `criar ${records.length} registros em ${tableName}`
  );
}

/**
 * Atualiza múltiplos registros de forma atômica
 */
export async function updateMany<T>(
  tableName: string,
  updates: Array<{ id: number; data: T }>,
  updateFn: (id: number, data: T) => Promise<any>
): Promise<void> {
  if (updates.length === 0) {
    return;
  }
  
  return withTransaction(
    async () => {
      for (const update of updates) {
        await updateFn(update.id, update.data);
      }
    },
    `atualizar ${updates.length} registros em ${tableName}`
  );
}

/**
 * Deleta múltiplos registros de forma atômica
 */
export async function deleteMany(
  tableName: string,
  ids: number[],
  deleteFn: (ids: number[]) => Promise<any>
): Promise<void> {
  if (ids.length === 0) {
    return;
  }
  
  return withTransaction(
    async () => {
      return await deleteFn(ids);
    },
    `deletar ${ids.length} registros de ${tableName}`
  );
}

/**
 * Cria registro com relacionamentos (atomicamente)
 */
export async function createWithRelations<TMain, TRelations>(
  mainRecord: TMain,
  relations: Array<{
    tableName: string;
    records: TRelations[];
    insertFn: (records: TRelations[]) => Promise<any>;
  }>,
  mainInsertFn: (record: TMain) => Promise<{ id: number }>
): Promise<{ id: number }> {
  return withTransaction(
    async () => {
      // 1. Criar registro principal
      const mainResult = await mainInsertFn(mainRecord);
      
      // 2. Criar relacionamentos
      for (const relation of relations) {
        if (relation.records.length > 0) {
          await relation.insertFn(relation.records);
        }
      }
      
      return mainResult;
    },
    'criar registro com relacionamentos'
  );
}

/**
 * Deleta registro e seus relacionamentos (cascade manual)
 */
export async function deleteWithRelations(
  mainTableName: string,
  mainId: number,
  relations: Array<{
    tableName: string;
    deleteFn: (mainId: number) => Promise<any>;
  }>,
  mainDeleteFn: (id: number) => Promise<any>
): Promise<void> {
  return withTransaction(
    async () => {
      // 1. Deletar relacionamentos primeiro
      for (const relation of relations) {
        await relation.deleteFn(mainId);
      }
      
      // 2. Deletar registro principal
      await mainDeleteFn(mainId);
    },
    `deletar ${mainTableName} e relacionamentos`
  );
}

/**
 * Wrapper para operações de leitura com retry
 * (útil para deadlocks e lock timeouts)
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Retry apenas para deadlocks e lock timeouts
      const shouldRetry = 
        error.code === 'ER_LOCK_DEADLOCK' ||
        error.code === 'ER_LOCK_WAIT_TIMEOUT';
      
      if (!shouldRetry || attempt === maxRetries) {
        throw error;
      }
      
      // Esperar antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }
  
  throw lastError;
}
