import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const tenantLinks = [
    { path: '/tenant/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/house-hunting', label: 'House Hunting', icon: '🔍' },
    { path: '/tenant/lease', label: 'Lease Management', icon: '📜' },
    { path: '/tenant/payments', label: 'Rent Management', icon: '💳' },
    { path: '/tenant/maintenance', label: 'Maintenance', icon: '🛠️' },
  ];

  const landlordLinks = [
    { path: '/landlord/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/landlord/properties', label: 'Property Management', icon: '🏠' },
    { path: '/landlord/tenants', label: 'Tenant Management', icon: '👥' },
    { path: '/landlord/payments', label: 'Rent Payments', icon: '💰' },
    { path: '/landlord/maintenance', label: 'Maintenance Requests', icon: '🔧' },
  ];

  const links = user?.role === 'landlord' ? landlordLinks : tenantLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        {links.map((link) => (
          <NavLink key={link.path} to={link.path} className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <span>{link.icon}</span> {link.label}
          </NavLink>
        ))}
      </div>
      <button className="sidebar-link" onClick={() => { logout(); navigate('/login'); }} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
        <span>🚪</span> Logout
      </button>
    </aside>
  );
};

export default Sidebar;