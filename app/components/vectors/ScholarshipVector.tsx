import React from 'react';

interface ScholarshipVectorProps {
  className?: string;
}

export const ScholarshipVector: React.FC<ScholarshipVectorProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="scholarshipBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="scholarshipStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      
      {/* Background Circle */}
      <circle
        cx="60"
        cy="60"
        r="58"
        fill="url(#scholarshipBg)"
        stroke="url(#scholarshipStroke)"
        strokeWidth="2"
      />
      
      {/* Graduation Cap */}
      <path
        d="M30 55L60 40L90 55L60 70L30 55Z"
        fill="#1E40AF"
        fillOpacity="0.9"
      />
      <path
        d="M60 70V85M60 85L45 77.5V62.5M60 85L75 77.5V62.5"
        stroke="#1E40AF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Decorative Elements */}
      <circle
        cx="60"
        cy="60"
        r="54"
        stroke="white"
        strokeWidth="0.5"
        strokeDasharray="4 4"
        opacity="0.6"
      />
      <path
        d="M85 45C88 42 90 40 92 39"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M35 45C32 42 30 40 28 39"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}; 