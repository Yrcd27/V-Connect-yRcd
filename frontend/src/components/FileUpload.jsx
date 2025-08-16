import { useState, useRef, useEffect } from 'react';
import { FiUploadCloud, FiFile, FiX, FiImage, FiPaperclip } from 'react-icons/fi';
import { motion } from 'framer-motion';

/**
 * FileUpload component that handles single or multiple file uploads
 * with drag-and-drop functionality, previews for images, and progress indicators
 * 
 * @param {Object} props Component properties
 * @param {Function} props.onFileSelect Callback when files are selected
 * @param {boolean} props.multiple Whether to allow multiple file selection
 * @param {string} props.accept File types to accept (e.g., "image/*,application/pdf")
 * @param {number} props.maxSize Maximum file size in bytes
 * @param {string} props.label Label text for the upload area
 * @param {string} props.helperText Additional helper text to display
 * @param {Array} props.initialFiles Array of files to show initially
 * @param {boolean} props.showPreview Whether to show file previews
 * @param {string} props.className Additional CSS classes
 * @param {string} props.error Error message to display
 */
const FileUpload = ({
  onFileSelect,
  multiple = false,
  accept = '*',
  maxSize = 5242880, // 5MB default
  label = 'Drop files here or click to browse',
  helperText = 'Supported file types: JPG, PNG, PDF',
  initialFiles = [],
  showPreview = true,
  className = '',
  error,
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);
  
  // Initialize with initial files if provided
  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setFiles(initialFiles.map(file => ({
        file,
        id: Math.random().toString(36).substring(2, 11),
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      })));
    }
  }, [initialFiles]);
  
  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach(fileObj => {
        if (fileObj.preview) URL.revokeObjectURL(fileObj.preview);
      });
    };
  }, [files]);
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };
  
  const validateFiles = (fileList) => {
    const validFiles = [];
    let errorMessage = '';
    
    Array.from(fileList).forEach(file => {
      // Check file size
      if (file.size > maxSize) {
        errorMessage = `File '${file.name}' exceeds the maximum size of ${maxSize / 1024 / 1024}MB.`;
        return;
      }
      
      // Check file type if accept is specified
      if (accept !== '*') {
        const acceptTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type;
        
        let isAccepted = false;
        for (const type of acceptTypes) {
          if (type.endsWith('/*')) {
            // Handle wildcards like "image/*"
            const category = type.split('/')[0];
            if (fileType.startsWith(`${category}/`)) {
              isAccepted = true;
              break;
            }
          } else if (type === fileType) {
            isAccepted = true;
            break;
          }
        }
        
        if (!isAccepted) {
          errorMessage = `File type '${fileType}' is not accepted.`;
          return;
        }
      }
      
      validFiles.push(file);
    });
    
    return { validFiles, errorMessage };
  };
  
  const processFiles = (fileList) => {
    const { validFiles, errorMessage } = validateFiles(fileList);
    
    if (errorMessage) {
      setFileError(errorMessage);
      return;
    }
    
    setFileError('');
    
    if (validFiles.length === 0) return;
    
    const newFiles = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(2, 11),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));
    
    const updatedFiles = multiple
      ? [...files, ...newFiles]
      : newFiles;
    
    setFiles(updatedFiles);
    
    if (onFileSelect) {
      onFileSelect(multiple
        ? updatedFiles.map(f => f.file)
        : updatedFiles[0].file
      );
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };
  
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current.click();
  };
  
  const removeFile = (id) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove && fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    
    if (onFileSelect) {
      onFileSelect(multiple
        ? updatedFiles.map(f => f.file)
        : updatedFiles.length > 0 ? updatedFiles[0].file : null
      );
    }
  };
  
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <FiImage className="w-6 h-6" />;
    return <FiFile className="w-6 h-6" />;
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
          ${error || fileError ? 'border-red-500' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInputChange}
        />
        
        <FiUploadCloud className="w-12 h-12 text-gray-400" />
        <p className="mt-2 text-sm font-medium text-gray-700">{label}</p>
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        
        {(error || fileError) && (
          <p className="mt-2 text-sm text-red-500">{error || fileError}</p>
        )}
      </div>
      
      {showPreview && files.length > 0 && (
        <div className="mt-4 space-y-3">
          {files.map((fileObj) => (
            <motion.div
              key={fileObj.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 text-gray-500">
                  {fileObj.preview ? (
                    <div className="w-10 h-10 rounded overflow-hidden">
                      <img 
                        src={fileObj.preview} 
                        alt={fileObj.file.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    getFileIcon(fileObj.file.type)
                  )}
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileObj.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileObj.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(fileObj.id);
                }}
              >
                <FiX className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Simple file input component for forms
 */
export const FileInput = ({
  id,
  name,
  label,
  helperText,
  error,
  multiple = false,
  accept = '*',
  onChange,
  required = false,
  className = '',
  ...props
}) => {
  const inputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const handleChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(Array.from(files));
    if (onChange) onChange(e);
  };
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="flex items-center">
        <label 
          htmlFor={id}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50"
        >
          <FiPaperclip className="mr-2 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {selectedFiles.length > 0 
              ? `${selectedFiles.length} file(s) selected` 
              : 'Choose file'}
          </span>
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="file"
            className="sr-only"
            multiple={multiple}
            accept={accept}
            onChange={handleChange}
            required={required}
            {...props}
          />
        </label>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="mt-2">
          <ul className="text-xs text-gray-500">
            {selectedFiles.map((file, index) => (
              <li key={index} className="truncate">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
