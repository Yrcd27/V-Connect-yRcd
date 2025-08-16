import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiFilter, FiSearch, FiUser } from 'react-icons/fi';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { LoadingButton, Loading } from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';

/**
 * VolunteerApplications component for organizations to manage volunteer applications for events
 */
const VolunteerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch applications data
    fetchApplications();
    // Fetch events for filter dropdown
    fetchEvents();
  }, [statusFilter, eventFilter, searchTerm, currentPage]);

  // Fetch applications from API or mock data
  const fetchApplications = () => {
    setIsLoading(true);
    
    // In a real app, this would be an API call with filters
    setTimeout(() => {
      // Mock application data
      const mockApplications = [
        {
          applicationId: 1,
          status: 'pending', // pending, approved, rejected
          applyDate: '2025-09-10',
          volunteer: {
            volunteerId: 1,
            name: 'Saman Perera',
            email: 'saman.perera@example.com',
            profileImage: 'https://randomuser.me/api/portraits/men/43.jpg',
            completedEvents: 8,
            volunteeredHours: 45
          },
          event: {
            eventId: 1,
            title: 'Blood Donation Drive',
            date: '2025-09-15',
            location: 'Colombo General Hospital'
          },
          message: "I'm a certified first aid provider and would like to help with this blood donation campaign."
        },
        {
          applicationId: 2,
          status: 'approved',
          applyDate: '2025-09-08',
          volunteer: {
            volunteerId: 2,
            name: 'Kumari Silva',
            email: 'kumari.silva@example.com',
            profileImage: 'https://randomuser.me/api/portraits/women/33.jpg',
            completedEvents: 5,
            volunteeredHours: 28
          },
          event: {
            eventId: 1,
            title: 'Blood Donation Drive',
            date: '2025-09-15',
            location: 'Colombo General Hospital'
          },
          message: "I've volunteered at blood donation events before and have experience in donor registration."
        },
        {
          applicationId: 3,
          status: 'pending',
          applyDate: '2025-09-05',
          volunteer: {
            volunteerId: 3,
            name: 'Amal Fernando',
            email: 'amal.fernando@example.com',
            profileImage: 'https://randomuser.me/api/portraits/men/22.jpg',
            completedEvents: 12,
            volunteeredHours: 67
          },
          event: {
            eventId: 2,
            title: 'House Building Project',
            date: '2025-09-20',
            location: 'Ratnapura District'
          },
          message: "I have construction experience and am willing to help build homes for those in need."
        },
        {
          applicationId: 4,
          status: 'rejected',
          applyDate: '2025-08-28',
          volunteer: {
            volunteerId: 4,
            name: 'Nimal Gunawardena',
            email: 'nimal.gunawardena@example.com',
            profileImage: 'https://randomuser.me/api/portraits/men/54.jpg',
            completedEvents: 3,
            volunteeredHours: 18
          },
          event: {
            eventId: 3,
            title: 'Beach Cleanup',
            date: '2025-08-30',
            location: 'Mount Lavinia Beach'
          },
          message: "I'm passionate about keeping our beaches clean and want to contribute to this effort."
        },
        {
          applicationId: 5,
          status: 'approved',
          applyDate: '2025-08-25',
          volunteer: {
            volunteerId: 5,
            name: 'Priya Mendis',
            email: 'priya.mendis@example.com',
            profileImage: 'https://randomuser.me/api/portraits/women/45.jpg',
            completedEvents: 7,
            volunteeredHours: 39
          },
          event: {
            eventId: 3,
            title: 'Beach Cleanup',
            date: '2025-08-30',
            location: 'Mount Lavinia Beach'
          },
          message: "I've organized similar cleanups before and would love to participate in this one."
        }
      ];

      // Apply filters
      let filteredApplications = [...mockApplications];
      
      // Status filter
      if (statusFilter !== 'all') {
        filteredApplications = filteredApplications.filter(app => app.status === statusFilter);
      }
      
      // Event filter
      if (eventFilter !== 'all') {
        filteredApplications = filteredApplications.filter(app => app.event.eventId === parseInt(eventFilter));
      }
      
      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredApplications = filteredApplications.filter(app => 
          app.volunteer.name.toLowerCase().includes(term) || 
          app.volunteer.email.toLowerCase().includes(term) ||
          app.event.title.toLowerCase().includes(term)
        );
      }

      setApplications(filteredApplications);
      setTotalPages(Math.ceil(filteredApplications.length / 10));
      setIsLoading(false);
    }, 800);
  };

  // Fetch events for filter dropdown
  const fetchEvents = () => {
    // In a real app, this would be an API call
    setTimeout(() => {
      // Mock events data
      const mockEvents = [
        { eventId: 1, title: 'Blood Donation Drive' },
        { eventId: 2, title: 'House Building Project' },
        { eventId: 3, title: 'Beach Cleanup' },
        { eventId: 4, title: 'Tree Planting Event' }
      ];
      
      setEvents(mockEvents);
    }, 500);
  };

  // View volunteer profile
  const viewVolunteerProfile = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsProfileModalOpen(true);
  };

  // Update application status
  const updateApplicationStatus = (applicationId, status) => {
    setIsUpdating(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      // Update application status locally
      setApplications(applications.map(app => 
        app.applicationId === applicationId 
          ? { ...app, status } 
          : app
      ));
      
      setIsUpdating(false);
    }, 1000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Send message to volunteer
  const sendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, this would be an API call
    console.log(`Sending message to ${selectedVolunteer.name}: ${message}`);
    setMessage('');
    // Show confirmation or feedback
  };

  // Table columns definition
  const columns = [
    {
      header: 'Volunteer',
      accessor: 'volunteer',
      cell: (row) => (
        <div className="flex items-center">
          <img src={row.volunteer.profileImage} alt={row.volunteer.name} className="w-8 h-8 rounded-full mr-3" />
          <div>
            <div className="font-medium">{row.volunteer.name}</div>
            <div className="text-sm text-gray-500">{row.volunteer.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Event',
      accessor: 'event',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.event.title}</div>
          <div className="text-sm text-gray-500">{formatDate(row.event.date)}</div>
          <div className="text-sm text-gray-500">{row.event.location}</div>
        </div>
      )
    },
    {
      header: 'Applied On',
      accessor: 'applyDate',
      cell: (row) => <div>{formatDate(row.applyDate)}</div>
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        let statusClass = '';
        switch(row.status) {
          case 'pending':
            statusClass = 'bg-yellow-50 text-yellow-700';
            break;
          case 'approved':
            statusClass = 'bg-green-50 text-green-700';
            break;
          case 'rejected':
            statusClass = 'bg-red-50 text-red-700';
            break;
          default:
            statusClass = 'bg-gray-50 text-gray-700';
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => viewVolunteerProfile(row.volunteer)}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
          >
            View Profile
          </button>
          
          {row.status === 'pending' && (
            <>
              <LoadingButton
                loading={isUpdating}
                onClick={() => updateApplicationStatus(row.applicationId, 'approved')}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200"
              >
                <FiCheckCircle size={16} className="mr-1" />
                Approve
              </LoadingButton>
              
              <LoadingButton
                loading={isUpdating}
                onClick={() => updateApplicationStatus(row.applicationId, 'rejected')}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
              >
                <FiXCircle size={16} className="mr-1" />
                Reject
              </LoadingButton>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Volunteer Applications</h1>
        <p className="text-gray-600">Review and manage volunteer applications for your events</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search volunteers or events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Event:</span>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Events</option>
                {events.map(event => (
                  <option key={event.eventId} value={event.eventId}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loading />
        </div>
      ) : applications.length > 0 ? (
        <>
          <Table
            columns={columns}
            data={applications}
          />
          <div className="mt-4">
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
          title="No applications found"
          message={
            searchTerm || statusFilter !== 'all' || eventFilter !== 'all'
              ? "No applications match your search criteria"
              : "You don't have any volunteer applications yet"
          }
          action={
            searchTerm || statusFilter !== 'all' || eventFilter !== 'all'
              ? {
                  label: 'Clear Filters',
                  onClick: () => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setEventFilter('all');
                  }
                }
              : null
          }
        />
      )}

      {/* Volunteer Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Volunteer Profile"
        size="large"
      >
        {selectedVolunteer && (
          <div className="space-y-6">
            <div className="flex items-center">
              <img
                src={selectedVolunteer.profileImage}
                alt={selectedVolunteer.name}
                className="w-20 h-20 rounded-full mr-6"
              />
              <div>
                <h3 className="text-xl font-bold">{selectedVolunteer.name}</h3>
                <p className="text-gray-600">{selectedVolunteer.email}</p>
                <div className="flex mt-2 space-x-4">
                  <div className="flex items-center">
                    <FiCheckCircle className="text-primary mr-1" />
                    <span>{selectedVolunteer.completedEvents} events completed</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="text-primary mr-1" />
                    <span>{selectedVolunteer.volunteeredHours} hours volunteered</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  Teaching
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  First Aid
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  Computer Skills
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  Event Planning
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Badges</h4>
              <div className="flex space-x-4">
                <div className="flex flex-col items-center">
                  <img src="https://via.placeholder.com/40" alt="Badge" className="mb-1" />
                  <span className="text-xs text-gray-500">First Timer</span>
                </div>
                <div className="flex flex-col items-center">
                  <img src="https://via.placeholder.com/40" alt="Badge" className="mb-1" />
                  <span className="text-xs text-gray-500">Team Player</span>
                </div>
                <div className="flex flex-col items-center">
                  <img src="https://via.placeholder.com/40" alt="Badge" className="mb-1" />
                  <span className="text-xs text-gray-500">Environmental</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Contact Volunteer</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VolunteerApplications;
