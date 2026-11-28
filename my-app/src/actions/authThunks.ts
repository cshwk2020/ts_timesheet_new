import { apiClient, ApiError } from '../api/client';
import type { User } from '../types';
import { HIDE_GLOBAL_OVERLAY, SHOW_GLOBAL_OVERLAY } from '../types';
import { UiMessages } from '../constants/uiMessages';

// 1. Initialize Auth (Check localStorage on page load/refresh)
export const initializeAuthAsync = () => (dispatch: any) => {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user_info');

  if (token && userStr) {
    try {
      const user: User = JSON.parse(userStr);
      dispatch({ type: 'AUTH_INITIALIZED', payload: { user, token } });
    } catch (e) {
      // Corrupt storage fallback
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      dispatch({ type: 'AUTH_INITIALIZED', payload: null });
    }
  } else {
    dispatch({ type: 'AUTH_INITIALIZED', payload: null });
  }
};

// 2. Login
export const loginAsync = (username: string, password: string) => async (dispatch: any) => {
  dispatch({ type: 'AUTH_START' });
  
  try {
    dispatch({ type: SHOW_GLOBAL_OVERLAY , payload: UiMessages.LOGGING_IN});
    const res = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    localStorage.setItem('auth_token', res.token);
    localStorage.setItem('user_info', JSON.stringify(res.user_info));
    
    dispatch({ type: 'AUTH_SUCCESS', payload: { user: res.user_info, token: res.token } });
  
  } catch (err) {
    const msg = err instanceof ApiError ? err.message : 'Login failed';
    dispatch({ type: 'AUTH_FAILURE', payload: msg });
  }
  finally {
    dispatch({ type: HIDE_GLOBAL_OVERLAY });
  }
};

 

                 

// 3. Logout
export const logoutAsync = () => async (dispatch: any) => {
  try {
     dispatch({ type: SHOW_GLOBAL_OVERLAY , payload: UiMessages.LOGGING_OUT});
    await apiClient('/auth/logout', { method: 'POST' });
  } catch (error) {
    // Ignore network errors, we still want to log out locally
    const msg = error instanceof ApiError ? error.message : 'Login failed';
    dispatch({ type: 'AUTH_FAILURE', payload: msg });

  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    dispatch({ type: 'AUTH_LOGOUT' });
    dispatch({ type: HIDE_GLOBAL_OVERLAY });
  }
};