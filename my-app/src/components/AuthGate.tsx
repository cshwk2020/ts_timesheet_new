import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Login } from './Login';

interface Props {
  children: React.ReactNode;
}

export const AuthGate: React.FC<Props> = ({ children }) => {
  const { user, isLoading } = useAuth();

  // 1. Wait for AuthProvider to check localStorage
  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        Loading...
      </div>
    );
  }

  // 2. No user -> Force Login Page
  if (!user) {
    return <Login />;
  }

  // 3. User exists -> Render App (Calendar)
  return <>{children}</>;
};