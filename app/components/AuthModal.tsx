import { FC, useState } from 'react';
import { loginUser, registerUser } from '../utils/authUtils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (isSignIn) {
        // Handle login
        const result = await loginUser(email, password);
        if (result.success) {
          setSuccess('Login successful!');
          setTimeout(() => {
            onClose();
            // Refresh the page to update the UI based on auth state
            window.location.reload();
          }, 1500);
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        // Handle registration
        if (!name) {
          setError('Please enter your name');
          setIsLoading(false);
          return;
        }
        
        const result = await registerUser(name, email, password);
        if (result.success) {
          setSuccess('Account created successfully!');
          setTimeout(() => {
            onClose();
            // Refresh the page to update the UI based on auth state
            window.location.reload();
          }, 1500);
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    // Reset form when closing
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            className={`flex-1 py-2 rounded-lg ${
              isSignIn ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 rounded-lg ${
              !isSignIn ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setIsSignIn(false)}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-800 text-red-200 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/50 border border-green-800 text-green-200 p-3 rounded-lg text-sm mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignIn && (
            <div>
              <label className="block text-sm font-medium text-gray-200">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isSignIn}
                className="mt-1 w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 ${isLoading ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors`}
          >
            {isLoading ? 'Processing...' : isSignIn ? 'Sign In' : 'Sign Up'}
          </button>

          {isSignIn && (
            <button
              type="button"
              className="w-full text-sm text-gray-400 hover:text-white"
            >
              Forgot password?
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;