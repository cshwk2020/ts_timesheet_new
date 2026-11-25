// src/reducers/taskReducer.ts
import {
  type TaskState,
  type TaskActionTypes,
  ADD_TASK,
  SET_TASK_TYPES,
  UPDATE_TASK,
  DELETE_TASK,
  ADD_TASK_TYPE, 
  UPDATE_TASK_TYPE,
  TOGGLE_TASK_STATUS 
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

    case UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((t) => 
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    case SET_TASK_TYPES:
        return {
          ...state,
          taskTypes: action.payload,
        };

    case ADD_TASK_TYPE:
      return {
        ...state,
        taskTypes: [...state.taskTypes, action.payload],
      };

    case UPDATE_TASK_TYPE:
      return {
        ...state,
        taskTypes: state.taskTypes.map((t) => 
          t.id === action.payload.id ? action.payload : t
        ),
      };

     case TOGGLE_TASK_STATUS:
      console.log('TOGGLE_TASK_STATUS...0...');
        return {
          ...state,
          tasks: state.tasks.map((t) => {
            if (t.id === action.payload) {
              // 👇 MUST create a new object reference
              return {
                ...t,
                status: t.status === 'done' ? 'planned' : 'done',
              };
            }
            console.log('TOGGLE_TASK_STATUS...1...');
            return t;
          }),
        };
 
 
    default:
      return state;
  }
};

export default taskReducer;