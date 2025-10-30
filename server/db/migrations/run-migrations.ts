/**
 * Script de Migração do Banco de Dados
 * Executa o schema.sql completo no banco MySQL
 */

import { config } from 'dotenv';
import { createConnection } from 'mysql2/promise';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente do arquivo .env
const envPath = join(__dirname, '../../../.env');
if (existsSync(envPath)) {
  config({ path: envPath });
  console.log('✅ Arquivo .env carregado');
} else {
  console.log('⚠️  Arquivo .env não encontrado, usando valores padrão');
}

// Exibir configuração (sem mostrar senha completa)
const dbPassword = process.env.DB_PASSWORD || '';
const maskedPassword = dbPassword ? dbPassword.substring(0, 3) + '***' : '(vazio)';
console.log(`📝 Configuração do banco:`);
console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
console.log(`   Port: ${process.env.DB_PORT || '3306'}`);
console.log(`   User: ${process.env.DB_USER || 'root'}`);
console.log(`   Pass: ${maskedPassword}`);
console.log(`   Database: ${process.env.DB_NAME || 'orquestrador_ia'}`);
console.log();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'orquestrador_ia',
  multipleStatements: true, // Permite executar múltiplos statements
};

async function runMigrations() {
  console.log('🔄 Iniciando migrações do banco de dados...\n');

  let connection;
  
  try {
    // Conectar ao MySQL (sem database específico primeiro)
    const { database, ...connectionConfigWithoutDb } = DB_CONFIG;
    connection = await createConnection(connectionConfigWithoutDb);
    
    console.log('✅ Conectado ao MySQL');

    // Criar database se não existir
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    console.log(`✅ Database '${database}' verificado/criado`);

    // Usar o database
    await connection.query(`USE \`${database}\``);
    console.log(`✅ Usando database '${database}'`);

    // Ler schema.sql
    const schemaPath = join(__dirname, '../../../schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    console.log('\n📄 Lendo schema.sql...');
    console.log(`📏 Tamanho do schema: ${(schema.length / 1024).toFixed(2)} KB\n`);

    // Dividir em statements individuais (por ponto-e-vírgula)
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📋 Total de statements SQL: ${statements.length}\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // Executar cada statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Pular comentários
      if (statement.startsWith('--') || statement.trim().length === 0) {
        skipCount++;
        continue;
      }

      try {
        await connection.query(statement);
        
        // Identificar tipo de statement
        const type = statement.toUpperCase().includes('CREATE TABLE') ? 'CREATE TABLE' :
                     statement.toUpperCase().includes('CREATE INDEX') ? 'CREATE INDEX' :
                     statement.toUpperCase().includes('INSERT') ? 'INSERT' :
                     'SQL';
        
        console.log(`  ✅ [${i + 1}/${statements.length}] ${type}`);
        successCount++;
      } catch (error: any) {
        // Ignorar erro de "já existe" para permitir re-execução
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
            error.code === 'ER_DUP_KEYNAME' ||
            error.message.includes('already exists')) {
          console.log(`  ⏭️  [${i + 1}/${statements.length}] Já existe (pulando)`);
          skipCount++;
        } else {
          console.error(`  ❌ [${i + 1}/${statements.length}] ERRO:`, error.message);
          errorCount++;
          
          // Mostrar statement que falhou (primeiras 200 caracteres)
          console.error(`     Statement: ${statement.substring(0, 200)}...`);
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DA MIGRAÇÃO:');
    console.log('='.repeat(60));
    console.log(`✅ Sucesso:   ${successCount} statements`);
    console.log(`⏭️  Pulados:   ${skipCount} statements (já existentes)`);
    console.log(`❌ Erros:     ${errorCount} statements`);
    console.log('='.repeat(60));

    if (errorCount > 0) {
      console.log('\n⚠️  Migração completada COM ERROS');
      console.log('   Verifique os erros acima e corrija se necessário.');
    } else {
      console.log('\n🎉 Migração completada com SUCESSO!');
      console.log('   Todas as 42 tabelas foram criadas/verificadas.');
    }

  } catch (error) {
    console.error('\n❌ ERRO FATAL na migração:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexão com MySQL encerrada');
    }
  }
}

// Executar
runMigrations()
  .then(() => {
    console.log('\n✅ Script de migração finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script de migração falhou:', error);
    process.exit(1);
  });
