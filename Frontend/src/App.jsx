import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

import DashboardLayout from './layouts/DashboardLayout';
import TenantLayout from './Components/TenantLayout';


import LandlordDashboard from './pages/landlord/LandlordDashboard';
import PropertyManagement from './pages/landlord/PropertyManagement';
import TenantManagement from './pages/landlord/TenantManagement';
import LandlordPayments from './pages/landlord/LandlordPayments';
import LandlordMaintenance from './pages/landlord/LandlordMaintenance';
import Announcements from './pages/landlord/Announcements';


import TenantDashboard from './pages/Tenant/TenantDashboard';
import LeaseManagement from './pages/Tenant/LeaseManagement';
import RentManagement from './pages/Tenant/RentManagement';
import MaintenanceRequest from './pages/Tenant/MaintenanceRequest';
import TenantAnnouncements from './pages/Tenant/TenantAnnouncements'; 

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import HouseHunting from './pages/HouseHunting';
import BookVisit from './pages/BookVisit';
import ContactLandlord from './pages/ContactLandlord';

import './styles/App.css';


const AppLayout = ({ children, searchVal, onSearchChange, showSearch = true }) => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
  
      <nav style={{
        padding: '0.5rem 2rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',    
        top: 0,                
        zIndex: 1000,          
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
       
        <div 
          onClick={() => navigate('/')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
        >
          <div style={{
            height: '74px',
            width: '79px',
            borderRadius: '50%',
            backgroundColor: '#ECE3D5',
            border: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <img 
              src="/logo.png?v=3" 
              alt="Alcove Logo" 
              style={{ height: '88px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <span style={{ fontWeight: '800', letterSpacing: '-0.02em', fontSize: '1.25rem', color: '#333' }}>
            ALCOVE
          </span>
        </div>

  
        <div style={{ flex: '0 1 420px', margin: '0 1.5rem' }}>
          {showSearch && (
            <input
              type="text"
              value={searchVal || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search by area, neighborhood, or housing complex..."
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '0.9rem',
                backgroundColor: '#FAF6F0',
                color: '#333'
              }}
            />
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={() => navigate('/login')}
            style={{ 
              padding: '0.6rem 1.5rem', 
              fontSize: '0.85rem', 
              fontWeight: '700',
              backgroundColor: '#8B263E', 
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            My Account
          </button>
        </div>
      </nav>

  
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

function AppContent() {
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <Routes>
   
      <Route path="/" element={
        <AppLayout searchVal={globalSearch} onSearchChange={setGlobalSearch} showSearch={true}>
          <LandingPage search={globalSearch} />
        </AppLayout>
      } />

      <Route path="/login" element={<AppLayout showSearch={false}><Login /></AppLayout>} />
      <Route path="/register" element={<AppLayout showSearch={false}><Register /></AppLayout>} />
      <Route path="/forgot-password" element={<AppLayout showSearch={false}><ForgotPassword /></AppLayout>} />
      <Route path="/house-hunting" element={<AppLayout showSearch={false}><HouseHunting /></AppLayout>} />
      <Route path="/book-visit" element={<AppLayout showSearch={false}><BookVisit /></AppLayout>} />
      <Route path="/contact-landlord" element={<AppLayout showSearch={false}><ContactLandlord /></AppLayout>} />


<Route
  path="/tenant/*"
  element={
    <ProtectedRoute allowedRoles={['tenant']}>
      <TenantLayout>
        <Routes>
          <Route path="dashboard" element={<TenantDashboard />} />
          <Route
            path="house-hunting"
            element={<LandingPage search={globalSearch} />}
          />
          <Route path="lease" element={<LeaseManagement />} />
          <Route path="rent" element={<RentManagement />} />
          <Route path="payments" element={<RentManagement />} />
          <Route path="maintenance" element={<MaintenanceRequest />} />
          <Route path="announcements" element={<TenantAnnouncements />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </TenantLayout>
    </ProtectedRoute>
  }
/>

   

<Route
  path="/landlord/*"
  element={
    <ProtectedRoute allowedRoles={['landlord']}>
      <DashboardLayout>
        <Routes>
          <Route path="dashboard" element={<LandlordDashboard />} />
          <Route path="properties" element={<PropertyManagement />} />
          <Route path="tenants" element={<TenantManagement />} />
          <Route path="payments" element={<LandlordPayments />} />
          <Route path="maintenance" element={<LandlordMaintenance />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;