import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiFilter, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { LoadingButton, Loading } from '../components/Loading';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';

/**
 * VolunteerEvents component for volunteers to browse and apply to events
 */
const VolunteerEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch events data
    fetchEvents();
    // Get volunteer's applied events
    fetchAppliedEvents();
  }, [filter, searchTerm, currentPage]);

  // Fetch events from API or mock data
  const fetchEvents = () => {
    setIsLoading(true);
    
    // In a real app, this would be an API call with filters
    setTimeout(() => {
      // Mock event data
      const mockEvents = [
        {
          eventId: 1,
          title: 'Blood Donation Drive',
          description: 'Community blood donation campaign. We need volunteers to help with registration, donor assistance, and refreshment distribution. No prior experience required, just a willing heart to serve!',
          location: 'Colombo General Hospital',
          eventDate: '2025-09-15',
          startTime: '09:00:00',
          endTime: '14:00:00',
          requiredVolunteers: 10,
          currentVolunteers: 5,
          status: 'active',
          organization: {
            name: 'Red Cross Sri Lanka',
            logo: 'https://via.placeholder.com/50'
          },
          skills: ['Medical', 'Customer Service']
        },
        {
          eventId: 2,
          title: 'House Building Project',
          description: 'Building homes for flood victims. We need volunteers for construction assistance, material management, and general support. Training will be provided for those without construction experience.',
          location: 'Ratnapura District',
          eventDate: '2025-09-20',
          startTime: '08:00:00',
          endTime: '17:00:00',
          requiredVolunteers: 20,
          currentVolunteers: 12,
          status: 'active',
          organization: {
            name: 'Habitat for Humanity SL',
            logo: 'https://via.placeholder.com/50'
          },
          skills: ['Construction', 'Physical Work']
        },
        {
          eventId: 3,
          title: 'Beach Cleanup',
          description: 'Cleaning the beach area and collecting plastic waste. Bring water, sun protection, and a positive attitude! Gloves and collection bags will be provided.',
          location: 'Mount Lavinia Beach',
          eventDate: '2025-08-30',
          startTime: '07:30:00',
          endTime: '11:30:00',
          requiredVolunteers: 15,
          currentVolunteers: 8,
          status: 'active',
          organization: {
            name: 'Ocean Care Initiative',
            logo: 'https://via.placeholder.com/50'
          },
          skills: ['Environmental', 'Physical Work']
        },
        {
          eventId: 4,
          title: 'Tree Planting Event',
          description: 'Reforestation initiative in urban areas. Learn about native species while helping restore green spaces in the city. Great for families and first-time volunteers!',
          location: 'Viharamahadevi Park',
          eventDate: '2025-10-05',
          startTime: '08:30:00',
          endTime: '12:30:00',
          requiredVolunteers: 25,
          currentVolunteers: 3,
          status: 'active',
          organization: {
            name: 'Green Earth Lanka',
            logo: 'https://via.placeholder.com/50'
          },
          skills: ['Environmental', 'Gardening']
        },
        {
          eventId: 5,
          title: 'Educational Workshop',
          description: 'Teaching basic computer skills to underprivileged children. Volunteers will assist instructors, provide one-on-one help to students, and help prepare teaching materials.',
          location: 'Community Center, Moratuwa',
          eventDate: '2025-07-15',
          startTime: '10:00:00',
          endTime: '15:00:00',
          requiredVolunteers: 8,
          currentVolunteers: 8,
          status: 'completed',
          organization: {
            name: 'Digital Education Trust',
            logo: 'https://via.placeholder.com/50'
          },
          skills: ['Teaching', 'Computer Skills']
        }
      ];

      // Filter and search
      let filteredEvents = [...mockEvents];
      
      // Filter by status
      if (filter !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.status === filter);
      }
      
      // Search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(term) || 
          event.description.toLowerCase().includes(term) ||
          event.location.toLowerCase().includes(term) ||
          event.organization.name.toLowerCase().includes(term) ||
          event.skills.some(skill => skill.toLowerCase().includes(term))
        );
      }

      setEvents(filteredEvents);
      setTotalPages(Math.ceil(filteredEvents.length / 6)); // 6 events per page
      setIsLoading(false);
    }, 800);
  };

  // Fetch applied events
  const fetchAppliedEvents = () => {
    // In a real app, this would be an API call
    setTimeout(() => {
      // Mock applied event IDs
      setAppliedEvents([2, 5]); 
    }, 500);
  };

  // Apply to an event
  const applyToEvent = (eventId) => {
    setIsApplying(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setAppliedEvents([...appliedEvents, eventId]);
      setIsApplying(false);
      setIsViewModalOpen(false);
    }, 1000);
  };

  // View event details
  const viewEvent = (event) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if event is full
  const isEventFull = (event) => {
    return event.currentVolunteers >= event.requiredVolunteers;
  };

  // Check if volunteer has applied to event
  const hasApplied = (eventId) => {
    return appliedEvents.includes(eventId);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Opportunities</h1>
          <p className="text-gray-600">Browse and apply for volunteer events</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events, skills, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-sm ${
                filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-md text-sm ${
                filter === 'active' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('applied')}
              className={`px-3 py-1 rounded-md text-sm ${
                filter === 'applied' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              My Applications
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loading />
        </div>
      ) : events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <motion.div
                key={event.eventId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <img
                        src={event.organization.logo}
                        alt={event.organization.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-600">{event.organization.name}</span>
                    </div>
                    {event.status === 'active' && hasApplied(event.eventId) && (
                      <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                        Applied
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{event.title}</h3>
                  
                  <div className="flex items-center text-sm mb-2">
                    <FiCalendar className="mr-1 text-gray-500" />
                    <span className="text-gray-700">{formatDate(event.eventDate)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm mb-2">
                    <FiMapPin className="mr-1 text-gray-500" />
                    <span className="text-gray-700">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm mb-3">
                    <FiClock className="mr-1 text-gray-500" />
                    <span className="text-gray-700">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {event.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Volunteers</span>
                      <span className="font-medium">
                        {event.currentVolunteers}/{event.requiredVolunteers}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          isEventFull(event) ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            (event.currentVolunteers / event.requiredVolunteers) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => viewEvent(event)}
                    className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      ) : (
        <EmptyState
          type="search"
          title="No events found"
          message={
            searchTerm
              ? "No events match your search criteria"
              : filter === 'applied'
              ? "You haven't applied to any events yet"
              : "There are no events available at this time"
          }
          action={
            searchTerm || filter !== 'all'
              ? {
                  label: 'Reset Filters',
                  onClick: () => {
                    setSearchTerm('');
                    setFilter('all');
                  },
                }
              : null
          }
        />
      )}

      {/* View Event Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedEvent?.title || ''}
        size="large"
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="flex items-center">
              <img
                src={selectedEvent.organization.logo}
                alt={selectedEvent.organization.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <span className="text-gray-700">{selectedEvent.organization.name}</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Description</h3>
              <p className="text-gray-700">{selectedEvent.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium">Date & Time</h3>
                <p className="text-gray-700 flex items-center mt-1">
                  <FiCalendar className="mr-2 text-gray-500" />
                  {formatDate(selectedEvent.eventDate)}
                </p>
                <p className="text-gray-700 flex items-center mt-1">
                  <FiClock className="mr-2 text-gray-500" />
                  {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Location</h3>
                <p className="text-gray-700 flex items-center mt-1">
                  <FiMapPin className="mr-2 text-gray-500" />
                  {selectedEvent.location}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium">Required Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedEvent.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Volunteer Spots</h3>
              <div className="flex justify-between text-sm mb-1">
                <span>Volunteers needed</span>
                <span className="font-medium">
                  {selectedEvent.currentVolunteers}/{selectedEvent.requiredVolunteers}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    isEventFull(selectedEvent) ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      (selectedEvent.currentVolunteers / selectedEvent.requiredVolunteers) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              {isEventFull(selectedEvent) && (
                <p className="text-red-500 text-sm mt-2">
                  This event is full. You can still apply, but will be placed on a waiting list.
                </p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              {selectedEvent.status === 'active' && !hasApplied(selectedEvent.eventId) ? (
                <LoadingButton
                  loading={isApplying}
                  onClick={() => applyToEvent(selectedEvent.eventId)}
                  className="px-4 py-2"
                >
                  Apply Now
                </LoadingButton>
              ) : selectedEvent.status === 'active' && hasApplied(selectedEvent.eventId) ? (
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-not-allowed"
                  disabled
                >
                  Already Applied
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-not-allowed"
                  disabled
                >
                  {selectedEvent.status === 'completed' ? 'Event Completed' : 'Not Available'}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VolunteerEvents;
