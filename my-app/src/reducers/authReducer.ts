import type { AuthState, AuthAction } from '../types'; // Assuming you put AuthAction in types or actions

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // true initially while we check localStorage
  error: null,
};

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
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
      // Used on app load to set state from localStorage without flashing errors
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