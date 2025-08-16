import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

/**
 * FormGroup - Container for form controls with label and error handling
 * 
 * @param {Object} props Component properties
 * @param {string} props.id The ID for the form control
 * @param {string} props.label The label text
 * @param {string} props.error Error message text
 * @param {React.ReactNode} props.children Child components (form controls)
 * @param {boolean} props.required Whether the field is required
 * @param {string} props.helperText Helper text to display below the field
 * @param {string} props.className Additional CSS classes
 */
export const FormGroup = ({
  id,
  label,
  error,
  children,
  required = false,
  helperText,
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {children}
      
      {error ? (
        <p className="mt-1 text-xs text-red-500 flex items-center">
          <FiAlertCircle className="mr-1" /> {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};

/**
 * Input component for text, email, password, etc.
 * 
 * @param {Object} props Component properties
 * @param {string} props.id The ID for the form control
 * @param {string} props.name The name attribute for the input
 * @param {string} props.type The input type ('text', 'email', 'password', etc.)
 * @param {string} props.label The label text
 * @param {string} props.placeholder Placeholder text
 * @param {string} props.error Error message text
 * @param {string} props.helperText Helper text to display below the field
 * @param {boolean} props.required Whether the field is required
 * @param {boolean} props.disabled Whether the field is disabled
 * @param {string} props.value The controlled input value
 * @param {Function} props.onChange Change event handler
 * @param {Function} props.onBlur Blur event handler
 * @param {string} props.className Additional CSS classes
 * @param {React.ReactNode} props.leftIcon Icon to display on the left side
 * @param {React.ReactNode} props.rightIcon Icon to display on the right side
 * @param {boolean} props.showValidation Whether to show validation icons
 */
export const Input = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  value,
  onChange,
  onBlur,
  className = '',
  leftIcon,
  rightIcon,
  showValidation = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const toggleShowPassword = () => setShowPassword(!showPassword);
  
  // Determine if the input has been touched and has a value
  const isTouched = value !== undefined && value !== '';
  
  // Determine input type based on the password visibility toggle
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  // Validation icon to display if showValidation is true
  const validationIcon = isTouched && !error ? (
    <FiCheck className="h-5 w-5 text-green-500" />
  ) : isTouched && error ? (
    <FiAlertCircle className="h-5 w-5 text-red-500" />
  ) : null;
  
  return (
    <FormGroup
      id={id}
      label={label}
      error={error}
      required={required}
      helperText={helperText}
      className={className}
    >
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          required={required}
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm text-sm
            ${leftIcon ? 'pl-10' : ''}
            ${(rightIcon || type === 'password' || showValidation) ? 'pr-10' : ''}
            ${isFocused ? 'border-primary ring-1 ring-primary' : 'border-gray-300'}
            ${error ? 'border-red-500 ring-1 ring-red-500' : ''}
            ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}
            focus:outline-none focus:ring-primary focus:border-primary
          `}
          {...props}
        />
        
        {(type === 'password' || rightIcon || (showValidation && validationIcon)) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {type === 'password' ? (
              <button
                type="button"
                onClick={toggleShowPassword}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            ) : showValidation && validationIcon ? (
              validationIcon
            ) : (
              rightIcon
            )}
          </div>
        )}
      </div>
    </FormGroup>
  );
};

/**
 * TextArea component for multiline text input
 * 
 * @param {Object} props Component properties
 * @param {string} props.id The ID for the form control
 * @param {string} props.name The name attribute for the textarea
 * @param {string} props.label The label text
 * @param {string} props.placeholder Placeholder text
 * @param {string} props.error Error message text
 * @param {string} props.helperText Helper text to display below the field
 * @param {boolean} props.required Whether the field is required
 * @param {boolean} props.disabled Whether the field is disabled
 * @param {string} props.value The controlled input value
 * @param {Function} props.onChange Change event handler
 * @param {Function} props.onBlur Blur event handler
 * @param {string} props.className Additional CSS classes
 * @param {number} props.rows Number of rows to display
 */
export const TextArea = ({
  id,
  name,
  label,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  value,
  onChange,
  onBlur,
  className = '',
  rows = 4,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <FormGroup
      id={id}
      label={label}
      error={error}
      required={required}
      helperText={helperText}
      className={className}
    >
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        onFocus={() => setIsFocused(true)}
        required={required}
        rows={rows}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm text-sm resize-y
          ${isFocused ? 'border-primary ring-1 ring-primary' : 'border-gray-300'}
          ${error ? 'border-red-500 ring-1 ring-red-500' : ''}
          ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}
          focus:outline-none focus:ring-primary focus:border-primary
        `}
        {...props}
      />
    </FormGroup>
  );
};

/**
 * Select component for dropdown selection
 * 
 * @param {Object} props Component properties
 * @param {string} props.id The ID for the form control
 * @param {string} props.name The name attribute for the select
 * @param {string} props.label The label text
 * @param {string} props.error Error message text
 * @param {string} props.helperText Helper text to display below the field
 * @param {boolean} props.required Whether the field is required
 * @param {boolean} props.disabled Whether the field is disabled
 * @param {string} props.value The controlled input value
 * @param {Function} props.onChange Change event handler
 * @param {Function} props.onBlur Blur event handler
 * @param {string} props.className Additional CSS classes
 * @param {Array} props.options Array of options: [{value, label}]
 * @param {string} props.placeholder Placeholder text (first option)
 */
export const Select = ({
  id,
  name,
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  value,
  onChange,
  onBlur,
  className = '',
  options = [],
  placeholder = 'Select an option',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <FormGroup
      id={id}
      label={label}
      error={error}
      required={required}
      helperText={helperText}
      className={className}
    >
      <select
        id={id}
        name={name}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        onFocus={() => setIsFocused(true)}
        required={required}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm text-sm appearance-none
          ${isFocused ? 'border-primary ring-1 ring-primary' : 'border-gray-300'}
          ${error ? 'border-red-500 ring-1 ring-red-500' : ''}
          ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}
          focus:outline-none focus:ring-primary focus:border-primary
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </FormGroup>
  );
};

