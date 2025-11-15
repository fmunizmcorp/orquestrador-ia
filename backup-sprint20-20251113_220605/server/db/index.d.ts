import * as schema from './schema.js';
export declare const db: import("drizzle-orm/mysql2").MySql2Database<typeof schema>;
export declare function testConnection(): Promise<boolean>;
export declare function closeConnection(): Promise<void>;
export { schema };
