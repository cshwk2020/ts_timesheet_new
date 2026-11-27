import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Settings, List, X } from 'lucide-react'; // 👈 Import List and X
import { type RootState } from '../reducers';
import { setViewMode, toggleTaskTypeManager } from '../actions/calendarActions';
import { logoutAsync } from '../actions/authThunks';
import './AppHeader.css';

export const AppHeader: React.FC = () => {
    
  const dispatch = useDispatch();
 
  const viewMode = useSelector((state: RootState) => state.calendar.viewMode);
  const { user } = useSelector((state: RootState) => state.auth);
  
  // 👇 State for the hamburger menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      // Dispatch the logout thunk from Redux
      dispatch(logoutAsync() as any);
    }
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleOpenTaskTypes = () => {
    dispatch(toggleTaskTypeManager(true));
    setIsMenuOpen(false); // Close menu after clicking
  };

 

  return (
    <header className="app-header">
      <div className="header-left" ref={menuRef}>
        {/* 👇 Toggle Menu Button */}
        <button className="icon-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="app-title">my-app</h1>

        {/* 👇 The Dropdown Menu */}
        {isMenuOpen && (
          <div className="nav-dropdown">


            <div className="nav-item">
             {user?.username || 'User'} 
            </div>  
 


            <button className="nav-item" onClick={handleOpenTaskTypes}>
              <List size={16} />
              Manage Task Types
            </button>
 
 
            <button className="nav-item" onClick={() => { setIsMenuOpen(false); alert('Settings coming soon!'); }}>
              <Settings size={16} />
              Settings
            </button>


             
            <button className="dropdown-logout" onClick={handleLogout}>
                Log Out
            </button>
            

          </div>
        )}
      </div>

      <div className="header-center">
        <div className="switch-toggle">
          {(['day', 'week', 'month'] as const).map((view) => (
            <button
              key={view}
              onClick={() => dispatch(setViewMode(view))}
              className={`switch-toggle-btn ${viewMode === view ? 'active' : ''}`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="header-right">
        {/* We can leave the Settings gear here as a shortcut, or remove it since it's now in the menu */}
        <button 
          className="icon-btn" 
          onClick={() => dispatch(toggleTaskTypeManager(true))}
          title="Manage Task Types"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};