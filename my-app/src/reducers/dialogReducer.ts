// src/reducers/errorReducer.ts
import { type DialogState, type AppActionTypes, SHOW_DIALOG, HIDE_DIALOG } from '../types';

// 👇 Must include ALL properties from DialogState
const initialState: DialogState = {
  isOpen: false,
  title: '',
  message: '',
  type: 'error',
  confirmText: '',
  onConfirm: null,
};

const dialogReducer = (
  state = initialState, 
  action: AppActionTypes
): DialogState => { // 👈 Explicit return type
  switch (action.type) {
    case SHOW_DIALOG:
        console.log('SHOW_DIALOG...0...', action.payload);
      return { ...state, isOpen: true, ...action.payload };
    case HIDE_DIALOG:
      return { ...initialState }; 
    default:
      return state;
  }
};

export default dialogReducer;