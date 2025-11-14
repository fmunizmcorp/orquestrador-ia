/**
 * REST API Routes - Wrapper compatível com banco
 */

import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';
import { projects, teams, prompts, tasks, aiModels, conversations, messages, aiWorkflows } from '../db/schema.js';
import { eq, desc, asc, and, sql } from 'drizzle-orm';
import { lmStudio } from '../lib/lm-studio.js';

const router = Router();

function successResponse(data: any, message?: string) {
  return { success: true, message: message || 'OK', data };
}

/**
 * Recalculate and update project progress based on completed tasks
 * @param projectId - Project ID to recalculate
 */
async function recalculateProjectProgress(projectId: number): Promise<void> {
  try {
    // Get all tasks for this project
    const projectTasks = await db.select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId));
    
    if (projectTasks.length > 0) {
      const completedTasks = projectTasks.filter(t => 
        t.status === 'completed'
      ).length;
      
      const calculatedProgress = Math.round((completedTasks / projectTasks.length) * 100);
      
      // Build update object based on progress
      const updateData: any = { progress: calculatedProgress };
      
      if (calculatedProgress >= 100) {
        updateData.status = 'completed';
      }
      
      // Update project progress and auto-complete if 100%
      await db.update(projects)
        .set(updateData)
        .where(eq(projects.id, projectId));
      
      console.log(`📊 Progress recalculated for project ${projectId}: ${calculatedProgress}% (${completedTasks}/${projectTasks.length} tasks)`);
    } else {
      // No tasks = 0% progress
      await db.update(projects)
        .set({ progress: 0 })
        .where(eq(projects.id, projectId));
      
      console.log(`📊 Progress reset to 0% for project ${projectId} (no tasks)`);
    }
  } catch (error) {
    console.error(`❌ Error recalculating progress for project ${projectId}:`, error);
    // Don't throw - allow operation to continue
  }
}

function errorResponse(error: any, status?: number) {
  // Extract error message
  let message = typeof error === 'string' ? error : (error.message || String(error));
  
  // Never expose database errors
  if (message.includes('Data truncated') || 
      message.includes('Duplicate entry') ||
      message.includes('foreign key constraint') ||
      message.includes('ER_')) {
    message = 'Database operation failed';
  }
  
  // Auto-detect status code if not provided
  if (!status) {
    if (message.toLowerCase().includes('not found') || 
        message.toLowerCase().includes('doesn\'t exist')) {
      status = 404;
    } else if (message.toLowerCase().includes('required') || 
               message.toLowerCase().includes('invalid') ||
               message.toLowerCase().includes('must be')) {
      status = 400;
    } else {
      status = 500;
    }
  }
  
  return { success: false, error: message, status };
}

