import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  label 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-gray-200 border-t-blue-600 rounded-full animate-spin`}
        role="status"
        aria-label={label || 'Carregando'}
      />
      {label && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{label}</span>
      )}
    </div>
  );
};

interface ButtonLoadingProps {
  children: React.ReactNode;
  isLoading: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  loadingText?: string;
}

export const ButtonWithLoading: React.FC<ButtonLoadingProps> = ({
  children,
  isLoading,
  disabled,
  onClick,
  type = 'button',
  className = '',
  loadingText,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${className} ${isLoading || disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <LoadingSpinner size="sm" />
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingSpinner;
