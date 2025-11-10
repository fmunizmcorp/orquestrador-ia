/**
 * REST API Routes - Wrapper compatível com banco
 */

import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';
import { projects, teams, prompts, tasks, aiModels } from '../db/schema.js';
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

// PUT /api/projects/:id
router.put('/projects/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json(errorResponse({ message: 'Invalid ID' }, 400));
    
    const { name, description, teamId, status, progress } = req.body;
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description;
    if (teamId !== undefined) updateData.teamId = teamId;
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json(errorResponse({ message: 'No fields to update' }, 400));
    }
    
    await db.update(projects).set(updateData).where(eq(projects.id, id));
    const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    
    if (!project) return res.status(404).json(errorResponse({ message: 'Project not found' }, 404));
    
    console.log('✅ REST: Project updated', id);
    res.json(successResponse(project, 'Project updated'));
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json(errorResponse(error));
  }
});

// DELETE /api/projects/:id
router.delete('/projects/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json(errorResponse({ message: 'Invalid ID' }, 400));
    
    const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    if (!project) return res.status(404).json(errorResponse({ message: 'Project not found' }, 404));
    
    await db.update(projects).set({ isActive: false }).where(eq(projects.id, id));
    
    console.log('✅ REST: Project soft-deleted', id);
    res.json(successResponse({ id }, 'Project deleted'));
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json(errorResponse(error));
  }
});

// PUT /api/teams/:id
router.put('/teams/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json(errorResponse({ message: 'Invalid ID' }, 400));
    
    const { name, description } = req.body;
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json(errorResponse({ message: 'No fields to update' }, 400));
    }
    
    await db.update(teams).set(updateData).where(eq(teams.id, id));
    const [team] = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
    
    if (!team) return res.status(404).json(errorResponse({ message: 'Team not found' }, 404));
    
    console.log('✅ REST: Team updated', id);
    res.json(successResponse(team, 'Team updated'));
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json(errorResponse(error));
  }
});

// DELETE /api/teams/:id
router.delete('/teams/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json(errorResponse({ message: 'Invalid ID' }, 400));
    
    const [team] = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
    if (!team) return res.status(404).json(errorResponse({ message: 'Team not found' }, 404));
    
    await db.delete(teams).where(eq(teams.id, id));
    
    console.log('✅ REST: Team deleted', id);
    res.json(successResponse({ id }, 'Team deleted'));
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json(errorResponse(error));
  }
});

// PUT /api/prompts/:id
router.put('/prompts/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json(errorResponse({ message: 'Invalid ID' }, 400));
    
    const { title, content, category, isPublic } = req.body;
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (category !== undefined) updateData.category = category;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json(errorResponse({ message: 'No fields to update' }, 400));
    }
    
    await db.update(prompts).set(updateData).where(eq(prompts.id, id));
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id)).limit(1);
    
    if (!prompt) return res.status(404).json(errorResponse({ message: 'Prompt not found' }, 404));
    
    console.log('✅ REST: Prompt updated', id);
    res.json(successResponse(prompt, 'Prompt updated'));
  } catch (error) {
    console.error('Error updating prompt:', error);
    res.status(500).json(errorResponse(error));
  }
});

// DELETE /api/prompts/:id
router.delete('/prompts/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json(errorResponse({ message: 'Invalid ID' }, 400));
    
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id)).limit(1);
    if (!prompt) return res.status(404).json(errorResponse({ message: 'Prompt not found' }, 404));
    
    await db.delete(prompts).where(eq(prompts.id, id));
    
    console.log('✅ REST: Prompt deleted', id);
    res.json(successResponse({ id }, 'Prompt deleted'));
  } catch (error) {
    console.error('Error deleting prompt:', error);
    res.status(500).json(errorResponse(error));
  }
});

// PUT /api/tasks/:id
router.put('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json(errorResponse({ message: 'Invalid ID' }, 400));
    
    const { title, description, projectId, status, priority } = req.body;
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (projectId !== undefined) updateData.projectId = projectId;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json(errorResponse({ message: 'No fields to update' }, 400));
    }
    
    await db.update(tasks).set(updateData).where(eq(tasks.id, id));
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    
    if (!task) return res.status(404).json(errorResponse({ message: 'Task not found' }, 404));
    
    console.log('✅ REST: Task updated', id);
    res.json(successResponse(task, 'Task updated'));
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json(errorResponse(error));
  }
});

// DELETE /api/tasks/:id
router.delete('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json(errorResponse({ message: 'Invalid ID' }, 400));
    
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    if (!task) return res.status(404).json(errorResponse({ message: 'Task not found' }, 404));
    
    await db.delete(tasks).where(eq(tasks.id, id));
    
    console.log('✅ REST: Task deleted', id);
    res.json(successResponse({ id }, 'Task deleted'));
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json(errorResponse(error));
  }
});

// GET /api/models
router.get('/models', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const allModels = await db.select().from(aiModels).where(eq(aiModels.isActive, true)).limit(limit);
    res.json(successResponse(allModels));
  } catch (error) {
    res.status(500).json(errorResponse(error));
  }
});

export default router;
