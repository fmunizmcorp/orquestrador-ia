/**
 * Teste Manual do WebSocket
 * Execute com: node test-websocket.js
 */

import WebSocket from 'ws';

const WS_URL = 'ws://localhost:3001/ws';

console.log('🔌 Conectando ao WebSocket...');
const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('✅ Conectado ao WebSocket!');
  console.log('');

  // Teste 1: Ping
  console.log('📤 Teste 1: Enviando PING...');
  ws.send(JSON.stringify({ type: 'ping' }));

  // Teste 2: Inscrever em monitoramento
  setTimeout(() => {
    console.log('');
    console.log('📤 Teste 2: Inscrevendo em monitoramento...');
    ws.send(JSON.stringify({ type: 'monitoring:subscribe' }));
  }, 1000);

  // Teste 3: Buscar histórico de chat
  setTimeout(() => {
    console.log('');
    console.log('📤 Teste 3: Buscando histórico de chat...');
    ws.send(JSON.stringify({
      type: 'chat:history',
      data: { conversationId: 1, limit: 5 }
    }));
  }, 2000);

  // Teste 4: Enviar mensagem de chat
  setTimeout(() => {
    console.log('');
    console.log('📤 Teste 4: Enviando mensagem de chat...');
    ws.send(JSON.stringify({
      type: 'chat:send',
      data: {
        message: 'Olá! Qual é a capital do Brasil?',
        conversationId: 1
      }
    }));
  }, 3000);

  // Teste 5: Inscrever em tarefa (se existir ID 1)
  setTimeout(() => {
    console.log('');
    console.log('📤 Teste 5: Inscrevendo em atualizações de tarefa #1...');
    ws.send(JSON.stringify({
      type: 'task:subscribe',
      data: { taskId: 1 }
    }));
  }, 5000);

  // Encerrar após 15 segundos
  setTimeout(() => {
    console.log('');
    console.log('⏰ Tempo de teste esgotado. Encerrando...');
    ws.close();
  }, 15000);
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data.toString());
    console.log('');
    console.log('📥 Mensagem recebida:');
    console.log('   Tipo:', message.type);
    
    // Mostrar dados de forma mais legível
    switch (message.type) {
      case 'pong':
        console.log('   ✅ PONG recebido!');
        break;
      
      case 'monitoring:subscribed':
        console.log('   ✅ Inscrito em monitoramento!');
        break;
      
      case 'metrics':
        console.log('   📊 Métricas do sistema:');
        console.log('      CPU:', message.data.cpu?.usage + '%');
        console.log('      RAM:', message.data.memory?.usedPercent + '%');
        break;
      
      case 'chat:history':
        console.log('   📜 Histórico de chat:', message.data.length, 'mensagens');
        if (message.data.length > 0) {
          console.log('      Última mensagem:', message.data[message.data.length - 1].content.substring(0, 50) + '...');
        }
        break;
      
      case 'chat:message':
        console.log('   💬 Mensagem salva:');
        console.log('      ID:', message.data.id);
        console.log('      Role:', message.data.role);
        console.log('      Conteúdo:', message.data.content.substring(0, 100) + '...');
        break;
      
      case 'chat:streaming':
        if (message.data.done) {
          console.log('   ✅ Streaming finalizado!');
        } else {
          process.stdout.write(message.data.chunk);
        }
        break;
      
      case 'task:subscribed':
        console.log('   ✅ Inscrito em tarefa #' + message.data.taskId);
        break;
      
      case 'task:update':
        console.log('   🔄 Atualização de tarefa:');
        console.log('      Tarefa:', message.data.task?.title);
        console.log('      Status:', message.data.task?.status);
        break;
      
      case 'error':
        console.log('   ❌ Erro:', message.data.message);
        break;
      
      default:
        console.log('   Dados:', JSON.stringify(message.data).substring(0, 200));
    }
  } catch (error) {
    console.error('❌ Erro ao processar mensagem:', error);
  }
});

ws.on('error', (error) => {
  console.error('');
  console.error('❌ Erro no WebSocket:', error.message);
});

ws.on('close', () => {
  console.log('');
  console.log('🔌 Conexão WebSocket fechada');
  process.exit(0);
});
