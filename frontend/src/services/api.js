/**
 * API Service for V-Connect Frontend
 * 
 * This file provides a centralized place for all API calls.
 * It can use either mock data or real API endpoints based on configuration.
 */

import APP_CONFIG from '../config';
import * as mockData from './mockData';

// Backend base URL - can be configured based on environment
const BASE_URL = APP_CONFIG.API.BASE_URL || 'http://localhost:8080/api';

// Authentication endpoints
const AUTH_URL = `${BASE_URL}/auth`;
const USERS_URL = `${BASE_URL}/users`;
const EVENTS_URL = `${BASE_URL}/events`;
const ORGANIZATIONS_URL = `${BASE_URL}/organizations`;
const VOLUNTEERS_URL = `${BASE_URL}/volunteers`;
const DONATIONS_URL = `${BASE_URL}/donations`;
const ADMIN_URL = `${BASE_URL}/admin`;

// Delay helper for mock API to simulate network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Reusable fetch function with authentication
const fetchWithAuth = async (url, options = {}) => {
  // If mock data is enabled, use mock data instead of real API calls
  if (APP_CONFIG.FEATURES.USE_MOCK_DATA) {
    // Add some delay to simulate network latency
    await delay(300);
    
    // Parse the URL to determine which mock data to return
    if (url.includes('/auth/login')) {
      const body = JSON.parse(options.body);
      const user = mockData.users.find(u => u.email === body.email);
      if (user) {
        // Simulate successful login
        localStorage.setItem('token', 'mock-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      } else {
        throw new Error('Invalid credentials');
      }
    } 
    
    // Handle other mock endpoints
    else if (url.includes('/events') && !url.includes('/')) {
      return { data: mockData.events };
    }
    else if (url.includes('/events/') && options.method !== 'DELETE') {
      const eventId = url.split('/events/')[1].split('/')[0];
      return { data: mockData.events.find(e => e.id === eventId) };
    }
    else if (url.includes('/organizations') && !url.includes('/')) {
      return { data: mockData.organizations };
    }
    else if (url.includes('/organizations/') && options.method !== 'DELETE') {
      const orgId = url.split('/organizations/')[1].split('/')[0];
      return { data: mockData.organizations.find(o => o.id === orgId) };
    }
    else if (url.includes('/volunteers') && !url.includes('/')) {
      return { data: mockData.volunteers };
    }
    else if (url.includes('/volunteers/') && options.method !== 'DELETE') {
      const volId = url.split('/volunteers/')[1].split('/')[0];
      return { data: mockData.volunteers.find(v => v.id === volId) };
    }
    else if (url.includes('/donations') && !url.includes('/')) {
      return { data: mockData.donations };
    }
    else if (url.includes('/donations/') && options.method !== 'DELETE') {
      const donationId = url.split('/donations/')[1].split('/')[0];
      return { data: mockData.donations.find(d => d.id === donationId) };
    }
    else if (url.includes('/admin/dashboard')) {
      return { data: mockData.dashboardStats };
    }
    
    // Default response for unhandled mock endpoints
    return { success: true, data: [] };
  }
  
  // Real API implementation
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Set headers with authentication token
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Perform fetch with error handling
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Parse response JSON
    const data = await response.json();
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw error;
  }
};

// Authentication Services
export const authService = {
  login: (email, password) => fetchWithAuth(`${AUTH_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  register: (userData) => fetchWithAuth(`${AUTH_URL}/register`, {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  getCurrentUser: () => fetchWithAuth(`${AUTH_URL}/me`),
  
  updateProfile: (profileData) => fetchWithAuth(`${AUTH_URL}/me`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
  
  changePassword: (passwords) => fetchWithAuth(`${AUTH_URL}/change-password`, {
    method: 'POST',
    body: JSON.stringify(passwords),
  }),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Event Services
export const eventService = {
  getAllEvents: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return fetchWithAuth(`${EVENTS_URL}${queryParams ? `?${queryParams}` : ''}`);
  },
  
  getEventById: (eventId) => fetchWithAuth(`${EVENTS_URL}/${eventId}`),
  
  createEvent: (eventData) => fetchWithAuth(`${EVENTS_URL}`, {
    method: 'POST',
    body: JSON.stringify(eventData),
  }),
  
  updateEvent: (eventId, eventData) => fetchWithAuth(`${EVENTS_URL}/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  }),
  
  deleteEvent: (eventId) => fetchWithAuth(`${EVENTS_URL}/${eventId}`, {
    method: 'DELETE',
  }),
  
  applyForEvent: (eventId) => fetchWithAuth(`${EVENTS_URL}/${eventId}/apply`, {
    method: 'POST',
  }),
  
  getEventApplications: (eventId) => fetchWithAuth(`${EVENTS_URL}/${eventId}/applications`),
  
  updateApplication: (eventId, applicationId, status) => fetchWithAuth(`${EVENTS_URL}/${eventId}/applications/${applicationId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
};

// Volunteer Services
export const volunteerService = {
  getProfile: (volunteerId) => fetchWithAuth(`${VOLUNTEERS_URL}/${volunteerId}`),
  
  updateProfile: (volunteerId, profileData) => fetchWithAuth(`${VOLUNTEERS_URL}/${volunteerId}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
  
  getMyEvents: () => fetchWithAuth(`${VOLUNTEERS_URL}/my-events`),
  
  getMyBadges: () => fetchWithAuth(`${VOLUNTEERS_URL}/my-badges`),
  
  getMyFeedback: () => fetchWithAuth(`${VOLUNTEERS_URL}/my-feedback`),
  
  getApplicationStatus: (eventId) => fetchWithAuth(`${VOLUNTEERS_URL}/events/${eventId}/application-status`),
};

