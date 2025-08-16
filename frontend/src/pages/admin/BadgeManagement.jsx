import React, { useState } from 'react';
import { FiAward, FiCheck, FiSearch } from 'react-icons/fi';
import Table from '../components/Table';
import { FormGroup, Input, TextArea } from '../components/FormElements';
import { LoadingButton } from '../components/Loading';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { motion } from 'framer-motion';

/**
 * BadgeManagement component for administrators to award badges to volunteers
 */
const BadgeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [badgeForm, setBadgeForm] = useState({
    badgeName: '',
    badgeDescription: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock data for demonstration
  const badgeOptions = [
    { id: 1, name: 'First Event', description: 'Awarded for completing first volunteer event' },
    { id: 2, name: 'Dedicated Helper', description: 'Awarded for volunteering more than 50 hours' },
    { id: 3, name: 'Community Champion', description: 'Awarded for exceptional service to the community' },
    { id: 4, name: 'Team Leader', description: 'Awarded for leadership in volunteer events' }
  ];

  // Search for volunteers
  const handleSearch = () => {
    if (!searchTerm) return;
    
    setIsLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      // Mock search results
      const results = [
        {
          id: '2',
          name: 'John Volunteer',
          email: 'volunteer@example.com',
          skills: 'Teaching, Mentoring, Event Planning',
          hours: 85,
          badges: 2
        },
        {
          id: '4',
          name: 'Sarah Thompson',
          email: 'sarah@example.com',
          skills: 'Teaching, Counseling, Leadership',
          hours: 42,
          badges: 1
        }
      ].filter(v => 
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        v.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setVolunteers(results);
      setIsLoading(false);
    }, 800);
  };

  // Open the modal to award a badge
  const openAwardModal = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBadgeForm({
      ...badgeForm,
      [name]: value
    });
  };

  // Award a badge to the selected volunteer
  const awardBadge = () => {
    if (!badgeForm.badgeName) return;
    
    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setSuccessMessage(`Badge "${badgeForm.badgeName}" successfully awarded to ${selectedVolunteer.name}`);
      
      // Reset form
      setBadgeForm({
        badgeName: '',
        badgeDescription: ''
      });
      
      // Auto-dismiss success message
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }, 1000);
  };

  // Table columns definition
  const columns = [
    {
      header: 'Volunteer',
      accessor: 'name',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      header: 'Skills',
      accessor: 'skills',
    },
    {
      header: 'Hours',
      accessor: 'hours',
      cell: (row) => (
        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
          {row.hours} hours
        </span>
      )
    },
    {
      header: 'Current Badges',
      accessor: 'badges',
      cell: (row) => (
        <span className="flex items-center">
          <FiAward className="mr-1 text-yellow-500" />
          {row.badges}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <button
          onClick={() => openAwardModal(row)}
          className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90"
        >
          Award Badge
        </button>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Badge Management</h1>
        <p className="text-gray-600">Award badges to recognize volunteer achievements</p>
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center"
        >
          <FiCheck className="mr-2" />
          {successMessage}
        </motion.div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <FormGroup id="searchTerm" label="Search Volunteers">
              <div className="flex">
                <Input
                  id="searchTerm"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-r-none"
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchTerm}
                  className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary/90 disabled:bg-primary/50"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                  {!isLoading && <FiSearch className="ml-2 inline" />}
                </button>
              </div>
            </FormGroup>
          </div>
        </div>
      </div>

      {volunteers.length > 0 ? (
        <Table
          columns={columns}
          data={volunteers}
          isLoading={isLoading}
        />
      ) : (
        <EmptyState
          type="data"
          title="No volunteers found"
          message="Search for volunteers to award badges"
        />
      )}

      {/* Badge Award Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Award Badge"
        type="info"
      >
        {selectedVolunteer && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <h3 className="font-medium">Awarding badge to:</h3>
              <p className="text-gray-700">{selectedVolunteer.name}</p>
              <p className="text-sm text-gray-500">{selectedVolunteer.email}</p>
            </div>
            
            <FormGroup id="badgeName" label="Badge Name" required>
              <select
                id="badgeName"
                name="badgeName"
                value={badgeForm.badgeName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select a badge</option>
                {badgeOptions.map(badge => (
                  <option key={badge.id} value={badge.name}>
                    {badge.name}
                  </option>
                ))}
              </select>
            </FormGroup>
            
            {badgeForm.badgeName && (
              <FormGroup id="badgeDescription" label="Badge Description">
                <TextArea
                  id="badgeDescription"
                  name="badgeDescription"
                  value={badgeForm.badgeDescription || badgeOptions.find(b => b.name === badgeForm.badgeName)?.description || ''}
                  onChange={handleInputChange}
                  placeholder="Enter a description for this badge"
                  rows={3}
                />
              </FormGroup>
            )}
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <LoadingButton
                loading={isSubmitting}
                disabled={!badgeForm.badgeName}
                onClick={awardBadge}
                className="px-4 py-2"
              >
                Award Badge
              </LoadingButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BadgeManagement;
