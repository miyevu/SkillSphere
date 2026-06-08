'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function CustomButton({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100 focus:ring-gray-400',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-blue-300 disabled:text-blue-300 focus:ring-blue-500',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
