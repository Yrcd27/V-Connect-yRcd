import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiFilter } from 'react-icons/fi';
import Table from '../components/Table';
import { FormGroup, Input, TextArea, Select } from '../components/FormElements';
import { LoadingButton, Loading } from '../components/Loading';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';

/**
 * EventManagement component for organizations to create and manage events
 */
const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    requiredVolunteers: '',
    status: 'active'
  });

  useEffect(() => {
    // Fetch events data
    fetchEvents();
  }, [statusFilter, currentPage]);

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
          description: 'Community blood donation campaign',
          location: 'Colombo General Hospital',
          eventDate: '2025-09-15',
          startTime: '09:00:00',
          endTime: '14:00:00',
          requiredVolunteers: 10,
          status: 'active',
          applicationsCount: 5
        },
        {
          eventId: 2,
          title: 'House Building Project',
          description: 'Building homes for flood victims',
          location: 'Ratnapura District',
          eventDate: '2025-09-20',
          startTime: '08:00:00',
          endTime: '17:00:00',
          requiredVolunteers: 20,
          status: 'active',
          applicationsCount: 12
        },
        {
          eventId: 3,
          title: 'Beach Cleanup',
          description: 'Cleaning the beach area and collecting plastic waste',
          location: 'Mount Lavinia Beach',
          eventDate: '2025-08-30',
          startTime: '07:30:00',
          endTime: '11:30:00',
          requiredVolunteers: 15,
          status: 'active',
          applicationsCount: 8
        },
        {
          eventId: 4,
          title: 'Tree Planting Event',
          description: 'Reforestation initiative in urban areas',
          location: 'Viharamahadevi Park',
          eventDate: '2025-10-05',
          startTime: '08:30:00',
          endTime: '12:30:00',
          requiredVolunteers: 25,
          status: 'active',
          applicationsCount: 3
        },
        {
          eventId: 5,
          title: 'Educational Workshop',
          description: 'Teaching basic computer skills to underprivileged children',
          location: 'Community Center, Moratuwa',
          eventDate: '2025-07-15',
          startTime: '10:00:00',
          endTime: '15:00:00',
          requiredVolunteers: 8,
          status: 'completed',
          applicationsCount: 8
        }
      ];

      // Filter events based on status
      const filteredEvents = statusFilter === 'all' 
        ? mockEvents 
        : mockEvents.filter(event => event.status === statusFilter);

      setEvents(filteredEvents);
      setTotalPages(Math.ceil(filteredEvents.length / 10));
      setIsLoading(false);
    }, 800);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm({
      ...eventForm,
      [name]: value
    });
  };

  // Create a new event
  const createEvent = () => {
    // Form validation
    if (!eventForm.title || !eventForm.description || !eventForm.location || 
        !eventForm.eventDate || !eventForm.startTime || !eventForm.requiredVolunteers) {
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCreateModalOpen(false);
      
      // Add new event to list (in real app this would come from API)
      const newEvent = {
        eventId: events.length + 1,
        ...eventForm,
        applicationsCount: 0
      };
      
      setEvents([newEvent, ...events]);
      
      // Reset form
      setEventForm({
        title: '',
        description: '',
        location: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        requiredVolunteers: '',
        status: 'active'
      });
      
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

  // Table columns definition
  const columns = [
    {
      header: 'Event',
      accessor: 'title',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.title}</div>
          <div className="text-sm text-gray-500 flex items-center">
            <FiCalendar className="mr-1" size={14} />
            {formatDate(row.eventDate)}
          </div>
        </div>
      )
    },
    {
      header: 'Location',
      accessor: 'location',
      cell: (row) => (
        <div className="flex items-center">
          <FiMapPin className="mr-1 text-gray-500" />
          {row.location}
        </div>
      )
    },
    {
      header: 'Time',
      accessor: 'startTime',
      cell: (row) => (
        <div className="flex items-center">
          <FiClock className="mr-1 text-gray-500" />
          {formatTime(row.startTime)} - {formatTime(row.endTime)}
        </div>
      )
    },
    {
      header: 'Volunteers',
      accessor: 'requiredVolunteers',
      cell: (row) => (
        <div className="flex items-center">
          <FiUsers className="mr-1 text-gray-500" />
          <span>{row.applicationsCount}/{row.requiredVolunteers}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        let statusClass = '';
        switch(row.status) {
          case 'active':
            statusClass = 'bg-green-50 text-green-700';
            break;
          case 'completed':
            statusClass = 'bg-blue-50 text-blue-700';
            break;
          case 'cancelled':
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
            onClick={() => viewEvent(row)}
            className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90"
          >
            View
          </button>
          <button
            onClick={() => console.log('View applications for event', row.eventId)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            Applications
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600">Create and manage your volunteer events</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Create Event
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <FiFilter className="mr-2 text-gray-500" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'active' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'completed' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'cancelled' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelled
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
          <Table
            columns={columns}
            data={events}
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
          type="data"
          title="No events found"
          message={
            statusFilter === 'all' 
              ? "You haven't created any events yet" 
              : `You don't have any ${statusFilter} events`
          }
          action={{
            label: 'Create Event',
            onClick: () => setIsCreateModalOpen(true)
          }}
        />
      )}

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Event"
        size="large"
      >
        <div className="space-y-4">
          <FormGroup id="title" label="Event Title" required>
            <Input
              id="title"
              name="title"
              value={eventForm.title}
              onChange={handleInputChange}
              placeholder="e.g., Beach Cleanup Event"
              required
            />
          </FormGroup>
          
          <FormGroup id="description" label="Description" required>
            <TextArea
              id="description"
              name="description"
              value={eventForm.description}
              onChange={handleInputChange}
              placeholder="Describe the event, purpose, and what volunteers will be doing"
              rows={4}
              required
            />
          </FormGroup>
          
          <FormGroup id="location" label="Location" required>
            <Input
              id="location"
              name="location"
              value={eventForm.location}
              onChange={handleInputChange}
              placeholder="e.g., Colombo General Hospital"
              required
            />
          </FormGroup>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup id="eventDate" label="Event Date" required>
              <Input
                id="eventDate"
                name="eventDate"
                type="date"
                value={eventForm.eventDate}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <div className="grid grid-cols-2 gap-3">
              <FormGroup id="startTime" label="Start Time" required>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={eventForm.startTime}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup id="endTime" label="End Time">
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={eventForm.endTime}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </div>
          </div>
          
          <FormGroup id="requiredVolunteers" label="Required Volunteers" required>
            <Input
              id="requiredVolunteers"
              name="requiredVolunteers"
              type="number"
              min="1"
              value={eventForm.requiredVolunteers}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          
          <FormGroup id="status" label="Status">
            <Select
              id="status"
              name="status"
              value={eventForm.status}
              onChange={handleInputChange}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'cancelled', label: 'Cancelled' }
              ]}
            />
          </FormGroup>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <LoadingButton
              loading={isSubmitting}
              onClick={createEvent}
              className="px-4 py-2"
              disabled={!eventForm.title || !eventForm.description || !eventForm.location || 
                !eventForm.eventDate || !eventForm.startTime || !eventForm.requiredVolunteers}
            >
              Create Event
            </LoadingButton>
          </div>
        </div>
      </Modal>

      {/* View Event Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedEvent?.title || ''}
      >
        {selectedEvent && (
          <div className="space-y-4">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium">Volunteers</h3>
                <p className="text-gray-700 flex items-center mt-1">
                  <FiUsers className="mr-2 text-gray-500" />
                  {selectedEvent.applicationsCount} / {selectedEvent.requiredVolunteers} applications
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Status</h3>
                <p className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedEvent.status === 'active'
                      ? 'bg-green-50 text-green-700'
                      : selectedEvent.status === 'completed'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  console.log('View applications for', selectedEvent.eventId);
                }}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                View Applications
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventManagement;
