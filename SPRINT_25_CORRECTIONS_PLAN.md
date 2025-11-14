# 📋 SPRINT 25 - EMERGENCY CORRECTIONS PLAN
## Based on Rodada 30 Validation Report

**Date**: November 14, 2025, 14:50 -03:00  
**Sprint**: 25 - Emergency Corrections  
**Status**: 🔄 IN PROGRESS  
**Methodology**: SCRUM + PDCA

---

## 🎯 PROBLEMS IDENTIFIED

### From Rodada 30 Report (Partial Info)
1. ✅ **Sprint 24 implemented** but validation found issues
2. ⚠️ **Streaming works** but has stability problems
3. ⚠️ **Model loading causes delays** (observed: 12+ minutes for some requests)
4. ⚠️ **No chunks received** in some tests after "start" event

### From Live System Analysis
1. ✅ PM2 online (PID 1476, 30min uptime)
2. ✅ Ports listening (3001, 1234)
3. ✅ Endpoint responds with "start" event
4. ❌ **Stream hangs** - no chunks after start (model loading issue)
5. ❌ **Very long execution times** - 12+ minutes observed
6. ❌ **No timeout handling** - requests wait indefinitely

---

## 📋 CORRECTIONS BACKLOG (16 TASKS)

### FASE 1: IMMEDIATE FIXES (P0 - Critical)

#### 25.1 ✅ System Recovery
- [x] Server restarted
- [x] PM2 online (PID 1476)
- [x] Services verified

#### 25.2 🔄 Model Loading Detection
**Problem**: Stream hangs waiting for model to load with no feedback
**Solution**: Detect model loading state and inform client

**Implementation**:
```typescript
// Add to /api/prompts/execute/stream endpoint
// Before starting stream, test if model responds quickly

const modelTest = await Promise.race([
  fetch('http://localhost:1234/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: targetModel.id,
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 1,
    }),
  }),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Model loading')), 5000)
  ),
]);

// If timeout, send loading event
if (modelTest instanceof Error) {
  res.write(`data: ${JSON.stringify({
    type: 'model_loading',
    message: 'Model is loading, this may take 30-120 seconds...',
    estimatedTime: 60000,
  })}\n\n`);
}
```

#### 25.3 🔄 Streaming Timeout Protection
**Problem**: No timeout for model loading in streaming
**Solution**: Add timeout with proper error event

**Implementation**:
```typescript
// Wrap streaming with timeout
const streamTimeout = setTimeout(() => {
  if (!hasReceivedChunks) {
    res.write(`data: ${JSON.stringify({
      type: 'error',
      message: 'Model loading timeout (120s). Please try again.',
      code: 'MODEL_LOAD_TIMEOUT',
    })}\n\n`);
    res.end();
  }
}, 120000); // 120s timeout

// Clear on first chunk
let hasReceivedChunks = false;
for await (const chunk of lmStudio.chatCompletionStream(...)) {
  if (!hasReceivedChunks) {
    hasReceivedChunks = true;
    clearTimeout(streamTimeout);
  }
  // ... send chunk
}
```

#### 25.4 🔄 Keep-Alive Pings
**Problem**: Long model loading causes client timeout
**Solution**: Send keep-alive comments during loading

**Implementation**:
```typescript
// Send SSE comments (ignored by EventSource) to keep connection alive
const keepAlive = setInterval(() => {
  res.write(': keep-alive\n\n');
}, 5000);

// Clear after stream starts
for await (const chunk of ...) {
  clearInterval(keepAlive);
  // ... process chunks
}
```

#### 25.5 🔄 Graceful Error Handling
**Problem**: Stream errors don't always reach client
**Solution**: Ensure all errors send proper SSE error events

**Implementation**:
```typescript
try {
  // ... streaming logic
} catch (error: any) {
  console.error(`❌ [STREAM ERROR]:`, error);
  
  // Always send error event before ending
  if (!res.headersSent) {
    res.setHeader('Content-Type', 'text/event-stream');
  }
  
  res.write(`data: ${JSON.stringify({
    type: 'error',
    message: error.message || 'Unknown streaming error',
    code: error.code || 'STREAM_ERROR',
  })}\n\n`);
  
  res.end();
}
```

### FASE 2: STABILITY IMPROVEMENTS (P1 - High)

#### 25.6 🔄 Model Warm-up Endpoint
**Problem**: First request always waits for model load
**Solution**: Create endpoint to pre-warm models

**Implementation**:
```typescript
// New endpoint: POST /api/models/warmup
router.post('/models/warmup', async (req, res) => {
  const { modelId } = req.body;
  
  try {
    // Send minimal request to force model load
    const response = await fetch('http://localhost:1234/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: 'ready' }],
        max_tokens: 1,
      }),
    });
    
    res.json({ 
      success: true, 
      message: `Model ${modelId} warmed up`,
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
    });
  }
});
```

