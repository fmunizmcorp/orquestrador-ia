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
    
    await db.delete(tasks).where(eq(tasks.id, id));
    
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
    
    // Update model status to loaded
    await db.update(aiModels)
      .set({ 
        status: 'loaded',
        lastUsed: new Date(),
      })
      .where(eq(aiModels.id, id));
    
    // In production, this would call LM Studio API to actually load the model
    // Example: await fetch('http://localhost:1234/v1/models/load', { ... })
    
    const loadResult = {
      modelId: model.id,
      modelName: model.name,
      status: 'loaded',
      message: `Model ${model.name} loaded successfully`,
      timestamp: new Date().toISOString(),
      // Simulated response - in production would return actual LM Studio response
      simulated: true,
    };
    
    res.json(successResponse(loadResult, 'Model loaded'));
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
    
    // Update model status to unloaded
    await db.update(aiModels)
      .set({ status: 'available' })
      .where(eq(aiModels.id, id));
    
    // In production, this would call LM Studio API to actually unload the model
    // Example: await fetch('http://localhost:1234/v1/models/unload', { ... })
    
    const unloadResult = {
      modelId: model.id,
      modelName: model.name,
      status: 'unloaded',
      message: `Model ${model.name} unloaded successfully`,
      timestamp: new Date().toISOString(),
      // Simulated response - in production would return actual LM Studio response
      simulated: true,
    };
    
    res.json(successResponse(unloadResult, 'Model unloaded'));
  } catch (error) {
    console.error('Error unloading model:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
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
    
    const execution = {
      workflowId: workflow.id,
      workflowName: workflow.name,
      status: allStepsCompleted ? 'completed' : 'partial',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      steps: executionSteps,
      context,
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

// POST /api/prompts/execute - Execute prompt
router.post('/prompts/execute', async (req: Request, res: Response) => {
  try {
    const { promptId, variables = {}, modelId = 1 } = req.body;
    
    if (!promptId) {
      return res.status(400).json(errorResponse('promptId is required'));
    }
    
    const [prompt] = await db.select()
      .from(prompts)
      .where(eq(prompts.id, promptId))
      .limit(1);
    
    if (!prompt) {
      return res.status(404).json(errorResponse('Prompt not found'));
    }
    
    // Replace variables in prompt content
    let processedContent = prompt.content || '';
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      processedContent = processedContent.replace(regex, String(value));
    });
    
    // Execute prompt with LM Studio
    let output: string;
    let status: string;
    
    try {
      const isLMStudioAvailable = await lmStudio.isAvailable();
      
      if (isLMStudioAvailable) {
        // Call LM Studio with processed prompt
        output = await lmStudio.complete(processedContent);
        status = 'completed';
      } else {
        // Fallback to simulated response
        output = `[LM Studio não disponível] Prompt executado: "${prompt.title}"`;
        status = 'simulated';
      }
    } catch (aiError: any) {
      console.error('Error calling LM Studio:', aiError);
      output = `[Erro na execução] ${aiError.message}`;
      status = 'error';
    }
    
    const execution = {
      promptId: prompt.id,
      promptTitle: prompt.title,
      modelId,
      input: processedContent,
      output,
      variables,
      executedAt: new Date().toISOString(),
      status,
    };
    
    // Increment use count
    await db.update(prompts)
      .set({ useCount: sql`${prompts.useCount} + 1` })
      .where(eq(prompts.id, promptId));
    
    res.json(successResponse(execution, 'Prompt executed'));
  } catch (error) {
    console.error('Error executing prompt:', error);
    const err = errorResponse(error);
    res.status(err.status).json(err);
  }
});

export default router;
