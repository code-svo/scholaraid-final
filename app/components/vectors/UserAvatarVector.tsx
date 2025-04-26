import React from 'react';

interface UserAvatarVectorProps {
  className?: string;
}

export const UserAvatarVector: React.FC<UserAvatarVectorProps> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="avatarGradient" x1="0" y1="0" x2="200" y2="200">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
      
      {/* Background Circle */}
      <circle cx="100" cy="100" r="98" fill="url(#avatarGradient)" />
      
      {/* Abstract Pattern */}
      <path
        d="M100 120C122.091 120 140 102.091 140 80C140 57.9086 122.091 40 100 40C77.9086 40 60 57.9086 60 80C60 102.091 77.9086 120 100 120Z"
        fill="white"
        fillOpacity="0.9"
      />
      <path
        d="M100 180C144.183 180 180 164.183 180 145C180 125.817 144.183 110 100 110C55.8172 110 20 125.817 20 145C20 164.183 55.8172 180 100 180Z"
        fill="white"
        fillOpacity="0.9"
      />
    </svg>
  );
}; 