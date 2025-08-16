/**
 * Mock data for V-Connect Frontend
 * 
 * This file provides mock data for the frontend to use during development
 * without needing a backend server.
 */

// Mock Users
const users = [
  {
    id: '1',
    email: 'admin@vconnect.org',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2023-01-15T08:00:00Z'
  },
  {
    id: '2',
    email: 'volunteer@example.com',
    name: 'John Volunteer',
    role: 'volunteer',
    createdAt: '2023-01-20T10:30:00Z'
  },
  {
    id: '3',
    email: 'org@example.com',
    name: 'Help Foundation',
    role: 'organization',
    createdAt: '2023-01-10T09:15:00Z'
  }
];

// Mock Volunteers
const volunteers = [
  {
    id: '2',
    userId: '2',
    name: 'John Volunteer',
    bio: 'Passionate about helping others and making a difference.',
    skills: ['Teaching', 'Mentoring', 'Event Planning'],
    availability: 'Weekends',
    location: 'New York, NY',
    profileImage: 'https://randomuser.me/api/portraits/men/42.jpg',
    contactEmail: 'volunteer@example.com',
    phone: '555-123-4567',
    volunteerHours: 85,
    joinDate: '2023-01-20T10:30:00Z',
    badges: [
      {
        id: '1',
        name: 'First Event',
        description: 'Completed first volunteer event',
        awardedDate: '2023-02-15T14:30:00Z'
      },
      {
        id: '2',
        name: 'Dedicated Helper',
        description: 'Volunteered for more than 50 hours',
        awardedDate: '2023-05-20T11:15:00Z'
      }
    ]
  },
  {
    id: '4',
    userId: '4',
    name: 'Sarah Thompson',
    bio: 'Education professional looking to give back to the community through teaching and mentoring.',
    skills: ['Teaching', 'Counseling', 'Leadership'],
    availability: 'Weekday evenings',
    location: 'Boston, MA',
    profileImage: 'https://randomuser.me/api/portraits/women/33.jpg',
    contactEmail: 'sarah@example.com',
    phone: '555-987-6543',
    volunteerHours: 42,
    joinDate: '2023-02-10T14:20:00Z',
    badges: [
      {
        id: '1',
        name: 'First Event',
        description: 'Completed first volunteer event',
        awardedDate: '2023-03-05T16:45:00Z'
      }
    ]
  }
];

// Mock Organizations
const organizations = [
  {
    id: '3',
    userId: '3',
    name: 'Help Foundation',
    description: 'Nonprofit organization dedicated to providing aid to underserved communities.',
    mission: 'To create opportunities for underserved communities through education, health initiatives, and community development.',
    website: 'https://helpfoundation.org',
    logo: 'https://placehold.co/400x200/png?text=Help+Foundation',
    contactEmail: 'contact@helpfoundation.org',
    phone: '555-789-0123',
    address: '123 Main St, Chicago, IL 60601',
    foundedYear: 2010,
    verificationStatus: 'verified',
    socialMedia: {
      facebook: 'helpfoundation',
      twitter: 'helpfoundation',
      instagram: 'helpfoundation'
    },
    eventsHosted: 12
  },
  {
    id: '5',
    userId: '5',
    name: 'Green Earth Initiative',
    description: 'Environmental organization focused on sustainability and conservation efforts.',
    mission: 'To protect and preserve our natural resources through education, advocacy, and community action.',
    website: 'https://greenearthinitiative.org',
    logo: 'https://placehold.co/400x200/png?text=Green+Earth',
    contactEmail: 'info@greenearthinitiative.org',
    phone: '555-456-7890',
    address: '456 Park Ave, San Francisco, CA 94107',
    foundedYear: 2015,
    verificationStatus: 'verified',
    socialMedia: {
      facebook: 'greenearthorg',
      twitter: 'greenearthorg',
      instagram: 'greenearthorg'
    },
    eventsHosted: 8
  }
];

