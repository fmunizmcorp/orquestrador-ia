/**
 * Helper functions for Drizzle ORM compatibility
 * Adds .returning() support to older Drizzle versions
 */
import { MySqlTable } from 'drizzle-orm/mysql-core';
/**
 * Polyfill for .returning() in INSERT operations
 * Fetches the inserted record by ID after insertion
 */
export declare function insertReturning<T extends MySqlTable>(db: any, table: T, values: any): Promise<any>;
/**
 * Polyfill for .returning() in UPDATE operations
 * Fetches the updated record after update
 */
export declare function updateReturning<T extends MySqlTable>(db: any, table: T, id: number, values: any): Promise<any>;
/**
 * Type-safe version of where() that works with Drizzle select chains
 */
export declare function selectWhere<T>(query: any, condition: any): T;
