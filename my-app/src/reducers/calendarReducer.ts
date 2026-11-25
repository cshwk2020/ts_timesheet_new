// src/reducers/calendarReducer.ts
import type { CalendarState, AppActionTypes } from '../types';
import { SET_CURRENT_DATE, SET_VIEW_MODE, TOGGLE_TASK_TYPE_MANAGER } from '../types';

const initialState: CalendarState = {
  currentDate: new Date().toISOString(),
  viewMode: 'day',
  isTaskTypeManagerOpen: false,
};

const calendarReducer = (state = initialState, action: AppActionTypes): CalendarState => {
  switch (action.type) {
    case SET_CURRENT_DATE:
      return { ...state, currentDate: action.payload };
    case SET_VIEW_MODE:
      return { ...state, viewMode: action.payload };
    case TOGGLE_TASK_TYPE_MANAGER:
      return { ...state, isTaskTypeManagerOpen: action.payload };
    default:
      return state;
  }
};

export default calendarReducer;