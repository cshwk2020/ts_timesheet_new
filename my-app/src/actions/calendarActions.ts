// src/actions/calendarActions.ts
import { SET_CURRENT_DATE } from '../types';

export const setCurrentDate = (date: Date) => ({
  type: SET_CURRENT_DATE,
  payload: date.toISOString(),
});