import { FC, useState, useEffect } from 'react';
import { makeDonation, connectToBaseNetwork } from '../utils/contractUtils';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonationComplete: (txHash: string, amount: string) => void;
}

const DonationModal: FC<DonationModalProps> = ({ isOpen, onClose, onDonationComplete }) => {
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);

  // Check if wallet is connected on mount and when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    // For demo purposes, we'll mock the wallet connection
    // In a real app, you would check the actual wallet connection
    setIsWalletConnected(true);
    
    // You can use this localStorage check for real implementation
    // const walletStore = localStorage.getItem('walletConnected');
    // setIsWalletConnected(walletStore === 'true');
  }, [isOpen]);

  const handlePresetAmount = (preset: string) => {
    setAmount(preset);
  };

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First try to connect to Base Sepolia
      await connectToBaseNetwork().catch(() => {
        throw new Error('Please make sure your wallet is connected and can switch to Base Sepolia testnet');
      });
      
      // Then try to make the donation
      const result = await makeDonation(amount, message);
      
      if (result.success) {
        setIsLoading(false);
        onDonationComplete(result.transactionHash, amount);
        onClose();
      } else {
        const errorMsg = result.error || 'Transaction failed';
        // Handle specific error cases
        if (errorMsg.includes('insufficient funds')) {
          setError('Insufficient funds. Make sure you have enough Base Sepolia ETH in your wallet.');
        } else if (errorMsg.includes('user rejected')) {
          setError('Transaction was rejected in your wallet. Please try again.');
        } else if (errorMsg.includes('network')) {
          setError('Network error. Please make sure you are connected to Base Sepolia testnet.');
        } else {
          setError(errorMsg);
        }
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Donation error:', err);
      setError(err.message || 'Error processing donation. Please try again.');
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setMessage('');
    setError(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    // Reset any errors when the modal opens
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-2xl w-full max-w-md mx-4 
                    border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="relative p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-2xl font-light tracking-tight text-white">Make a Donation</h2>
          <button 
            onClick={handleClose} 
            className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '0.01', label: '0.01 ETH' },
              { value: '0.05', label: '0.05 ETH' },
              { value: '0.1', label: '0.1 ETH' }
            ].map((preset) => (
              <button 
                key={preset.value}
                className={`relative group overflow-hidden p-4 rounded-xl transition-all duration-300
                          ${amount === preset.value 
                            ? 'bg-blue-600 text-white border-transparent shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                            : 'bg-white/5 text-gray-300 border border-white/10 hover:border-blue-500/50 hover:bg-blue-600/20'
                          }`}
                onClick={() => handlePresetAmount(preset.value)}
              >
                <span className="relative z-10 text-sm font-medium">{preset.label}</span>
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 
                              transition-opacity duration-300 ${amount === preset.value ? 'opacity-100' : 'group-hover:opacity-100'}`} />
              </button>
            ))}
          </div>
          
          <div className="relative group">
            <input
              type="number"
              placeholder="Custom amount"
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white 
                       placeholder-gray-500 transition-all duration-300
                       focus:border-blue-500/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20
                       hover:border-white/20"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.001"
              min="0"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none
                           transition-all duration-300 group-focus-within:text-blue-400">
              ETH
            </span>
          </div>
          
          <div className="relative">
            <textarea
              placeholder="Add a message (optional)"
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white 
                       placeholder-gray-500 transition-all duration-300 min-h-[120px]
                       focus:border-blue-500/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20
                       hover:border-white/20 resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm
                          animate-[fadeIn_0.3s_ease-in-out]">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          <button 
            className={`relative w-full py-4 rounded-xl font-medium transition-all duration-300 
                      group overflow-hidden ${
                        isLoading 
                          ? 'bg-blue-900/50 text-blue-300 cursor-wait' 
                          : 'bg-white text-gray-900 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]'
                      }`}
            onClick={handleDonate}
            disabled={isLoading}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Donate Now
                  <svg className="w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" 
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
            {!isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-white 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                           blur-xl" />
            )}
          </button>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Donation will be processed on Base Sepolia testnet</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-sm">
              <p className="text-gray-500">You'll need Base Sepolia ETH in your wallet</p>
              <a 
                href="https://sepolia-faucet.base.org/" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                Get test ETH from Base Sepolia Faucet
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;