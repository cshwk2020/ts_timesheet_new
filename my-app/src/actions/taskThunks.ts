
import { apiUpdateTask, apiDeleteTask, apiToggleTask, apiCreateTask, apiFetchTasks, apiFetchTaskTypes } from '../api/tasks';
import type { TaskType, Task, TaskAction } from '../types';
import { apiClient } from '../api/client';
 

export const loadTasksAsync = () => async (dispatch: any) => {
  try {
    console.log(`loadTasksAsync...0...`);
    const [tasks, taskTypes] = await Promise.all([
      apiFetchTasks(),
      apiFetchTaskTypes()
    ]);
    
    console.log(`loadTasksAsync...10...tasks==`, tasks);
    console.log(`loadTasksAsync...20...taskTypes==`, taskTypes);

    // Assuming you have a HYDRATE_TASKS action or you can just dispatch SET_TASK_TYPES
    dispatch({ type: 'SET_TASKS', payload: tasks });
    dispatch({ type: 'SET_TASK_TYPES', payload: taskTypes });
    
    // If you don't have a HYDRATE action, you can dispatch ADD_TASK for each:
    // tasks.forEach((t: any) => dispatch({ type: 'ADD_TASK', payload: t }));
    
  } catch (error) {
    console.error("Failed to load initial data", error);
    throw error;
  }
};
 

// 1. Update Task
export const updateTaskAsync = (task: Task) => async (dispatch: any) =>  {
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
export const deleteTaskAsync = (taskId: string) => async (dispatch: any) => {
  try {
    await apiDeleteTask(taskId);
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  } catch (error) {
    console.error("Failed to delete task", error);
  }
};

 
// 4. Create Task (Save)
export const createTaskAsync = (newTaskData: Partial<Task>) => async (dispatch: any) => {
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




 

// ... existing task thunks ...

// 1. Create Task Type
export const addTaskTypeAsync = (name: string, color: string) => async (dispatch: any) => {
  try {
    const newType = await apiClient('/task-types', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    });
    
    // Dispatch the exact server payload to update the local store
    dispatch({ type: 'ADD_TASK_TYPE', payload: newType });
  } catch (error) {
    console.error("Failed to add task type", error);
    throw error;
  }
};

// 2. Update Task Type
export const updateTaskTypeAsync = (taskType: TaskType) => async (dispatch: any) => {
  try {
    const updatedType = await apiClient(`/task-types/${taskType.id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: taskType.name, color: taskType.color }),
    });
    
    dispatch({ type: 'UPDATE_TASK_TYPE', payload: updatedType });
  } catch (error) {
    console.error("Failed to update task type", error);
    throw error;
  }
};