// GET /api/projects
router.get('/projects', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const allProjects = await db.select().from(projects).where(eq(projects.isActive, true)).limit(limit);
    res.json(successResponse(allProjects));
  } catch (error) {
    const err = errorResponse(error);
    res.status(err.status).json(err);
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
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// GET /api/projects/:id - Get specific project
router.get('/projects/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json(errorResponse('Invalid project ID'));
    }
    
    // Recalculate progress before retrieving (ensures fresh data)
    await recalculateProjectProgress(id);
    
    const [project] = await db.select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);
    
    if (!project) {
      return res.status(404).json(errorResponse('Project not found'));
    }
    
    res.json(successResponse(project, 'Project retrieved'));
  } catch (error) {
    console.error('Error getting project:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// GET /api/teams
router.get('/teams', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const allTeams = await db.select().from(teams).limit(limit);
    res.json(successResponse(allTeams));
  } catch (error) {
    const err = errorResponse(error);
    res.status(err.status).json(err);
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
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// GET /api/prompts
router.get('/prompts', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const allPrompts = await db.select().from(prompts).limit(limit);
    res.json(successResponse(allPrompts));
  } catch (error) {
    const err = errorResponse(error);
    res.status(err.status).json(err);
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
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// GET /api/tasks
router.get('/tasks', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const allTasks = await db.select().from(tasks).limit(limit);
    res.json(successResponse(allTasks));
  } catch (error) {
    const err = errorResponse(error);
    res.status(err.status).json(err);
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
    
    // Recalculate project progress if task belongs to a project
    if (projectId) {
      await recalculateProjectProgress(projectId);
    }
    
    console.log('✅ REST: Task created', id);
    res.status(201).json(successResponse(task, 'Task created'));
  } catch (error) {
    const err = errorResponse(error);
    res.status(err.status).json(err);
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
    if (status !== undefined) {
      updateData.status = status;
    }
    if (progress !== undefined) {
      updateData.progress = progress;
      // Auto-complete if progress reaches 100%
      if (progress >= 100 && !updateData.status) {
        updateData.status = 'completed';
      }
    }
    
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
    const err = errorResponse(error);
    res.status(err.status).json(err);
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
    const err = errorResponse(error);
    res.status(err.status).json(err);
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
    const err = errorResponse(error);
    res.status(err.status).json(err);
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
    const err = errorResponse(error);
    res.status(err.status).json(err);
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
    const err = errorResponse(error);
    res.status(err.status).json(err);
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
    const err = errorResponse(error);
    res.status(err.status).json(err);
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
    if (status !== undefined) {
      updateData.status = status;
      // Auto-fill completedAt when status changes to 'completed'
      if (status === 'completed') {
        updateData.completedAt = new Date();
      }
    }
    if (priority !== undefined) updateData.priority = priority;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json(errorResponse({ message: 'No fields to update' }, 400));
    }
    
    await db.update(tasks).set(updateData).where(eq(tasks.id, id));
    
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    
    if (!task) return res.status(404).json(errorResponse({ message: 'Task not found' }, 404));
    
    // Recalculate project progress if task belongs to a project (use task's projectId from DB)
    if (task.projectId) {
      await recalculateProjectProgress(task.projectId);
    }
    
    console.log('✅ REST: Task updated', id);
    res.json(successResponse(task, 'Task updated'));
  } catch (error) {
    console.error('Error updating task:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// DELETE /api/tasks/:id
router.delete('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json(errorResponse({ message: 'Invalid ID' }, 400));
    
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    if (!task) return res.status(404).json(errorResponse({ message: 'Task not found' }, 404));
    
    // Store projectId before deletion for progress recalculation
    const taskProjectId = task.projectId;
    
    await db.delete(tasks).where(eq(tasks.id, id));
    
    // Recalculate project progress after deletion if task belonged to a project
    if (taskProjectId) {
      await recalculateProjectProgress(taskProjectId);
    }
    
    console.log('✅ REST: Task deleted', id);
    res.json(successResponse({ id }, 'Task deleted'));
  } catch (error) {
    console.error('Error deleting task:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// GET /api/models
router.get('/models', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const allModels = await db.select().from(aiModels).where(eq(aiModels.isActive, true)).limit(limit);
    res.json(successResponse(allModels));
  } catch (error) {
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// GET /api/models/:id - Get specific model
router.get('/models/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json(errorResponse('Invalid model ID'));
    }
    
    const [model] = await db.select()
      .from(aiModels)
      .where(eq(aiModels.id, id))
      .limit(1);
    
    if (!model) {
      return res.status(404).json(errorResponse('Model not found'));
    }
    
    res.json(successResponse(model, 'Model retrieved'));
  } catch (error) {
    console.error('Error getting model:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// POST /api/models/:id/load - Load model in LM Studio
router.post('/models/:id/load', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json(errorResponse('Invalid model ID'));
    }
    
    const [model] = await db.select()
      .from(aiModels)
      .where(eq(aiModels.id, id))
      .limit(1);
    
    if (!model) {
      return res.status(404).json(errorResponse('Model not found'));
    }
    
    // REAL INTEGRATION: Verify if model is actually loaded in LM Studio
    try {
      const lmResponse = await fetch('http://localhost:1234/v1/models', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });
      
      if (!lmResponse.ok) {
        throw new Error(`LM Studio returned ${lmResponse.status}`);
      }
      
      const lmData = await lmResponse.json();
      const loadedModels = lmData.data || [];
      
      // Check if model is actually loaded (modelId matches any loaded model)
      const isActuallyLoaded = loadedModels.some((m: any) => 
        m.id === model.modelId || m.id.includes(model.modelId || '')
      );
      
      // Update database with REAL state
      await db.update(aiModels)
        .set({ 
          isLoaded: isActuallyLoaded,
          updatedAt: new Date(),
        })
        .where(eq(aiModels.id, id));
      
      if (!isActuallyLoaded) {
        // Model is NOT loaded in LM Studio
        return res.status(400).json({
          success: false,
          error: 'Model not loaded in LM Studio',
          message: `Model '${model.modelId}' is not currently loaded in LM Studio. Please load it first using LM Studio UI or CLI: lms load ${model.modelId}`,
          instruction: `Run in terminal: lms load ${model.modelId}`,
          availableModels: loadedModels.map((m: any) => m.id),
          simulated: false,
        });
      }
      
      // Model IS loaded - success!
      const loadResult = {
        modelId: model.id,
        modelName: model.name,
        status: 'loaded',
        message: `Model ${model.name} is loaded and ready`,
        timestamp: new Date().toISOString(),
        lmStudioModelId: loadedModels.find((m: any) => m.id === model.modelId || m.id.includes(model.modelId || ''))?.id,
        simulated: false, // REAL integration!
      };
      
      console.log(`✅ Model ${model.name} verified as loaded in LM Studio`);
      res.json(successResponse(loadResult, 'Model loaded'));
      
    } catch (lmError: any) {
      console.error('LM Studio API error:', lmError.message);
      
      // Mark as not loaded
      await db.update(aiModels)
        .set({ isLoaded: false, updatedAt: new Date() })
        .where(eq(aiModels.id, id));
      
      return res.status(503).json({
        success: false,
        error: 'LM Studio not available',
        message: 'LM Studio is not running or not accessible on port 1234',
        instruction: 'Please start LM Studio and ensure it is running on http://localhost:1234',
        simulated: false,
      });
    }
  } catch (error) {
    console.error('Error loading model:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// POST /api/models/:id/unload - Unload model from LM Studio
router.post('/models/:id/unload', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json(errorResponse('Invalid model ID'));
    }
    
    const [model] = await db.select()
      .from(aiModels)
      .where(eq(aiModels.id, id))
      .limit(1);
    
    if (!model) {
      return res.status(404).json(errorResponse('Model not found'));
    }
    
    // REAL INTEGRATION: Verify current state in LM Studio
    try {
      const lmResponse = await fetch('http://localhost:1234/v1/models', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });
      
      if (!lmResponse.ok) {
        throw new Error(`LM Studio returned ${lmResponse.status}`);
      }
      
      const lmData = await lmResponse.json();
      const loadedModels = lmData.data || [];
      
      // Check if model is still loaded
      const isStillLoaded = loadedModels.some((m: any) => 
        m.id === model.modelId || m.id.includes(model.modelId || '')
      );
      
      // Update database to NOT loaded
      await db.update(aiModels)
        .set({ isLoaded: false, updatedAt: new Date() })
        .where(eq(aiModels.id, id));
      
      if (isStillLoaded) {
        // Model is STILL loaded in LM Studio
        return res.status(400).json({
          success: false,
          error: 'Model still loaded in LM Studio',
          message: `Model '${model.modelId}' is still loaded in LM Studio. To unload it, please use LM Studio UI or CLI: lms unload ${model.modelId}`,
          instruction: `Run in terminal: lms unload ${model.modelId}`,
          simulated: false,
        });
      }
      
      // Model is NOT loaded - success!
      const unloadResult = {
        modelId: model.id,
        modelName: model.name,
        status: 'unloaded',
        message: `Model ${model.name} is unloaded`,
        timestamp: new Date().toISOString(),
        simulated: false, // REAL integration!
      };
      
      console.log(`✅ Model ${model.name} verified as unloaded from LM Studio`);
      res.json(successResponse(unloadResult, 'Model unloaded'));
      
    } catch (lmError: any) {
      console.error('LM Studio API error:', lmError.message);
      
      // Mark as not loaded anyway (safe assumption)
      await db.update(aiModels)
        .set({ isLoaded: false, updatedAt: new Date() })
        .where(eq(aiModels.id, id));
      
      return res.status(503).json({
        success: false,
        error: 'LM Studio not available',
        message: 'LM Studio is not running or not accessible on port 1234. Model marked as unloaded in database.',
        simulated: false,
      });
    }
  } catch (error) {
    console.error('Error unloading model:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// POST /api/models/sync - Synchronize ALL models with LM Studio
router.post('/models/sync', async (req: Request, res: Response) => {
  try {
    // REAL INTEGRATION: Get currently loaded models from LM Studio
    const lmResponse = await fetch('http://localhost:1234/v1/models', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    
    if (!lmResponse.ok) {
      throw new Error(`LM Studio returned ${lmResponse.status}`);
    }
    
    const lmData = await lmResponse.json();
    const loadedModels = lmData.data || [];
    const loadedModelIds = new Set(loadedModels.map((m: any) => m.id));
    
    // Get all models from database
    const allModels = await db.select().from(aiModels);
    
    // Synchronize each model
    let syncedCount = 0;
    let changedCount = 0;
    
    for (const model of allModels) {
      const isActuallyLoaded = loadedModelIds.has(model.modelId || '');
      
      // Update only if state changed
      if (model.isLoaded !== isActuallyLoaded) {
        await db.update(aiModels)
          .set({ 
            isLoaded: isActuallyLoaded,
            updatedAt: new Date(),
          })
          .where(eq(aiModels.id, model.id));
        
        changedCount++;
        console.log(`🔄 Synced model ${model.name}: ${model.isLoaded} → ${isActuallyLoaded}`);
      }
      
      syncedCount++;
    }
    
    const syncResult = {
      totalModels: allModels.length,
      syncedModels: syncedCount,
      changedModels: changedCount,
      loadedInLMStudio: loadedModels.length,
      loadedModelIds: Array.from(loadedModelIds),
      timestamp: new Date().toISOString(),
      simulated: false,
    };
    
    console.log(`✅ Synchronized ${syncedCount} models with LM Studio (${changedCount} changed)`);
    res.json(successResponse(syncResult, 'Models synchronized'));
    
  } catch (lmError: any) {
    console.error('LM Studio API error:', lmError.message);
    
    return res.status(503).json({
      success: false,
      error: 'LM Studio not available',
      message: 'LM Studio is not running or not accessible on port 1234',
      simulated: false,
    });
  }
});

// ========================================
// CHAT ENDPOINTS
// ========================================

// GET /api/chat - List conversations
router.get('/chat', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.query.userId as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const userConversations = await db.select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.lastMessageAt))
      .limit(limit);
    
    res.json(successResponse(userConversations, 'Conversations retrieved'));
  } catch (error) {
    console.error('Error listing conversations:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// POST /api/chat - Create conversation
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { userId = 1, title = 'Nova Conversa', modelId = 1, systemPrompt = '' } = req.body;
    
    const result: any = await db.insert(conversations).values({
      userId,
      title,
      modelId,
      systemPrompt,
    });
    
    const convId = result[0]?.insertId || result.insertId;
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, convId)).limit(1);
    
    res.json(successResponse(conversation, 'Conversation created'));
  } catch (error) {
    console.error('Error creating conversation:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// GET /api/chat/:id - Get conversation with messages
router.get('/chat/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const [conversation] = await db.select()
      .from(conversations)
      .where(eq(conversations.id, id))
      .limit(1);
    
    if (!conversation) {
      return res.status(404).json(errorResponse('Conversation not found'));
    }
    
    const conversationMessages = await db.select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt))
      .limit(100);
    
    res.json(successResponse({ conversation, messages: conversationMessages }));
  } catch (error) {
    console.error('Error getting conversation:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// GET /api/chat/:id/messages - List conversation messages
router.get('/chat/:id/messages', async (req: Request, res: Response) => {
  try {
    const conversationId = parseInt(req.params.id);
    const limit = parseInt(req.query.limit as string) || 100;
    
    // Check if conversation exists
    const [conversation] = await db.select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);
    
    if (!conversation) {
      return res.status(404).json(errorResponse('Conversation not found'));
    }
    
    // Get messages
    const conversationMessages = await db.select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt))
      .limit(limit);
    
    res.json(successResponse(conversationMessages, 'Messages retrieved'));
  } catch (error) {
    console.error('Error getting messages:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// POST /api/chat/:id/messages - Send message
router.post('/chat/:id/messages', async (req: Request, res: Response) => {
  try {
    const conversationId = parseInt(req.params.id);
    const { content, role = 'user' } = req.body;
    
    if (!content) {
      return res.status(400).json(errorResponse('Content is required'));
    }
    
    // Get conversation for system prompt
    const [conversation] = await db.select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);
    
    if (!conversation) {
      return res.status(404).json(errorResponse('Conversation not found'));
    }
    
    // Save user message
    const result: any = await db.insert(messages).values({
      conversationId,
      content,
      role,
    });
    
    const msgId = result[0]?.insertId || result.insertId;
    const [userMessage] = await db.select().from(messages).where(eq(messages.id, msgId)).limit(1);
    
    // Generate AI response if user message
    let aiResponse = null;
    if (role === 'user') {
      try {
        // Check if LM Studio is available
        const isLMStudioAvailable = await lmStudio.isAvailable();
        
        let aiContent: string;
        
        if (isLMStudioAvailable) {
          // Get conversation history for context
          const history = await db.select()
            .from(messages)
            .where(eq(messages.conversationId, conversationId))
            .orderBy(asc(messages.createdAt))
            .limit(10);
          
          // Build messages array for LM Studio
          const lmMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
          
          if (conversation.systemPrompt) {
            lmMessages.push({ role: 'system', content: conversation.systemPrompt });
          }
          
          history.forEach(msg => {
            if (msg.role === 'user' || msg.role === 'assistant') {
              lmMessages.push({ role: msg.role, content: msg.content });
            }
          });
          
          // Call LM Studio
          aiContent = await lmStudio.chatCompletion({ messages: lmMessages });
        } else {
          // Fallback to simulated response
          aiContent = `[LM Studio não disponível] Resposta simulada para: "${content.substring(0, 50)}..."`;
        }
        
        // Save AI response
        const aiResult: any = await db.insert(messages).values({
          conversationId,
          content: aiContent,
          role: 'assistant',
        });
        
        const aiMsgId = aiResult[0]?.insertId || aiResult.insertId;
        [aiResponse] = await db.select().from(messages).where(eq(messages.id, aiMsgId)).limit(1);
        
      } catch (aiError) {
        console.error('Error generating AI response:', aiError);
        // Continue without AI response - user message is still saved
      }
    }
    
    // Update conversation lastMessageAt
    await db.update(conversations)
      .set({ 
        lastMessageAt: new Date(),
        messageCount: sql`${conversations.messageCount} + ${aiResponse ? 2 : 1}`,
      })
      .where(eq(conversations.id, conversationId));
    
    res.json(successResponse({ 
      userMessage, 
      aiResponse,
    }, 'Message sent'));
  } catch (error) {
    console.error('Error sending message:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// ========================================
// WORKFLOWS ENDPOINTS
// ========================================

// GET /api/workflows - List workflows
router.get('/workflows', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.query.userId as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    
    const conditions = [eq(aiWorkflows.userId, userId)];
    if (isActive !== undefined) {
      conditions.push(eq(aiWorkflows.isActive, isActive));
    }
    
    const workflows = await db.select()
      .from(aiWorkflows)
      .where(and(...conditions))
      .orderBy(desc(aiWorkflows.createdAt))
      .limit(limit);
    
    res.json(successResponse(workflows, 'Workflows retrieved'));
  } catch (error) {
    console.error('Error listing workflows:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// POST /api/workflows - Create workflow
router.post('/workflows', async (req: Request, res: Response) => {
  try {
    const { userId = 1, name, description = '', steps = [], isActive = true } = req.body;
    
    if (!name) {
      return res.status(400).json(errorResponse('Name is required'));
    }
    
    const result: any = await db.insert(aiWorkflows).values({
      userId,
      name,
      description,
      steps: steps as any,
      isActive,
    });
    
    const workflowId = result[0]?.insertId || result.insertId;
    const [workflow] = await db.select().from(aiWorkflows).where(eq(aiWorkflows.id, workflowId)).limit(1);
    
    res.json(successResponse(workflow, 'Workflow created'));
  } catch (error) {
    console.error('Error creating workflow:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// GET /api/workflows/:id - Get workflow
router.get('/workflows/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const [workflow] = await db.select()
      .from(aiWorkflows)
      .where(eq(aiWorkflows.id, id))
      .limit(1);
    
    if (!workflow) {
      return res.status(404).json(errorResponse('Workflow not found'));
    }
    
    res.json(successResponse(workflow));
  } catch (error) {
    console.error('Error getting workflow:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// PUT /api/workflows/:id - Update workflow
router.put('/workflows/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, steps, isActive } = req.body;
    
    const updateData: any = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (steps !== undefined) updateData.steps = steps;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    await db.update(aiWorkflows)
      .set(updateData)
      .where(eq(aiWorkflows.id, id));
    
    const [workflow] = await db.select().from(aiWorkflows).where(eq(aiWorkflows.id, id)).limit(1);
    
    res.json(successResponse(workflow, 'Workflow updated'));
  } catch (error) {
    console.error('Error updating workflow:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// DELETE /api/workflows/:id - Delete workflow
router.delete('/workflows/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    await db.delete(aiWorkflows).where(eq(aiWorkflows.id, id));
    
    res.json(successResponse({ id }, 'Workflow deleted'));
  } catch (error) {
    console.error('Error deleting workflow:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// POST /api/workflows/:id/execute - Execute workflow
router.post('/workflows/:id/execute', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { context = {} } = req.body;
    
    const [workflow] = await db.select()
      .from(aiWorkflows)
      .where(eq(aiWorkflows.id, id))
      .limit(1);
    
    if (!workflow) {
      return res.status(404).json(errorResponse('Workflow not found'));
    }
    
    if (!workflow.isActive) {
      return res.status(400).json(errorResponse('Workflow is not active'));
    }
    
    // Execute workflow with real AI calls
    const steps = (workflow.steps as any[]) || [];
    const isLMStudioAvailable = await lmStudio.isAvailable();
    
    const executionSteps = [];
    
    for (const step of steps) {
      const startTime = new Date().toISOString();
      let stepStatus = 'completed';
      let stepResult: any = {
        message: `Step ${step.name} executed successfully`,
        type: step.type,
      };
      
      // If step requires AI execution
      if (step.type === 'ai_prompt' || step.type === 'ai_chat' || step.type === 'llm') {
        try {
          if (isLMStudioAvailable && step.prompt) {
            // Execute with real LM Studio
            const aiOutput = await lmStudio.complete(step.prompt, step.systemPrompt);
            stepResult = {
              ...stepResult,
              aiOutput,
              message: `AI step executed successfully`,
            };
          } else {
            // Fallback
            stepResult = {
              ...stepResult,
              message: `Step ${step.name} executed (LM Studio not available)`,
              simulated: true,
            };
          }
        } catch (stepError: any) {
          console.error(`Error in workflow step ${step.id}:`, stepError);
          stepStatus = 'error';
          stepResult = {
            ...stepResult,
            error: stepError.message,
            message: `Step ${step.name} failed`,
          };
        }
      }
      
      executionSteps.push({
        stepId: step.id,
        status: stepStatus,
        startedAt: startTime,
        completedAt: new Date().toISOString(),
        result: stepResult,
      });
    }
    
    const allStepsCompleted = executionSteps.every(s => s.status === 'completed');
    const endTime = new Date();
    
    // Preserve metadata from workflow
    const preservedMetadata = {
      workflowDescription: workflow.description,
      workflowCreatedAt: workflow.createdAt,
      workflowUpdatedAt: workflow.updatedAt,
      totalSteps: steps.length,
      completedSteps: executionSteps.filter(s => s.status === 'completed').length,
      errorSteps: executionSteps.filter(s => s.status === 'error').length,
    };
    
    const execution = {
      workflowId: workflow.id,
      workflowName: workflow.name,
      status: allStepsCompleted ? 'completed' : 'partial',
      startedAt: new Date().toISOString(),
      completedAt: endTime.toISOString(),
      steps: executionSteps,
      context,
      metadata: preservedMetadata,
      lmStudioAvailable: isLMStudioAvailable,
    };
    
    res.json(successResponse(execution, 'Workflow executed'));
  } catch (error) {
    console.error('Error executing workflow:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// ========================================
// PROMPTS EXECUTION ENDPOINT
// ========================================

// POST /api/prompts/execute - Execute prompt with REAL LM Studio integration
router.post('/prompts/execute', async (req: Request, res: Response) => {
  try {
    const { promptId, variables = {}, modelId = 1, metadata = {} } = req.body;
    
    console.log(`📝 [PROMPT EXECUTE] Starting execution - promptId: ${promptId}, modelId: ${modelId}`);
    
    if (!promptId) {
      return res.status(400).json(errorResponse('promptId is required'));
    }
    
    // Get prompt from database
    const [prompt] = await db.select()
      .from(prompts)
      .where(eq(prompts.id, promptId))
      .limit(1);
    
    if (!prompt) {
      console.error(`❌ [PROMPT EXECUTE] Prompt not found: ${promptId}`);
      return res.status(404).json(errorResponse('Prompt not found'));
    }
    
    console.log(`✅ [PROMPT EXECUTE] Prompt found: "${prompt.title}"`);
    
    // Get model from database to get the actual LM Studio model ID
    const [model] = await db.select()
      .from(aiModels)
      .where(eq(aiModels.id, modelId))
      .limit(1);
    
    if (!model) {
      console.error(`❌ [PROMPT EXECUTE] Model not found in database: ${modelId}`);
      return res.status(404).json(errorResponse('Model not found'));
    }
    
    console.log(`✅ [PROMPT EXECUTE] Model found: ${model.name} (modelId: ${model.modelId})`);
    
    // Replace variables in prompt content
    let processedContent = prompt.content || '';
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      processedContent = processedContent.replace(regex, String(value));
    });
    
    console.log(`📝 [PROMPT EXECUTE] Processed content length: ${processedContent.length} chars`);
    
    // Execute prompt with LM Studio
    let output: string;
    let status: string;
    let lmStudioModelUsed: string | null = null;
    let simulated: boolean = false;
    
    try {
      // Check if LM Studio is available
      const isLMStudioAvailable = await lmStudio.isAvailable();
      console.log(`🔍 [PROMPT EXECUTE] LM Studio available: ${isLMStudioAvailable}`);
      
      if (isLMStudioAvailable) {
        // Get loaded models from LM Studio to verify which one to use
        const lmResponse = await fetch('http://localhost:1234/v1/models', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000),
        });
        
        if (!lmResponse.ok) {
          throw new Error(`LM Studio API returned ${lmResponse.status}`);
        }
        
        const lmData = await lmResponse.json();
        const loadedModels = lmData.data || [];
        
        console.log(`🔍 [PROMPT EXECUTE] Found ${loadedModels.length} loaded models in LM Studio`);
        
        if (loadedModels.length === 0) {
          throw new Error('LM Studio: No models loaded. Please load a model first using LM Studio UI or CLI command: lms load <model-name>');
        }
        
        // Try to find the model specified in database
        let targetModel = loadedModels.find((m: any) => 
          m.id === model.modelId || 
          m.id.includes(model.modelId || '') ||
          (model.modelId && m.id.toLowerCase().includes(model.modelId.toLowerCase()))
        );
        
        // Fallback: use first available model if specified model not found
        if (!targetModel) {
          console.warn(`⚠️  [PROMPT EXECUTE] Model '${model.modelId}' not found in loaded models, using first available: ${loadedModels[0].id}`);
          targetModel = loadedModels[0];
        }
        
        lmStudioModelUsed = targetModel.id;
        console.log(`🎯 [PROMPT EXECUTE] Using LM Studio model: ${lmStudioModelUsed}`);
        
        // Call LM Studio with processed prompt and correct modelId
        console.log(`🚀 [PROMPT EXECUTE] Calling LM Studio API...`);
        const startTime = Date.now();
        
        output = await lmStudio.complete(processedContent, undefined, lmStudioModelUsed || undefined);
        
        const duration = Date.now() - startTime;
        console.log(`✅ [PROMPT EXECUTE] LM Studio responded in ${duration}ms - output length: ${output.length} chars`);
        
        status = 'completed';
        simulated = false;
      } else {
        // Fallback to simulated response
        console.warn(`⚠️  [PROMPT EXECUTE] LM Studio not available, using simulated response`);
        output = `[LM Studio não disponível] Prompt executado: "${prompt.title}"`;
        status = 'simulated';
        simulated = true;
      }
    } catch (aiError: any) {
      console.error(`❌ [PROMPT EXECUTE] Error calling LM Studio:`, aiError.message);
      output = `[Erro na execução] ${aiError.message}`;
      status = 'error';
      simulated = false;
    }
    
    // Preserve and enrich metadata
    const enrichedMetadata = {
      ...metadata, // User-provided metadata
      promptCategory: prompt.category,
      promptIsPublic: prompt.isPublic,
      promptUseCount: (prompt.useCount || 0) + 1, // Will be incremented
      executionTimestamp: new Date().toISOString(),
      lmStudioAvailable: status !== 'simulated',
      lmStudioModelUsed: lmStudioModelUsed,
      requestedModelId: model.id,
      requestedModelName: model.name,
      requestedLMStudioModelId: model.modelId,
    };
    
    const execution = {
      promptId: prompt.id,
      promptTitle: prompt.title,
      modelId,
      modelName: model.name,
      lmStudioModelId: model.modelId,
      lmStudioModelUsed: lmStudioModelUsed,
      input: processedContent,
      output,
      variables,
      metadata: enrichedMetadata,
      executedAt: new Date().toISOString(),
      status,
      simulated,
    };
    
    // Increment use count
    await db.update(prompts)
      .set({ useCount: sql`${prompts.useCount} + 1` })
      .where(eq(prompts.id, promptId));
    
    console.log(`🎉 [PROMPT EXECUTE] Execution completed successfully - status: ${status}, simulated: ${simulated}`);
    
    res.json(successResponse(execution, 'Prompt executed'));
  } catch (error) {
    console.error('❌ [PROMPT EXECUTE] Fatal error:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

// POST /api/prompts/execute/stream - Execute prompt with STREAMING (SSE)
router.post('/prompts/execute/stream', async (req: Request, res: Response) => {
  try {
    const { promptId, variables = {}, modelId = 1 } = req.body;
    
    console.log(`🌊 [PROMPT EXECUTE STREAM] Starting streaming execution - promptId: ${promptId}, modelId: ${modelId}`);
    
    if (!promptId) {
      return res.status(400).json(errorResponse('promptId is required'));
    }
    
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    
    // Get prompt from database
    const [prompt] = await db.select()
      .from(prompts)
      .where(eq(prompts.id, promptId))
      .limit(1);
    
    if (!prompt) {
      console.error(`❌ [PROMPT EXECUTE STREAM] Prompt not found: ${promptId}`);
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Prompt not found' })}\n\n`);
      return res.end();
    }
    
    console.log(`✅ [PROMPT EXECUTE STREAM] Prompt found: "${prompt.title}"`);
    
    // Get model from database
    const [model] = await db.select()
      .from(aiModels)
      .where(eq(aiModels.id, modelId))
      .limit(1);
    
    if (!model) {
      console.error(`❌ [PROMPT EXECUTE STREAM] Model not found: ${modelId}`);
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Model not found' })}\n\n`);
      return res.end();
    }
    
    console.log(`✅ [PROMPT EXECUTE STREAM] Model found: ${model.name}`);
    
    // Replace variables in prompt content
    let processedContent = prompt.content || '';
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      processedContent = processedContent.replace(regex, String(value));
    });
    
    // Send initial metadata event
    res.write(`data: ${JSON.stringify({
      type: 'start',
      promptId,
      promptTitle: prompt.title,
      modelId: model.id,
      modelName: model.name,
      lmStudioModelId: model.modelId,
    })}\n\n`);
    
    try {
      // Check if LM Studio is available
      const isLMStudioAvailable = await lmStudio.isAvailable();
      
      if (!isLMStudioAvailable) {
        console.warn(`⚠️  [PROMPT EXECUTE STREAM] LM Studio not available`);
        res.write(`data: ${JSON.stringify({
          type: 'error',
          message: 'LM Studio not available'
        })}\n\n`);
        return res.end();
      }
      
      // Get loaded models to verify which one to use
      const lmResponse = await fetch('http://localhost:1234/v1/models', {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      
      const lmData = await lmResponse.json();
      const loadedModels = lmData.data || [];
      
      if (loadedModels.length === 0) {
        console.error(`❌ [PROMPT EXECUTE STREAM] No models loaded in LM Studio`);
        res.write(`data: ${JSON.stringify({
          type: 'error',
          message: 'No models loaded in LM Studio'
        })}\n\n`);
        return res.end();
      }
      
      // Find target model (fuzzy match or fallback to first)
      let targetModel = loadedModels.find((m: any) => 
        m.id === model.modelId || 
        m.id.includes(model.modelId || '') ||
        (model.modelId && m.id.toLowerCase().includes(model.modelId.toLowerCase()))
      ) || loadedModels[0];
      
      console.log(`🎯 [PROMPT EXECUTE STREAM] Using model: ${targetModel.id}`);
      console.log(`🌊 [PROMPT EXECUTE STREAM] Starting stream...`);
      
      const startTime = Date.now();
      let totalChunks = 0;
      let fullOutput = '';
      
      // Stream from LM Studio
      for await (const chunk of lmStudio.chatCompletionStream({
        model: targetModel.id,
        messages: [{ role: 'user', content: processedContent }],
        temperature: 0.7,
        max_tokens: 2000,
      })) {
        fullOutput += chunk;
        totalChunks++;
        
        // Send chunk to client
        res.write(`data: ${JSON.stringify({
          type: 'chunk',
          content: chunk,
          chunkNumber: totalChunks,
        })}\n\n`);
      }
      
      const duration = Date.now() - startTime;
      console.log(`✅ [PROMPT EXECUTE STREAM] Stream completed - ${totalChunks} chunks, ${duration}ms, ${fullOutput.length} chars`);
      
      // Send completion event
      res.write(`data: ${JSON.stringify({
        type: 'done',
        totalChunks,
        duration,
        outputLength: fullOutput.length,
      })}\n\n`);
      
      // Increment use count
      await db.update(prompts)
        .set({ useCount: sql`${prompts.useCount} + 1` })
        .where(eq(prompts.id, promptId));
      
      res.end();
    } catch (streamError: any) {
      console.error(`❌ [PROMPT EXECUTE STREAM] Stream error:`, streamError.message);
      res.write(`data: ${JSON.stringify({
        type: 'error',
        message: streamError.message
      })}\n\n`);
      res.end();
    }
  } catch (error: any) {
    console.error('❌ [PROMPT EXECUTE STREAM] Fatal error:', error);
    try {
      res.write(`data: ${JSON.stringify({
        type: 'error',
        message: error.message || 'Internal server error'
      })}\n\n`);
      res.end();
    } catch (writeError) {
      // Response already ended, nothing we can do
      console.error('❌ Failed to send error to client:', writeError);
    }
  }
});

// GET /api/system/metrics - System metrics (CPU, Memory, Disk)
router.get('/system/metrics', async (req: Request, res: Response) => {
  try {
    const os = await import('os');
    
    // CPU Usage calculation (average load as percentage)
    const cpuUsage = os.loadavg()[0] / os.cpus().length * 100;
    
    // Memory Usage calculation
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;
    
    // Disk usage (approximate - requires more complex calculation)
    // For now, return a placeholder value
    const diskUsage = 0;
    
    const metrics = {
      cpu: parseFloat(cpuUsage.toFixed(1)),
      memory: parseFloat(memoryUsage.toFixed(1)),
      disk: diskUsage,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ REST: System metrics retrieved', metrics);
    res.json(successResponse(metrics, 'System metrics retrieved'));
  } catch (error) {
    console.error('Error getting system metrics:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

export default router;
