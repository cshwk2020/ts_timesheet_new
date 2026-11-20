import { combineReducers } from 'redux';
import taskReducer from './taskReducer';
import errorReducer from './errorReducer'; // 👈 Import it

const rootReducer = combineReducers({
  tasks: taskReducer,
  error: errorReducer, // 👈 Add it to the store
});

export type RootState = ReturnType<typeof rootReducer>;  // 👈 defined here
export default rootReducer;

 
