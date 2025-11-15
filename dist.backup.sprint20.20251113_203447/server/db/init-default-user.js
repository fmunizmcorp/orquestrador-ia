/**
 * Inicialização do Usuário Padrão
 * Cria automaticamente um usuário administrador para sistema sem autenticação
 */
import { db } from './index.js';
import { users } from './schema.js';
export async function initDefaultUser() {
    try {
        // Verificar se já existe algum usuário
        const existingUsers = await db.select().from(users).limit(1);
        if (existingUsers.length === 0) {
            console.log('📝 Criando usuário padrão...');
            // Criar usuário padrão (sem senha - sistema aberto)
            await db.insert(users).values({
                openId: 'admin-system',
                email: 'admin@orquestrador.local',
                name: 'Administrador',
                role: 'admin',
            });
            console.log('✅ Usuário padrão criado com sucesso!');
            console.log('   Email: admin@orquestrador.local');
            console.log('   Nome: Administrador');
            console.log('   Sistema: Acesso aberto (sem autenticação)');
        }
        else {
            console.log('✅ Usuário já existe no banco de dados');
        }
    }
    catch (error) {
        console.error('❌ Erro ao criar usuário padrão:', error);
        // Não lançar erro - o sistema pode funcionar sem isso
    }
}
