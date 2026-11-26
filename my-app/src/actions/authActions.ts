import type { AuthAction, User } from '../types';

 
export const authStart = (): AuthAction => ({ type: 'AUTH_START' });
export const authSuccess = (user: User, token: string): AuthAction => ({ 
  type: 'AUTH_SUCCESS', payload: { user, token } 
});
export const authFailure = (error: string): AuthAction => ({ 
  type: 'AUTH_FAILURE', payload: error 
});
export const authLogout = (): AuthAction => ({ type: 'AUTH_LOGOUT' });
export const authInitialized = (data: { user: User; token: string } | null): AuthAction => ({ 
  type: 'AUTH_INITIALIZED', payload: data 
});