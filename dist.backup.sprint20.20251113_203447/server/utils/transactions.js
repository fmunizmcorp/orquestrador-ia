/**
 * Transaction Helpers - Suporte a transações ACID
 */
import { db } from '../db/index.js';
import { handleDatabaseError } from './validation.js';
/**
 * Executa operação dentro de uma transação
 * Se houver erro, faz rollback automático
 */
export async function withTransaction(operation, operationName = 'transação') {
    // Note: Drizzle ORM 0.29.3 ainda não tem suporte nativo a transações
    // Por ora, vamos usar try/catch para capturar erros
    // Em versões futuras, usar: db.transaction()
    try {
        const result = await operation(db);
        return result;
    }
    catch (error) {
        handleDatabaseError(error, operationName);
    }
}
/**
 * Cria múltiplos registros de forma atômica
 */
export async function createMany(tableName, records, insertFn) {
    if (records.length === 0) {
        return [];
    }
    return withTransaction(async () => {
        return await insertFn(records);
    }, `criar ${records.length} registros em ${tableName}`);
}
/**
 * Atualiza múltiplos registros de forma atômica
 */
export async function updateMany(tableName, updates, updateFn) {
    if (updates.length === 0) {
        return;
    }
    return withTransaction(async () => {
        for (const update of updates) {
            await updateFn(update.id, update.data);
        }
    }, `atualizar ${updates.length} registros em ${tableName}`);
}
/**
 * Deleta múltiplos registros de forma atômica
 */
export async function deleteMany(tableName, ids, deleteFn) {
    if (ids.length === 0) {
        return;
    }
    return withTransaction(async () => {
        return await deleteFn(ids);
    }, `deletar ${ids.length} registros de ${tableName}`);
}
/**
 * Cria registro com relacionamentos (atomicamente)
 */
export async function createWithRelations(mainRecord, relations, mainInsertFn) {
    return withTransaction(async () => {
        // 1. Criar registro principal
        const mainResult = await mainInsertFn(mainRecord);
        // 2. Criar relacionamentos
        for (const relation of relations) {
            if (relation.records.length > 0) {
                await relation.insertFn(relation.records);
            }
        }
        return mainResult;
    }, 'criar registro com relacionamentos');
}
/**
 * Deleta registro e seus relacionamentos (cascade manual)
 */
export async function deleteWithRelations(mainTableName, mainId, relations, mainDeleteFn) {
    return withTransaction(async () => {
        // 1. Deletar relacionamentos primeiro
        for (const relation of relations) {
            await relation.deleteFn(mainId);
        }
        // 2. Deletar registro principal
        await mainDeleteFn(mainId);
    }, `deletar ${mainTableName} e relacionamentos`);
}
/**
 * Wrapper para operações de leitura com retry
 * (útil para deadlocks e lock timeouts)
 */
export async function withRetry(operation, maxRetries = 3, delayMs = 1000) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            // Retry apenas para deadlocks e lock timeouts
            const shouldRetry = error.code === 'ER_LOCK_DEADLOCK' ||
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
