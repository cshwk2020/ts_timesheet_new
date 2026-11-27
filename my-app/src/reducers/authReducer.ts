import type { AuthState, AuthAction } from '../types';

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Starts as true to block app until localStorage is checked
  error: null,
};

export const authReducer = (state = initialAuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
      
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
      
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
      
    case 'AUTH_LOGOUT':
      return {
        ...initialAuthState,
        isLoading: false,
      };
      
    case 'AUTH_INITIALIZED':
      if (action.payload) {
        return {
          ...state,
          isLoading: false,
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
        };
      }
      return { ...initialAuthState, isLoading: false };
      
    default:
      return state;
  }
};