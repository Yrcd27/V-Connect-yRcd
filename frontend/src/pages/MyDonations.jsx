import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlusCircle, FiCalendar, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed, closed

  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        // Fetch organization's donations
        const response = await fetch('http://localhost:9005/api/org/my-donations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch donation campaigns');
        }
        
        const data = await response.json();
        setDonations(data.data || []);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError(err.message || 'Something went wrong');
        // Use fallback data for demonstration
        setDonations(fallbackDonations);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDonations();
  }, []);

  // Fallback data for testing
  const fallbackDonations = [
    {
      request_id: 1,
      title: 'Clean Water Initiative',
      description: 'Help us provide clean water to rural communities by funding water purification systems.',
      target_amount: 5000.00,
      current_amount: 2500.00,
      created_at: '2025-08-01',
      status: 'active',
      donors_count: 15
    },
    {
      request_id: 2,
      title: 'School Supplies Drive',
      description: 'Support children in need with essential school supplies for the upcoming school year.',
      target_amount: 3000.00,
      current_amount: 3000.00,
      created_at: '2025-07-15',
      status: 'completed',
      donors_count: 32
    },
    {
      request_id: 3,
      title: 'Community Garden Project',
      description: 'Help us build a community garden to provide fresh produce for local families.',
      target_amount: 7500.00,
      current_amount: 1200.00,
      created_at: '2025-08-10',
      status: 'active',
      donors_count: 8
    }
  ];

  // Filter donations based on status
  const filteredDonations = donations.filter(donation => {
    if (filter === 'all') return true;
    return donation.status === filter;
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <DashboardLayout userType="organization">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Donation Campaigns</h1>
          <p className="text-gray-600">Manage your organization's fundraising campaigns.</p>
        </div>
        <Link
          to="/create-donation"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center"
        >
          <FiPlusCircle className="mr-2" /> New Campaign
        </Link>
      </div>
      
      {/* Filter tabs */}
      <div className="flex mb-6 space-x-2 overflow-x-auto pb-2">
        <button 
          className={`px-4 py-2 rounded-md whitespace-nowrap ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          onClick={() => setFilter('all')}
        >
          All Campaigns
        </button>
        <button 
          className={`px-4 py-2 rounded-md whitespace-nowrap ${filter === 'active' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={`px-4 py-2 rounded-md whitespace-nowrap ${filter === 'completed' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button 
          className={`px-4 py-2 rounded-md whitespace-nowrap ${filter === 'closed' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          onClick={() => setFilter('closed')}
        >
          Closed
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Loading campaigns...</p>
        </div>
      ) : error && donations.length === 0 ? (
        <div className="bg-red-50 p-4 rounded-lg mb-6 flex items-center">
          <FiAlertCircle className="text-red-500 mr-2" />
          <p className="text-red-600">{error}</p>
        </div>
      ) : filteredDonations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <div className="mb-4 text-gray-400">
            <FiDollarSign size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No campaigns found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' ? 
              "You haven't created any donation campaigns yet." : 
              `You don't have any ${filter} campaigns.`}
          </p>
          <Link
            to="/create-donation"
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 inline-block"
          >
            Create Your First Campaign
          </Link>
        </div>
      ) : (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredDonations.map(donation => (
            <motion.div 
              key={donation.request_id} 
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{donation.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{donation.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm 
                  ${donation.status === 'active' ? 'bg-green-100 text-green-800' : 
                    donation.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                </span>
              </div>
              
              <div className="mt-4 mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>
                    {formatCurrency(donation.current_amount || 0)} of {formatCurrency(donation.target_amount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`${
                      donation.status === 'completed' ? 'bg-blue-500' : 'bg-primary'
                    } h-2.5 rounded-full`}
                    style={{ width: `${Math.min(((donation.current_amount || 0) / donation.target_amount) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{Math.round(((donation.current_amount || 0) / donation.target_amount) * 100)}% Complete</span>
                  <span>{donation.donors_count || 0} Donors</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <FiCalendar className="mr-2" />
                  <span>Created on {formatDate(donation.created_at)}</span>
                </div>
                <div className="space-x-3">
                  <Link
                    to={`/donation-details/${donation.request_id}`}
                    className="text-primary hover:underline"
                  >
                    View Details
                  </Link>
                  {donation.status === 'active' && (
                    <Link
                      to={`/edit-donation/${donation.request_id}`}
                      className="text-gray-600 hover:underline"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default MyDonations;
