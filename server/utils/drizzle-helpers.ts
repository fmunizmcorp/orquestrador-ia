/**
 * Helper functions for Drizzle ORM compatibility
 * Adds .returning() support to older Drizzle versions
 */

import { MySqlTable } from 'drizzle-orm/mysql-core';
import { eq } from 'drizzle-orm';

/**
 * Polyfill for .returning() in INSERT operations
 * Fetches the inserted record by ID after insertion
 */
export async function insertReturning<T extends MySqlTable>(
  db: any,
  table: T,
  values: any
): Promise<any> {
  const result = await db.insert(table).values(values);
  const insertId = result[0]?.insertId || result.insertId;
  
  if (!insertId) {
    throw new Error('Insert failed: no insertId returned');
  }
  
  const [inserted] = await db
    .select()
    .from(table)
    .where(eq((table as any).id, insertId))
    .limit(1);
  
  return [inserted];
}

/**
 * Polyfill for .returning() in UPDATE operations
 * Fetches the updated record after update
 */
export async function updateReturning<T extends MySqlTable>(
  db: any,
  table: T,
  id: number,
  values: any
): Promise<any> {
  await db
    .update(table)
    .set(values)
    .where(eq((table as any).id, id));
  
  const [updated] = await db
    .select()
    .from(table)
    .where(eq((table as any).id, id))
    .limit(1);
  
  return [updated];
}

/**
 * Type-safe version of where() that works with Drizzle select chains
 */
export function selectWhere<T>(query: any, condition: any): T {
  return query.where(condition) as T;
}
