import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js';
// Configuração da conexão
const poolConnection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'flavio',
    password: process.env.DB_PASSWORD || 'bdflavioia',
    database: process.env.DB_NAME || 'orquestraia',
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
});
// Criar instância do Drizzle
export const db = drizzle(poolConnection, { schema, mode: 'default' });
// Função para testar conexão
export async function testConnection() {
    try {
        const connection = await poolConnection.getConnection();
        console.log('✅ Conexão com MySQL estabelecida com sucesso!');
        connection.release();
        return true;
    }
    catch (error) {
        console.error('❌ Erro ao conectar ao MySQL:', error);
        return false;
    }
}
// Fechar conexão
export async function closeConnection() {
    await poolConnection.end();
}
export { schema };
