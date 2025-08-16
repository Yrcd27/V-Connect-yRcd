import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiAlertCircle, FiInfo } from 'react-icons/fi';

/**
 * Toast notification component that shows messages briefly and disappears
 * 
 * @param {Object} props Component properties
 * @param {string} props.message The message to display
 * @param {string} props.type The type of notification (success, error, warning, info)
 * @param {number} props.duration Duration in ms for the toast to be visible (default: 4000ms)
 * @param {Function} props.onClose Callback function when toast is closed
 */
const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Delay to allow exit animation
    }, duration);
    
    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck className="text-green-500" size={20} />;
      case 'error':
        return <FiAlertCircle className="text-red-500" size={20} />;
      case 'warning':
        return <FiAlertCircle className="text-yellow-500" size={20} />;
      case 'info':
      default:
        return <FiInfo className="text-blue-500" size={20} />;
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed top-4 right-4 z-50 max-w-sm rounded-lg shadow-lg ${getBgColor()} border p-4 flex items-start`}
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        >
          <div className="mr-3 flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 pr-8">
            <p className="text-gray-800">{message}</p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <FiX size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Toast container to manage multiple notifications
 */
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export { Toast, ToastContainer };

/**
 * Context provider for managing toasts throughout the app
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now().toString();
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
    return id;
  };
  
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };
  
  const successToast = (message, duration) => addToast(message, 'success', duration);
  const errorToast = (message, duration) => addToast(message, 'error', duration);
  const warningToast = (message, duration) => addToast(message, 'warning', duration);
  const infoToast = (message, duration) => addToast(message, 'info', duration);
  
  const ToastContextProvider = ({ children }) => {
    return (
      <>
        {children}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  };
  
  return {
    ToastContextProvider,
    addToast,
    successToast,
    errorToast,
    warningToast,
    infoToast,
    removeToast
  };
};

export default useToast;
