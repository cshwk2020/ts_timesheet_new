import type { UIState } from '../types';
import { SHOW_GLOBAL_OVERLAY, HIDE_GLOBAL_OVERLAY } from '../types';

const initialState: UIState = { isLoading: false, message: '' };

export const uiReducer = (state = initialState, action: any): UIState => {
  switch (action.type) {
    case SHOW_GLOBAL_OVERLAY:
      return { isLoading: true, message: action.payload };
    case HIDE_GLOBAL_OVERLAY:
      return { isLoading: false, message: '' };
    default:
      return state;
  }
};