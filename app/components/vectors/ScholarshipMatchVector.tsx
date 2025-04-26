import React from 'react';

interface ScholarshipMatchVectorProps {
  className?: string;
}

export const ScholarshipMatchVector: React.FC<ScholarshipMatchVectorProps> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill="url(#matchGradient)"
        stroke="url(#matchStroke)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="matchGradient" x1="2" y1="2" x2="22" y2="21.02">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#EF4444" />
        </linearGradient>
        <linearGradient id="matchStroke" x1="2" y1="2" x2="22" y2="21.02">
          <stop stopColor="#FCD34D" />
          <stop offset="1" stopColor="#F87171" />
        </linearGradient>
      </defs>
    </svg>
  );
}; 