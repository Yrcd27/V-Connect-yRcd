import React, { useState, useEffect } from 'react';
import { FiAward, FiBriefcase, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Loading } from '../components/Loading';
import EmptyState from '../components/EmptyState';

/**
 * VolunteerProfile component for displaying volunteer profile information, skills, and badges
 */
const VolunteerProfile = () => {
  const [volunteer, setVolunteer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('skills');

  useEffect(() => {
    // Fetch volunteer profile
    fetchProfile();
  }, []);

  // Fetch volunteer profile from API or mock data
  const fetchProfile = () => {
    setIsLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      // Mock volunteer data
      const mockVolunteer = {
        volunteerId: 1,
        name: 'Saman Perera',
        email: 'saman.perera@example.com',
        contactNumber: '+94 77 123 4567',
        address: 'No. 45, Temple Road, Colombo 5',
        dateOfBirth: '1995-05-12',
        bio: 'Passionate about community development and environmental conservation. I believe in making a positive impact through dedicated volunteer work.',
        profileImage: 'https://randomuser.me/api/portraits/men/43.jpg',
        joinedDate: '2023-01-15',
        completedEvents: 8,
        upcomingEvents: 2,
        skills: [
          { skillId: 1, name: 'Teaching', endorsed: 5 },
          { skillId: 2, name: 'First Aid', endorsed: 3 },
          { skillId: 3, name: 'Event Planning', endorsed: 2 },
          { skillId: 4, name: 'Computer Skills', endorsed: 7 },
          { skillId: 5, name: 'Environmental Conservation', endorsed: 4 }
        ],
        badges: [
          { 
            badgeId: 1, 
            name: 'First Time Volunteer', 
            description: 'Awarded for completing your first volunteer event',
            image: 'https://via.placeholder.com/80',
            dateAwarded: '2023-01-20'
          },
          { 
            badgeId: 2, 
            name: 'Environmental Champion', 
            description: 'Completed 5 environmental conservation events',
            image: 'https://via.placeholder.com/80',
            dateAwarded: '2023-03-15'
          },
          { 
            badgeId: 3, 
            name: 'Team Player', 
            description: 'Received excellent feedback from 3 different organizations',
            image: 'https://via.placeholder.com/80',
            dateAwarded: '2023-06-30'
          }
        ],
        volunteeredHours: 45
      };
      
      setVolunteer(mockVolunteer);
      setIsLoading(false);
    }, 800);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate time volunteering
  const calculateTimeVolunteering = (joinedDate) => {
    const joined = new Date(joinedDate);
    const now = new Date();
    const diffTime = Math.abs(now - joined);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    
    if (diffMonths < 1) {
      return `${diffDays} days`;
    } else if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths === 1 ? '' : 's'}`;
    } else {
      const years = Math.floor(diffMonths / 12);
      const remainingMonths = diffMonths % 12;
      return `${years} year${years === 1 ? '' : 's'}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths === 1 ? '' : 's'}` : ''}`;
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    );
  }

  // Render profile if data is loaded
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Volunteer Profile</h1>
        <p className="text-gray-600">View your profile, skills, and badges</p>
      </div>

      {volunteer && (
        <>
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img 
                  src={volunteer.profileImage} 
                  alt={volunteer.name} 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full"
                />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{volunteer.name}</h2>
                <p className="text-gray-700 mb-4">{volunteer.bio}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-full p-2 mr-3">
                      <FiCalendar className="text-primary" size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Volunteering for</p>
                      <p className="font-medium">{calculateTimeVolunteering(volunteer.joinedDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-full p-2 mr-3">
                      <FiCheckCircle className="text-primary" size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Events completed</p>
                      <p className="font-medium">{volunteer.completedEvents}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-full p-2 mr-3">
                      <FiAward className="text-primary" size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hours volunteered</p>
                      <p className="font-medium">{volunteer.volunteeredHours} hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'skills'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Skills
                </button>
                <button
                  onClick={() => setActiveTab('badges')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'badges'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Badges
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">Your Skills</h3>
                  {volunteer.skills.length > 0 ? (
                    <div className="space-y-4">
                      {volunteer.skills.map(skill => (
                        <div key={skill.skillId} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{skill.name}</h4>
                            <p className="text-sm text-gray-500">
                              {skill.endorsed} {skill.endorsed === 1 ? 'endorsement' : 'endorsements'}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {/* Skill level indicator */}
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`w-2 h-8 rounded-full ${
                                    i < Math.min(Math.ceil(skill.endorsed / 2), 5) 
                                      ? 'bg-primary' 
                                      : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      type="data"
                      title="No skills yet"
                      message="Your skills will appear here as you gain experience through volunteering"
                    />
                  )}
                </div>
              )}

              {/* Badges Tab */}
              {activeTab === 'badges' && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">Your Badges</h3>
                  {volunteer.badges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {volunteer.badges.map(badge => (
                        <motion.div 
                          key={badge.badgeId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gray-50 p-4 rounded-lg flex flex-col items-center text-center"
                        >
                          <img 
                            src={badge.image} 
                            alt={badge.name} 
                            className="w-20 h-20 mb-3"
                          />
                          <h4 className="font-medium mb-1">{badge.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                          <p className="text-xs text-gray-500">
                            Awarded on {formatDate(badge.dateAwarded)}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      type="data"
                      title="No badges yet"
                      message="Complete volunteer events to earn badges for your achievements"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{volunteer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Contact Number</p>
                <p className="font-medium">{volunteer.contactNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="font-medium">{volunteer.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                <p className="font-medium">{formatDate(volunteer.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Member Since</p>
                <p className="font-medium">{formatDate(volunteer.joinedDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Upcoming Events</p>
                <p className="font-medium">{volunteer.upcomingEvents}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VolunteerProfile;
