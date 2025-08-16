import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiAlertCircle, FiChevronLeft, FiEdit, FiShare2 } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [userType, setUserType] = useState('volunteer'); // volunteer, organization, or admin
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        setUserType(user.type);
        
        // Fetch event details
        const eventResponse = await fetch(`http://localhost:9002/pub/events/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event details');
        }
        
        const eventData = await eventResponse.json();
        setEvent(eventData);
        
        // Check if volunteer has applied (volunteer view only)
        if (user.type === 'volunteer') {
          const applicationResponse = await fetch(`http://localhost:9004/api/vol/events/${eventId}/application-status`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (applicationResponse.ok) {
            const applicationData = await applicationResponse.json();
            setHasApplied(applicationData.hasApplied || false);
          }
        }
        
        // Fetch volunteers for this event (organization view only)
        if (user.type === 'organization' || user.type === 'admin') {
          const volunteersResponse = await fetch(`http://localhost:9001/api/org/events/${eventId}/volunteers`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (volunteersResponse.ok) {
            const volunteersData = await volunteersResponse.json();
            setVolunteers(volunteersData);
          }
        }
        
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [eventId]);

  // Handle apply to event
  const handleApplyToEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:9004/api/vol/events/${eventId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to apply for event');
      }
      
      setHasApplied(true);
      alert('Successfully applied to the event!');
      
    } catch (err) {
      alert(err.message || 'Something went wrong');
    }
  };

  // Handle share event
  const handleShareEvent = () => {
    const eventUrl = `${window.location.origin}/event-details/${eventId}`;
    
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this volunteer opportunity: ${event.title}`,
        url: eventUrl
      })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(eventUrl)
        .then(() => alert('Event link copied to clipboard!'))
        .catch((err) => alert('Failed to copy link'));
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
    <DashboardLayout userType={userType}>
      <div className="mb-6">
        <button 
          className="text-gray-600 flex items-center hover:text-primary transition-colors"
          onClick={() => navigate(-1)}
        >
          <FiChevronLeft className="mr-1" /> Back
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Loading event details...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-600">
          <FiAlertCircle className="mr-2" />
          <p>{error}</p>
        </div>
      ) : event ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
            <div className={`h-2 ${event.is_private ? 'bg-accent' : 'bg-primary'}`}></div>
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
                <h1 className="text-2xl font-bold mb-2 md:mb-0">{event.title}</h1>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${event.is_private ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                    {event.is_private ? 'Private' : 'Public'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    event.status === 'active' ? 'bg-green-100 text-green-700' : 
                    event.status === 'completed' ? 'bg-blue-100 text-blue-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
              </div>
              
              {/* Organization and Actions */}
              <div className="flex flex-col md:flex-row justify-between mb-8">
                <div className="mb-4 md:mb-0">
                  <p className="text-gray-500">Organized by</p>
                  <p className="font-medium">{event.organization_name}</p>
                </div>
                <div className="flex space-x-2">
                  {(userType === 'organization' && event.is_owner) && (
                    <Link
                      to={`/edit-event/${eventId}`}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <FiEdit className="mr-2" /> Edit Event
                    </Link>
                  )}
                  <button
                    onClick={handleShareEvent}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center"
                  >
                    <FiShare2 className="mr-2" /> Share
                  </button>
                </div>
              </div>
              
              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-lg font-semibold mb-4">Description</h2>
                  <p className="text-gray-700 mb-6 whitespace-pre-line">{event.description}</p>
                  
                  {event.additional_info && (
                    <>
                      <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
                      <p className="text-gray-700 mb-6 whitespace-pre-line">{event.additional_info}</p>
                    </>
                  )}
                  
                  {event.skills_required && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-3">Skills Required</h2>
                      <div className="flex flex-wrap gap-2">
                        {event.skills_required.split(',').map((skill, index) => (
                          <span 
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Event Details</h2>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FiCalendar className="text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Date</p>
                          <p className="text-gray-600">{formatDate(event.event_date)}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FiClock className="text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Duration</p>
                          <p className="text-gray-600">{event.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FiMapPin className="text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-gray-600">{event.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FiUsers className="text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium">Volunteers</p>
                          <p className="text-gray-600">
                            {event.current_volunteers} / {event.required_volunteers} volunteers
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Apply Button for Volunteers */}
                    {(userType === 'volunteer' && event.status === 'active') && (
                      <div className="mt-6">
                        {hasApplied ? (
                          <div className="bg-green-50 text-green-600 p-3 rounded-md text-center">
                            <p className="font-medium">You have applied for this event</p>
                          </div>
                        ) : (
                          <button
                            onClick={handleApplyToEvent}
                            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Volunteer List (For Organization or Admin) */}
              {(userType === 'organization' || userType === 'admin') && volunteers.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">Registered Volunteers ({volunteers.length})</h2>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Volunteer
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Applied On
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {volunteers.map((volunteer) => (
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
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(volunteer.applied_date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  volunteer.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                  volunteer.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Link to={`/volunteer-profile/${volunteer.volunteer_id}`} className="text-primary hover:underline">
                                  View Profile
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">Event not found.</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EventDetails;
