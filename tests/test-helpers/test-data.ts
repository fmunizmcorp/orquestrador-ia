/**
 * Test data for Sprint 49 tests
 */

export const TEST_MESSAGES = {
  chat: {
    simple: 'Hello, this is a test message from automated test',
    multiline: 'Line 1\nLine 2\nLine 3',
    empty: '',
    whitespace: '   ',
  },
  followUp: {
    question: 'Can you tell me more about this?',
    complex: 'What are the implications of this approach?',
  },
};

export const SELECTORS = {
  chat: {
    textarea: 'textarea[placeholder*="mensagem"]',
    sendButton: 'button[aria-label="Send"]',
    wsStatus: '[data-testid="ws-status"]',
    message: '[data-testid="chat-message"]',
  },
  followUp: {
    textarea: 'textarea[placeholder*="follow"]',
    sendButton: 'button:has-text("Enviar")',
    conversationItem: '[data-testid="conversation-item"]',
    result: '[data-testid="prompt-result"]',
  },
  analytics: {
    loading: 'text=Carregando Analytics',
    dashboard: '[data-testid="analytics-dashboard"]',
    error: 'text=Erro ao Carregar Analytics',
    reload: 'button:has-text("Recarregar")',
  },
  prompts: {
    card: '[data-testid="prompt-card"]',
    executeButton: 'button:has-text("Executar")',
  },
};

export const TIMEOUTS = {
  short: 2000,
  medium: 5000,
  long: 10000,
  veryLong: 30000,
};
