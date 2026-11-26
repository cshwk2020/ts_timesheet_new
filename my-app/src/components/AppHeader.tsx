import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../reducers';
import { setViewMode, toggleTaskTypeManager } from '../actions/calendarActions';
import { Menu, Settings, List, X } from 'lucide-react'; // 👈 Import List and X
import { useAuth } from '../context/AuthContext';
import './AppHeader.css';

export const AppHeader: React.FC = () => {
    
  const dispatch = useDispatch();
  const { user, logout } = useAuth();

  const viewMode = useSelector((state: RootState) => state.calendar.viewMode);
  
  
  // 👇 State for the hamburger menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
      // AuthGate will handle unmounting the app and showing Login
    }
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
            <button className="nav-item" onClick={handleOpenTaskTypes}>
              <List size={16} />
              Manage Task Types
            </button>
            <button className="dropdown-logout" onClick={handleLogout}>
                Log Out
              </button>
            <button className="nav-item" onClick={() => { setIsMenuOpen(false); alert('Settings coming soon!'); }}>
              <Settings size={16} />
              Settings
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