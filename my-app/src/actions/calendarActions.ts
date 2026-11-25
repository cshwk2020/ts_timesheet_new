// src/actions/calendarActions.ts

import { SET_CURRENT_DATE, SET_VIEW_MODE, TOGGLE_TASK_TYPE_MANAGER } from '../types';

export const setCurrentDate = (date: Date) => ({
  type: SET_CURRENT_DATE,
  payload: date.toISOString(),
});

export const setViewMode = (mode: 'day' | 'week' | 'month') => ({
  type: SET_VIEW_MODE,
  payload: mode,
});

export const toggleTaskTypeManager = (isOpen: boolean) => ({
  type: TOGGLE_TASK_TYPE_MANAGER,
  payload: isOpen,
});