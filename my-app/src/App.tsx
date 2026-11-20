// src/App.tsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchTaskTypes } from './services/taskTypeService';
import { setTaskTypes } from './actions/taskActions';
import CalendarMain from './components/CalendarMain'; // Or your TaskList
import './App.css';

function App() {
  const dispatch = useDispatch();

  // Fetch types ONCE when the app loads
  useEffect(() => {
    fetchTaskTypes().then((types) => {
      dispatch(setTaskTypes(types));
    });
  }, [dispatch]);

  return (
    <div className="App">
      <CalendarMain />
    </div>
  );
}

export default App;