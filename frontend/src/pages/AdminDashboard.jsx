import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiGlobe, FiFlag, FiBriefcase, FiAlertCircle, FiCheck, FiX, FiSearch } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    totalOrganizations: 0,
    totalEvents: 0,
    pendingOrganizations: 0
  });
  const [organizations, setOrganizations] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        
        // Fetch admin dashboard data
        const statsResponse = await fetch('http://localhost:9006/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const statsData = await statsResponse.json();
        setStats(statsData);
        
        // Fetch pending organization approvals
        const organizationsResponse = await fetch('http://localhost:9006/api/admin/organizations?status=pending', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!organizationsResponse.ok) {
          throw new Error('Failed to fetch organizations');
        }
        
        const organizationsData = await organizationsResponse.json();
        setOrganizations(organizationsData);
        
        // Fetch user reports
        const reportsResponse = await fetch('http://localhost:9006/api/admin/reports', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!reportsResponse.ok) {
          throw new Error('Failed to fetch reports');
        }
        
        const reportsData = await reportsResponse.json();
        setReports(reportsData);
        
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);

  // Handle organization approval
  const handleApproveOrganization = async (orgId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:9006/api/admin/organizations/${orgId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve organization');
      }
      
      // Update organizations list to reflect approval
      setOrganizations(organizations.filter(org => org.organization_id !== orgId));
      
      // Update stats
      setStats({
        ...stats,
        pendingOrganizations: stats.pendingOrganizations - 1,
        totalOrganizations: stats.totalOrganizations + 1
      });
      
      alert('Organization approved successfully!');
      
    } catch (err) {
      alert(err.message || 'Something went wrong');
    }
  };

  // Handle organization rejection
  const handleRejectOrganization = async (orgId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:9006/api/admin/organizations/${orgId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject organization');
      }
      
      // Update organizations list to reflect rejection
      setOrganizations(organizations.filter(org => org.organization_id !== orgId));
      
      // Update stats
      setStats({
        ...stats,
        pendingOrganizations: stats.pendingOrganizations - 1
      });
      
      alert('Organization rejected successfully!');
      
    } catch (err) {
      alert(err.message || 'Something went wrong');
    }
  };

  // Handle report resolution
  const handleResolveReport = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:9006/api/admin/reports/${reportId}/resolve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to resolve report');
      }
      
      // Update reports list to reflect resolution
      setReports(reports.map(report => {
        if (report.report_id === reportId) {
          return { ...report, status: 'resolved' };
        }
        return report;
      }));
      
      alert('Report marked as resolved!');
      
    } catch (err) {
      alert(err.message || 'Something went wrong');
    }
  };
  
  // Filter organizations based on search term
  const filteredOrganizations = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <DashboardLayout userType="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor and manage platform activities</p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Loading admin data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-600 mb-6">
          <FiAlertCircle className="mr-2" />
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Volunteers</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalVolunteers}</h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <FiUsers className="text-xl text-primary" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Organizations</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalOrganizations}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FiBriefcase className="text-xl text-blue-600" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Events</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalEvents}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FiGlobe className="text-xl text-green-600" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pending Organizations</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.pendingOrganizations}</h3>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FiFlag className="text-xl text-yellow-600" />
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Organization Approvals Section */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Pending Organization Approvals</h2>
              <Link to="/admin/organizations" className="text-primary hover:underline text-sm">
                View all organizations
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              {organizations.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-600">No pending organization approvals.</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search organizations..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Organization
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Registration Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrganizations.map((org) => (
                          <tr key={org.organization_id}>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                  {org.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{org.name}</div>
                                  <div className="text-sm text-gray-500">{org.type}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{org.email}</div>
                              <div className="text-sm text-gray-500">{org.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(org.registration_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleApproveOrganization(org.organization_id)}
                                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors flex items-center text-sm"
                                >
                                  <FiCheck className="mr-1" /> Approve
                                </button>
                                <button
                                  onClick={() => handleRejectOrganization(org.organization_id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors flex items-center text-sm"
                                >
                                  <FiX className="mr-1" /> Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Reports Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Reports</h2>
              <Link to="/admin/reports" className="text-primary hover:underline text-sm">
                View all reports
              </Link>
            </div>
            
            {reports.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
                <p className="text-gray-600">No pending reports to review.</p>
              </div>
            ) : (
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {reports
                  .filter(report => report.status !== 'resolved')
                  .slice(0, 5)
                  .map((report) => (
                    <motion.div 
                      key={report.report_id} 
                      className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                      variants={itemVariants}
                    >
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="text-xs px-2 py-1 rounded mr-2 bg-red-100 text-red-700">
                              {report.type}
                            </span>
                            <span className="text-sm text-gray-500">
                              Reported on {formatDate(report.report_date)}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium mb-2">
                            Report against {report.reported_type}: {report.reported_name}
                          </h3>
                          <p className="text-gray-700 mb-4">{report.description}</p>
                          <div className="flex space-x-4">
                            <div>
                              <span className="text-sm text-gray-500">Reported by:</span>
                              <div className="flex items-center mt-1">
                                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                  {report.reporter_name.charAt(0).toUpperCase()}
                                </div>
                                <span className="ml-2 text-sm">{report.reporter_name}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-6 flex flex-col space-y-2">
                          <button
                            onClick={() => handleResolveReport(report.report_id)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors flex items-center text-sm"
                          >
                            <FiCheck className="mr-1" /> Mark Resolved
                          </button>
                          <Link
                            to={`/admin/reports/${report.report_id}`}
                            className="text-center bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors text-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
