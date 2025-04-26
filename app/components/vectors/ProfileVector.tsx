import React from 'react';

interface ProfileVectorProps {
  className?: string;
}

export const ProfileVector: React.FC<ProfileVectorProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="profileBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
        <linearGradient id="profileStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
      </defs>
      
      {/* Background Circle */}
      <circle
        cx="60"
        cy="60"
        r="58"
        fill="url(#profileBg)"
        stroke="url(#profileStroke)"
        strokeWidth="2"
      />
      
      {/* Stylized User Silhouette */}
      <path
        d="M60 35C54.4772 35 50 39.4772 50 45C50 50.5228 54.4772 55 60 55C65.5228 55 70 50.5228 70 45C70 39.4772 65.5228 35 60 35Z"
        fill="#4C1D95"
        fillOpacity="0.8"
      />
      <path
        d="M40 75C40 67.268 46.268 61 54 61H66C73.732 61 80 67.268 80 75V85H40V75Z"
        fill="#4C1D95"
        fillOpacity="0.8"
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
    </svg>
  );
}; 