/**
 * Test Chat Functionality - Direct WebSocket Test
 * Tests if chat messages can be sent via WebSocket
 */

const WebSocket = require('ws');

const TEST_URL = 'ws://localhost:3001/ws';
const TEST_MESSAGE = 'AUTOMATED TEST MESSAGE - ' + new Date().toISOString();

console.log('🧪 ================================');
console.log('🧪 TESTING CHAT FUNCTIONALITY');
console.log('🧪 ================================\n');

console.log(`📡 Connecting to: ${TEST_URL}`);

const ws = new WebSocket(TEST_URL);
let testPassed = false;

ws.on('open', () => {
  console.log('✅ WebSocket CONNECTED\n');
  
  // Wait a moment for server to be ready
  setTimeout(() => {
    const payload = {
      type: 'chat:send',
      data: {
        message: TEST_MESSAGE,
        conversationId: 1
      }
    };
    
    console.log('📤 Sending test message:');
    console.log(JSON.stringify(payload, null, 2));
    console.log('');
    
    ws.send(JSON.stringify(payload));
    
    // Wait for response
    setTimeout(() => {
      if (!testPassed) {
        console.log('❌ No response received from server after 5 seconds');
        console.log('⚠️  This indicates chat functionality is NOT working');
        ws.close();
        process.exit(1);
      }
    }, 5000);
  }, 500);
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data.toString());
    console.log('📩 Received message:');
    console.log(JSON.stringify(message, null, 2));
    console.log('');
    
    if (message.type === 'chat:message' && message.data.role === 'user') {
      console.log('✅ TEST PASSED: Chat message was processed by server!');
      testPassed = true;
      ws.close();
      process.exit(0);
    }
    
    if (message.type === 'error') {
      console.log('❌ TEST FAILED: Server returned error:');
      console.log(message.data.message);
      ws.close();
      process.exit(1);
    }
  } catch (e) {
    console.error('Error parsing message:', e);
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket ERROR:', error.message);
  process.exit(1);
});

ws.on('close', () => {
  console.log('\n📡 WebSocket CLOSED');
  if (testPassed) {
    console.log('✅ Test completed successfully');
  } else {
    console.log('❌ Test did not complete successfully');
  }
});

// Timeout after 10 seconds
setTimeout(() => {
  console.log('❌ Test TIMEOUT after 10 seconds');
  ws.close();
  process.exit(1);
}, 10000);
