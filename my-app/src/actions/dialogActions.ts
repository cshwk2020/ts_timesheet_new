import { SHOW_DIALOG, HIDE_DIALOG, type DialogState } from '../types';

 

// Generic Confirmation Dialog
export const showDialog = (
  title: string, 
  message: string, 
  confirmText: string,
  onConfirm: () => void // 👈 Pass the action directly
) => ({
  type: SHOW_DIALOG,
  payload: { 
    title, 
    message, 
    type: 'confirm' as const, 
    confirmText,
    onConfirm 
  },
});

export const hideDialog = () => ({
  type: HIDE_DIALOG,
});