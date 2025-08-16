import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiDollarSign, FiUser, FiTarget, FiEdit, FiCheckCircle } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';

const DonationDetails = () => {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [donationStats, setDonationStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const fetchDonationDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        // Get user type from localStorage to determine the layout
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserType(user.user_type || 'volunteer');
        
        // Fetch donation details
        const detailsResponse = await fetch(`http://localhost:9005/api/donations/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!detailsResponse.ok) {
          throw new Error('Failed to fetch donation details');
        }
        
        const detailsData = await detailsResponse.json();
        
        // Fetch donation statistics
        const statsResponse = await fetch(`http://localhost:9005/api/donations/${id}/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        let statsData = {};
        if (statsResponse.ok) {
          statsData = await statsResponse.json();
        }
        
        setDonation(detailsData.data);
        setDonationStats(statsData.data);
      } catch (err) {
        console.error('Error fetching donation details:', err);
        setError(err.message || 'Something went wrong');
        
        // Use fallback data for demonstration
        setDonation(fallbackDonation);
        setDonationStats(fallbackStats);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDonationDetails();
  }, [id]);

  // Fallback data for testing
  const fallbackDonation = {
    request_id: parseInt(id),
    title: 'Clean Water Initiative',
    description: 'Help us provide clean water to rural communities by funding water purification systems. Access to clean water is a basic human right, yet millions of people worldwide lack this essential resource. Your contribution will help install water filters and build wells in communities that currently rely on contaminated water sources. This will significantly reduce waterborne diseases and improve overall health outcomes in these areas.\n\nOur team works directly with local communities to ensure that solutions are sustainable and appropriate for their specific needs. We provide training on maintenance and empower communities to manage their own water resources in the long term.',
    target_amount: 5000.00,
    current_amount: 2500.00,
    created_at: '2025-08-01',
    status: 'active',
    organization_id: 3,
    organization_name: 'Lio',
    contact_info: 'donations@lio.org or call 555-123-4567'
  };
  
  const fallbackStats = {
    donors_count: 15,
    recent_donors: [
      { name: 'Anonymous', amount: 100, date: '2025-08-15' },
      { name: 'John Smith', amount: 250, date: '2025-08-10' },
      { name: 'Sarah Johnson', amount: 50, date: '2025-08-05' }
    ],
    donation_timeline: [
      { date: '2025-08-01', total: 500 },
      { date: '2025-08-05', total: 1200 },
      { date: '2025-08-10', total: 1800 },
      { date: '2025-08-15', total: 2500 }
    ]
  };

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

  const handleCloseCampaign = async () => {
    if (!confirm('Are you sure you want to close this donation campaign?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`http://localhost:9005/api/org/donations/${id}/close`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to close campaign');
      }
      
      // Update the status in the UI
      setDonation({
        ...donation,
        status: 'closed'
      });
      
    } catch (err) {
      console.error('Error closing campaign:', err);
      alert(err.message || 'Something went wrong');
    }
  };
  
  const handleCompleteCampaign = async () => {
    if (!confirm('Are you sure you want to mark this donation campaign as completed?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`http://localhost:9005/api/org/donations/${id}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete campaign');
      }
      
      // Update the status in the UI
      setDonation({
        ...donation,
        status: 'completed'
      });
      
    } catch (err) {
      console.error('Error completing campaign:', err);
      alert(err.message || 'Something went wrong');
    }
  };

  return (
    <DashboardLayout userType={userType}>
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Donation Campaign Details</h1>
          <p className="text-gray-600">View details and progress of this fundraising campaign.</p>
        </div>
        <Link to={userType === 'organization' ? '/my-donations' : '/donations'} className="text-primary hover:underline">
          ← Back to {userType === 'organization' ? 'My Campaigns' : 'All Donations'}
        </Link>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Loading campaign details...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      ) : donation ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Campaign Info */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Campaign Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                <h2 className="text-2xl font-semibold">{donation.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm 
                  ${donation.status === 'active' ? 'bg-green-100 text-green-800' : 
                    donation.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <FiCalendar className="mr-2" />
                <span>Campaign started on {formatDate(donation.created_at)}</span>
              </div>
              
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold">Progress</span>
                  <span className="font-semibold">
                    {formatCurrency(donation.current_amount || 0)} raised of {formatCurrency(donation.target_amount)} goal
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`${
                      donation.status === 'completed' ? 'bg-blue-500' : 'bg-primary'
                    } h-4 rounded-full`}
                    style={{ width: `${Math.min(((donation.current_amount || 0) / donation.target_amount) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{Math.round(((donation.current_amount || 0) / donation.target_amount) * 100)}% Complete</span>
                  <span>{donationStats?.donors_count || 0} Donors</span>
                </div>
              </div>
              
              {/* Organization info */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Campaign by:</h3>
                <Link to={`/organization/${donation.organization_id}`} className="text-primary hover:underline">
                  {donation.organization_name}
                </Link>
              </div>
            </div>
            
            {/* Campaign Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">About this campaign</h3>
              <div className="prose max-w-none">
                {donation.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
            
            {/* Contact Information */}
            {donation.contact_info && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <p>{donation.contact_info}</p>
              </div>
            )}
          </motion.div>
          
          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Action Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              {userType === 'organization' && donation.status === 'active' ? (
                <>
                  <h3 className="text-lg font-semibold mb-4">Campaign Management</h3>
                  <div className="space-y-3">
                    <Link 
                      to={`/edit-donation/${donation.request_id}`}
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 flex items-center justify-center w-full"
                    >
                      <FiEdit className="mr-2" /> Edit Campaign
                    </Link>
                    <button 
                      onClick={handleCompleteCampaign}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center w-full"
                    >
                      <FiCheckCircle className="mr-2" /> Mark as Completed
                    </button>
                    <button 
                      onClick={handleCloseCampaign}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center justify-center w-full"
                    >
                      Close Campaign
                    </button>
                  </div>
                </>
              ) : userType === 'volunteer' || userType === 'admin' ? (
                <>
                  <h3 className="text-lg font-semibold mb-4">Support This Campaign</h3>
                  {donation.status === 'active' ? (
                    <Link 
                      to={`/donate/${donation.request_id}`}
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 flex items-center justify-center w-full"
                    >
                      <FiDollarSign className="mr-2" /> Donate Now
                    </Link>
                  ) : (
                    <p className="text-center text-gray-500 py-2">
                      This campaign is no longer accepting donations
                    </p>
                  )}
                </>
              ) : null}
            </div>
            
            {/* Campaign Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">Campaign Stats</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-primary mb-2">
                    <FiDollarSign size={24} className="mx-auto" />
                  </div>
                  <div className="text-2xl font-bold">{formatCurrency(donation.current_amount || 0)}</div>
                  <div className="text-sm text-gray-500">Raised So Far</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-primary mb-2">
                    <FiUser size={24} className="mx-auto" />
                  </div>
                  <div className="text-2xl font-bold">{donationStats?.donors_count || 0}</div>
                  <div className="text-sm text-gray-500">Total Donors</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-primary mb-2">
                    <FiTarget size={24} className="mx-auto" />
                  </div>
                  <div className="text-2xl font-bold">{formatCurrency(donation.target_amount)}</div>
                  <div className="text-sm text-gray-500">Goal Amount</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-primary mb-2">
                    <FiCalendar size={24} className="mx-auto" />
                  </div>
                  <div className="text-2xl font-bold">
                    {Math.ceil((new Date() - new Date(donation.created_at)) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-gray-500">Days Running</div>
                </div>
              </div>
            </div>
            
            {/* Recent Donors */}
            {donationStats?.recent_donors && donationStats.recent_donors.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Donors</h3>
                
                <div className="space-y-4">
                  {donationStats.recent_donors.map((donor, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          <FiUser className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{donor.name}</p>
                          <p className="text-xs text-gray-500">{formatDate(donor.date)}</p>
                        </div>
                      </div>
                      <div className="font-semibold">{formatCurrency(donor.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">Donation campaign not found.</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DonationDetails;