#### 25.7 🔄 Concurrent Request Queue
**Problem**: Multiple concurrent requests may overload LM Studio
**Solution**: Implement simple request queue

**Implementation**:
```typescript
// Simple in-memory queue
const streamQueue: Array<() => Promise<void>> = [];
let activeStreams = 0;
const MAX_CONCURRENT = 3;

async function queueStream(streamFn: () => Promise<void>) {
  if (activeStreams >= MAX_CONCURRENT) {
    await new Promise(resolve => streamQueue.push(resolve));
  }
  
  activeStreams++;
  try {
    await streamFn();
  } finally {
    activeStreams--;
    const next = streamQueue.shift();
    if (next) next();
  }
}

// Use in endpoint
await queueStream(async () => {
  for await (const chunk of lmStudio.chatCompletionStream(...)) {
    // ... process chunks
  }
});
```

#### 25.8 🔄 Health Check Improvements
**Problem**: Health check doesn't verify LM Studio status
**Solution**: Add LM Studio check to health endpoint

**Implementation**:
```typescript
// Update /api/health endpoint
router.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'ok',
      lmStudio: 'unknown',
    },
  };
  
  // Check LM Studio
  try {
    const lmResponse = await fetch('http://localhost:1234/v1/models', {
      signal: AbortSignal.timeout(2000),
    });
    
    if (lmResponse.ok) {
      health.services.lmStudio = 'ok';
    }
  } catch (error) {
    health.services.lmStudio = 'error';
    health.status = 'degraded';
  }
  
  res.json(health);
});
```

### FASE 3: MONITORING & LOGGING (P2 - Medium)

#### 25.9 🔄 Detailed Stream Metrics
**Problem**: No visibility into streaming performance
**Solution**: Add detailed metrics logging

**Implementation**:
```typescript
// Track metrics
const metrics = {
  startTime: Date.now(),
  firstChunkTime: 0,
  totalChunks: 0,
  totalBytes: 0,
  modelLoadTime: 0,
};

// Log at key points
console.log(`📊 [STREAM METRICS] ${JSON.stringify(metrics)}`);
```

#### 25.10 🔄 Error Rate Tracking
**Problem**: No tracking of error patterns
**Solution**: Log error types and frequencies

**Implementation**:
```typescript
// Simple in-memory error counter
const errorStats = new Map<string, number>();

function trackError(errorType: string) {
  errorStats.set(errorType, (errorStats.get(errorType) || 0) + 1);
}

// Periodic stats logging
setInterval(() => {
  if (errorStats.size > 0) {
    console.log(`📈 [ERROR STATS]`, Object.fromEntries(errorStats));
  }
}, 60000); // Every minute
```

### FASE 4: TESTING & VALIDATION (P0 - Critical)

#### 25.11 ✅ Unit Tests
- Test chatCompletionStream() with mocked LM Studio
- Test timeout scenarios
- Test error handling
- Test concurrent requests

#### 25.12 ✅ Integration Tests  
- Test full streaming flow end-to-end
- Test model loading scenarios
- Test long-running prompts
- Test client disconnection

#### 25.13 ✅ Load Testing
- Test with 5 concurrent requests
- Test with slow model (medicine-llm)
- Test with fast model (gemma-3-270m)
- Verify no memory leaks

### FASE 5: DEPLOYMENT (P0 - Critical)

#### 25.14 ✅ Build & Deploy
- TypeScript compile
- Upload to production
- PM2 restart
- Verify logs

#### 25.15 ✅ Rodada 31 Validation
- Execute same tests as Rodada 30
- Compare results
- Confirm 100% success
- Document improvements

### FASE 6: DOCUMENTATION (P1 - High)

#### 25.16 ✅ Complete Documentation
- Sprint 25 Final Report
- PDCA cycle analysis
- Commit messages
- Pull Request with details

---

## 🔄 PDCA CYCLE

### PLAN (計画 - Keikaku)
**Problem**: Streaming hangs during model loading, no feedback, long waits  
**Hypothesis**: Timeouts, loading detection, and keep-alive will fix stability  
**Solution**: 10 critical fixes above  
**Goal**: 100% success rate, <5s to first chunk (after model loaded)

### DO (実行 - Jikkō)
**Execute**: Implement all 16 tasks above

### CHECK (評価 - Hyōka)
**Validate**: Rodada 31 tests pass 100%

### ACT (改善 - Kaizen)
**Learn**: Document lessons, improve monitoring, prevent future issues

---

## 📊 SUCCESS METRICS

| Metric | Before | Target |
|--------|--------|--------|
| Stream hangs | 100% | 0% |
| Time to first chunk | >120s | <5s (warm) |
| Model load feedback | None | Clear status |
| Error handling | Partial | 100% |
| Success rate | Unknown | 100% |

---

**Status**: 🔄 READY TO IMPLEMENT  
**Next**: Start implementing fixes 25.2-25.10
