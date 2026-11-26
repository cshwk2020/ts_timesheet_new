import { apiClient } from './client';
import type { Task, TaskType } from '../types'; // Assuming your interfaces are in types.ts


// --- TASKS ---
export const apiFetchTasks = () => apiClient('/tasks');
export const apiCreateTask = (taskData: Partial<Task>) => apiClient('/tasks', { method: 'POST', body: JSON.stringify(taskData) });
export const apiUpdateTask = (id: string, taskData: Partial<Task>) => apiClient(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(taskData) });
export const apiToggleTask = (id: string) => apiClient(`/tasks/${id}/toggle`, { method: 'PATCH' });
export const apiDeleteTask = (id: string) => apiClient(`/tasks/${id}`, { method: 'DELETE' });

// --- TASK TYPES ---
export const apiFetchTaskTypes = () => apiClient('/task-types');
export const apiCreateTaskType = (data: Partial<TaskType>) => apiClient('/task-types', { method: 'POST', body: JSON.stringify(data) });


/*
// Fetch everything for the calendar (replaces your previous initial state load)
export const fetchCalendarData = async (): Promise<{ tasks: Task[], taskTypes: TaskType[] }> => {
  // Option A: Fetch parallel
  const [tasks, taskTypes] = await Promise.all([
    apiClient('/tasks'),
    apiClient('/task-types')
  ]);

  return { tasks, taskTypes };
};

// Toggle Status
export const toggleTaskStatus = async (taskId: string): Promise<Task> => {
  return apiClient(`/tasks/${taskId}/toggle`, {
    method: 'PATCH',
  });
};

// Delete Task
export const deleteTask = async (taskId: string): Promise<void> => {
  return apiClient(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
};
*/