import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import VolunteerDashboard from './pages/VolunteerDashboard';
import OrganizationDashboard from './pages/OrganizationDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import NotFound from './pages/NotFound';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);
  
  // Protected route component
  const ProtectedRoute = ({ children, allowedTypes }) => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>;
    }
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    if (allowedTypes && !allowedTypes.includes(user.type)) {
      // Redirect to the appropriate dashboard based on user type
      if (user.type === 'volunteer') {
        return <Navigate to="/volunteer/dashboard" />;
      } else if (user.type === 'organization') {
        return <Navigate to="/organization/dashboard" />;
      } else if (user.type === 'admin') {
        return <Navigate to="/admin/dashboard" />;
      }
    }
    
    return children;
  };

  // Public route that redirects logged in users to their dashboard
  const PublicRoute = ({ children }) => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>;
    }
    
    if (user) {
      // Redirect to the appropriate dashboard based on user type
      if (user.type === 'volunteer') {
        return <Navigate to="/volunteer/dashboard" />;
      } else if (user.type === 'organization') {
        return <Navigate to="/organization/dashboard" />;
      } else if (user.type === 'admin') {
        return <Navigate to="/admin/dashboard" />;
      }
    }
    
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login setUser={setUser} />
            </PublicRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Volunteer Routes */}
        <Route 
          path="/volunteer/dashboard" 
          element={
            <ProtectedRoute allowedTypes={['volunteer']}>
              <VolunteerDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Organization Routes */}
        <Route 
          path="/organization/dashboard" 
          element={
            <ProtectedRoute allowedTypes={['organization']}>
              <OrganizationDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-event" 
          element={
            <ProtectedRoute allowedTypes={['organization']}>
              <CreateEvent />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedTypes={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Common Routes */}
        <Route 
          path="/event-details/:eventId" 
          element={
            <ProtectedRoute allowedTypes={['volunteer', 'organization', 'admin']}>
              <EventDetails />
            </ProtectedRoute>
          } 
        />
        
        {/* Dashboard shortcuts */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedTypes={['volunteer', 'organization', 'admin']}>
              {user && user.type === 'volunteer' ? (
                <Navigate to="/volunteer/dashboard" />
              ) : user && user.type === 'organization' ? (
                <Navigate to="/organization/dashboard" />
              ) : (
                <Navigate to="/admin/dashboard" />
              )}
            </ProtectedRoute>
          } 
        />
        
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
