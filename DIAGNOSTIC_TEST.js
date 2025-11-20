/**
 * DIAGNOSTIC TEST - Run this in browser console
 * 
 * Copy and paste this entire script into browser console (F12) when on Chat page
 * It will check if event handlers are properly registered
 */

console.log('🔍 STARTING DIAGNOSTIC TEST...\n');

// Test 1: Find send button
console.log('📍 Test 1: Finding Send Button');
const buttons = document.querySelectorAll('button');
console.log(`Found ${buttons.length} buttons total`);

let sendButton = null;
buttons.forEach((btn, i) => {
  const text = btn.textContent?.trim();
  console.log(`  Button ${i}: "${text}" | disabled: ${btn.disabled}`);
  if (text === 'Enviar' || text.includes('Enviar')) {
    sendButton = btn;
    console.log(`  ✅ SEND BUTTON FOUND: Button ${i}`);
  }
});

if (!sendButton) {
  console.error('❌ SEND BUTTON NOT FOUND!');
} else {
  console.log('\n📍 Test 2: Button Properties');
  console.log('  disabled:', sendButton.disabled);
  console.log('  className:', sendButton.className);
  console.log('  style.display:', sendButton.style.display);
  console.log('  style.pointerEvents:', sendButton.style.pointerEvents);
  
  console.log('\n📍 Test 3: Event Listeners');
  
  // Check React event handlers (stored as properties)
  console.log('  onClick property:', sendButton.onclick ? 'EXISTS' : 'NULL');
  
  // Check if button is inside a form
  const form = sendButton.closest('form');
  console.log('  Inside form:', form ? 'YES' : 'NO');
  
  console.log('\n📍 Test 4: Parent Elements');
  let parent = sendButton.parentElement;
  let depth = 0;
  while (parent && depth < 5) {
    console.log(`  Parent ${depth}:`, parent.tagName, parent.className);
    parent = parent.parentElement;
    depth++;
  }
  
  console.log('\n📍 Test 5: Manual Click Test');
  console.log('  Attempting manual click...');
  
  try {
    // Store original disabled state
    const wasDisabled = sendButton.disabled;
    
    // Temporarily enable button
    sendButton.disabled = false;
    
    // Create and dispatch click event
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    
    const result = sendButton.dispatchEvent(clickEvent);
    console.log('  Click dispatched, result:', result);
    
    // Restore disabled state
    sendButton.disabled = wasDisabled;
    
    console.log('  ✅ Click test completed');
  } catch (error) {
    console.error('  ❌ Click test failed:', error);
  }
}

// Test 2: Find textarea
console.log('\n📍 Test 6: Finding Textarea');
const textareas = document.querySelectorAll('textarea');
console.log(`Found ${textareas.length} textarea(s)`);

if (textareas.length > 0) {
  const textarea = textareas[0];
  console.log('  value:', textarea.value.substring(0, 50));
  console.log('  disabled:', textarea.disabled);
  console.log('  placeholder:', textarea.placeholder);
  
  console.log('\n📍 Test 7: Textarea Event Listeners');
  console.log('  onKeyDown property:', textarea.onkeydown ? 'EXISTS' : 'NULL');
}

// Test 3: Check React DevTools
console.log('\n📍 Test 8: React Info');
const hasReactDevTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
console.log('  React DevTools:', hasReactDevTools ? 'INSTALLED' : 'NOT INSTALLED');

// Test 4: Check for React Fiber
console.log('\n📍 Test 9: React Fiber Check');
if (sendButton) {
  const fiberKey = Object.keys(sendButton).find(key => key.startsWith('__reactFiber'));
  console.log('  React Fiber key:', fiberKey ? 'FOUND' : 'NOT FOUND');
  
  if (fiberKey) {
    const fiber = sendButton[fiberKey];
    console.log('  Fiber type:', fiber?.type);
    console.log('  Fiber props:', fiber?.memoizedProps ? 'EXISTS' : 'NULL');
    
    if (fiber?.memoizedProps) {
      console.log('  Props.onClick:', fiber.memoizedProps.onClick ? 'EXISTS' : 'NULL');
      console.log('  Props.disabled:', fiber.memoizedProps.disabled);
    }
  }
}

// Test 5: Check WebSocket
console.log('\n📍 Test 10: WebSocket Check');
const wsStatus = document.querySelector('[title*="WebSocket"], [title*="Conectado"]');
if (wsStatus) {
  console.log('  WebSocket status element found');
  console.log('  Text:', wsStatus.textContent);
}

console.log('\n✅ DIAGNOSTIC TEST COMPLETE\n');
console.log('📋 SUMMARY:');
console.log('  - Send button:', sendButton ? 'FOUND' : 'NOT FOUND');
console.log('  - Button disabled:', sendButton?.disabled);
console.log('  - Textarea:', textareas.length > 0 ? 'FOUND' : 'NOT FOUND');
console.log('\n💡 Next step: Check if button disabled state is incorrect');
