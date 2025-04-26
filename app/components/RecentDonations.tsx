'use client';

import { useState, useEffect } from 'react';
import { getLatestDonations } from '../utils/contractUtils';

type Donation = {
  donor: string;
  amount: string;
  message: string;
  timestamp: Date;
};

interface RecentDonationsProps {
  refreshTrigger?: boolean;
}

export default function RecentDonations({ refreshTrigger }: RecentDonationsProps) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDonationId, setNewDonationId] = useState<string | null>(null);

  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const latestDonations = await getLatestDonations(5);
      
      // Ensure timestamps are Date objects
      const formattedDonations = latestDonations.map(donation => ({
        ...donation,
        timestamp: donation.timestamp instanceof Date 
          ? donation.timestamp 
          : new Date(donation.timestamp)
      }));
      
      setDonations(formattedDonations);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError('Failed to load recent donations');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [refreshTrigger]);

  // When new donations come in, mark them for animation
  useEffect(() => {
    if (donations.length > 0) {
      const latestDonation = donations[0];
      setNewDonationId(latestDonation.donor);
      
      // Clear the new donation marker after animation
      const timer = setTimeout(() => {
        setNewDonationId(null);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [donations]);

  // Format address to show only first and last few characters
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="donations-bento-container">
        <div className="donations-bento-header">
          <h3 className="donations-bento-title">Recent Donations</h3>
        </div>
        <div className="flex justify-center py-6">
          <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="donations-bento-container">
        <div className="donations-bento-header">
          <h3 className="donations-bento-title">Recent Donations</h3>
        </div>
        <p className="text-center text-red-400 mb-4">{error}</p>
        <button 
          onClick={fetchDonations}
          className="make-donation-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="donations-bento-container">
      <div className="donations-bento-header">
        <h3 className="donations-bento-title">Recent Donations</h3>
      </div>
      
      {donations.length === 0 ? (
        <p className="text-center text-gray-400 py-4">No donations yet. Be the first to donate!</p>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <div 
              key={donation.donor} 
              className="donation-card"
            >
              {newDonationId === donation.donor && (
                <div className="new-donation-glow" />
              )}
              <div className="donation-info">
                <span className="donation-address">{formatAddress(donation.donor)}</span>
                {donation.message && (
                  <p className="donation-message">"{donation.message}"</p>
                )}
                <span className="donation-time">{formatDate(donation.timestamp)}</span>
              </div>
              <span className="donation-amount">{donation.amount} ETH</span>
            </div>
          ))}
        </div>
      )}
      
      <button 
        onClick={() => window.dispatchEvent(new CustomEvent('open-donation-modal'))}
        className="make-donation-button"
      >
        Make a Donation
      </button>
    </div>
  );
} 