import { router } from '../trpc';
import { providersRouter } from './providersRouter';
import { modelsRouter } from './modelsRouter';
import { specializedAIsRouter } from './specializedAIsRouter';
import { credentialsRouter } from './credentialsRouter';
import { tasksRouter } from './tasksRouter';
import { subtasksRouter } from './subtasksRouter';
import { templatesRouter } from './templatesRouter';
import { workflowsRouter } from './workflowsRouter';
import { instructionsRouter } from './instructionsRouter';
import { knowledgeBaseRouter } from './knowledgeBaseRouter';
import { knowledgeSourcesRouter } from './knowledgeSourcesRouter';
import { executionLogsRouter } from './executionLogsRouter';
import { chatRouter} from './chatRouter';
import { externalAPIAccountsRouter } from './externalAPIAccountsRouter';

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
});

export type AppRouter = typeof appRouter;
