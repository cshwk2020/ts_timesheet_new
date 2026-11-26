import   { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { authReducer, initialAuthState } from '../reducers/authReducer';
import { authStart, authSuccess, authFailure, authLogout, authInitialized } from '../actions/authActions';
import type { AuthState, User } from '../types';
import { apiClient, ApiError } from '../api/client';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // 1. Check local storage on mount (Auto Login / Refresh)
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user_info');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(authInitialized({ user, token }));
      } catch (e) {
        // Corrupt storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        dispatch(authInitialized(null));
      }
    } else {
      dispatch(authInitialized(null));
    }

    // 2. Listen for 401s from apiClient
    const handleAuthExpired = () => {
      dispatch(authLogout());
    };
    window.addEventListener('auth_expired', handleAuthExpired);
    return () => window.removeEventListener('auth_expired', handleAuthExpired);
  }, []);

  const login = async (username: string, password: string) => {
    dispatch(authStart());
    try {
      const res = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('user_info', JSON.stringify(res.user_info));
      
      dispatch(authSuccess(res.user_info, res.token));
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Login failed';
      dispatch(authFailure(msg));
      throw err; // Throw so the Login form can show an error
    }
  };

  const logout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network error on logout
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      dispatch(authLogout());
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};