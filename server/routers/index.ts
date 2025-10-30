import { router } from '../trpc.js';
import { providersRouter } from './providersRouter.js';
import { modelsRouter } from './modelsRouter.js';
import { specializedAIsRouter } from './specializedAIsRouter.js';
import { credentialsRouter } from './credentialsRouter.js';
import { tasksRouter } from './tasksRouter.js';
import { subtasksRouter } from './subtasksRouter.js';
import { templatesRouter } from './templatesRouter.js';
import { workflowsRouter } from './workflowsRouter.js';
import { instructionsRouter } from './instructionsRouter.js';
import { knowledgeBaseRouter } from './knowledgeBaseRouter.js';
import { knowledgeSourcesRouter } from './knowledgeSourcesRouter.js';
import { executionLogsRouter } from './executionLogsRouter.js';
import { chatRouter} from './chatRouter.js';
import { externalAPIAccountsRouter } from './externalAPIAccountsRouter.js';
import { systemMonitorRouter } from './systemMonitorRouter.js';
import { puppeteerRouter } from './puppeteerRouter.js';
import { githubRouter } from './githubRouter.js';
import { gmailRouter } from './gmailRouter.js';

export const appRouter = router({
  providers: providersRouter,
  models: modelsRouter,
  specializedAIs: specializedAIsRouter,
  credentials: credentialsRouter,
  tasks: tasksRouter,
  subtasks: subtasksRouter,
  templates: templatesRouter,
  workflows: workflowsRouter,
  instructions: instructionsRouter,
  knowledgeBase: knowledgeBaseRouter,
  knowledgeSources: knowledgeSourcesRouter,
  executionLogs: executionLogsRouter,
  chat: chatRouter,
  externalAPIAccounts: externalAPIAccountsRouter,
  systemMonitor: systemMonitorRouter,
  puppeteer: puppeteerRouter,
  github: githubRouter,
  gmail: gmailRouter,
});

export type AppRouter = typeof appRouter;
