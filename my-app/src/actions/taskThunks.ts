
import { apiUpdateTask, apiDeleteTask, apiToggleTask, apiCreateTask, apiFetchTasks, apiFetchTaskTypes } from '../api/tasks';
import type { TaskType, Task, TaskAction } from '../types';
import { apiClient } from '../api/client';
 import { HIDE_GLOBAL_OVERLAY, SHOW_GLOBAL_OVERLAY } from '../types';
import { UiMessages } from '../constants/uiMessages';

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

  console.log(`DEBUG updateTaskAsync,,,,,task==`,task);

  try {
    
    dispatch({ type: SHOW_GLOBAL_OVERLAY , payload: UiMessages.SAVING});

    // 1. Call Laravel
    const savedTask = await apiUpdateTask(task.id, task);
    
    // 2. Only if success, update local Redux state
    dispatch({ type: 'UPDATE_TASK', payload: savedTask });
  } catch (error) {
    // Handle error (e.g., show toast)
    console.error("Failed to update task", error);
    throw error;
  }
  finally {

     dispatch({ type: HIDE_GLOBAL_OVERLAY });
  }
};

 
// 2. Toggle Status
export const toggleTaskAsync = (taskId: string) => async (dispatch: any) => {

  try {
    
    dispatch({ type: SHOW_GLOBAL_OVERLAY , payload: UiMessages.SAVING});

    const updatedTask = await apiToggleTask(taskId);
    // Dispatch the full updated task returned by Laravel
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask }); 
  } catch (error) {
    console.error("Failed to toggle task", error);
    throw error;
  }
  finally {

     dispatch({ type: HIDE_GLOBAL_OVERLAY });
  }
};
 
 
// 3. Delete Task
 export const deleteTaskAsync = (taskId: string) => async (dispatch: any) => {
  
  try {

    dispatch({ type: SHOW_GLOBAL_OVERLAY , payload: UiMessages.DELETING});

    await apiDeleteTask(taskId);
    dispatch({ type: 'DELETE_TASK', payload: taskId });

  } catch (error) {
    console.error("Failed to delete task", error);
    throw error;

  } 
  finally {

     dispatch({ type: HIDE_GLOBAL_OVERLAY });
  }
};

 
// 4. Create Task (Save)
export const createTaskAsync = (newTaskData: Partial<Task>) => async (dispatch: any) => {
  
  try {

    dispatch({ type: SHOW_GLOBAL_OVERLAY , payload: UiMessages.SAVING});

    const newTask = await apiCreateTask(newTaskData);
    // Add to state using the DB-generated ID
    dispatch({ type: 'ADD_TASK', payload: newTask });
    
  } 
  catch (error) {
    console.error("Failed to create task", error);
    throw error; 
    // Re-throw so the form can catch it and show a spinner error
  }
  finally {
     dispatch({ type: HIDE_GLOBAL_OVERLAY });
  }
};




 

// ... existing task thunks ...

// 1. Create Task Type
export const addTaskTypeAsync = (name: string, color: string) => async (dispatch: any) => {
  
  try {

    dispatch({ type: SHOW_GLOBAL_OVERLAY , payload: UiMessages.SAVING});

    const newType = await apiClient('/task-types', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    });
    
    // Dispatch the exact server payload to update the local store
    dispatch({ type: 'ADD_TASK_TYPE', payload: newType });
  } 
  catch (error) {
    console.error("Failed to add task type", error);
    throw error;
  }
  finally {
     dispatch({ type: HIDE_GLOBAL_OVERLAY });
  }
  
};

// 2. Update Task Type
export const updateTaskTypeAsync = (taskType: TaskType) => async (dispatch: any) => {

  try {

    dispatch({ type: SHOW_GLOBAL_OVERLAY , payload: UiMessages.SAVING});

    const updatedType = await apiClient(`/task-types/${taskType.id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: taskType.name, color: taskType.color }),
    });
    
    dispatch({ type: 'UPDATE_TASK_TYPE', payload: updatedType });

  } 
  catch (error) {
    console.error("Failed to update task type", error);
    throw error;
  }
  finally {
     dispatch({ type: HIDE_GLOBAL_OVERLAY });
  }
};