# SPRINT 49 - COMPREHENSIVE TEST STRATEGY
## Automated Testing for 3 Critical Bug Fixes

**Created**: 2025-11-17 18:15 GMT  
**Sprint**: Sprint 49 Round 4  
**Methodology**: SCRUM + PDCA  
**Goal**: 100% automated test coverage with ZERO failures

---

## 🎯 TEST OBJECTIVES

### Primary Goals
1. **Verify all 3 critical fixes work correctly**
2. **Automate regression testing** (prevent future breakage)
3. **Achieve 100% test coverage** for Sprint 49 scope
4. **Zero manual intervention** (full CI/CD ready)
5. **Production-like environment** testing

### Success Criteria
- ✅ All tests pass (0 failures)
- ✅ Tests run in < 2 minutes total
- ✅ Tests can run in CI/CD pipeline
- ✅ Tests provide clear failure diagnostics
- ✅ 100% code path coverage for fixed components

---

## 📊 TEST SCOPE

### In-Scope (3 Critical Bugs)

#### BUG #1: Chat Principal - WebSocket Message Send
**File**: `client/src/pages/Chat.tsx`  
**Fix**: useCallback for handleSend + handleKeyDown  
**Severity**: CRITICAL (P0)

**Test Scenarios**:
1. ✅ WebSocket connection establishes successfully
2. ✅ Text input accepts user input
3. ✅ Enter key sends message (preventDefault works)
4. ✅ Send button sends message (onClick works)
5. ✅ Message appears in chat history
6. ✅ Input field clears after send
7. ✅ WebSocket.send() is called with correct payload
8. ✅ No stale closure issues (handlers use current state)

#### BUG #2: Follow-up Messages - Prompt Execution
**File**: `client/src/components/StreamingPromptExecutor.tsx`  
**Fix**: useCallback for handleSendFollowUp  
**Severity**: CRITICAL (P0)

**Test Scenarios**:
1. ✅ Navigate to Prompts page
2. ✅ Execute a prompt successfully
3. ✅ Follow-up textarea accepts input
4. ✅ Enter key sends follow-up message
5. ✅ Follow-up message triggers new execution
6. ✅ Conversation history is updated
7. ✅ No stale closure issues
8. ✅ Streaming response appears

#### BUG #3: Analytics Dashboard - Render Error
**File**: `client/src/components/AnalyticsDashboard.tsx`  
**Fix**: Loading states + error handling + try-catch  
**Severity**: HIGH (P1)

**Test Scenarios**:
1. ✅ Loading spinner appears while data loads
2. ✅ No render errors occur
3. ✅ Dashboard loads with data (if available)
4. ✅ Dashboard shows empty state (if no data)
5. ✅ Error boundary catches render errors
6. ✅ Error message displays clearly
7. ✅ Reload button works
8. ✅ All 10 tRPC queries handle loading correctly

### Out-of-Scope
- ❌ Other pages not modified in Sprint 49
- ❌ Backend API logic (assumed working)
- ❌ WebSocket server (assumed working)
- ❌ Database operations (assumed working)
- ❌ Performance benchmarks (separate sprint)
- ❌ Cross-browser testing (Chrome only for now)

---

## 🛠️ TEST TECHNOLOGY STACK

### Framework: Playwright
**Why Playwright?**
- ✅ Real browser testing (Chrome, Firefox, Safari)
- ✅ Full WebSocket support
- ✅ Network interception capabilities
- ✅ Screenshot/video recording on failure
- ✅ TypeScript support (matches our stack)
- ✅ Headless + headed modes
- ✅ Fast execution (parallel tests)

### Alternative Considered: Jest + React Testing Library
**Why NOT chosen:**
- ❌ JSDOM doesn't support WebSocket fully
- ❌ Mocking WebSocket is fragile
- ❌ Doesn't test real browser behavior
- ❌ Can't catch React stale closure bugs reliably

### Setup Requirements
```bash
npm install -D @playwright/test
npx playwright install chromium
```

---

## 📋 TEST IMPLEMENTATION PLAN

