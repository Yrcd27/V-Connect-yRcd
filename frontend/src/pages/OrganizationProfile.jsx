import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiCalendar, FiMapPin, FiGlobe, FiMail, FiPhone, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';
import EditOrganizationProfile from '../components/EditOrganizationProfile';

const OrganizationProfile = () => {
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        // Fetch organization profile data
        const profileResponse = await fetch('http://localhost:9000/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const profileData = await profileResponse.json();
        
        // Fetch organization's events
        const eventsResponse = await fetch('http://localhost:9001/api/org/my-events', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        let eventsData = [];
        if (eventsResponse.ok) {
          eventsData = await eventsResponse.json();
        }
        
        // Fetch organization's donations
        const donationsResponse = await fetch('http://localhost:9005/api/org/my-donations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        let donationsData = [];
        if (donationsResponse.ok) {
          donationsData = await donationsResponse.json();
        }
        
        setProfile(profileData.data);
        setEvents(eventsData.data || []);
        setDonations(donationsData.data || []);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);

  // Fallback profile data for testing when API fails
  const fallbackProfile = {
    user_id: 3,
    name: 'Lio',
    email: 'lio4@example.com',
    phone: '555-123-4567',
    user_type: 'organization',
    profile: {
      description: 'Organization dedicated to community service',
      address: '123 Main St, Colombo',
      website: 'https://lio.org',
      is_verified: true
    }
  };

  const fallbackEvents = [
    {
      event_id: 1,
      title: 'Beach Cleanup',
      location: 'Mount Lavinia Beach',
      event_date: '2025-09-15',
      required_volunteers: 10,
      applied_volunteers: 5,
      status: 'active'
    },
    {
      event_id: 2,
      title: 'Food Drive',
      location: 'Colombo City Center',
      event_date: '2025-10-01',
      required_volunteers: 5,
      applied_volunteers: 3,
      status: 'active'
    }
  ];

  const fallbackDonations = [
    {
      request_id: 1,
      title: 'Clean Water Initiative',
      target_amount: 5000.00,
      current_amount: 2500.00,
      created_at: '2025-08-01',
      status: 'active'
    }
  ];

  // Use actual data if available, otherwise use fallback data
  const displayProfile = profile || fallbackProfile;
  const displayEvents = events.length > 0 ? events : fallbackEvents;
  const displayDonations = donations.length > 0 ? donations : fallbackDonations;

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile({
      ...profile,
      name: updatedProfile.name,
      phone: updatedProfile.phone,
      profile: {
        ...profile.profile,
        description: updatedProfile.description,
        address: updatedProfile.address,
        website: updatedProfile.website
      }
    });
    setIsEditModalOpen(false);
  };

  return (
    <DashboardLayout userType="organization">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Organization Profile</h1>
        <p className="text-gray-600">Manage your organization profile and view your events and donation campaigns.</p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Organization Info</h2>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"
              >
                <FiEdit2 />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">{displayProfile.name.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-bold">{displayProfile.name}</h3>
              <div className="flex items-center justify-center mt-2">
                {displayProfile.profile?.is_verified ? (
                  <span className="inline-flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <FiCheckCircle className="mr-1" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                    <FiAlertCircle className="mr-1" /> Verification Pending
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <FiMail className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{displayProfile.email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiPhone className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{displayProfile.phone || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiMapPin className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{displayProfile.profile?.address || 'Not provided'}</p>
                </div>
              </div>
              
              {displayProfile.profile?.website && (
                <div className="flex items-center">
                  <FiGlobe className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a 
                      href={displayProfile.profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {displayProfile.profile.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            <hr className="my-6" />
            
            <div>
              <h3 className="font-semibold mb-2">About Us</h3>
              <p className="text-gray-600">{displayProfile.profile?.description || 'No description provided.'}</p>
            </div>
            
            <hr className="my-6" />
            
            <div>
              <h3 className="font-semibold mb-2">Summary</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{displayEvents.length}</p>
                  <p className="text-sm text-gray-600">Total Events</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{displayDonations.length}</p>
                  <p className="text-sm text-gray-600">Donation Campaigns</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Events and Donations */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Recent Events */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Events</h2>
                <a 
                  href="/create-event" 
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm"
                >
                  Create New Event
                </a>
              </div>
              
              {displayEvents.length === 0 ? (
                <p className="text-gray-500">You haven't created any events yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3 font-semibold">Event Name</th>
                        <th className="pb-3 font-semibold">Date</th>
                        <th className="pb-3 font-semibold">Location</th>
                        <th className="pb-3 font-semibold">Volunteers</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayEvents.map((event) => (
                        <tr key={event.event_id} className="border-b">
                          <td className="py-4">
                            <a 
                              href={`/event-details/${event.event_id}`} 
                              className="text-primary hover:underline"
                            >
                              {event.title}
                            </a>
                          </td>
                          <td className="py-4">{formatDate(event.event_date)}</td>
                          <td className="py-4">{event.location}</td>
                          <td className="py-4">
                            {event.applied_volunteers}/{event.required_volunteers}
                          </td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs 
                              ${event.status === 'active' ? 'bg-green-100 text-green-800' : 
                                event.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                                event.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                'bg-gray-100 text-gray-800'}`}>
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {displayEvents.length > 0 && (
                <div className="mt-4 text-right">
                  <a 
                    href="/organization-dashboard" 
                    className="text-primary hover:underline text-sm"
                  >
                    View All Events
                  </a>
                </div>
              )}
            </div>
            
            {/* Donations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Donation Campaigns</h2>
                <a 
                  href="/create-donation" 
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm"
                >
                  Create New Campaign
                </a>
              </div>
              
              {displayDonations.length === 0 ? (
                <p className="text-gray-500">You haven't created any donation campaigns yet.</p>
              ) : (
                <div className="space-y-4">
                  {displayDonations.map(donation => (
                    <div key={donation.request_id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{donation.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs 
                          ${donation.status === 'active' ? 'bg-green-100 text-green-800' : 
                            donation.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="mt-3 mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>
                            {formatCurrency(donation.current_amount || 0)} of {formatCurrency(donation.target_amount)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${Math.min(((donation.current_amount || 0) / donation.target_amount) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center text-gray-500">
                          <FiCalendar className="mr-1" />
                          <span>Started {formatDate(donation.created_at)}</span>
                        </div>
                        <a 
                          href={`/donation-details/${donation.request_id}`} 
                          className="text-primary hover:underline"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {displayDonations.length > 0 && (
                <div className="mt-4 text-right">
                  <a 
                    href="/my-donations" 
                    className="text-primary hover:underline text-sm"
                  >
                    View All Campaigns
                  </a>
                </div>
              )}
            </div>
            
            {/* Verification Status */}
            {!displayProfile.profile?.is_verified && (
              <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-100 p-6">
                <div className="flex items-start">
                  <FiAlertCircle className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-yellow-800">Verification Pending</h3>
                    <p className="text-yellow-700 mt-2">
                      Your organization is currently pending verification. Some features may be limited until 
                      your organization is verified by our admins. We'll notify you once the verification is complete.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
      
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditOrganizationProfile
          profile={displayProfile}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </DashboardLayout>
  );
};

export default OrganizationProfile;
