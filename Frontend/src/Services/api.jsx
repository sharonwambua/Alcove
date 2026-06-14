import axios from 'axios';

const API = axios.create({
  baseURL: 'https://api.alcove-portal.mock/v1', // Fallback URL for dynamic wireframes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Structural runtime inject for authorization tokens
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('alcove_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: (credentials) => Promise.resolve({ data: { token: 'mock-jwt-token', user: { name: 'Alex Carter', email: credentials.email, role: credentials.email.includes('landlord') ? 'landlord' : 'tenant' } } }),
  register: (userData) => Promise.resolve({ data: { success: true } }),
};

export const propertyAPI = {
  getAll: () => Promise.resolve({ data: [
    { id: 1, title: 'Skyline Luxury Apartment', location: 'Downtown', rent: 2200, beds: 2, baths: 2, amenities: ['Gym', 'Pool', 'Wifi'], image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500' },
    { id: 2, title: 'Cozy Suburban Townhouse', location: 'Greenwood', rent: 1650, beds: 3, baths: 2.5, amenities: ['Parking', 'Backyard'], image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500' }
  ]}),
};

export default API;