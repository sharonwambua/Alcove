import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TenantLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

const menuItems = [
  { text: 'Overview Dashboard', path: '/tenant/dashboard' },
  { text: 'House Hunting', path: '/tenant/house-hunting' }, // <-- Updated sub-path
  { text: 'PPayments', path: '/tenant/rent' },
  { text: 'Maintenance Tickets', path: '/tenant/maintenance' },
];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        minHeight: '100vh',
        backgroundColor: 'var(--background, #FAF6F0)',
      }}
    >
  
      <aside
        style={{
          backgroundColor: 'var(--surface, #ffffff)',
          borderRight: '1px solid var(--border, #e0e0e0)',
          padding: '2.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
    
          <div
            style={{
              marginBottom: '2.5rem',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                margin: '0 auto',
                borderRadius: '50%',
                backgroundColor: '#FAF6F0',
                border: '1px solid var(--border, #e0e0e0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
              }}
            >
              <img
                src="/logo.png?v=3"
                alt="Alcove Logo"
                style={{
                  width: '80%',
                  height: '80%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted, #777)',
                fontWeight: '700',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginTop: '1rem',
                textAlign: 'center',
              }}
            >
              Tenant Portal
            </div>
          </div>


          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.25rem',
                    textAlign: 'left',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#FAF6F0' : 'transparent',
                    color: isActive
                      ? 'var(--primary, #8B263E)'
                      : 'var(--text-muted, #555)',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {item.text}
                </button>
              );
            })}
          </nav>
        </div>


        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '0.85rem',
            borderRadius: '8px',
            border: '1px solid var(--border, #e0e0e0)',
            backgroundColor: 'transparent',
            color: '#d9534f',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Exit Portal
        </button>
      </aside>


      <main
        style={{
          padding: '2.5rem 3rem',
          overflowY: 'auto',
          maxHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default TenantLayout;