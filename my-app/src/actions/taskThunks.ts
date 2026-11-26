
import { apiUpdateTask, apiDeleteTask, apiToggleTask, apiCreateTask } from '../api/tasks';
import type { Task, TaskAction } from '../types';

// Assuming you have a TaskAction type defined in your reducer
 

// 1. Update Task
export const updateTaskAsync = async (
  task: Task, 
  dispatch: React.Dispatch<TaskAction>
) => {
  try {
    // 1. Call Laravel
    const savedTask = await apiUpdateTask(task.id, task);
    
    // 2. Only if success, update local Redux state
    dispatch({ type: 'UPDATE_TASK', payload: savedTask });
  } catch (error) {
    // Handle error (e.g., show toast)
    console.error("Failed to update task", error);
  }
};

// 2. Toggle Status
export const toggleTaskAsync = async (
  taskId: string, 
  dispatch: React.Dispatch<TaskAction>
) => {
  try {
    const updatedTask = await apiToggleTask(taskId);
    // Dispatch the full updated task returned by Laravel
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask }); 
  } catch (error) {
    console.error("Failed to toggle task", error);
  }
};

// 3. Delete Task
export const deleteTaskAsync = async (
  taskId: string, 
  dispatch: React.Dispatch<TaskAction>
) => {
  try {
    await apiDeleteTask(taskId);
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  } catch (error) {
    console.error("Failed to delete task", error);
  }
};

// 4. Create Task (Save)
export const createTaskAsync = async (
  newTaskData: Partial<Task>, 
  dispatch: React.Dispatch<TaskAction>
) => {
  try {
    const newTask = await apiCreateTask(newTaskData);
    // Add to state using the DB-generated ID
    dispatch({ type: 'ADD_TASK', payload: newTask });
  } catch (error) {
    console.error("Failed to create task", error);
    throw error; 
    // Re-throw so the form can catch it and show a spinner error
  }
};
