import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-9xl font-bold text-blue-500">404</h1>
      <h2 className="text-2xl mt-4 mb-8">This page could not be found.</h2>
      <p className="text-gray-400 max-w-lg text-center mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
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