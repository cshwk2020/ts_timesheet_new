import { combineReducers } from 'redux';
import calendarReducer from './calendarReducer';
import taskReducer from './taskReducer';
import errorReducer from './errorReducer'; // 👈 Import it
import dialogReducer from './dialogReducer';


const rootReducer = combineReducers({
  calendar: calendarReducer, 
  tasks: taskReducer,
  error: errorReducer,  
  dialog: dialogReducer,
});

export type RootState = ReturnType<typeof rootReducer>;  // 👈 defined here
export default rootReducer;

 
