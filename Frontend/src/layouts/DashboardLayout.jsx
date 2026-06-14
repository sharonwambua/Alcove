import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components.css';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { text: 'Overview Dashboard', path: '/landlord/dashboard' },
    { text: 'Property Management', path: '/landlord/properties' },
    { text: 'Tenant Management', path: '/landlord/tenants' },
    { text: 'Payments & Collections', path: '/landlord/payments' },
    { text: 'Maintenance Requests', path: '/landlord/maintenance' },
    { text: 'Announcements', path: '/landlord/announcements' },
    { text: 'Reports & Analytics', path: '/landlord/reports' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '100vh', backgroundColor: 'var(--background, #FAF6F0)' }}>
      
  
      <aside style={{ 
        backgroundColor: '#ffffff', 
        borderRight: '1px solid var(--border, #e0e0e0)', 
        padding: '2.5rem 1.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        height: '100vh',
        position: 'sticky',
        top: 0
      }}>
        <div>
    
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: '#FAF6F0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border, #e0e0e0)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
            }}>
              <img 
                src="/logo.png?v=3" 
                alt="Alcove Logo" 
                style={{ 
                  width: '100%',
                  maxHeight: '75px',
                  objectFit: 'contain',
                  display: 'block'
                }} 
              />
            </div>
            
            <div style={{ 
              fontSize: '0.72rem', 
              color: 'var(--text-muted, #777)', 
              fontWeight: '700', 
              letterSpacing: '0.06em', 
              textTransform: 'uppercase', 
              marginTop: '1rem', 
              textAlign: 'center' 
            }}>
              Landlord Portal
            </div>
          </div>

      
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  style={{
                    width: '100%', 
                    padding: '0.85rem 1.25rem', 
                    textAlign: 'left', 
                    borderRadius: '8px',
                    border: 'none', 
                    fontWeight: '700', 
                    fontSize: '0.95rem', 
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#FAF6F0' : 'transparent',
                    color: isActive ? 'var(--primary, #8B263E)' : '#555',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {item.text}
                </button>
              );
            })}
          </nav>
        </div>

   
        <button 
          type="button"
          onClick={() => { logout(); navigate('/'); }}
          style={{ 
            width: '100%', padding: '0.85rem', borderRadius: '8px', 
            border: '1px solid var(--border, #e0e0e0)', backgroundColor: 'transparent', 
            color: '#d9534f', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' 
          }}
        >
          Exit Portal
        </button>
      </aside>

      {/* FULL WORKSPACE VIEWPORT CHANNEL */}
      <main style={{ padding: '2.5rem 3rem', overflowY: 'auto', height: '100vh' }}>
        {children}
      </main>

    </div>
  );
};

export default DashboardLayout;