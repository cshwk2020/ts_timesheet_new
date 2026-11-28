// src/App.tsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchTaskTypes } from './services/taskTypeService';
import { setTaskTypes } from './actions/taskActions';
import CalendarMain from './components/CalendarMain';  
 
import { AuthGate } from './components/AuthGate';
import './App.css';
import { initializeAuthAsync } from './actions/authThunks';
import { GlobalBlockingOverlay } from './components/GlobalBlockingOverlay';

function App() {
  const dispatch = useDispatch();

   useEffect(() => {
    
    //
    dispatch(initializeAuthAsync() as any);
   
    //
    const handleExpired = () => {
      // Force Redux state to logout instantly
      dispatch({ type: 'AUTH_LOGOUT' });
    };

    window.addEventListener('auth_expired', handleExpired);
    return () => window.removeEventListener('auth_expired', handleExpired);
    
  }, [dispatch]);


  return (
 
    <>
      <GlobalBlockingOverlay />
      
      <AuthGate>
        <div className="App">
          <CalendarMain />
        </div>
      </AuthGate>
    </>
      
     
     
    
  );
}

export default App;