/**
 * Transaction Helpers - Suporte a transações ACID
 */
import { db } from '../db/index.js';
/**
 * Executa operação dentro de uma transação
 * Se houver erro, faz rollback automático
 */
export declare function withTransaction<T>(operation: (tx: typeof db) => Promise<T>, operationName?: string): Promise<T>;
/**
 * Cria múltiplos registros de forma atômica
 */
export declare function createMany<T>(tableName: string, records: T[], insertFn: (records: T[]) => Promise<any>): Promise<any>;
/**
 * Atualiza múltiplos registros de forma atômica
 */
export declare function updateMany<T>(tableName: string, updates: Array<{
    id: number;
    data: T;
}>, updateFn: (id: number, data: T) => Promise<any>): Promise<void>;
/**
 * Deleta múltiplos registros de forma atômica
 */
export declare function deleteMany(tableName: string, ids: number[], deleteFn: (ids: number[]) => Promise<any>): Promise<void>;
/**
 * Cria registro com relacionamentos (atomicamente)
 */
export declare function createWithRelations<TMain, TRelations>(mainRecord: TMain, relations: Array<{
    tableName: string;
    records: TRelations[];
    insertFn: (records: TRelations[]) => Promise<any>;
}>, mainInsertFn: (record: TMain) => Promise<{
    id: number;
}>): Promise<{
    id: number;
}>;
/**
 * Deleta registro e seus relacionamentos (cascade manual)
 */
export declare function deleteWithRelations(mainTableName: string, mainId: number, relations: Array<{
    tableName: string;
    deleteFn: (mainId: number) => Promise<any>;
}>, mainDeleteFn: (id: number) => Promise<any>): Promise<void>;
/**
 * Wrapper para operações de leitura com retry
 * (útil para deadlocks e lock timeouts)
 */
export declare function withRetry<T>(operation: () => Promise<T>, maxRetries?: number, delayMs?: number): Promise<T>;
