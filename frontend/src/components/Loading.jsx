import { motion } from 'framer-motion';

/**
 * Loading spinner component with customizable options
 * 
 * @param {Object} props Component properties
 * @param {string} props.size Size of the spinner: 'sm', 'md', 'lg'
 * @param {string} props.color Color of the spinner: 'primary', 'secondary', 'white'
 * @param {string} props.text Text to display below the spinner
 * @param {boolean} props.fullPage Whether to display the spinner on the full page
 */
const Loading = ({
  size = 'md',
  color = 'primary',
  text,
  fullPage = false,
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6 border-2';
      case 'lg':
        return 'w-16 h-16 border-4';
      case 'md':
      default:
        return 'w-10 h-10 border-3';
    }
  };
  
  const getColorClass = () => {
    switch (color) {
      case 'white':
        return 'border-white border-t-transparent';
      case 'secondary':
        return 'border-gray-600 border-t-transparent';
      case 'primary':
      default:
        return 'border-primary border-t-transparent';
    }
  };
  
  const spinner = (
    <div className={`flex flex-col items-center justify-center ${fullPage ? 'min-h-screen' : ''}`}>
      <motion.div
        className={`${getSizeClass()} ${getColorClass()} rounded-full animate-spin`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
  
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }
  
  return spinner;
};

/**
 * Button component with loading state
 */
export const LoadingButton = ({
  children,
  loading = false,
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  ...props
}) => {
  // Base classes
  const baseClasses = 'flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 text-white focus:ring-primary/50',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400/50',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary/10 focus:ring-primary/50',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/50',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500/50',
  };
  
  // Disabled styles
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${sizeClasses[size] || sizeClasses.md}
        ${variantClasses[variant] || variantClasses.primary}
        ${(disabled || loading) ? disabledClasses : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className={`animate-spin mr-2 ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

/**
 * Skeleton loading component for content placeholders
 */
export const Skeleton = ({ 
  type = 'text', 
  width, 
  height,
  count = 1,
  className = '', 
  ...props 
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const typeClasses = {
    text: 'h-4',
    title: 'h-8',
    avatar: 'rounded-full',
    thumbnail: 'rounded-md',
    button: 'h-10 rounded-md',
    card: 'rounded-lg',
    custom: '',
  };
  
  const getStyle = () => {
    const style = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;
    return style;
  };
  
  const renderSkeleton = (index) => (
    <div
      key={index}
      className={`
        ${baseClasses} 
        ${typeClasses[type] || typeClasses.text}
        ${className}
      `}
      style={getStyle()}
      {...props}
    />
  );
  
  return count > 1 
    ? [...Array(count)].map((_, index) => renderSkeleton(index))
    : renderSkeleton(0);
};

export default Loading;
