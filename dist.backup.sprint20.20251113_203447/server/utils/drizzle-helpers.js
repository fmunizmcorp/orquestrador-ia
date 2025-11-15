/**
 * Helper functions for Drizzle ORM compatibility
 * Adds .returning() support to older Drizzle versions
 */
import { eq } from 'drizzle-orm';
/**
 * Polyfill for .returning() in INSERT operations
 * Fetches the inserted record by ID after insertion
 */
export async function insertReturning(db, table, values) {
    const result = await db.insert(table).values(values);
    const insertId = result[0]?.insertId || result.insertId;
    if (!insertId) {
        throw new Error('Insert failed: no insertId returned');
    }
    const [inserted] = await db
        .select()
        .from(table)
        .where(eq(table.id, insertId))
        .limit(1);
    return [inserted];
}
/**
 * Polyfill for .returning() in UPDATE operations
 * Fetches the updated record after update
 */
export async function updateReturning(db, table, id, values) {
    await db
        .update(table)
        .set(values)
        .where(eq(table.id, id));
    const [updated] = await db
        .select()
        .from(table)
        .where(eq(table.id, id))
        .limit(1);
    return [updated];
}
/**
 * Type-safe version of where() that works with Drizzle select chains
 */
export function selectWhere(query, condition) {
    return query.where(condition);
}