### Test File Structure
```
tests/
├── e2e/
│   ├── sprint49/
│   │   ├── bug1-chat-send.spec.ts          # Bug #1 tests
│   │   ├── bug2-follow-up.spec.ts          # Bug #2 tests
│   │   ├── bug3-analytics.spec.ts          # Bug #3 tests
│   │   └── sprint49-integration.spec.ts    # All 3 together
│   └── critical-path.test.ts               # Existing (update)
├── playwright.config.ts                     # Playwright config
└── test-helpers/
    ├── wait-for-server.ts                   # Wait for PM2
    ├── websocket-utils.ts                   # WebSocket helpers
    └── test-data.ts                         # Mock data
```

### Test Execution Flow
```
1. Start PM2 service (if not running)
2. Wait for server ready (health check)
3. Launch browser (headless Chrome)
4. Run Bug #1 tests (8 scenarios)
5. Run Bug #2 tests (8 scenarios)
6. Run Bug #3 tests (8 scenarios)
7. Run integration test (all 3 together)
8. Generate report (HTML + JSON)
9. Exit with code 0 (pass) or 1 (fail)
```

---

## 🎯 DETAILED TEST SCENARIOS

### Test Suite 1: Bug #1 - Chat Send Functionality

#### Test 1.1: WebSocket Connection
```typescript
test('Chat page establishes WebSocket connection', async ({ page }) => {
  await page.goto('http://localhost:3001/chat');
  
  // Wait for WebSocket connection
  await page.waitForSelector('[data-testid="ws-status"]:has-text("Connected")', {
    timeout: 5000
  });
  
  // Verify connection indicator
  const status = await page.locator('[data-testid="ws-status"]').textContent();
  expect(status).toContain('Connected');
});
```

#### Test 1.2: Send Message via Enter Key
```typescript
test('Sending message via Enter key works (no stale closure)', async ({ page }) => {
  await page.goto('http://localhost:3001/chat');
  await page.waitForSelector('[data-testid="ws-status"]:has-text("Connected")');
  
  // Type message
  const textarea = page.locator('textarea[placeholder*="Digite sua mensagem"]');
  await textarea.fill('Test message from automated test');
  
  // Intercept WebSocket send
  let wsSent = false;
  await page.evaluate(() => {
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
      window.__lastWsMessage = data;
      return originalSend.call(this, data);
    };
  });
  
  // Press Enter
  await textarea.press('Enter');
  
  // Verify WebSocket send was called
  const lastMessage = await page.evaluate(() => window.__lastWsMessage);
  expect(lastMessage).toBeTruthy();
  expect(JSON.parse(lastMessage).type).toBe('chat:send');
  
  // Verify input cleared
  await expect(textarea).toHaveValue('');
  
  // Verify message in history
  await expect(page.locator('text=Test message from automated test')).toBeVisible();
});
```

#### Test 1.3: Send Message via Button Click
```typescript
test('Sending message via Send button works (no stale closure)', async ({ page }) => {
  await page.goto('http://localhost:3001/chat');
  await page.waitForSelector('[data-testid="ws-status"]:has-text("Connected")');
  
  const textarea = page.locator('textarea[placeholder*="Digite sua mensagem"]');
  await textarea.fill('Test via button click');
  
  // Click send button
  await page.click('button[aria-label="Send"]');
  
  // Verify input cleared
  await expect(textarea).toHaveValue('');
  
  // Verify message sent
  await expect(page.locator('text=Test via button click')).toBeVisible();
});
```

#### Test 1.4: No Send When Input Empty
```typescript
test('Does not send empty messages', async ({ page }) => {
  await page.goto('http://localhost:3001/chat');
  await page.waitForSelector('[data-testid="ws-status"]:has-text("Connected")');
  
  const textarea = page.locator('textarea[placeholder*="Digite sua mensagem"]');
  
  // Try to send empty
  await textarea.press('Enter');
  
  // Verify nothing happened (no new messages)
  const messageCount = await page.locator('[data-testid="chat-message"]').count();
  const initialCount = messageCount;
  
  await textarea.press('Enter');
  
  const finalCount = await page.locator('[data-testid="chat-message"]').count();
  expect(finalCount).toBe(initialCount); // No change
});
```

