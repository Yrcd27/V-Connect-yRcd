import React from 'react';
import { motion } from 'framer-motion';
import { FiInfo, FiSearch, FiAlertCircle, FiFileText, FiInbox, FiCalendar } from 'react-icons/fi';

/**
 * EmptyState component to display when there's no data to show
 * 
 * @param {Object} props Component properties
 * @param {string} props.title The title text for the empty state
 * @param {string} props.message The message text for the empty state
 * @param {React.ReactNode} props.icon Icon component to display
 * @param {React.ReactNode} props.action Action button or link
 * @param {string} props.type Predefined type: 'default', 'search', 'error', 'data', 'notification'
 * @param {string} props.illustration Custom illustration URL
 * @param {boolean} props.compact Whether to show a compact version
 */
const EmptyState = ({
  title,
  message,
  icon,
  action,
  type = 'default',
  illustration,
  compact = false,
}) => {
  // Default content based on type
  const getDefaultContent = () => {
    switch (type) {
      case 'search':
        return {
          icon: <FiSearch size={32} />,
          title: title || 'No results found',
          message: message || "Try adjusting your search or filters to find what you're looking for.",
        };
      case 'error':
        return {
          icon: <FiAlertCircle size={32} />,
          title: title || 'Something went wrong',
          message: message || 'There was an error loading this content. Please try again later.',
        };
      case 'data':
        return {
          icon: <FiFileText size={32} />,
          title: title || 'No data available',
          message: message || 'There is no data to display at this time.',
        };
      case 'notification':
        return {
          icon: <FiInbox size={32} />,
          title: title || 'No notifications',
          message: message || "You don't have any notifications at the moment.",
        };
      case 'events':
        return {
          icon: <FiCalendar size={32} />,
          title: title || 'No events scheduled',
          message: message || 'There are no events scheduled at this time.',
        };
      case 'default':
      default:
        return {
          icon: icon || <FiInfo size={32} />,
          title: title || 'No content',
          message: message || "There's nothing to show here at the moment.",
        };
    }
  };
  
  const content = getDefaultContent();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center text-center p-6 ${compact ? 'py-4' : 'py-12'}`}
    >
      {illustration ? (
        <img 
          src={illustration} 
          alt="Empty state illustration" 
          className={`mb-4 ${compact ? 'w-32' : 'w-48'}`}
        />
      ) : (
        <div className={`flex items-center justify-center ${compact ? 'w-12 h-12' : 'w-16 h-16'} rounded-full bg-gray-100 text-gray-500 mb-4`}>
          {content.icon}
        </div>
      )}
      
      <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-medium text-gray-900 mb-2`}>
        {content.title}
      </h3>
      
      <p className={`${compact ? 'text-sm' : 'text-base'} text-gray-500 max-w-md`}>
        {content.message}
      </p>
      
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
