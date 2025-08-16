# V-Connect Frontend Pages and Components

## New Pages

### Profile Pages
- **VolunteerProfile** - Displays volunteer profile information, badges, and event history
- **OrganizationProfile** - Shows organization details, event statistics, and donation campaigns

### Donation Pages
- **CreateDonation** - Form to create a new donation campaign
- **MyDonations** - Lists all donation campaigns created by the organization
- **DonationDetails** - Shows detailed information about a specific donation campaign

## New Components
- **EditVolunteerProfile** - Modal component for editing volunteer profile information
- **EditOrganizationProfile** - Modal component for editing organization profile information

## Updated Routes
Added the following routes to App.jsx:
- /volunteer-profile
- /organization-profile
- /create-donation
- /my-donations
- /donation-details/:id

## Features Implemented

### Volunteer Profile Page
- Display personal information
- Show volunteer skills and bio
- List volunteer badges and achievements
- Show event participation history
- Allow editing profile information

### Organization Profile Page
- Display organization information
- Show verification status
- List recent events
- Display donation campaigns
- Allow editing organization details

### Donation Management
- Create new donation campaigns
- View all donation campaigns
- Filter campaigns by status
- Track campaign progress
- View campaign details and statistics

## Database Integration
All pages connect to the appropriate backend services for:
- User profile data
- Event participation data
- Donation campaign data
- Badge and achievement data

## User Interface Enhancements
- Responsive design for all screen sizes
- Loading states and error handling
- Progress indicators for donations
- Status badges for different states
- Modal components for editing data

All pages use the common DashboardLayout component for consistent navigation and user experience.
