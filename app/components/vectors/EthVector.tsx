import React from 'react';

interface EthVectorProps {
  className?: string;
}

export const EthVector: React.FC<EthVectorProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="ethGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L4 12L12 16L20 12L12 2Z"
        fill="url(#ethGradient)"
        stroke="url(#ethGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 12L12 22L20 12L12 16L4 12Z"
        fill="url(#ethGradient)"
        fillOpacity="0.5"
        stroke="url(#ethGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}; 