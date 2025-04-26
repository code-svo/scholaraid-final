import { FC } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { getCurrentUser } from '../utils/authUtils';
import Image from 'next/image';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const Profile: FC<ProfileProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const currentUser = getCurrentUser();

  if (!isOpen) return null;

  const user = session?.user || currentUser;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-2xl w-full max-w-md mx-4 
                    border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="relative p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-2xl font-light tracking-tight text-white">My Profile</h2>
          <button 
            onClick={onClose} 
            className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500/50">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'Profile'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-2xl text-blue-400">
                    {user?.name?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-medium text-white">{user?.name || 'Guest User'}</h3>
              <p className="text-gray-400">{user?.email || 'No email provided'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Account Status</h4>
              <p className="text-white">
                {session ? 'Connected with Google' : 'Local Account'}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Authentication</h4>
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="w-full py-2 px-4 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <a
                  href="/signin"
                  className="w-full py-2 px-4 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors block text-center"
                >
                  Sign In with Google
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 