/**
 * Checkbox component
 * 
 * @param {Object} props Component properties
 * @param {string} props.id The ID for the form control
 * @param {string} props.name The name attribute for the checkbox
 * @param {string} props.label The label text
 * @param {string} props.error Error message text
 * @param {boolean} props.required Whether the field is required
 * @param {boolean} props.disabled Whether the field is disabled
 * @param {boolean} props.checked Whether the checkbox is checked
 * @param {Function} props.onChange Change event handler
 * @param {string} props.className Additional CSS classes
 */
export const Checkbox = ({
  id,
  name,
  label,
  error,
  required = false,
  disabled = false,
  checked = false,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={id}
          name={name}
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          required={required}
          className={`
            w-4 h-4 text-primary border-gray-300 rounded
            ${disabled ? 'bg-gray-100' : ''}
            focus:ring-primary focus:ring-2
          `}
          {...props}
        />
      </div>
      
      <div className="ml-3 text-sm">
        {label && (
          <label 
            htmlFor={id}
            className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};

/**
 * Radio component
 * 
 * @param {Object} props Component properties
 * @param {string} props.id The ID for the form control
 * @param {string} props.name The name attribute for the radio button
 * @param {string} props.label The label text
 * @param {string} props.value The value of the radio button
 * @param {boolean} props.disabled Whether the field is disabled
 * @param {string} props.checked The currently selected value
 * @param {Function} props.onChange Change event handler
 * @param {string} props.className Additional CSS classes
 */
export const Radio = ({
  id,
  name,
  label,
  value,
  disabled = false,
  checked = false,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        name={name}
        type="radio"
        value={value}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className={`
          w-4 h-4 text-primary border-gray-300
          ${disabled ? 'bg-gray-100' : ''}
          focus:ring-primary focus:ring-2
        `}
        {...props}
      />
      
      {label && (
        <label 
          htmlFor={id}
          className={`ml-3 block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

/**
 * RadioGroup component for grouped radio buttons
 * 
 * @param {Object} props Component properties
 * @param {string} props.name The name attribute for the radio group
 * @param {string} props.label The label text for the group
 * @param {string} props.error Error message text
 * @param {string} props.helperText Helper text to display below the field
 * @param {boolean} props.required Whether the field is required
 * @param {Array} props.options Array of options: [{value, label, disabled}]
 * @param {string} props.value The currently selected value
 * @param {Function} props.onChange Change event handler
 * @param {boolean} props.inline Whether to display options inline
 * @param {string} props.className Additional CSS classes
 */
export const RadioGroup = ({
  name,
  label,
  error,
  helperText,
  required = false,
  options = [],
  value,
  onChange,
  inline = false,
  className = '',
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className={`space-${inline ? 'x' : 'y'}-3 ${inline ? 'flex' : ''}`}>
        {options.map((option) => (
          <Radio
            key={option.value}
            id={`${name}-${option.value}`}
            name={name}
            label={option.label}
            value={option.value}
            disabled={option.disabled}
            checked={value === option.value}
            onChange={onChange}
            className={inline ? 'mr-4' : ''}
          />
        ))}
      </div>
      
      {error ? (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};

/**
 * DateInput component for date selection
 * 
 * @param {Object} props Component properties
 * @param {string} props.id The ID for the form control
 * @param {string} props.name The name attribute for the input
 * @param {string} props.label The label text
 * @param {string} props.error Error message text
 * @param {string} props.helperText Helper text to display below the field
 * @param {boolean} props.required Whether the field is required
 * @param {boolean} props.disabled Whether the field is disabled
 * @param {string} props.value The controlled input value
 * @param {Function} props.onChange Change event handler
 * @param {Function} props.onBlur Blur event handler
 * @param {string} props.className Additional CSS classes
 * @param {string} props.min Minimum date
 * @param {string} props.max Maximum date
 */
export const DateInput = ({
  id,
  name,
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  value,
  onChange,
  onBlur,
  className = '',
  min,
  max,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <FormGroup
      id={id}
      label={label}
      error={error}
      required={required}
      helperText={helperText}
      className={className}
    >
      <input
        id={id}
        name={name}
        type="date"
        disabled={disabled}
        value={value || ''}
        onChange={onChange}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        onFocus={() => setIsFocused(true)}
        required={required}
        min={min}
        max={max}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm text-sm
          ${isFocused ? 'border-primary ring-1 ring-primary' : 'border-gray-300'}
          ${error ? 'border-red-500 ring-1 ring-red-500' : ''}
          ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}
          focus:outline-none focus:ring-primary focus:border-primary
        `}
        {...props}
      />
    </FormGroup>
  );
};

/**
 * Switch component (toggle)
 * 
 * @param {Object} props Component properties
 * @param {string} props.id The ID for the form control
 * @param {string} props.name The name attribute for the switch
 * @param {string} props.label The label text
 * @param {boolean} props.disabled Whether the field is disabled
 * @param {boolean} props.checked Whether the switch is on
 * @param {Function} props.onChange Change event handler
 * @param {string} props.className Additional CSS classes
 */
export const Switch = ({
  id,
  name,
  label,
  disabled = false,
  checked = false,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <label htmlFor={id} className="inline-flex relative items-center cursor-pointer">
        <input
          id={id}
          name={name}
          type="checkbox"
          className="sr-only"
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          {...props}
        />
        <div
          className={`
            w-11 h-6 bg-gray-200 rounded-full peer
            peer-focus:ring-2 peer-focus:ring-primary
            ${checked ? 'peer-checked:bg-primary' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            peer-checked:after:translate-x-full after:content-[''] 
            after:absolute after:top-[2px] after:left-[2px]
            after:bg-white after:rounded-full after:h-5 after:w-5
            after:transition-all
          `}
        />
        {label && (
          <span className={`ml-3 text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
            {label}
          </span>
        )}
      </label>
    </div>
  );
};
