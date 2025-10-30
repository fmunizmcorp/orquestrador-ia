/**
 * End-to-End Critical Path Tests
 * Tests the most important user workflows
 */
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

test.describe('Critical Path Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Complete Task Creation and Execution Flow', async ({ page }) => {
    // Navigate to Tasks
    await page.click('text=Tarefas');
    await expect(page).toHaveURL(/.*tasks/);

    // Create new task
    await page.click('button:has-text("Nova Tarefa")');
    await page.fill('input[name="title"]', 'E2E Test Task');
    await page.fill('textarea[name="description"]', 'Testing complete workflow');
    await page.selectOption('select[name="priority"]', 'high');
    await page.click('button[type="submit"]');

    // Verify task created
    await expect(page.locator('text=E2E Test Task')).toBeVisible();

    // Execute task
    await page.click('button:has-text("Executar")');
    
    // Wait for execution to complete
    await page.waitForSelector('text=completed', { timeout: 30000 });
    
    // Verify completion
    const status = await page.locator('[data-testid="task-status"]').textContent();
    expect(status).toContain('completed');
  });

  test('AI Model Selection and Configuration', async ({ page }) => {
    // Navigate to Models
    await page.click('text=Modelos');
    await expect(page).toHaveURL(/.*models/);

    // Select a model
    const firstModel = page.locator('[data-testid="model-card"]').first();
    await firstModel.click();

    // Configure model
    await page.fill('input[name="contextWindow"]', '4096');
    await page.fill('input[name="temperature"]', '0.7');
    await page.click('button:has-text("Salvar")');

    // Verify saved
    await expect(page.locator('text=Configuração salva')).toBeVisible();
  });

  test('Chat Interaction with AI', async ({ page }) => {
    // Navigate to Chat
    await page.click('text=Chat');
    await expect(page).toHaveURL(/.*chat/);

    // Send message
    const message = 'Hello, this is a test message';
    await page.fill('textarea[placeholder*="mensagem"]', message);
    await page.click('button[aria-label="Send"]');

    // Verify message sent
    await expect(page.locator(`text=${message}`)).toBeVisible();

    // Wait for AI response
    await page.waitForSelector('[data-testid="ai-response"]', { timeout: 10000 });
    
    // Verify response received
    const response = await page.locator('[data-testid="ai-response"]').last();
    await expect(response).toBeVisible();
  });

  test('Workflow Creation and Execution', async ({ page }) => {
    // Navigate to Workflows
    await page.click('text=Workflows');
    await expect(page).toHaveURL(/.*workflows/);

    // Create workflow
    await page.click('button:has-text("Novo Workflow")');
    await page.fill('input[name="name"]', 'Test Workflow');
    
    // Add workflow steps (simplified)
    await page.click('button:has-text("Adicionar Etapa")');
    await page.selectOption('select[name="stepType"]', 'task');
    await page.click('button:has-text("Salvar")');

    // Execute workflow
    await page.click('button:has-text("Executar Workflow")');
    
    // Verify execution started
    await expect(page.locator('text=Executando')).toBeVisible();
  });

  test('System Health Check', async ({ page }) => {
    // Navigate to Dashboard
    await page.goto(BASE_URL);
    
    // Check system metrics are displayed
    await expect(page.locator('[data-testid="cpu-usage"]')).toBeVisible();
    await expect(page.locator('[data-testid="memory-usage"]')).toBeVisible();
    await expect(page.locator('[data-testid="disk-usage"]')).toBeVisible();

    // Verify values are reasonable
    const cpuUsage = await page.locator('[data-testid="cpu-usage"]').textContent();
    const cpuValue = parseFloat(cpuUsage || '0');
    expect(cpuValue).toBeGreaterThanOrEqual(0);
    expect(cpuValue).toBeLessThanOrEqual(100);
  });

  test('Real-time Updates via WebSocket', async ({ page }) => {
    // Navigate to Dashboard
    await page.goto(BASE_URL);

    // Check WebSocket connection status
    await page.waitForSelector('[data-testid="websocket-status"]');
    const status = await page.locator('[data-testid="websocket-status"]').textContent();
    expect(status).toContain('Connected');

    // Trigger an update (e.g., create a task)
    await page.click('text=Tarefas');
    await page.click('button:has-text("Nova Tarefa")');
    await page.fill('input[name="title"]', 'Real-time Test');
    await page.click('button[type="submit"]');

    // Verify real-time notification
    await expect(page.locator('text=Task created')).toBeVisible({ timeout: 5000 });
  });

  test('Error Handling and Recovery', async ({ page }) => {
    // Test error handling by triggering a known error condition
    await page.goto(`${BASE_URL}/tasks/999999`); // Non-existent task

    // Verify error message displayed
    await expect(page.locator('text=Task not found')).toBeVisible();

    // Verify recovery option
    await page.click('button:has-text("Voltar")');
    await expect(page).toHaveURL(/.*tasks/);
  });

  test('Performance: Page Load Times', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    const loadTime = Date.now() - startTime;

    // Verify page loads within acceptable time
    expect(loadTime).toBeLessThan(3000); // 3 seconds

    // Verify critical elements loaded
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });
});

