import React from 'react';

const Button = ({ 
    children,
    onClick,
    className = '', 
    variant = 'blue',
    px="4",
    py="2",
      
     }) => {
  // Color variant configurations
  const variants = {
    blue: {
      gradient: 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800',
      hover: 'hover:from-blue-700 hover:via-blue-800 hover:to-blue-900',
      border: 'border-blue-500/20',
      glow: 'bg-blue-400/20'
    },
    green: {
      gradient: 'bg-gradient-to-r from-green-600 via-green-700 to-green-800',
      hover: 'hover:from-green-700 hover:via-green-800 hover:to-green-900',
      border: 'border-green-500/20',
      glow: 'bg-green-400/20'
    },
    purple: {
      gradient: 'bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800',
      hover: 'hover:from-purple-700 hover:via-purple-800 hover:to-purple-900',
      border: 'border-purple-500/20',
      glow: 'bg-purple-400/20'
    },
    red: {
      gradient: 'bg-gradient-to-r from-red-600 via-red-700 to-red-800',
      hover: 'hover:from-red-700 hover:via-red-800 hover:to-red-900',
      border: 'border-red-500/20',
      glow: 'bg-red-400/20'
    },
    orange: {
      gradient: 'bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800',
      hover: 'hover:from-orange-700 hover:via-orange-800 hover:to-orange-900',
      border: 'border-orange-500/20',
      glow: 'bg-orange-400/20'
    },
    pink: {
      gradient: 'bg-gradient-to-r from-pink-600 via-pink-700 to-pink-800',
      hover: 'hover:from-pink-700 hover:via-pink-800 hover:to-pink-900',
      border: 'border-pink-500/20',
      glow: 'bg-pink-400/20'
    },
    gray: {
      gradient: 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800',
      hover: 'hover:from-gray-700 hover:via-gray-800 hover:to-gray-900',
      border: 'border-gray-500/20',
      glow: 'bg-gray-400/20'
    },
    indigo: {
      gradient: 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800',
      hover: 'hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900',
      border: 'border-indigo-500/20',
      glow: 'bg-indigo-400/20'
    }
  };

  const currentVariant = variants[variant] || variants.blue;

  return (
      <button
        onClick={onClick}
        className={`
          relative overflow-hidden
          ${currentVariant.gradient}
          ${currentVariant.hover}
          text-white font-semibold
          px-${px} py-${py} 
          rounded-2xl
          shadow-lg hover:shadow-xl
          transform hover:scale-105 active:scale-95
          transition-all duration-300 ease-in-out
          border ${currentVariant.border}
          backdrop-blur-sm
          group
          ${className}
        `}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        <div className={`absolute inset-0 rounded-2xl ${currentVariant.glow} blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      </button>
  );
};


export default Button