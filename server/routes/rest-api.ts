/**
 * REST API Routes - Wrapper compatível com banco
 */

import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';
import { projects, teams, prompts, tasks } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

function successResponse(data: any, message?: string) {
  return { success: true, message: message || 'OK', data };
}

function errorResponse(error: any, status: number = 500) {
  return { success: false, error: error.message || String(error), status };
}

// GET /api/projects
router.get('/projects', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const allProjects = await db.select().from(projects).where(eq(projects.isActive, true)).limit(limit);
    res.json(successResponse(allProjects));
  } catch (error) {
    res.status(500).json(errorResponse(error));
  }
});

// POST /api/projects  
router.post('/projects', async (req: Request, res: Response) => {
  try {
    const { name, description, teamId } = req.body;
    if (!name) return res.status(400).json(errorResponse({ message: 'Name required' }, 400));
    
    const result: any = await db.insert(projects).values({
      userId: 1,
      name: name.trim(),
      description: description || null,
      teamId: teamId || null,
      status: 'active',
      progress: 0,
      isActive: true,
    } as any);
    
    const id = result[0]?.insertId || result.insertId;
    const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    
    console.log('✅ REST: Project created', id);
    res.status(201).json(successResponse(project, 'Project created'));
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json(errorResponse(error));
  }
});

// GET /api/teams
router.get('/teams', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const allTeams = await db.select().from(teams).limit(limit);
    res.json(successResponse(allTeams));
  } catch (error) {
    res.status(500).json(errorResponse(error));
  }
});

// POST /api/teams
router.post('/teams', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json(errorResponse({ message: 'Name required' }, 400));
    
    const result: any = await db.insert(teams).values({
      name: name.trim(),
      description: description || null,
      ownerId: 1,
    } as any);
    
    const id = result[0]?.insertId || result.insertId;
    const [team] = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
    
    console.log('✅ REST: Team created', id);
    res.status(201).json(successResponse(team, 'Team created'));
  } catch (error) {
    res.status(500).json(errorResponse(error));
  }
});

// GET /api/prompts
router.get('/prompts', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const allPrompts = await db.select().from(prompts).limit(limit);
    res.json(successResponse(allPrompts));
  } catch (error) {
    res.status(500).json(errorResponse(error));
  }
});

// POST /api/prompts
router.post('/prompts', async (req: Request, res: Response) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) return res.status(400).json(errorResponse({ message: 'Title and content required' }, 400));
    
    const result: any = await db.insert(prompts).values({
      userId: 1,
      title: title.trim(),
      content: content.trim(),
      category: category || null,
      isPublic: false,
    } as any);
    
    const id = result[0]?.insertId || result.insertId;
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id)).limit(1);
    
    console.log('✅ REST: Prompt created', id);
    res.status(201).json(successResponse(prompt, 'Prompt created'));
  } catch (error) {
    res.status(500).json(errorResponse(error));
  }
});

// GET /api/tasks
router.get('/tasks', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const allTasks = await db.select().from(tasks).limit(limit);
    res.json(successResponse(allTasks));
  } catch (error) {
    res.status(500).json(errorResponse(error));
  }
});

// POST /api/tasks
router.post('/tasks', async (req: Request, res: Response) => {
  try {
    const { title, description, projectId } = req.body;
    if (!title) return res.status(400).json(errorResponse({ message: 'Title required' }, 400));
    
    const result: any = await db.insert(tasks).values({
      userId: 1,
      title: title.trim(),
      description: description || null,
      projectId: projectId || null,
      status: 'pending',
      priority: 'medium',
    } as any);
    
    const id = result[0]?.insertId || result.insertId;
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    
    console.log('✅ REST: Task created', id);
    res.status(201).json(successResponse(task, 'Task created'));
  } catch (error) {
    res.status(500).json(errorResponse(error));
  }
});

export default router;