// Mock Events
const events = [
  {
    id: '1',
    title: 'Community Cleanup Day',
    description: 'Join us for a day of cleaning up local parks and streets to make our community more beautiful.',
    organizationId: '3',
    organizationName: 'Help Foundation',
    date: '2023-09-15T09:00:00Z',
    endDate: '2023-09-15T13:00:00Z',
    location: 'Central Park, Chicago, IL',
    image: 'https://placehold.co/600x400/png?text=Community+Cleanup',
    category: 'Environment',
    spotsAvailable: 20,
    spotsTotal: 25,
    requirements: 'Bring gloves if possible. Water and snacks provided.',
    status: 'active',
    createdAt: '2023-08-01T10:00:00Z',
    applications: [
      {
        id: '101',
        volunteerId: '2',
        volunteerName: 'John Volunteer',
        status: 'approved',
        appliedAt: '2023-08-02T14:30:00Z'
      },
      {
        id: '102',
        volunteerId: '4',
        volunteerName: 'Sarah Thompson',
        status: 'pending',
        appliedAt: '2023-08-03T09:45:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Tree Planting Initiative',
    description: 'Help us plant trees in areas affected by deforestation. Training will be provided on proper planting techniques.',
    organizationId: '5',
    organizationName: 'Green Earth Initiative',
    date: '2023-10-22T10:00:00Z',
    endDate: '2023-10-22T16:00:00Z',
    location: 'Redwood Park, San Francisco, CA',
    image: 'https://placehold.co/600x400/png?text=Tree+Planting',
    category: 'Environment',
    spotsAvailable: 15,
    spotsTotal: 15,
    requirements: 'No experience necessary. Tools and equipment will be provided.',
    status: 'active',
    createdAt: '2023-09-01T11:30:00Z',
    applications: [
      {
        id: '103',
        volunteerId: '2',
        volunteerName: 'John Volunteer',
        status: 'approved',
        appliedAt: '2023-09-05T16:20:00Z'
      }
    ]
  },
  {
    id: '3',
    title: 'Food Bank Assistance',
    description: 'Volunteers needed to sort and pack food donations for distribution to local families in need.',
    organizationId: '3',
    organizationName: 'Help Foundation',
    date: '2023-09-30T13:00:00Z',
    endDate: '2023-09-30T17:00:00Z',
    location: 'Community Center, 456 Oak St, Chicago, IL',
    image: 'https://placehold.co/600x400/png?text=Food+Bank',
    category: 'Community Service',
    spotsAvailable: 8,
    spotsTotal: 10,
    requirements: 'Must be able to stand for extended periods. Closed-toe shoes required.',
    status: 'active',
    createdAt: '2023-09-10T09:15:00Z',
    applications: []
  }
];

// Mock Donations
const donations = [
  {
    id: '1',
    title: 'School Supplies for Children',
    description: 'Collecting school supplies for underprivileged children starting the new school year.',
    organizationId: '3',
    organizationName: 'Help Foundation',
    itemsNeeded: ['Notebooks', 'Pencils', 'Backpacks', 'Rulers', 'Erasers'],
    startDate: '2023-08-01T00:00:00Z',
    endDate: '2023-09-01T00:00:00Z',
    dropoffLocation: '123 Main St, Chicago, IL 60601',
    image: 'https://placehold.co/600x400/png?text=School+Supplies',
    status: 'active',
    createdAt: '2023-07-15T11:20:00Z',
    progress: {
      itemsReceived: 120,
      itemsGoal: 200,
      donorsCount: 18
    }
  },
  {
    id: '2',
    title: 'Winter Clothing Drive',
    description: 'Collecting warm clothing items for homeless shelters before winter.',
    organizationId: '3',
    organizationName: 'Help Foundation',
    itemsNeeded: ['Coats', 'Gloves', 'Scarves', 'Hats', 'Socks', 'Blankets'],
    startDate: '2023-10-01T00:00:00Z',
    endDate: '2023-11-15T00:00:00Z',
    dropoffLocation: '123 Main St, Chicago, IL 60601',
    image: 'https://placehold.co/600x400/png?text=Clothing+Drive',
    status: 'upcoming',
    createdAt: '2023-09-15T14:00:00Z',
    progress: {
      itemsReceived: 0,
      itemsGoal: 300,
      donorsCount: 0
    }
  },
  {
    id: '3',
    title: 'Native Tree Seedling Collection',
    description: 'Collecting native tree seedlings for our reforestation projects.',
    organizationId: '5',
    organizationName: 'Green Earth Initiative',
    itemsNeeded: ['Oak seedlings', 'Maple seedlings', 'Pine seedlings', 'Planting pots', 'Soil'],
    startDate: '2023-09-01T00:00:00Z',
    endDate: '2023-10-15T00:00:00Z',
    dropoffLocation: '456 Park Ave, San Francisco, CA 94107',
    image: 'https://placehold.co/600x400/png?text=Tree+Seedlings',
    status: 'active',
    createdAt: '2023-08-20T10:40:00Z',
    progress: {
      itemsReceived: 85,
      itemsGoal: 150,
      donorsCount: 12
    }
  }
];

// Mock feedback
const feedback = [
  {
    id: '1',
    eventId: '1',
    eventTitle: 'Community Cleanup Day',
    volunteerId: '2',
    volunteerName: 'John Volunteer',
    organizationId: '3',
    organizationName: 'Help Foundation',
    rating: 5,
    comment: 'John was an outstanding volunteer, showing great initiative and leadership during the cleanup event.',
    createdAt: '2023-09-16T10:30:00Z'
  },
  {
    id: '2',
    eventId: '2',
    eventTitle: 'Tree Planting Initiative',
    volunteerId: '2',
    volunteerName: 'John Volunteer',
    organizationId: '5',
    organizationName: 'Green Earth Initiative',
    rating: 4,
    comment: 'Great attitude and worked well with the team. Would be happy to have John volunteer with us again.',
    createdAt: '2023-10-23T09:45:00Z'
  }
];

// Mock dashboard stats for admin
const dashboardStats = {
  totalUsers: 45,
  totalOrganizations: 12,
  totalVolunteers: 33,
  activeEvents: 8,
  completedEvents: 24,
  volunteerHours: 782,
  newUsersThisMonth: 5,
  pendingVerifications: 2,
  activeDonations: 4,
  completedDonations: 9,
  charts: {
    eventsByCategory: [
      { category: 'Environment', count: 12 },
      { category: 'Education', count: 8 },
      { category: 'Community Service', count: 6 },
      { category: 'Healthcare', count: 3 },
      { category: 'Animal Welfare', count: 3 }
    ],
    volunteersByMonth: [
      { month: 'Jan', count: 2 },
      { month: 'Feb', count: 4 },
      { month: 'Mar', count: 3 },
      { month: 'Apr', count: 5 },
      { month: 'May', count: 7 },
      { month: 'Jun', count: 4 },
      { month: 'Jul', count: 2 },
      { month: 'Aug', count: 3 },
      { month: 'Sep', count: 3 }
    ]
  }
};

export {
  users,
  volunteers,
  organizations,
  events,
  donations,
  feedback,
  dashboardStats
};
