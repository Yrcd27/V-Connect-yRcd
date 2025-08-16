// Frontend configuration
const APP_CONFIG = {
  // App details
  APP_NAME: 'V-Connect',
  
  // API configuration - set this when connecting to a real backend
  API: {
    // Base URL for the API (to be configured later when connecting to a real backend)
    BASE_URL: '',
    
    // Default timeout for API requests in milliseconds
    TIMEOUT: 15000,
  },
  
  // Feature flags
  FEATURES: {
    ENABLE_NOTIFICATIONS: true,
    ENABLE_DARK_MODE: false,
    USE_MOCK_DATA: true, // Set to true to use mock data instead of real API calls
  },
  
  // UI configuration
  UI: {
    ITEMS_PER_PAGE: 10,
    MAX_FILE_SIZE: 5242880, // 5MB
    ACCEPTED_FILE_TYPES: 'image/jpeg,image/png,image/gif,application/pdf',
  }
};

export default APP_CONFIG;
