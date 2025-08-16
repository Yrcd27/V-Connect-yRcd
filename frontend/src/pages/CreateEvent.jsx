import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiAlertCircle, FiInfo } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    is_private: false,
    required_volunteers: 1,
    skills_required: '',
    duration: '',
    additional_info: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:9001/api/org/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      
      const data = await response.json();
      
      alert('Event created successfully!');
      navigate(`/event-details/${data.event_id}`);
      
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout userType="organization">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Create New Event</h1>
        <p className="text-gray-600">Create a new volunteer opportunity for your organization</p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-lg flex items-center text-red-600">
          <FiAlertCircle className="mr-2" />
          <p>{error}</p>
        </div>
      )}
      
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Title */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Event Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter event title"
              />
            </div>
            
            {/* Event Description */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Event Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Describe the volunteer opportunity, expectations, and impact"
              ></textarea>
            </div>
            
            {/* Date and Time */}
            <div>
              <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-1">
                <FiCalendar className="inline mr-1" /> Event Date*
              </label>
              <input
                type="date"
                id="event_date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                <FiClock className="inline mr-1" /> Duration*
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g., 2 hours, All day, etc."
              />
            </div>
            
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                <FiMapPin className="inline mr-1" /> Location*
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Event location"
              />
            </div>
            
            {/* Required Volunteers */}
            <div>
              <label htmlFor="required_volunteers" className="block text-sm font-medium text-gray-700 mb-1">
                <FiUsers className="inline mr-1" /> Number of Volunteers Needed*
              </label>
              <input
                type="number"
                id="required_volunteers"
                name="required_volunteers"
                value={formData.required_volunteers}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            {/* Skills Required */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="skills_required" className="block text-sm font-medium text-gray-700 mb-1">
                Skills Required
              </label>
              <input
                type="text"
                id="skills_required"
                name="skills_required"
                value={formData.skills_required}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g., First aid, teaching, cooking (comma separated)"
              />
            </div>
            
            {/* Additional Information */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="additional_info" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information
              </label>
              <textarea
                id="additional_info"
                name="additional_info"
                value={formData.additional_info}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Any additional details volunteers should know"
              ></textarea>
            </div>
            
            {/* Private Event Toggle */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_private"
                  name="is_private"
                  checked={formData.is_private}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="is_private" className="ml-2 block text-sm text-gray-700">
                  Private Event (Only visible to your volunteers)
                </label>
              </div>
            </div>
            
            {/* Note */}
            <div className="col-span-1 md:col-span-2 bg-blue-50 p-4 rounded-md">
              <div className="flex">
                <FiInfo className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Public events will be visible to all volunteers on the platform. Private events will only be visible to volunteers who have already joined your organization.
                </p>
              </div>
            </div>
            
            {/* Submit Buttons */}
            <div className="col-span-1 md:col-span-2 flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

export default CreateEvent;
