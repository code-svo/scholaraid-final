import React, { useEffect, useState } from 'react';

const vectorAvatars = [
  // Simple SVG avatars for demo
  (
    <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none">
      <circle cx="32" cy="32" r="32" fill="#4ADE80" />
      <ellipse cx="32" cy="28" rx="12" ry="12" fill="#fff" />
      <ellipse cx="32" cy="50" rx="16" ry="8" fill="#fff" />
    </svg>
  ),
  (
    <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none">
      <circle cx="32" cy="32" r="32" fill="#60A5FA" />
      <ellipse cx="32" cy="28" rx="12" ry="12" fill="#fff" />
      <ellipse cx="32" cy="50" rx="16" ry="8" fill="#fff" />
      <ellipse cx="24" cy="26" rx="2" ry="3" fill="#60A5FA" />
    </svg>
  ),
  (
    <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none">
      <circle cx="32" cy="32" r="32" fill="#F472B6" />
      <ellipse cx="32" cy="28" rx="12" ry="12" fill="#fff" />
      <ellipse cx="32" cy="50" rx="16" ry="8" fill="#fff" />
      <ellipse cx="40" cy="26" rx="2" ry="3" fill="#F472B6" />
    </svg>
  ),
  (
    <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none">
      <circle cx="32" cy="32" r="32" fill="#FBBF24" />
      <ellipse cx="32" cy="28" rx="12" ry="12" fill="#fff" />
      <ellipse cx="32" cy="50" rx="16" ry="8" fill="#fff" />
      <ellipse cx="28" cy="26" rx="2" ry="3" fill="#FBBF24" />
    </svg>
  ),
];

const statusIcons: Record<string, JSX.Element> = {
  Verified: (
    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
    </svg>
  ),
  Pending: (
    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
    </svg>
  ),
  Home: (
    <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1m-6 0h6" />
    </svg>
  ),
  New: (
    <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4h4" />
    </svg>
  ),
};

const initialApplicants = [
  { name: 'Emma Johnson', status: 'Verified', color: 'text-green-400', avatar: 0 },
  { name: 'Michael Smith', status: 'Pending', color: 'text-blue-400', avatar: 1 },
  { name: 'Sarah Brown', status: 'Home', color: 'text-pink-400', avatar: 2 },
  { name: 'Alex Lee', status: 'New', color: 'text-yellow-400', avatar: 3 },
];

export default function TopApplicants() {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [startIdx, setStartIdx] = useState(0);

  // Simulate real-time updates (optional, can be removed if not needed)
  useEffect(() => {
    const interval = setInterval(() => {
      setApplicants(prev => {
        const next = [...prev];
        next.push(next.shift()!);
        return next;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const canGoLeft = startIdx > 0;
  const canGoRight = startIdx < applicants.length - 2;

  const handleProfileNav = (name: string) => {
    // Scroll to profile section with anchor id based on name (e.g., #profile-emma-johnson)
    const anchor = `profile-${name.toLowerCase().replace(/\s+/g, '-')}`;
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-black/60 border border-green-800/40 rounded-[2.5rem] p-12 shadow-xl backdrop-blur-xl w-full mb-12">
      <h2 className="text-2xl font-semibold mb-8 text-green-400 text-center">Top Applicants</h2>
      <div className="flex items-center justify-center gap-6">
        <button
          className={`rounded-full p-2 bg-white/10 border border-white/20 text-green-400 hover:bg-green-400/10 transition disabled:opacity-30 disabled:cursor-not-allowed`}
          onClick={() => setStartIdx(idx => Math.max(0, idx - 1))}
          disabled={!canGoLeft}
          aria-label="Previous"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex flex-row justify-center items-stretch gap-10 w-full max-w-xl">
          {applicants.slice(startIdx, startIdx + 2).map((app, idx) => (
            <div key={app.name} className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-6 min-w-[160px] max-w-[200px] shadow hover:shadow-lg transition-all duration-300">
              <div className="mb-2">{vectorAvatars[app.avatar]}</div>
              <span className="font-medium text-white mb-1 text-center text-base">{app.name}</span>
              <div className="flex items-center gap-2 mt-1 mb-3">
                {statusIcons[app.status]}
                <span className={`text-xs ${app.color}`}>{app.status}</span>
              </div>
              <button
                className="mt-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition"
                onClick={() => handleProfileNav(app.name)}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
        <button
          className={`rounded-full p-2 bg-white/10 border border-white/20 text-green-400 hover:bg-green-400/10 transition disabled:opacity-30 disabled:cursor-not-allowed`}
          onClick={() => setStartIdx(idx => Math.min(applicants.length - 2, idx + 1))}
          disabled={!canGoRight}
          aria-label="Next"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
} 