#### Test 1.5: Shift+Enter Adds Line Break
```typescript
test('Shift+Enter adds line break (does not send)', async ({ page }) => {
  await page.goto('http://localhost:3001/chat');
  await page.waitForSelector('[data-testid="ws-status"]:has-text("Connected")');
  
  const textarea = page.locator('textarea[placeholder*="Digite sua mensagem"]');
  await textarea.fill('Line 1');
  
  // Press Shift+Enter
  await textarea.press('Shift+Enter');
  await textarea.type('Line 2');
  
  // Verify both lines present
  const value = await textarea.inputValue();
  expect(value).toContain('Line 1');
  expect(value).toContain('Line 2');
  expect(value).toContain('\n'); // Line break
  
  // Verify message NOT sent yet
  await expect(page.locator('text=Line 1')).not.toBeVisible();
});
```

#### Test 1.6: Console Logs Confirm useCallback
```typescript
test('Console logs show useCallback execution', async ({ page }) => {
  const logs: string[] = [];
  page.on('console', msg => {
    if (msg.text().includes('[SPRINT 49 ROUND 3]')) {
      logs.push(msg.text());
    }
  });
  
  await page.goto('http://localhost:3001/chat');
  await page.waitForSelector('[data-testid="ws-status"]:has-text("Connected")');
  
  const textarea = page.locator('textarea[placeholder*="Digite sua mensagem"]');
  await textarea.fill('Test logging');
  await textarea.press('Enter');
  
  // Verify logs include our markers
  expect(logs.some(log => log.includes('handleSend CALLED'))).toBe(true);
  expect(logs.some(log => log.includes('handleKeyDown TRIGGERED'))).toBe(true);
});
```

---

### Test Suite 2: Bug #2 - Follow-up Messages

#### Test 2.1: Navigate to Prompts and Execute
```typescript
test('Can navigate to prompts and execute prompt', async ({ page }) => {
  await page.goto('http://localhost:3001/prompts');
  
  // Find and click first prompt
  await page.click('[data-testid="prompt-card"]:first-child');
  
  // Click execute
  await page.click('button:has-text("Executar")');
  
  // Wait for execution to start
  await expect(page.locator('text=Executando')).toBeVisible();
});
```

#### Test 2.2: Send Follow-up Message via Enter
```typescript
test('Can send follow-up message via Enter key', async ({ page }) => {
  // Execute initial prompt first
  await page.goto('http://localhost:3001/prompts');
  await page.click('[data-testid="prompt-card"]:first-child');
  await page.click('button:has-text("Executar")');
  await page.waitForSelector('[data-testid="prompt-result"]', { timeout: 30000 });
  
  // Now send follow-up
  const followUpTextarea = page.locator('textarea[placeholder*="follow-up"]');
  await followUpTextarea.fill('What else can you tell me?');
  await followUpTextarea.press('Enter');
  
  // Verify follow-up was sent
  await expect(page.locator('text=What else can you tell me?')).toBeVisible();
  
  // Verify input cleared
  await expect(followUpTextarea).toHaveValue('');
});
```

#### Test 2.3: Follow-up Updates Conversation History
```typescript
test('Follow-up messages update conversation history', async ({ page }) => {
  await page.goto('http://localhost:3001/prompts');
  await page.click('[data-testid="prompt-card"]:first-child');
  await page.click('button:has-text("Executar")');
  await page.waitForSelector('[data-testid="prompt-result"]');
  
  // Count initial conversation items
  const initialCount = await page.locator('[data-testid="conversation-item"]').count();
  
  // Send follow-up
  const followUpTextarea = page.locator('textarea[placeholder*="follow-up"]');
  await followUpTextarea.fill('Follow-up question');
  await followUpTextarea.press('Enter');
  
  // Wait for response
  await page.waitForTimeout(2000);
  
  // Verify conversation grew
  const finalCount = await page.locator('[data-testid="conversation-item"]').count();
  expect(finalCount).toBeGreaterThan(initialCount);
});
```

#### Test 2.4: Console Logs Confirm useCallback
```typescript
test('Follow-up console logs show useCallback', async ({ page }) => {
  const logs: string[] = [];
  page.on('console', msg => {
    if (msg.text().includes('[SPRINT 49 ROUND 3]')) {
      logs.push(msg.text());
    }
  });
  
  await page.goto('http://localhost:3001/prompts');
  // ... execute prompt and send follow-up ...
  
  expect(logs.some(log => log.includes('handleSendFollowUp called'))).toBe(true);
});
```

---

### Test Suite 3: Bug #3 - Analytics Dashboard

