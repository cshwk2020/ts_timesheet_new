import { combineReducers } from 'redux';
import taskReducer from './taskReducer';
import errorReducer from './errorReducer'; // 👈 Import it
import dialogReducer from './dialogReducer';

const rootReducer = combineReducers({
  tasks: taskReducer,
  error: errorReducer,  
  dialog: dialogReducer,
});

export type RootState = ReturnType<typeof rootReducer>;  // 👈 defined here
export default rootReducer;

 
