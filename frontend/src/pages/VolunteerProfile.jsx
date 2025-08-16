import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiAward, FiClock, FiUser, FiMail, FiPhone, FiStar } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';
import EditVolunteerProfile from '../components/EditVolunteerProfile';

const VolunteerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [badges, setBadges] = useState([]);
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
        
        // Fetch volunteer profile data
        const profileResponse = await fetch('http://localhost:9000/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const profileData = await profileResponse.json();
        
        // Fetch volunteer's events/applications
        const eventsResponse = await fetch('http://localhost:9004/api/vol/my-events', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch events data');
        }
        
        const eventsData = await eventsResponse.json();
        
        // Fetch volunteer's badges
        const badgesResponse = await fetch('http://localhost:9004/api/vol/my-badges', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        let badgesData = [];
        
        if (badgesResponse.ok) {
          badgesData = await badgesResponse.json();
        }
        
        setProfile(profileData.data);
        setEvents(eventsData.data || []);
        setBadges(badgesData.data || []);
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
    user_id: 1,
    name: 'John Volunteer',
    email: 'vol4@example.com',
    phone: '123-456-7890',
    user_type: 'volunteer',
    profile: {
      skills: 'Teaching, First Aid',
      bio: 'Passionate about helping others and making a difference in the community.',
      total_hours: 45,
      badge_count: 3,
      rating: 4.5
    }
  };

  const fallbackEvents = [
    {
      event_id: 1,
      title: 'Beach Cleanup',
      organization_name: 'Clean Earth Foundation',
      event_date: '2025-09-15',
      status: 'Upcoming',
      application_status: 'accepted'
    },
    {
      event_id: 2,
      title: 'Food Drive',
      organization_name: 'Food for All',
      event_date: '2025-08-20',
      status: 'Completed',
      application_status: 'completed',
      hours: 8
    }
  ];

  const fallbackBadges = [
    {
      badge_id: 1,
      badge_name: 'First Timer',
      badge_description: 'Completed first volunteer event',
      earned_date: '2025-06-15'
    },
    {
      badge_id: 2,
      badge_name: 'Environment Champion',
      badge_description: 'Participated in 3 environmental events',
      earned_date: '2025-07-20'
    },
    {
      badge_id: 3,
      badge_name: '10+ Hours',
      badge_description: 'Contributed more than 10 hours',
      earned_date: '2025-08-01'
    }
  ];

  // Use actual data if available, otherwise use fallback data
  const displayProfile = profile || fallbackProfile;
  const displayEvents = events.length > 0 ? events : fallbackEvents;
  const displayBadges = badges.length > 0 ? badges : fallbackBadges;

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile({
      ...profile,
      name: updatedProfile.name,
      phone: updatedProfile.phone,
      profile: {
        ...profile.profile,
        skills: updatedProfile.skills,
        bio: updatedProfile.bio
      }
    });
    setIsEditModalOpen(false);
  };

  return (
    <DashboardLayout userType="volunteer">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your volunteer profile and view your contributions.</p>
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
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"
              >
                <FiEdit2 />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser className="text-primary text-4xl" />
              </div>
              <h3 className="text-xl font-bold">{displayProfile.name}</h3>
              <p className="text-gray-500 text-sm mt-1">Volunteer</p>
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
                <FiStar className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="flex items-center">
                    {displayProfile.profile?.rating || 0}/5
                    <span className="ml-2 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-${star <= Math.round(displayProfile.profile?.rating || 0) ? 'yellow-400' : 'gray-300'}`}>★</span>
                      ))}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <hr className="my-6" />
            
            <div>
              <h3 className="font-semibold mb-2">Bio</h3>
              <p className="text-gray-600">{displayProfile.profile?.bio || 'No bio provided.'}</p>
            </div>
            
            <hr className="my-6" />
            
            <div>
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {displayProfile.profile?.skills ? (
                  displayProfile.profile.skills.split(',').map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills listed</p>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Stats and Events */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col">
                <span className="text-gray-500 text-sm mb-1">Total Hours</span>
                <div className="flex items-center">
                  <FiClock className="text-primary mr-2" />
                  <span className="text-2xl font-bold">{displayProfile.profile?.total_hours || 0}</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col">
                <span className="text-gray-500 text-sm mb-1">Events Participated</span>
                <div className="flex items-center">
                  <FiClock className="text-primary mr-2" />
                  <span className="text-2xl font-bold">{displayEvents.length}</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col">
                <span className="text-gray-500 text-sm mb-1">Badges Earned</span>
                <div className="flex items-center">
                  <FiAward className="text-primary mr-2" />
                  <span className="text-2xl font-bold">{displayProfile.profile?.badge_count || displayBadges.length}</span>
                </div>
              </div>
            </div>
            
            {/* Recent Events */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
              
              {displayEvents.length === 0 ? (
                <p className="text-gray-500">You haven't participated in any events yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3 font-semibold">Event Name</th>
                        <th className="pb-3 font-semibold">Organization</th>
                        <th className="pb-3 font-semibold">Date</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayEvents.map((event) => (
                        <tr key={event.event_id} className="border-b">
                          <td className="py-4">{event.title}</td>
                          <td className="py-4">{event.organization_name}</td>
                          <td className="py-4">{formatDate(event.event_date)}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs 
                              ${event.application_status === 'accepted' ? 'bg-green-100 text-green-800' : 
                                event.application_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                event.application_status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'}`}>
                              {event.application_status.charAt(0).toUpperCase() + event.application_status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Badges */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4">Badges</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayBadges.map((badge) => (
                  <div key={badge.badge_id} className="bg-gray-50 rounded-lg p-4 flex items-start">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg mr-3">
                      <FiAward size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{badge.badge_name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{badge.badge_description}</p>
                      <p className="text-xs text-gray-500">Earned on {formatDate(badge.earned_date)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {displayBadges.length === 0 && (
                <p className="text-gray-500">You haven't earned any badges yet.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditVolunteerProfile
          profile={displayProfile}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </DashboardLayout>
  );
};

export default VolunteerProfile;
