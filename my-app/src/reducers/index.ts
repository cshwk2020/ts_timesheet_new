import { combineReducers } from 'redux';
import taskReducer from './taskReducer';

const rootReducer = combineReducers({
  tasks: taskReducer,
});

export type RootState = ReturnType<typeof rootReducer>;  // 👈 defined here
export default rootReducer;