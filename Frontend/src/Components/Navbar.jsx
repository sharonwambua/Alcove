import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';

const Navbar = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand"> Alcove</Link>
      <div className="navbar-actions">
        <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
          <span className="badge">3</span>
          {showNotifications && <NotificationPanel />}
        </div>
        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user?.name?.[0] || 'U'}
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user?.name || 'Guest'}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;