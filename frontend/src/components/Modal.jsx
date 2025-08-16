import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle, FiAlertTriangle, FiCheck, FiInfo } from 'react-icons/fi';

/**
 * Modal component for displaying dialogs, alerts, and confirmations
 * 
 * @param {Object} props Component properties
 * @param {boolean} props.isOpen Whether the modal is visible or not
 * @param {Function} props.onClose Callback when modal is closed
 * @param {string} props.title The modal title
 * @param {string|JSX.Element} props.children Modal content
 * @param {string} props.type Modal type: 'info', 'success', 'warning', 'error', 'confirm'
 * @param {Array} props.actions Array of action buttons [{label, onClick, color}]
 * @param {string} props.size Modal size: 'sm', 'md', 'lg', 'xl'
 */
const Modal = ({
  isOpen = false,
  onClose,
  title = '',
  children,
  type = 'info',
  actions = [],
  size = 'md',
}) => {
  const modalRef = useRef(null);
  
  // Handle click outside to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  // Handle escape key to close
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
  const getIconByType = () => {
    switch (type) {
      case 'success':
        return <FiCheck className="text-green-500" size={24} />;
      case 'warning':
        return <FiAlertTriangle className="text-yellow-500" size={24} />;
      case 'error':
        return <FiAlertCircle className="text-red-500" size={24} />;
      case 'confirm':
        return <FiAlertCircle className="text-blue-500" size={24} />;
      case 'info':
      default:
        return <FiInfo className="text-blue-500" size={24} />;
    }
  };
  
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      case 'md':
      default:
        return 'max-w-md';
    }
  };
  
  // Default actions if none provided
  const defaultActions = () => {
    if (actions.length > 0) return actions;
    
    if (type === 'confirm') {
      return [
        {
          label: 'Cancel',
          onClick: onClose,
          color: 'gray',
        },
        {
          label: 'Confirm',
          onClick: () => {
            onClose(true);
          },
          color: 'primary',
        },
      ];
    }
    
    return [
      {
        label: 'Close',
        onClick: onClose,
        color: 'primary',
      },
    ];
  };
  
  const buttonColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary hover:bg-primary/90 text-white';
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'gray':
      default:
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalRef}
            className={`bg-white rounded-lg shadow-xl w-full ${getSizeClass()} overflow-hidden`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between p-4 border-b">
              <div className="flex items-center">
                {type && (
                  <div className="mr-3">
                    {getIconByType()}
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={onClose}
              >
                <FiX size={24} />
              </button>
            </div>
            
            {/* Modal body */}
            <div className="p-6">
              {children}
            </div>
            
            {/* Modal footer with actions */}
            {defaultActions().length > 0 && (
              <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
                {defaultActions().map((action, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-md transition-colors ${buttonColorClasses(action.color)}`}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Custom hook for using modals in components
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});
  
  const openModal = (props = {}) => {
    setModalProps(props);
    setIsOpen(true);
  };
  
  const closeModal = (result) => {
    setIsOpen(false);
    if (modalProps.onResult) {
      modalProps.onResult(result);
    }
  };
  
  // Helper methods for common modal types
  const showAlert = (title, message, type = 'info', onClose) => {
    openModal({
      title,
      type,
      onResult: onClose,
      children: <p className="text-gray-700">{message}</p>
    });
  };
  
  const showConfirm = (title, message, onConfirm, onCancel) => {
    openModal({
      title,
      type: 'confirm',
      onResult: (result) => {
        if (result && onConfirm) {
          onConfirm();
        } else if (onCancel) {
          onCancel();
        }
      },
      children: <p className="text-gray-700">{message}</p>
    });
  };
  
  const ModalComponent = (props) => (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      {...modalProps}
      {...props}
    />
  );
  
  return {
    isOpen,
    openModal,
    closeModal,
    ModalComponent,
    showAlert,
    showConfirm
  };
};

export default Modal;
