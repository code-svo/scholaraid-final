'use client';

import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">Test Page Works!</h1>
      <p className="text-gray-400 mb-8">
        If you can see this, routing is working correctly.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Return to Homepage
      </Link>
    </div>
  );
} 