#### Test 3.1: Loading State Displays
```typescript
test('Analytics page shows loading state initially', async ({ page }) => {
  // Slow down network to see loading
  await page.route('**/api/trpc/**', route => {
    setTimeout(() => route.continue(), 1000);
  });
  
  const loadingPromise = page.waitForSelector('text=Carregando Analytics', {
    timeout: 5000
  });
  
  await page.goto('http://localhost:3001/analytics');
  
  // Verify loading appears
  await expect(loadingPromise).resolves.toBeTruthy();
});
```

#### Test 3.2: No Render Errors
```typescript
test('Analytics page renders without errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  await page.goto('http://localhost:3001/analytics');
  await page.waitForLoadState('networkidle');
  
  // Verify no errors
  expect(errors).toHaveLength(0);
});
```

#### Test 3.3: Dashboard Shows Content or Empty State
```typescript
test('Analytics dashboard loads successfully', async ({ page }) => {
  await page.goto('http://localhost:3001/analytics');
  await page.waitForLoadState('networkidle');
  
  // Should show either content OR empty state (not error)
  const hasContent = await page.locator('[data-testid="analytics-dashboard"]').isVisible();
  const hasEmptyState = await page.locator('text=Sem dados disponíveis').isVisible();
  
  expect(hasContent || hasEmptyState).toBe(true);
});
```

#### Test 3.4: Error Boundary Catches Errors
```typescript
test('Error boundary handles render errors gracefully', async ({ page }) => {
  // Simulate error by injecting bad data
  await page.route('**/api/trpc/monitoring.getCurrentMetrics', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result: { data: null } }) // Bad data
    });
  });
  
  await page.goto('http://localhost:3001/analytics');
  await page.waitForLoadState('networkidle');
  
  // Should show error UI, not crash
  const errorVisible = await page.locator('text=Erro ao Carregar Analytics').isVisible();
  expect(errorVisible).toBe(true);
  
  // Reload button should exist
  await expect(page.locator('button:has-text("Recarregar")')).toBeVisible();
});
```

---

## 🔄 TEST EXECUTION PLAN

### Phase 1: Setup (5 minutes)
1. Install Playwright
2. Configure playwright.config.ts
3. Create test helper utilities
4. Verify PM2 service running

### Phase 2: Test Implementation (30 minutes)
1. Implement Bug #1 tests (8 scenarios)
2. Implement Bug #2 tests (8 scenarios)
3. Implement Bug #3 tests (8 scenarios)
4. Create integration test

### Phase 3: Test Execution (5 minutes)
1. Run tests in headless mode
2. Capture screenshots on failure
3. Generate HTML report
4. Generate JSON results

### Phase 4: Analysis (10 minutes)
1. Review test results
2. Identify any failures
3. Prioritize fixes (if needed)
4. Document findings

### Phase 5: Fix & Re-test (Variable)
1. Fix any identified issues
2. Re-run tests
3. Repeat until 100% pass rate
4. Commit + PR following workflow

---

## 📊 SUCCESS METRICS

### Test Coverage Goals
- ✅ **100% of Sprint 49 fixed code paths**
- ✅ **100% of critical user workflows**
- ✅ **0 failures** in production environment
- ✅ **< 2 minutes** total execution time
- ✅ **Clear diagnostics** on any failure

### PDCA Validation
- **Plan**: This document ✅
- **Do**: Implement tests ⏳
- **Check**: Execute + analyze results ⏳
- **Act**: Fix issues + re-test ⏳

---

## 🚀 NEXT STEPS

1. ✅ **SPRINT49-1 COMPLETE**: Test strategy designed
2. ⏳ **SPRINT49-2 NEXT**: Install Playwright
3. ⏳ **SPRINT49-3**: Implement Bug #1 tests
4. ⏳ **SPRINT49-4**: Implement Bug #2 tests
5. ⏳ **SPRINT49-5**: Implement Bug #3 tests
6. ⏳ **SPRINT49-6**: Execute all tests
7. ⏳ **SPRINT49-7**: Analyze results
8. ⏳ **SPRINT49-8**: Fix issues (if any)
9. ⏳ **SPRINT49-9**: Commit + PR
10. ⏳ **SPRINT49-10**: Final report

---

**Status**: ✅ SPRINT49-1 COMPLETE  
**Next**: SPRINT49-2 (Install Playwright)  
**Confidence**: HIGH (strategy is comprehensive and surgical)  
**ETA**: 60-90 minutes for complete implementation + testing
