import React, { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiClock, FiAward, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import { Loading } from '../components/Loading';

/**
 * AdminDashboard component for displaying volunteer management analytics
 */
const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // week, month, year, all

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  // Fetch dashboard data from API or mock data
  const fetchDashboardData = () => {
    setIsLoading(true);
    
    // In a real app, this would be an API call with the time range
    setTimeout(() => {
      // Mock dashboard data
      const mockData = {
        stats: {
          totalVolunteers: 245,
          activeVolunteers: 178,
          totalEvents: 37,
          upcomingEvents: 12,
          totalHours: 1875,
          totalBadges: 523
        },
        recentEvents: [
          {
            eventId: 1,
            title: 'Blood Donation Drive',
            date: '2025-09-15',
            volunteers: 5,
            organization: 'Red Cross Sri Lanka'
          },
          {
            eventId: 2,
            title: 'House Building Project',
            date: '2025-09-20',
            volunteers: 12,
            organization: 'Habitat for Humanity SL'
          },
          {
            eventId: 3,
            title: 'Beach Cleanup',
            date: '2025-08-30',
            volunteers: 8,
            organization: 'Ocean Care Initiative'
          }
        ],
        topVolunteers: [
          {
            volunteerId: 1,
            name: 'Saman Perera',
            hours: 78,
            events: 12,
            profileImage: 'https://randomuser.me/api/portraits/men/43.jpg'
          },
          {
            volunteerId: 3,
            name: 'Amal Fernando',
            hours: 67,
            events: 9,
            profileImage: 'https://randomuser.me/api/portraits/men/22.jpg'
          },
          {
            volunteerId: 5,
            name: 'Priya Mendis',
            hours: 54,
            events: 7,
            profileImage: 'https://randomuser.me/api/portraits/women/45.jpg'
          },
          {
            volunteerId: 2,
            name: 'Kumari Silva',
            hours: 42,
            events: 6,
            profileImage: 'https://randomuser.me/api/portraits/women/33.jpg'
          },
          {
            volunteerId: 4,
            name: 'Nimal Gunawardena',
            hours: 38,
            events: 5,
            profileImage: 'https://randomuser.me/api/portraits/men/54.jpg'
          }
        ],
        popularSkills: [
          { name: 'Teaching', count: 87 },
          { name: 'Environmental Conservation', count: 75 },
          { name: 'First Aid', count: 62 },
          { name: 'Computer Skills', count: 58 },
          { name: 'Event Planning', count: 45 }
        ],
        monthlyActivity: [
          { month: 'Jan', volunteers: 45, hours: 270 },
          { month: 'Feb', volunteers: 52, hours: 312 },
          { month: 'Mar', volunteers: 58, hours: 348 },
          { month: 'Apr', volunteers: 63, hours: 378 },
          { month: 'May', volunteers: 70, hours: 420 },
          { month: 'Jun', volunteers: 75, hours: 450 }
        ]
      };
      
      setDashboardData(mockData);
      setIsLoading(false);
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of volunteer activity and impact</p>
      </div>

      {dashboardData && (
        <>
          {/* Time Range Filter */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-4">Time Range:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTimeRange('week')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    timeRange === 'week' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    timeRange === 'month' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setTimeRange('year')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    timeRange === 'year' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Year
                </button>
                <button
                  onClick={() => setTimeRange('all')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    timeRange === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Time
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-3 mr-4">
                  <FiUsers className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Volunteers</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.totalVolunteers}</h3>
                  <p className="text-sm text-primary">
                    {dashboardData.stats.activeVolunteers} active volunteers
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-3 mr-4">
                  <FiCalendar className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Events</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.totalEvents}</h3>
                  <p className="text-sm text-primary">
                    {dashboardData.stats.upcomingEvents} upcoming events
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-3 mr-4">
                  <FiClock className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Volunteer Hours</p>
                  <h3 className="text-2xl font-bold">{dashboardData.stats.totalHours}</h3>
                  <p className="text-sm text-primary">
                    Avg. {Math.round(dashboardData.stats.totalHours / dashboardData.stats.activeVolunteers)} hours per volunteer
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly Activity Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Monthly Volunteer Activity</h2>
              <div className="h-64">
                <div className="flex items-end h-48 space-x-4">
                  {dashboardData.monthlyActivity.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col items-center space-y-2">
                        <div 
                          className="w-6 bg-blue-500 rounded-t"
                          style={{ height: `${month.volunteers / 1.2}px` }}
                          title={`${month.volunteers} volunteers`}
                        ></div>
                        <div 
                          className="w-6 bg-primary rounded-t"
                          style={{ height: `${month.hours / 8}px` }}
                          title={`${month.hours} hours`}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{month.month}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <div className="flex items-center mr-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-500">Volunteers</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                    <span className="text-xs text-gray-500">Hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Skills Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Popular Skills</h2>
              <div className="space-y-4">
                {dashboardData.popularSkills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill.name}</span>
                      <span>{skill.count} volunteers</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${(skill.count / dashboardData.stats.totalVolunteers) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Events */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Events</h2>
                <button className="text-sm text-primary hover:underline">
                  View all
                </button>
              </div>
              <div className="divide-y">
                {dashboardData.recentEvents.map((event) => (
                  <div key={event.eventId} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-500">{event.organization}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{formatDate(event.date)}</p>
                        <p className="text-sm text-gray-500">{event.volunteers} volunteers</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Volunteers */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Top Volunteers</h2>
                <button className="text-sm text-primary hover:underline">
                  View all
                </button>
              </div>
              <div className="divide-y">
                {dashboardData.topVolunteers.map((volunteer) => (
                  <div key={volunteer.volunteerId} className="py-3 flex items-center">
                    <img
                      src={volunteer.profileImage}
                      alt={volunteer.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{volunteer.name}</h4>
                      <p className="text-sm text-gray-500">{volunteer.events} events</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{volunteer.hours} hours</p>
                      <p className="text-sm text-gray-500">total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
