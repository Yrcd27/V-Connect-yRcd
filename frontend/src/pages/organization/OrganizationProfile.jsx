import React, { useState, useEffect } from 'react';
import { FiEdit2, FiMapPin, FiPhone, FiMail, FiCalendar, FiUsers } from 'react-icons/fi';
import { LoadingButton, Loading } from '../components/Loading';
import Modal from '../components/Modal';
import { FormGroup, Input, TextArea } from '../components/FormElements';
import FileUpload from '../components/FileUpload';

/**
 * OrganizationProfile component for organizations to view and update their profile
 */
const OrganizationProfile = () => {
  const [organization, setOrganization] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [orgForm, setOrgForm] = useState({
    name: '',
    description: '',
    address: '',
    contactNumber: '',
    email: '',
    website: '',
    logo: null,
    coverImage: null
  });

  useEffect(() => {
    // Fetch organization profile
    fetchOrganizationProfile();
  }, []);

  // Fetch organization profile from API or mock data
  const fetchOrganizationProfile = () => {
    setIsLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      // Mock organization data
      const mockOrganization = {
        organizationId: 1,
        name: 'Green Earth Lanka',
        description: 'Green Earth Lanka is committed to environmental conservation and sustainable development. We organize tree planting campaigns, beach cleanups, and educational workshops to raise awareness about environmental issues.',
        address: '45 Green Avenue, Colombo 05',
        contactNumber: '+94 11 2345678',
        email: 'info@greenearthlanka.org',
        website: 'www.greenearthlanka.org',
        logo: 'https://via.placeholder.com/150',
        coverImage: 'https://images.unsplash.com/photo-1569370480949-a8ac3ffec1fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        joinedDate: '2022-01-15',
        stats: {
          totalEvents: 24,
          upcomingEvents: 3,
          totalVolunteers: 156,
          totalVolunteerHours: 780
        },
        recentEvents: [
          {
            eventId: 4,
            title: 'Tree Planting Event',
            date: '2025-10-05',
            location: 'Viharamahadevi Park',
            volunteers: 3
          },
          {
            eventId: 6,
            title: 'Environmental Workshop',
            date: '2025-10-12',
            location: 'Colombo Public Library',
            volunteers: 2
          },
          {
            eventId: 8,
            title: 'River Cleanup Campaign',
            date: '2025-11-05',
            location: 'Kelani River',
            volunteers: 0
          }
        ]
      };
      
      setOrganization(mockOrganization);
      setOrgForm({
        name: mockOrganization.name,
        description: mockOrganization.description,
        address: mockOrganization.address,
        contactNumber: mockOrganization.contactNumber,
        email: mockOrganization.email,
        website: mockOrganization.website,
        logo: mockOrganization.logo,
        coverImage: mockOrganization.coverImage
      });
      
      setIsLoading(false);
    }, 800);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrgForm({
      ...orgForm,
      [name]: value
    });
  };

  // Update organization profile
  const updateProfile = () => {
    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      // Update local state
      setOrganization({
        ...organization,
        name: orgForm.name,
        description: orgForm.description,
        address: orgForm.address,
        contactNumber: orgForm.contactNumber,
        email: orgForm.email,
        website: orgForm.website,
        logo: orgForm.logo,
        coverImage: orgForm.coverImage
      });
      
      setIsSubmitting(false);
      setIsEditModalOpen(false);
    }, 1000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6">
      {organization && (
        <>
          {/* Cover Image and Logo */}
          <div className="relative h-60 bg-gray-200 rounded-lg overflow-hidden mb-16">
            <img
              src={organization.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-6 transform translate-y-1/2">
              <div className="relative">
                <img
                  src={organization.logo}
                  alt={organization.name}
                  className="w-24 h-24 rounded-lg border-4 border-white bg-white"
                />
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1.5 shadow-sm hover:bg-primary/90"
                >
                  <FiEdit2 size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Organization Name and Description */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
                <p className="text-gray-600 mt-1">
                  Member since {formatDate(organization.joinedDate)}
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Edit Profile
              </button>
            </div>
            <p className="mt-4 text-gray-700">{organization.description}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-2 mr-3">
                  <FiCalendar className="text-primary" size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Events</p>
                  <p className="text-xl font-semibold">{organization.stats.totalEvents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-2 mr-3">
                  <FiCalendar className="text-primary" size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Upcoming Events</p>
                  <p className="text-xl font-semibold">{organization.stats.upcomingEvents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-2 mr-3">
                  <FiUsers className="text-primary" size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Volunteers</p>
                  <p className="text-xl font-semibold">{organization.stats.totalVolunteers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-2 mr-3">
                  <FiUsers className="text-primary" size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Volunteer Hours</p>
                  <p className="text-xl font-semibold">{organization.stats.totalVolunteerHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <FiMapPin className="mt-1 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{organization.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiPhone className="mt-1 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{organization.contactNumber}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiMail className="mt-1 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{organization.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="mt-1 mr-3 text-gray-500" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <a 
                    href={`https://${organization.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-medium text-primary hover:underline"
                  >
                    {organization.website}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upcoming Events</h2>
              <button className="text-sm text-primary hover:underline">
                View all events
              </button>
            </div>
            <div className="divide-y">
              {organization.recentEvents.map((event) => (
                <div key={event.eventId} className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FiMapPin className="mr-1" size={14} />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{formatDate(event.date)}</p>
                      <p className="text-sm text-gray-500">
                        {event.volunteers} / ? volunteers
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Organization Profile"
        size="large"
      >
        <div className="space-y-4">
          <FormGroup id="coverImage" label="Cover Image">
            <FileUpload
              id="coverImage"
              currentImage={orgForm.coverImage}
              onChange={(file) => setOrgForm({ ...orgForm, coverImage: file })}
            />
          </FormGroup>
          
          <FormGroup id="logo" label="Organization Logo">
            <FileUpload
              id="logo"
              currentImage={orgForm.logo}
              onChange={(file) => setOrgForm({ ...orgForm, logo: file })}
              isSquare={true}
            />
          </FormGroup>
          
          <FormGroup id="name" label="Organization Name" required>
            <Input
              id="name"
              name="name"
              value={orgForm.name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          
          <FormGroup id="description" label="Description" required>
            <TextArea
              id="description"
              name="description"
              value={orgForm.description}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </FormGroup>
          
          <FormGroup id="address" label="Address" required>
            <TextArea
              id="address"
              name="address"
              value={orgForm.address}
              onChange={handleInputChange}
              rows={2}
              required
            />
          </FormGroup>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup id="contactNumber" label="Contact Number" required>
              <Input
                id="contactNumber"
                name="contactNumber"
                value={orgForm.contactNumber}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup id="email" label="Email" required>
              <Input
                id="email"
                name="email"
                type="email"
                value={orgForm.email}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </div>
          
          <FormGroup id="website" label="Website">
            <Input
              id="website"
              name="website"
              value={orgForm.website}
              onChange={handleInputChange}
              placeholder="www.example.com"
            />
          </FormGroup>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <LoadingButton
              loading={isSubmitting}
              onClick={updateProfile}
              className="px-4 py-2"
            >
              Save Changes
            </LoadingButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrganizationProfile;
