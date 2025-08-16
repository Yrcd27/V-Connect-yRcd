import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';

const CreateDonation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: '',
    contact_info: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Make sure the target amount is a valid number
      const targetAmount = parseFloat(formData.target_amount);
      if (isNaN(targetAmount) || targetAmount <= 0) {
        throw new Error('Please enter a valid target amount');
      }
      
      // Prepare data for API
      const donationData = {
        title: formData.title,
        description: formData.description,
        target_amount: targetAmount,
        contact_info: formData.contact_info,
      };
      
      // Submit donation request to API
      const response = await fetch('http://localhost:9005/api/org/donation-requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donationData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create donation request');
      }
      
      // On success, navigate to the organization profile or donations list
      navigate('/my-donations');
      
    } catch (err) {
      console.error('Error creating donation request:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout userType="organization">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Create Donation Campaign</h1>
          <p className="text-gray-600">Start a new fundraising campaign for your organization.</p>
        </div>
        
        {error && (
          <div className="bg-red-50 p-4 rounded-lg mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Campaign Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Clean Water Initiative"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="target_amount" className="block text-gray-700 font-medium mb-2">
                Target Amount (USD) *
              </label>
              <input
                type="number"
                id="target_amount"
                name="target_amount"
                value={formData.target_amount}
                onChange={handleChange}
                placeholder="5000"
                min="1"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain what the funds will be used for and why they are needed..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label htmlFor="contact_info" className="block text-gray-700 font-medium mb-2">
                Contact Information
              </label>
              <textarea
                id="contact_info"
                name="contact_info"
                value={formData.contact_info}
                onChange={handleChange}
                placeholder="Provide contact information for donation inquiries"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                Include email, phone, or other ways donors can contact you with questions.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/organization-profile')}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center justify-center min-w-[120px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : 'Create Campaign'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default CreateDonation;
