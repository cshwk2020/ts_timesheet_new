import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../reducers'; // Ensure this path is correct
import { Login } from './Login';

interface Props {
  children: React.ReactNode;
}

export const AuthGate: React.FC<Props> = ({ children }) => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const hasToken = !!localStorage.getItem('auth_token');

  // 1. Wait for the initializeAuthAsync to finish checking localStorage
 
  if (!user && isLoading && hasToken) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        Loading application...
      </div>
    );
  }
  

  // 2. No user -> Force Login
 
  if (!user) {
    return <Login />;
  }
  

  // 3. User exists -> Render App (Calendar)
  return <>{children}</>;
};