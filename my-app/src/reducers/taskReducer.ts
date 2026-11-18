// src/reducers/taskReducer.ts
import {
  type TaskState,
  type TaskActionTypes,
  ADD_TASK,
  SET_TASK_TYPES,
} from '../types';

const initialState: TaskState = {
  tasks: [],
  taskTypes: [],
};

const taskReducer = (
  state = initialState,
  action: TaskActionTypes
): TaskState => {
  switch (action.type) {
    case ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };

    case SET_TASK_TYPES:
      return {
        ...state,
        taskTypes: action.payload,
      };

    default:
      return state;
  }
};

export default taskReducer;