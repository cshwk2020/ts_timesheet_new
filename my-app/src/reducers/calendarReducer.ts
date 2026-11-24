// src/reducers/calendarReducer.ts
import type { CalendarState, AppActionTypes } from '../types';
import { SET_CURRENT_DATE } from '../types';

const initialState: CalendarState = {
  currentDate: new Date().toISOString(),
};

const calendarReducer = (
  state = initialState,
  action: AppActionTypes
): CalendarState => {
  switch (action.type) {
    case SET_CURRENT_DATE:
      return { ...state, currentDate: action.payload };
    default:
      return state;
  }
};

export default calendarReducer;

