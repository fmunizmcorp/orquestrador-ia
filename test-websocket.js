const WebSocket = require('ws');

console.log('🧪 [SPRINT 46] WebSocket Test Starting...\n');

const ws = new WebSocket('ws://192.168.192.164:3001/ws');

ws.on('open', () => {
  console.log('✅ [SPRINT 46] WebSocket Connected!');
  console.log('📊 [SPRINT 46] ReadyState:', ws.readyState, '(1 = OPEN)');
  
  // Send test message
  const payload = {
    type: 'chat:send',
    data: {
      message: 'Test message from Sprint 46 validation',
      conversationId: 1
    }
  };
  
  console.log('\n📤 [SPRINT 46] Sending test message:', JSON.stringify(payload, null, 2));
  ws.send(JSON.stringify(payload));
});

ws.on('message', (data) => {
  const message = data.toString();
  console.log('\n📥 [SPRINT 46] Message received from server:');
  
  try {
    const parsed = JSON.parse(message);
    console.log(JSON.stringify(parsed, null, 2));
    
    if (parsed.type === 'chat:message') {
      console.log('✅ [SPRINT 46] Chat message confirmed!');
    } else if (parsed.type === 'chat:streaming') {
      console.log('🔄 [SPRINT 46] Streaming chunk received');
    } else if (parsed.type === 'error') {
      console.log('❌ [SPRINT 46] Error from server:', parsed.data.message);
    }
  } catch (e) {
    console.log('Raw message:', message);
  }
});

ws.on('error', (error) => {
  console.error('\n❌ [SPRINT 46] WebSocket Error:', error.message);
});

ws.on('close', (code, reason) => {
  console.log('\n❌ [SPRINT 46] WebSocket Disconnected');
  console.log('Code:', code);
  console.log('Reason:', reason.toString() || 'No reason provided');
});

// Auto close after 15s
setTimeout(() => {
  console.log('\n⏰ [SPRINT 46] Test timeout reached, closing connection');
  ws.close();
  process.exit(0);
}, 15000);
