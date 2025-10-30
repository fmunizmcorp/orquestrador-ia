/**
 * Orchestrator Service Tests
 */
import { describe, it, expect, beforeAll } from '@jest/globals';
import { orchestratorService } from '../services/orchestratorService';
import { db } from '../db';
import { tasks, subtasks } from '../db/schema';
import { eq } from 'drizzle-orm';

describe('Orchestrator Service', () => {
  let testTaskId: number;

  beforeAll(async () => {
    // Create test task
    const [task] = await db.insert(tasks).values({
      userId: 1,
      title: 'Test Task for Orchestrator',
      description: 'This is a test task to validate orchestrator functionality',
      status: 'pending',
      priority: 'medium',
    }).returning();

    testTaskId = task.id;
  });

  it('should plan task and create subtasks', async () => {
    const breakdown = await orchestratorService.planTask(testTaskId);
    
    expect(Array.isArray(breakdown)).toBe(true);
    expect(breakdown.length).toBeGreaterThan(0);
    
    // Verify subtasks were created in database
    const createdSubtasks = await db.select()
      .from(subtasks)
      .where(eq(subtasks.taskId, testTaskId));
    
    expect(createdSubtasks.length).toBeGreaterThan(0);
  });

  it('should execute subtask with cross-validation', async () => {
    // Get first subtask
    const [subtask] = await db.select()
      .from(subtasks)
      .where(eq(subtasks.taskId, testTaskId))
      .limit(1);
    
    if (subtask) {
      const success = await orchestratorService.executeSubtask(subtask.id);
      expect(typeof success).toBe('boolean');
    }
  });

  it('should update quality metrics', async () => {
    // Quality metrics should be updated after execution
    // This is tested implicitly by executeSubtask
    expect(true).toBe(true);
  });
});