test.describe('Integration Tests', () => {
  test('Provider → Model → Task Flow', async ({ page }) => {
    // 1. Configure Provider
    await page.goto(`${BASE_URL}/providers`);
    await page.click('button:has-text("Novo Provedor")');
    await page.fill('input[name="name"]', 'Test Provider');
    await page.fill('input[name="baseUrl"]', 'http://localhost:1234/v1');
    await page.click('button[type="submit"]');

    // 2. Add Model
    await page.goto(`${BASE_URL}/models`);
    await page.click('button:has-text("Novo Modelo")');
    await page.fill('input[name="modelName"]', 'test-model');
    await page.click('button[type="submit"]');

    // 3. Create Task with Model
    await page.goto(`${BASE_URL}/tasks`);
    await page.click('button:has-text("Nova Tarefa")');
    await page.fill('input[name="title"]', 'Integration Test');
    await page.selectOption('select[name="modelId"]', '1'); // First model
    await page.click('button[type="submit"]');

    // Verify complete flow
    await expect(page.locator('text=Integration Test')).toBeVisible();
  });

  test('Credentials → External API Integration', async ({ page }) => {
    // Add credentials
    await page.goto(`${BASE_URL}/credentials`);
    await page.click('button:has-text("Nova Credencial")');
    await page.selectOption('select[name="service"]', 'github');
    await page.fill('input[name="token"]', 'test_token_123');
    await page.click('button[type="submit"]');

    // Use credentials in integration
    await page.goto(`${BASE_URL}/external-api-accounts`);
    await expect(page.locator('text=github')).toBeVisible();
  });
});

test.describe('Performance Tests', () => {
  test('Concurrent Task Execution', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks`);

    // Create multiple tasks
    for (let i = 0; i < 5; i++) {
      await page.click('button:has-text("Nova Tarefa")');
      await page.fill('input[name="title"]', `Concurrent Task ${i}`);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
    }

    // Execute all tasks
    await page.click('button:has-text("Executar Todos")');

    // Verify system handles load
    await page.waitForTimeout(5000);
    const errorCount = await page.locator('text=error').count();
    expect(errorCount).toBeLessThan(2); // Allow max 1 error
  });

  test('Large Dataset Handling', async ({ page }) => {
    await page.goto(`${BASE_URL}/knowledge-base`);
    
    // Create knowledge base with large content
    await page.click('button:has-text("Nova Base")');
    const largeText = 'Lorem ipsum '.repeat(1000);
    await page.fill('textarea[name="content"]', largeText);
    await page.click('button[type="submit"]');

    // Verify saved successfully
    await expect(page.locator('text=Salvo com sucesso')).toBeVisible();
  });
});
