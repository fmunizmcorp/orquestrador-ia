/**
 * Main tRPC Router
 * Aggregates all sub-routers into a single API
 * 180+ endpoints across 14 routers
 */
import { router } from '../trpc.js';
// Import all sub-routers
import { authRouter } from './routers/auth.js';
import { usersRouter } from './routers/users.js';
import { teamsRouter } from './routers/teams.js';
import { projectsRouter } from './routers/projects.js';
import { tasksRouter } from './routers/tasks.js';
import { chatRouter } from './routers/chat.js';
import { promptsRouter } from './routers/prompts.js';
import { modelsRouter } from './routers/models.js';
import { lmstudioRouter } from './routers/lmstudio.js';
import { trainingRouter } from './routers/training.js';
import { servicesRouter } from './routers/services.js';
import { monitoringRouter } from './routers/monitoring.js';
import { workflowsRouter } from './routers/workflows.js';
import { templatesRouter } from './routers/templates.js';
import { knowledgebaseRouter } from './routers/knowledgebase.js';
import { settingsRouter } from './routers/settings.js';
/**
 * Main application router
 * Combines all feature routers
 */
export const appRouter = router({
    // SPRINT 4 - Authentication (5 endpoints)
    auth: authRouter,
    // SPRINT 4 - Users Management (14 endpoints)
    users: usersRouter,
    // SPRINT 4 - Teams Management (9 endpoints)
    teams: teamsRouter,
    // SPRINT 4 - Projects Management (10 endpoints)
    projects: projectsRouter,
    // SPRINT 5 - LM Studio Integration (12 endpoints)
    lmstudio: lmstudioRouter,
    // SPRINT 7 - Task Management (16 endpoints)
    tasks: tasksRouter,
    // SPRINT 8 - Chat Interface (15 endpoints)
    chat: chatRouter,
    // SPRINT 9 - Prompt Management (12 endpoints)
    prompts: promptsRouter,
    // SPRINT 9 - Models Management (10 endpoints)
    models: modelsRouter,
    // SPRINT 10 - Model Training (22 endpoints)
    training: trainingRouter,
    // SPRINT 11 - External Services (35+ endpoints)
    services: servicesRouter,
    // SPRINT 13 - System Monitoring (14 endpoints)
    monitoring: monitoringRouter,
    // SPRINT 12 - Workflow Management (18 endpoints)
    workflows: workflowsRouter,
    // SPRINT 14 - Template Management (14 endpoints)
    templates: templatesRouter,
    // SPRINT 15 - Knowledge Base (16 endpoints)
    knowledgebase: knowledgebaseRouter,
    // SPRINT 16 - System Settings (25 endpoints)
    settings: settingsRouter,
});
/**
 * ✅ Router Statistics - COMPLETE
 * - Total Routers: 16
 * - Total Endpoints: 247
 * - Coverage: Sprints 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
 *
 * Endpoints by Router:
 * 1. auth          - 5 endpoints   (login, register, verify, refresh, logout)
 * 2. users         - 14 endpoints  (profile, update, search, preferences, statistics, activity, avatar, sessions, export)
 * 3. teams         - 9 endpoints   (CRUD, members management)
 * 4. projects      - 10 endpoints  (CRUD, stats, archive, duplicate)
 * 5. tasks         - 16 endpoints  (CRUD, subtasks, dependencies, orchestration)
 * 6. chat          - 15 endpoints  (conversations, messages, attachments, reactions)
 * 7. prompts       - 12 endpoints  (CRUD, versions, search, revert)
 * 8. models        - 10 endpoints  (CRUD, specialized AIs)
 * 9. lmstudio      - 12 endpoints  (list, load, generate, benchmark, compare)
 * 10. training     - 22 endpoints  (datasets, jobs, evaluation, metrics)
 * 11. services     - 35 endpoints  (GitHub, Gmail, Drive, Sheets, OAuth, credentials)
 * 12. monitoring   - 14 endpoints  (metrics, health, logs, alerts)
 * 13. workflows    - 18 endpoints  (CRUD, execute, validate, templates, import/export)
 * 14. templates    - 14 endpoints  (CRUD, use, validate, import/export, popular)
 * 15. knowledgebase - 16 endpoints (CRUD, search, sources, tags, similar, import/export)
 * 16. settings     - 25 endpoints  (system config, notifications, security, providers, backups)
 *
 * TOTAL: 247 ENDPOINTS ✅
 *
 * Frontend Pages Status: 13/16 COMPLETE (81.25%)
 * ✅ Dashboard, Projects, Teams, Tasks, Chat, Prompts, Credentials, Workflows, Templates, KnowledgeBase, Settings, Profile, LMStudio
 * ⏳ Models, Training, Services (pending)
 */