// Organization Services
export const organizationService = {
  getProfile: (organizationId) => fetchWithAuth(`${ORGANIZATIONS_URL}/${organizationId}`),
  
  updateProfile: (organizationId, profileData) => fetchWithAuth(`${ORGANIZATIONS_URL}/${organizationId}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
  
  getMyEvents: () => fetchWithAuth(`${ORGANIZATIONS_URL}/my-events`),
  
  getEventVolunteers: (eventId) => fetchWithAuth(`${ORGANIZATIONS_URL}/events/${eventId}/volunteers`),
  
  provideFeedback: (feedbackData) => fetchWithAuth(`${ORGANIZATIONS_URL}/feedback`, {
    method: 'POST',
    body: JSON.stringify(feedbackData),
  }),
};

// Donation Services
export const donationService = {
  getAllDonations: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return fetchWithAuth(`${DONATIONS_URL}${queryParams ? `?${queryParams}` : ''}`);
  },
  
  getDonationById: (donationId) => fetchWithAuth(`${DONATIONS_URL}/${donationId}`),
  
  createDonation: (donationData) => fetchWithAuth(`${DONATIONS_URL}`, {
    method: 'POST',
    body: JSON.stringify(donationData),
  }),
  
  updateDonation: (donationId, donationData) => fetchWithAuth(`${DONATIONS_URL}/${donationId}`, {
    method: 'PUT',
    body: JSON.stringify(donationData),
  }),
  
  closeDonation: (donationId) => fetchWithAuth(`${DONATIONS_URL}/${donationId}/close`, {
    method: 'PUT',
  }),
  
  completeDonation: (donationId) => fetchWithAuth(`${DONATIONS_URL}/${donationId}/complete`, {
    method: 'PUT',
  }),
  
  getMyDonations: () => fetchWithAuth(`${DONATIONS_URL}/my-donations`),
  
  getDonationStats: (donationId) => fetchWithAuth(`${DONATIONS_URL}/${donationId}/stats`),
};

// Admin Services
export const adminService = {
  getDashboardStats: () => fetchWithAuth(`${ADMIN_URL}/dashboard`),
  
  getUsers: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return fetchWithAuth(`${ADMIN_URL}/users${queryParams ? `?${queryParams}` : ''}`);
  },
  
  getPendingOrganizations: () => fetchWithAuth(`${ADMIN_URL}/organizations?status=pending`),
  
  approveOrganization: (organizationId) => fetchWithAuth(`${ADMIN_URL}/organizations/${organizationId}/approve`, {
    method: 'PUT',
  }),
  
  rejectOrganization: (organizationId) => fetchWithAuth(`${ADMIN_URL}/organizations/${organizationId}/reject`, {
    method: 'PUT',
  }),
  
  getReports: () => fetchWithAuth(`${ADMIN_URL}/reports`),
  
  resolveReport: (reportId) => fetchWithAuth(`${ADMIN_URL}/reports/${reportId}/resolve`, {
    method: 'PUT',
  }),
  
  awardBadge: (badgeData) => fetchWithAuth(`${ADMIN_URL}/badges`, {
    method: 'POST',
    body: JSON.stringify(badgeData),
  }),
};

// Export all services
export default {
  auth: authService,
  events: eventService,
  volunteers: volunteerService,
  organizations: organizationService,
  donations: donationService,
  admin: adminService,
};
