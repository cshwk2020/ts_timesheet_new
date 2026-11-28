import { combineReducers } from 'redux';
import calendarReducer from './calendarReducer';
import taskReducer from './taskReducer';
import errorReducer from './errorReducer'; // 👈 Import it
import dialogReducer from './dialogReducer';
import { authReducer } from './authReducer';
import { uiReducer } from './uiReducer';


const rootReducer = combineReducers({
  calendar: calendarReducer, 
  tasks: taskReducer,
  ui: uiReducer,
  error: errorReducer,  
  dialog: dialogReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;  // 👈 defined here
export default rootReducer;

 
