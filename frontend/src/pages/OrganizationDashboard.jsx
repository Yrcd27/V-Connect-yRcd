import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiUsers, FiCalendar, FiAlertCircle, FiCheck, FiClock, FiUser, FiEdit } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    pendingVolunteers: 0,
    totalVolunteers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        
        // Fetch organization's profile which includes events using the new API structure
        const eventsResponse = await fetch('http://localhost:9000/organizations/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch organization profile');
        }
        
        const profileData = await eventsResponse.json();
        
        // Get events for this organization
        const orgEvents = await fetch('http://localhost:9003/events?organizationId=' + profileData.id, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!orgEvents.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const eventsData = await orgEvents.json();
        setEvents(eventsData);
        
        // Fetch event applications for all events
        // This would be a combined call in a real implementation
        // For now, we'll simulate getting applications for all events
        let allApplications = [];
        
        for (const event of eventsData) {
          const applicationsResponse = await fetch(`http://localhost:9003/events/${event.event_id}/applications`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (applicationsResponse.ok) {
            const eventApplications = await applicationsResponse.json();
            allApplications = [...allApplications, ...eventApplications];
          }
        }
        
        setVolunteers(allApplications);
        
        // Calculate stats
        const activeEvents = eventsData.filter(event => event.status === 'active').length;
        const pendingApplications = allApplications.filter(vol => vol.status === 'pending').length;
        
        setStats({
          totalEvents: eventsData.length,
          activeEvents,
          pendingVolunteers: pendingApplications,
          totalVolunteers: allApplications.length
        });
        
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Handle approval of volunteer application
  const handleApproveVolunteer = async (volunteerId, eventId) => {
    try {
      const token = localStorage.getItem('token');
      
      // Find the application ID from the volunteers array
      const application = volunteers.find(
        vol => vol.volunteer_id === volunteerId && vol.event_id === eventId
      );
      
      if (!application) {
        throw new Error('Application not found');
      }
      
      const response = await fetch(`http://localhost:9003/events/${eventId}/applications/${application.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: 'approved'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve volunteer');
      }
      
      // Update volunteers list to reflect approval
      const updatedVolunteers = volunteers.map(volunteer => {
        if (volunteer.volunteer_id === volunteerId && volunteer.event_id === eventId) {
          return { ...volunteer, status: 'approved' };
        }
        return volunteer;
      });
      
      setVolunteers(updatedVolunteers);
      
      // Update stats
      setStats({
        ...stats,
        pendingVolunteers: stats.pendingVolunteers - 1
      });
      
      alert('Volunteer approved successfully!');
      
    } catch (err) {
      alert(err.message || 'Something went wrong');
    }
  };

  // Create new event handler
  const handleCreateNewEvent = () => {
    navigate('/create-event');
  };
  
  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <DashboardLayout userType="organization">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Organization Dashboard</h1>
          <p className="text-gray-600">Manage your events and volunteers</p>
        </div>
        <button 
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center"
          onClick={handleCreateNewEvent}
        >
          <FiPlus className="mr-2" /> Create New Event
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-600 mb-6">
          <FiAlertCircle className="mr-2" />
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Events</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalEvents}</h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <FiCalendar className="text-xl text-primary" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Events</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.activeEvents}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FiClock className="text-xl text-green-600" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pending Volunteers</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.pendingVolunteers}</h3>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FiUser className="text-xl text-yellow-600" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Volunteers</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalVolunteers}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FiUsers className="text-xl text-blue-600" />
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Events Section */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Events</h2>
              <Link to="/manage-events" className="text-primary hover:underline text-sm">
                View all events
              </Link>
            </div>
            
            {events.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600 mb-4">You haven't created any events yet.</p>
                <button 
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center mx-auto"
                  onClick={handleCreateNewEvent}
                >
                  <FiPlus className="mr-2" /> Create Your First Event
                </button>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {events.slice(0, 3).map((event) => (
                  <motion.div 
                    key={event.event_id} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className={`h-3 ${event.status === 'active' ? 'bg-green-500' : event.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          event.status === 'active' ? 'bg-green-100 text-green-700' : 
                          event.status === 'completed' ? 'bg-blue-100 text-blue-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiCalendar className="mr-2 text-gray-400" />
                          <span>{formatDate(event.event_date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiUsers className="mr-2 text-gray-400" />
                          <span>{event.current_volunteers} / {event.required_volunteers} volunteers</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Link 
                          to={`/event-details/${event.event_id}`}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          View Details
                        </Link>
                        <Link 
                          to={`/edit-event/${event.event_id}`}
                          className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1 rounded"
                        >
                          <FiEdit className="mr-1" /> Edit
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
          
          {/* Pending Volunteers Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Pending Volunteer Applications</h2>
              <Link to="/manage-volunteers" className="text-primary hover:underline text-sm">
                Manage all volunteers
              </Link>
            </div>
            
            {volunteers.filter(vol => vol.status === 'pending').length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600">No pending volunteer applications.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied On
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {volunteers
                        .filter(vol => vol.status === 'pending')
                        .slice(0, 5)
                        .map((volunteer) => (
                          <tr key={volunteer.volunteer_id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                  {volunteer.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
                                  <div className="text-sm text-gray-500">{volunteer.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{volunteer.event_title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(volunteer.applied_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleApproveVolunteer(volunteer.volunteer_id, volunteer.event_id)}
                                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors flex items-center"
                                >
                                  <FiCheck className="mr-1" /> Approve
                                </button>
                                <Link
                                  to={`/volunteer-profile/${volunteer.volunteer_id}`}
                                  className="text-primary hover:underline"
                                >
                                  View Profile
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default OrganizationDashboard;
