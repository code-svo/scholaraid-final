'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { MouseEvent } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import debounce from 'lodash/debounce';
import DonationModal from './components/DonationModal';
import RecentDonations from './components/RecentDonations';
import ApplicationForm from './components/ApplicationForm';
import AuthModal from './components/AuthModal';
import ScholarshipApplicationForm, { ApplicationFormData } from './components/ScholarshipApplicationForm';
import Footer from './components/Footer';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Avatar,
  Name,
  Identity,
  Address,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { getCurrentUser, logoutUser } from './utils/authUtils';
import dynamic from 'next/dynamic';
import { ProfileVector } from './components/vectors/ProfileVector';
import { EthVector } from './components/vectors/EthVector';
import FaqBentoBox from './components/FaqBentoBox';
import TopApplicants from './components/TopApplicants';
import Chatbot from './components/Chatbot';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Profile from './components/Profile';

// Add interfaces and types
interface DonationInfo {
  amount: string;
  timestamp: number;
}

interface SearchResult {
  title: string;
  description: string;
  amount: string;
  type: string;
}

// Custom SVG Components
const EthereumIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-400">
    <path fill="currentColor" d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
  </svg>
);

const TimeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-400">
    <path fill="currentColor" d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
    <path fill="currentColor" d="M13 7h-2v6h6v-2h-4z"/>
  </svg>
);

const LightningIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-yellow-500">
    <path fill="currentColor" d="M7 2v11h3v9l7-12h-4l4-8z"/>
  </svg>
);

// Add TypeScript interfaces
interface DonationInfo {
  amount: string;
  timestamp: number;
}

interface Scholarship {
  id: string;
  title: string;
  amount: string;
  deadline: string;
  applicants: number;
  tags: string[];
  progress: number;
  icon: string;
  gradientClass: string;
  category: 'STEM' | 'Arts' | 'Athletic';
}

// Add new vector components at the top with existing SVG components
const UserAvatarVector = () => (
  <svg viewBox="0 0 24 24" className="w-20 h-20 text-blue-400">
    <defs>
      <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4F46E5"/>
        <stop offset="100%" stopColor="#60A5FA"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="8" r="5" fill="url(#avatarGradient)"/>
    <path fill="url(#avatarGradient)" d="M2 20.5c0-2.5 4.5-5.5 10-5.5s10 3 10 5.5V22H2v-1.5z"/>
  </svg>
);

const SkillIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-400">
    <path fill="currentColor" d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2zm0 2.7L19.3 11H18v9h-4v-6H8v6H4v-9H2.7L12 4.7z"/>
  </svg>
);

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'home' | 'achievements'>('home');
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [isScholarshipFormOpen, setIsScholarshipFormOpen] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationFormData | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [donationCompleted, setDonationCompleted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'STEM' | 'Arts' | 'Athletic'>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [totalDonations, setTotalDonations] = useState(0);
  const [recentDonation, setRecentDonation] = useState<DonationInfo | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [skills, setSkills] = useState(['React', 'TypeScript', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [kolkataTime, setKolkataTime] = useState('');
  const chatbotRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Initialize client-side state once component is mounted
  useEffect(() => {
    setIsClient(true);
    
    // Check for logged in user
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Load skills from localStorage
    const savedSkills = localStorage.getItem('userSkills');
    if (savedSkills) {
      setUserSkills(JSON.parse(savedSkills));
    }
    
    // Load application data from localStorage
    const savedData = localStorage.getItem('applicationData');
    if (savedData) {
      setApplicationData(JSON.parse(savedData));
    }
    
    // Add event listeners to track wallet connection
    const checkWalletConnection = () => {
      // Simple check for wallet connection through localStorage
      const walletStore = localStorage.getItem('walletConnected');
      setIsWalletConnected(walletStore === 'true');
    };
    
    // Check initially
    checkWalletConnection();
    
    // Set up listeners for wallet connection status
    window.addEventListener('storage', checkWalletConnection);
    
    // Enhanced wallet connection detection
    const detectWalletConnection = () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        // Check if accounts are already connected
        window.ethereum.request({ method: 'eth_accounts' })
          .then((accounts: string[]) => {
            const isConnected = accounts && accounts.length > 0;
            setIsWalletConnected(isConnected);
            localStorage.setItem('walletConnected', isConnected ? 'true' : 'false');
          })
          .catch(console.error);
          
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          const isConnected = accounts && accounts.length > 0;
          setIsWalletConnected(isConnected);
          localStorage.setItem('walletConnected', isConnected ? 'true' : 'false');
        });
        
        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
          // Refresh accounts after chain change
          window.ethereum.request({ method: 'eth_accounts' })
            .then((accounts: string[]) => {
              const isConnected = accounts && accounts.length > 0;
              setIsWalletConnected(isConnected);
              localStorage.setItem('walletConnected', isConnected ? 'true' : 'false');
            })
            .catch(console.error);
        });
      }
    };
    
    // Call the enhanced detection
    detectWalletConnection();
    
    // Set up a mutation observer to detect changes in the DOM
    // This is a workaround to detect when wallet connects/disconnects
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(() => {
        // Look for wallet connection state in DOM
        const walletDom = document.querySelector('.onchainkit-connected');
        if (walletDom) {
          setIsWalletConnected(true);
          localStorage.setItem('walletConnected', 'true');
        } else {
          const disconnectBtn = document.querySelector('.onchainkit-disconnect');
          if (!disconnectBtn && isWalletConnected) {
            window.ethereum.request({ method: 'eth_accounts' })
              .then((accounts: string[]) => {
                const isConnected = accounts && accounts.length > 0;
                setIsWalletConnected(isConnected);
                localStorage.setItem('walletConnected', isConnected ? 'true' : 'false');
              })
              .catch(console.error);
          }
        }
      });
      
      // Start observing
      observer.observe(document.body, { childList: true, subtree: true });
      
      return () => {
        window.removeEventListener('storage', checkWalletConnection);
        observer.disconnect();
        // Clean up event listeners
        if (window.ethereum) {
          window.ethereum.removeAllListeners('accountsChanged');
          window.ethereum.removeAllListeners('chainChanged');
        }
      };
    }
    
    return () => {
      window.removeEventListener('storage', checkWalletConnection);
      // Clean up event listeners
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [isWalletConnected]);

  // Set up listeners for custom events
  useEffect(() => {
    const handleOpenDonationModalEvent = () => {
      setIsDonateModalOpen(true);
    };
    
    window.addEventListener('open-donation-modal', handleOpenDonationModalEvent);
    
    return () => {
      window.removeEventListener('open-donation-modal', handleOpenDonationModalEvent);
    };
  }, []);

  // Function to handle page navigation
  const navigateTo = (page: 'home' | 'achievements') => {
    setCurrentPage(page);
  };

  const handleOpenDonateModal = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsDonateModalOpen(true);
  };

  const handleCloseDonateModal = () => {
    setIsDonateModalOpen(false);
  };

  // Function to handle scholarship application submission
  const handleApplicationSubmit = (formData: ApplicationFormData) => {
    setApplicationData(formData);
    
    // Add the new skills from the application to the user skills
    const newSkills = formData.skills.filter(skill => !userSkills.includes(skill));
    if (newSkills.length > 0) {
      const updatedSkills = [...userSkills, ...newSkills];
      setUserSkills(updatedSkills);
      
      // Save to localStorage only on client side
      if (isClient) {
        localStorage.setItem('userSkills', JSON.stringify(updatedSkills));
      }
    }
    
    // Save application data to localStorage only on client side
    if (isClient) {
      localStorage.setItem('applicationData', JSON.stringify(formData));
    }
  };

  // Function to reset application data
  const resetApplication = () => {
    setApplicationData(null);
    
    // Remove from localStorage only on client side
    if (isClient) {
      localStorage.removeItem('applicationData');
    }
  };

  // Function to add a new skill
  const addSkill = () => {
    if (skillInput.trim() !== '' && !userSkills.includes(skillInput.trim())) {
      const newSkills = [...userSkills, skillInput.trim()];
      setUserSkills(newSkills);
      setSkillInput('');
      
      // Save to localStorage only on client side
      if (isClient) {
        localStorage.setItem('userSkills', JSON.stringify(newSkills));
      }
    }
  };

  // Function to remove a skill
  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = userSkills.filter(skill => skill !== skillToRemove);
    setUserSkills(updatedSkills);
    
    // Save to localStorage only on client side
    if (isClient) {
      localStorage.setItem('userSkills', JSON.stringify(updatedSkills));
    }
  };

  // Function to get scholarship name from type
  const getScholarshipName = (type: string) => {
    switch (type) {
      case 'STEM': return 'STEM Scholarship';
      case 'Arts': return 'Arts Scholarship';
      case 'Athletic': return 'Athletic Scholarship';
      case 'Research': return 'Research Grant';
      case 'Technology': return 'Technology Innovation';
      default: return type;
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    // You may want to reset some user-specific state here
  };

  // Function to handle donation completion
  const handleDonationComplete = (txHash: string, amount: string) => {
    const donationAmount = parseFloat(amount);
    setTotalDonations(prev => prev + donationAmount);
    setRecentDonation({ amount, timestamp: Date.now() });
  };

  // Update search handling functions with proper types
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [
      {
        title: "STEM Innovation Scholarship",
        description: "For students pursuing STEM fields",
        amount: "5,000",
        type: "STEM"
      },
      {
        title: "Digital Arts Grant",
        description: "Supporting creative digital artists",
        amount: "3,000",
        type: "Arts"
      },
      {
        title: "Blockchain Development Fund",
        description: "For aspiring blockchain developers",
        amount: "7,500",
        type: "Technology"
      }
    ].filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
  }, []);

  const debouncedSearch = useCallback(
    debounce((query: string) => handleSearch(query), 300),
    []
  );

  const handleSearchResultClick = (result: SearchResult) => {
    setSelectedType(result.type);
    setIsScholarshipFormOpen(true);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Featured scholarships data with categories
  const featuredScholarships: Scholarship[] = [
    {
      id: '1',
      title: 'STEM Scholarship',
      amount: '2.5 ETH',
      deadline: 'Jun 1, 2024',
      applicants: 178,
      tags: ['Web3', 'Blockchain', 'Innovation'],
      progress: 65,
      icon: '🧬',
      gradientClass: 'from-blue-900/40 to-blue-800/10',
      category: 'STEM'
    },
    {
      id: '2',
      title: 'Arts Scholarship',
      amount: '1.5 ETH',
      deadline: 'Jun 1, 2024',
      applicants: 178,
      tags: ['Web3', 'Blockchain', 'Innovation'],
      progress: 65,
      icon: '🎨',
      gradientClass: 'from-purple-900/40 to-purple-800/10',
      category: 'Arts'
    },
    {
      id: '3',
      title: 'Athletic Scholarship',
      amount: '3.0 ETH',
      deadline: 'Jun 1, 2024',
      applicants: 178,
      tags: ['Web3', 'Blockchain', 'Innovation'],
      progress: 65,
      icon: '⚽',
      gradientClass: 'from-teal-900/40 to-teal-800/10',
      category: 'Athletic'
    }
  ];

  // Filter scholarships based on selected filter
  const filteredScholarships = featuredScholarships.filter(scholarship => 
    selectedFilter === 'All' ? true : scholarship.category === selectedFilter
  );

  // Additional filter options
  const additionalFilters = [
    'Amount: High to Low',
    'Amount: Low to High',
    'Deadline: Closest',
    'Most Popular',
    'Recently Added'
  ];

  // Function to handle filter selection
  const handleFilterClick = (filter: 'All' | 'STEM' | 'Arts' | 'Athletic') => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
  };

  // Function to sort scholarships
  const handleSort = (sortType: string) => {
    // Implementation for sorting can be added here
    setShowFilterDropdown(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // Enhanced scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add these helper functions near the top of the component
  const calculateTotalScholarships = () => {
    return filteredScholarships.length;
  };

  const calculateTotalAwarded = () => {
    return filteredScholarships.reduce((total, scholarship) => {
      const amount = parseInt(scholarship.amount.replace(/[^0-9]/g, ''));
      return total + amount;
    }, 0);
  };

  const calculateTotalStudents = () => {
    return filteredScholarships.reduce((total, scholarship) => {
      return total + scholarship.applicants;
    }, 0);
  };

  const formatDonationTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const dropdown = document.getElementById('profile-dropdown');
      const trigger = document.getElementById('profile-trigger');
      
      if (dropdown && trigger && 
          !dropdown.contains(event.target as Node) && 
          !trigger.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleAddSkill = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  }, [newSkill, skills]);

  const handleRemoveSkill = useCallback((skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  }, []);

  useEffect(() => {
    const updateKolkataTime = () => {
      const time = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setKolkataTime(time);
    };

    updateKolkataTime();
    const interval = setInterval(updateKolkataTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAskGroqClick = () => {
    if (chatbotRef.current) {
      chatbotRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen font-sans bg-black text-white gradient-overlay">
      {/* Updated HEADER */}
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="navbar-brand" onClick={() => navigateTo('home')}>
            <img 
              src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=40&h=40&fit=crop"
              alt="ScholarAid Logo" 
              className="w-10 h-10 rounded-lg"
            />
            <span className="brand-text text-2xl">ScholarAid</span>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <div className="navbar-skills-container">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Add your skills..."
                className="navbar-skills-input bg-white/5 border-white/10"
              />
              <button
                onClick={addSkill}
                className="absolute right-2 text-white/70 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 max-w-xs">
              {isClient && userSkills.slice(0, 3).map((skill, index) => (
                <span key={index} className="navbar-skill-tag">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="navbar-skill-remove">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
              {isClient && userSkills.length > 3 && (
                <span className="navbar-skill-tag">
                  +{userSkills.length - 3}
                </span>
              )}
            </div>
          </div>

          <nav className="flex items-center space-x-6">
            <a 
              href="#" 
              className={`navbar-link ${currentPage === 'achievements' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('achievements');
              }}
            >
              Achievements
            </a>
            <a href="#" 
              className="navbar-link"
              onClick={handleOpenDonateModal}>
              Donate
            </a>
            <a href="#" 
              className="navbar-link"
              onClick={(e) => {
                e.preventDefault();
                setIsScholarshipFormOpen(true);
              }}>
              Apply
            </a>
            
            <div className="flex items-center gap-4">
              {isClient && isWalletConnected && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-700/20 border border-green-500/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-400">Connected</span>
                </div>
              )}
              
              <Wallet>
                <ConnectWallet className="navbar-connect-button">
                  {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
                </ConnectWallet>
                <WalletDropdown className="navbar-dropdown">
                  <Identity className="px-4 py-3">
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownLink
                    icon="wallet"
                    href="https://keys.coinbase.com"
                    target="_blank"
                    className="navbar-dropdown-item"
                  >
                    Wallet
                  </WalletDropdownLink>
                  <WalletDropdownDisconnect className="navbar-dropdown-item" />
                </WalletDropdown>
              </Wallet>
            </div>

            {/* Profile Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                {session?.user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <span className="text-white">Profile</span>
            </button>

            {/* Ask GROQ AI Button */}
            <button
              onClick={handleAskGroqClick}
              className="ml-2 flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:from-blue-400 hover:to-purple-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{ fontSize: '1rem' }}
              aria-label="Ask GROQ AI"
            >
              <svg className="text-lg w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="7" y="11" width="10" height="6" rx="2" fill="#fff" stroke="#6366f1" strokeWidth="1.5"/><rect x="9" y="7" width="6" height="4" rx="2" fill="#a5b4fc" stroke="#6366f1" strokeWidth="1.5"/><circle cx="9.5" cy="14" r="1" fill="#6366f1"/><circle cx="14.5" cy="14" r="1" fill="#6366f1"/><rect x="11" y="17" width="2" height="2" rx="1" fill="#6366f1"/></svg>
              Ask GROQ AI
            </button>
            {/* Auth/Profile Dropdown */}
            {session && session.user ? (
              <div className="relative">
                <button
                  id="profile-trigger"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`profile-trigger ${isProfileDropdownOpen ? 'active' : ''}`}
                >
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                    <img src={session.user.image || ''} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <span className="text-white/90">{session.user.name}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    className={`w-4 h-4 text-blue-400 transform transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {/* Overlay */}
                <div className={`profile-dropdown-overlay ${isProfileDropdownOpen ? 'open' : ''}`} 
                     onClick={() => setIsProfileDropdownOpen(false)} />
                {/* Dropdown Menu */}
                <div id="profile-dropdown" 
                     className={`profile-dropdown ${isProfileDropdownOpen ? 'open' : ''}`}>  
                  {/* Modernized Avatar Section */}
                  <div className="flex flex-col items-center py-6 border-b border-blue-800/30 bg-gradient-to-br from-blue-900/30 to-purple-900/20">
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg ring-4 ring-blue-500/20 mb-2">
                      <img src={session.user.image || ''} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <span className="profile-name text-lg font-semibold text-white">{session.user.name}</span>
                    <span className="profile-email text-blue-400 text-sm">{session.user.email}</span>
                  </div>
                  {/* Actions will be updated in the next step */}
                  <div className="py-2">
                    {/* Actions go here */}
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/signin" legacyBehavior>
                <a className="navbar-button bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-5 py-2 rounded-xl shadow-lg hover:from-blue-400 hover:to-purple-400 transition-all duration-300">Sign In</a>
              </Link>
            )}
          </nav>
        </div>
      </header>
      
      {/* Mobile Skills Input (only visible on small screens) */}
      <div className="lg:hidden border-b border-gray-800 p-4">
        <div className="relative">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add your skills..."
            className="bg-black border border-blue-800 rounded-lg px-4 py-2 text-white w-full"
          />
          <button
            onClick={addSkill}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {isClient && userSkills.length > 0 && (
          <div className="flex flex-wrap mt-2">
            {userSkills.map((skill, index) => (
              <span key={index} className="bg-blue-900 text-white text-xs px-2 py-1 rounded-full mr-2 mb-2 flex items-center">
                {skill}
                <button onClick={() => removeSkill(skill)} className="ml-1 text-blue-300 hover:text-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* HERO SECTION */}
      <section className="relative py-20 flex flex-col lg:flex-row items-center justify-between px-4 gap-12 lg:gap-0 text-left max-w-7xl mx-auto w-full">
        {/* Left: Headline and Actions */}
        <div className="flex-1 flex flex-col justify-center items-start max-w-2xl w-full">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight leading-tight">
            Onchain<br />
            <span className="font-medium">is a scholarship<br />platform</span>
          </h1>

          <h1 className="text-5xl md:text-6xl font-light mb-4 tracking-tight leading-tight">
            from Kolkata weaving<br />
            <span className="font-medium">web3 & education via<br />transparency + innovation.</span>
          </h1>
          <p className="text-base md:text-lg text-gray-400 mb-6 mt-2">
            I'm always happy to chat, so email me for anything!<br />
            <span className="text-xs text-blue-400 select-all">scholarship@onchain.com</span>
          </p>
          <div className="flex flex-wrap gap-4 mb-4">
            <a href="#" onClick={e => { e.preventDefault(); setIsApplicationFormOpen(true); }} className="px-6 py-3 bg-white text-gray-900 rounded-xl font-medium shadow hover:bg-gray-100 transition-all">Apply Now</a>
            <a href="#" onClick={e => { e.preventDefault(); setIsScholarshipFormOpen(true); }} className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium shadow hover:bg-gray-700 transition-all">Learn More</a>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl w-full mb-8">
            <div className="search-bar group">
              <div className="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="search-input"
                placeholder="Search scholarships..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  debouncedSearch(e.target.value);
                }}
              />
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Find Scholarships
              </button>
              {searchResults.length > 0 && searchQuery && (
                <div className="search-results animate-fade-in">
                  {searchResults.map((result, index) => (
                    <div key={index} className="search-result-item">
                      <div>
                        <h4 className="font-medium text-white">{result.title}</h4>
                        <p className="text-sm text-gray-400">{result.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400 font-medium">{result.amount} USDC</span>
                        <button 
                          onClick={() => handleSearchResultClick(result)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Donation Box */}
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-lg space-y-6">
          {/* Latest Support Box */}
          <div className="bento-donations-display w-full flex flex-col gap-2 p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-md hover:border-emerald-400/50 transition-all duration-300 group animate-fade-in">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-mono text-emerald-400 group-hover:text-emerald-300 transition-colors">Latest Support</span>
            </div>
            
            {recentDonation ? (
              <div className="flex flex-col">
                <span className="text-white hover:text-emerald-300 transition-colors">{recentDonation.amount} ETH</span>
                <span className="text-xs text-emerald-400/70">{formatDonationTime(recentDonation.timestamp)}</span>
              </div>
            ) : (
              <span className="text-emerald-400/50">Awaiting first donation</span>
            )}
            
            <div className="mt-2 pt-2 border-t border-emerald-500/20">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400/70">Total Raised</span>
                <span className="text-white font-medium">{totalDonations.toFixed(2)} ETH</span>
              </div>
            </div>
          </div>

          {/* Recent Donations Component */}
          <div className="w-full">
            <RecentDonations refreshTrigger={donationCompleted} />
          </div>
        </div>
      </section>
      
      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto py-12 px-4">
        {currentPage === 'home' ? (
          <>
            {/* Featured Scholarships */}
            <section className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-4xl font-light tracking-tight mb-2">Featured Scholarships</h2>
                  <p className="text-gray-400 font-light">Discover opportunities that match your interests and goals</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleFilterClick('All')}
                    className={`filter-button ${selectedFilter === 'All' ? 'active' : ''}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => handleFilterClick('STEM')}
                    className={`filter-button ${selectedFilter === 'STEM' ? 'active' : ''}`}
                  >
                    STEM
                  </button>
                  <button 
                    onClick={() => handleFilterClick('Arts')}
                    className={`filter-button ${selectedFilter === 'Arts' ? 'active' : ''}`}
                  >
                    Arts
                  </button>
                  <button 
                    onClick={() => handleFilterClick('Athletic')}
                    className={`filter-button ${selectedFilter === 'Athletic' ? 'active' : ''}`}
                  >
                    Athletic
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="filter-button flex items-center gap-2"
                    >
                      More Filters
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 transition-transform duration-300 ${showFilterDropdown ? 'rotate-180' : ''}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {showFilterDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-blue-800/50 rounded-xl shadow-xl z-50">
                        {additionalFilters.map((filter, index) => (
                          <button
                            key={index}
                            onClick={() => handleSort(filter)}
                            className="w-full px-4 py-2 text-left hover:bg-blue-900/20 transition-colors"
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="scholarship-scroll-container">
                <div 
                  ref={scrollRef}
                  className="scholarship-scroll-wrapper"
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseUp}
                >
                  {[...filteredScholarships, ...filteredScholarships].map((scholarship, index) => (
                    <div
                      key={`${scholarship.id}-${index}`}
                      className="scholarship-card relative overflow-hidden backdrop-blur-xl 
                               bg-gradient-to-br from-gray-900/90 to-gray-800/95 
                               border border-white/10 rounded-2xl p-8
                               hover:border-blue-500/50 hover:bg-gray-800/95
                               transition-all duration-500 cursor-pointer
                               group w-[420px] hover:scale-[1.02]"
                      onClick={(e) => {
                        if (isDragging) {
                          e.preventDefault();
                          return;
                        }
                        setSelectedType(scholarship.category);
                        setIsScholarshipFormOpen(true);
                      }}
                    >
                      {/* Enhanced Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 opacity-0 
                                    group-hover:opacity-100 transition-all duration-500 pointer-events-none blur-xl" />
                      
                      {/* Category Badge with Vector Icon */}
                      <div className="absolute top-6 right-6 flex items-center gap-2">
                        <div className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2
                                      ${scholarship.category === 'STEM' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                        scholarship.category === 'Arts' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                        'bg-teal-500/20 text-teal-400 border border-teal-500/30'}`}>
                          {scholarship.category === 'STEM' ? (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          ) : scholarship.category === 'Arts' ? (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                            </svg>
                          )}
                          {scholarship.category}
                        </div>
                      </div>

                      {/* Main Content with Enhanced Layout */}
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-2xl font-light mb-3 text-white/90 group-hover:text-white transition-colors">
                              {scholarship.title}
                            </h3>
                          </div>
                        </div>

                        {/* Amount with Enhanced ETH Icon */}
                        <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                                      rounded-xl p-4 border border-blue-500/20 group-hover:border-blue-500/30 transition-colors">
                          <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                            <EthereumIcon />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-blue-400/80">Scholarship Amount</span>
                            <span className="text-2xl font-light text-blue-400">
                              {scholarship.amount}
                            </span>
                          </div>
                        </div>

                        {/* Tags with Enhanced Design */}
                        <div className="flex flex-wrap gap-2">
                          {scholarship.tags.map((skill, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 text-sm bg-white/5 border border-white/10 
                                       rounded-xl text-white/70 flex items-center gap-2
                                       hover:bg-white/10 hover:border-white/20 transition-all duration-300
                                       group-hover:translate-y-[-2px]"
                            >
                              <LightningIcon />
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Enhanced Footer Info */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 
                                          flex items-center justify-center text-white text-xl
                                          group-hover:scale-110 transition-transform">
                              {scholarship.icon}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm text-white/70">{scholarship.title}</span>
                              <span className="text-xs text-white/50">Verified Program</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg
                                        group-hover:bg-white/10 transition-colors">
                            <TimeIcon />
                            <div className="flex flex-col">
                              <span className="text-xs text-white/50">Deadline</span>
                              <span className="text-sm text-white/70">{scholarship.deadline}</span>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Progress Bar */}
                        <div className="relative pt-2">
                          <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-700/50">
                            <div
                              style={{ width: `${scholarship.progress}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center 
                                       bg-gradient-to-r from-blue-500 to-purple-500 rounded-full
                                       transition-all duration-500 ease-out group-hover:from-blue-400 group-hover:to-purple-400"
                            />
                          </div>
                          <div className="flex justify-between text-xs mt-2">
                            <span className="text-white/50 flex items-center gap-1">
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {scholarship.applicants} Applicants
                            </span>
                            <span className="text-blue-400/80">{scholarship.progress}% Complete</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Move the Chatbot directly under Top Applicants */}
            <div ref={chatbotRef} className="mb-16 flex justify-center w-full">
              <div className="w-full md:w-2/3">
                <Chatbot />
              </div>
            </div>

            {/* User Profile Section - Add ID for scroll */}
            <section id="profile" className="mb-16 relative scroll-mt-24">
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 blur-3xl opacity-30 -z-10"></div>
              
              <h1 className="text-4xl font-light mb-6">My Profile</h1>
              <div className="bg-black/40 backdrop-blur-xl border border-blue-800/30 rounded-2xl p-8
                            relative overflow-hidden group hover:border-blue-500/50 transition-all duration-500">
                {/* Interactive Glow Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 opacity-0 
                              group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 
                              group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row gap-8 relative">
                  {/* Left Column - Profile Vector */}
                  <div className="md:w-1/4">
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full relative group/avatar
                                    before:absolute before:inset-0 before:rounded-full
                                    before:bg-gradient-to-r before:from-blue-500/20 before:to-purple-500/20
                                    before:animate-pulse before:duration-2000">
                        {/* Vector Avatar */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-20 h-20 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                                  d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                        {/* Animated Border */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30
                                      group-hover/avatar:opacity-50 transition-opacity duration-500"></div>
                      </div>

                      <div className="mt-4 space-y-1 text-center relative">
                        <div className="relative group/edit">
                          <h3 className="text-2xl font-light text-white/90 group-hover/edit:text-white transition-colors">
                            {session && session.user ? session.user.name : "Shubh"}
                          </h3>
                          <button className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/edit:opacity-100
                                           transition-opacity duration-300">
                            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-blue-400/80 text-sm">
                          {session && session.user ? session.user.email : "jitius0414@gmail.com"}
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => setIsScholarshipFormOpen(true)}
                        className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700
                                 text-white rounded-xl hover:from-blue-500 hover:to-blue-600
                                 transition-all duration-300 text-sm font-medium
                                 relative group/button overflow-hidden"
                      >
                        <span className="relative z-10">Apply for Scholarship</span>
                        <div className="absolute inset-0 -translate-y-full group-hover/button:translate-y-0
                                      bg-gradient-to-r from-blue-500 to-purple-500
                                      transition-transform duration-500"></div>
                      </button>
                    </div>
                  </div>

                  {/* Right Column - Skills */}
                  <div className="md:w-3/4">
                    <div className="mb-8">
                      <h2 className="text-2xl font-light mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        My Skills
                      </h2>
                      <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-blue-800/30
                                    group/skills hover:border-blue-500/50 transition-all duration-500">
                        <div className="relative">
                          {/* Skills Input */}
                          <div className="relative mb-4">
                            <input
                              type="text"
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addSkill();
                                }
                              }}
                              placeholder="Add your skills..."
                              className="w-full px-4 py-2.5 bg-black/60 border border-blue-800/30 rounded-xl text-white 
                                       placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-all duration-300
                                       pr-12"
                            />
                            <button
                              onClick={addSkill}
                              className="absolute right-2 top-1/2 -translate-y-1/2 
                                       text-blue-400/70 hover:text-blue-400 transition-colors
                                       bg-blue-500/10 rounded-lg hover:bg-blue-500/20"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                      d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>

                          {/* Skills Tags */}
                          <div className="flex flex-wrap gap-2">
                            {isClient && userSkills.map((skill, index) => (
                              <div 
                                key={index} 
                                className="px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-xl 
                                         flex items-center gap-2 group/skill hover:border-blue-500/50 
                                         transition-all duration-300 relative overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                                              opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300"></div>
                                <span className="text-white/80 relative z-10">{skill}</span>
                                <button 
                                  onClick={() => removeSkill(skill)} 
                                  className="relative z-10 text-blue-400/70 hover:text-blue-400 transition-colors
                                           hover:bg-blue-500/20 p-1 rounded-lg"
                                >
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>

                          {isClient && userSkills.length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                              Add your first skill to get started
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Potential Scholarship Matches */}
                    <div>
                      <h2 className="text-2xl font-light mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        Potential Scholarship Matches
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userSkills.length > 0 ? (
                          <>
                            <div className="bg-black/40 backdrop-blur-xl border border-blue-800/30 rounded-xl p-6 
                                          hover:border-blue-500/50 transition-all duration-300 group/card
                                          relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 
                                            opacity-0 group-hover/card:opacity-100 transition-all duration-500"></div>
                              <h4 className="text-xl font-light text-white/90 mb-3">Tech Innovation Scholarship</h4>
                              <p className="text-sm text-gray-400 mb-4">Matches your skills: {userSkills.slice(0, 2).join(', ')}</p>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <EthereumIcon />
                                  </div>
                                  <span className="text-2xl font-light text-blue-400">2.5 ETH</span>
                                </div>
                                <button 
                                  onClick={() => setIsScholarshipFormOpen(true)}
                                  className="px-4 py-2 bg-blue-600/90 hover:bg-blue-600 rounded-xl text-sm font-medium
                                           transition-all duration-300 group-hover/card:scale-105">
                                  <span className="relative z-10">Apply Now</span>
                                  <div className="absolute inset-0 -translate-y-full group-hover/card:translate-y-0
                                                bg-gradient-to-r from-blue-500 to-purple-500
                                                transition-transform duration-500"></div>
                                </button>
                              </div>
                            </div>

                            <div className="bg-black/40 backdrop-blur-xl border border-blue-800/30 rounded-xl p-6
                                          hover:border-blue-500/50 transition-all duration-300 group/card
                                          relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 
                                            opacity-0 group-hover/card:opacity-100 transition-all duration-500"></div>
                              <h4 className="text-xl font-light text-white/90 mb-3">Research Grant</h4>
                              <p className="text-sm text-gray-400 mb-4">Matches your profile</p>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <EthereumIcon />
                                  </div>
                                  <span className="text-2xl font-light text-blue-400">1.8 ETH</span>
                                </div>
                                <button 
                                  onClick={() => setIsScholarshipFormOpen(true)}
                                  className="px-4 py-2 bg-blue-600/90 hover:bg-blue-600 rounded-xl text-sm font-medium
                                           transition-all duration-300 group-hover/card:scale-105">
                                  <span className="relative z-10">Apply Now</span>
                                  <div className="absolute inset-0 -translate-y-full group-hover/card:translate-y-0
                                                bg-gradient-to-r from-blue-500 to-purple-500
                                                transition-transform duration-500"></div>
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="col-span-2 text-center py-12 text-gray-400">
                            <svg className="w-16 h-16 mx-auto mb-4 text-blue-400/50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Add skills to see matching scholarships
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works - Moved after profile */}
            <section className="mb-16">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="w-full md:w-2/3">
                  <h2 className="text-4xl font-bold mb-10">How It Works</h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 border border-blue-400 rounded-lg flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-blue-400">
                          <rect x="2" y="4" width="20" height="16" rx="2" ry="2" strokeWidth="2" />
                          <path strokeLinecap="round" strokeWidth="2" d="M12 12h4" />
                        </svg>
                      </div>
                      <h3 className="text-center font-medium">Connect<br />Wallet</h3>
                    </div>

                    <div className="text-blue-400 font-bold">→</div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 border border-blue-400 rounded-lg flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-blue-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <h3 className="text-center font-medium">Submit<br />Application</h3>
                    </div>

                    <div className="text-blue-400 font-bold">→</div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 border border-blue-400 rounded-full flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-blue-400">
                          <circle cx="12" cy="12" r="10" strokeWidth="2" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                        </svg>
                      </div>
                      <h3 className="text-center font-medium">Get Funded</h3>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/3 mt-8 md:mt-0">
                  <div className="bg-black border border-blue-800 rounded-lg p-4">
                  
<div className="relative">
  <button 
    className="w-full p-3 text-left flex items-center justify-between bg-black text-white rounded-lg mb-4 border border-blue-800 hover:border-blue-400 transition-colors"
    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
  >
    <span>{selectedType || "Type of Applicant"}</span>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      className={`w-5 h-5 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>
  
  {isDropdownOpen && (
    <div className="absolute w-full bg-gray-900 border border-blue-800 rounded-lg mt-1 py-2 z-10">
      {[
        'Undergraduate Student',
        'Graduate Student',
        'High School Senior',
        'International Student',
        'Transfer Student',
        'First-Generation Student',
        'Research Scholar'
      ].map((type) => (
        <button
          key={type}
          className="w-full px-4 py-2 text-left hover:bg-blue-900 transition-colors"
          onClick={() => {
            setSelectedType(type);
            setIsDropdownOpen(false);
          }}
        >
          {type}
        </button>
      ))}
    </div>
  )}

<button 
  className={`w-full py-3 text-white rounded-lg text-xl font-bold ${
    selectedType 
      ? 'bg-blue-500 hover:bg-blue-600' 
      : 'bg-blue-500/50 cursor-not-allowed'
  } transition-colors`}
  disabled={!selectedType}
  onClick={()=> setIsApplicationFormOpen(true)}
>


  Apply Now
</button></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonial */}
            <section className="mb-16">
              <div className="bg-black border border-blue-800 rounded-lg p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                    <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=96&h=96&fit=crop"
            alt="Jessica Wilson" 
            className="w-full h-full object-cover" 
          />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl mb-4">"The Onchain Scholarship Portal made funding my education simple and transparent."</p>
                    <p className="text-blue-400 font-medium">Jessica Wilson</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : null}
      </main>

      {/* Replace the old footer with the new Footer component */}
      <Footer />

      {isDonateModalOpen && (
        <DonationModal 
          isOpen={isDonateModalOpen} 
          onClose={handleCloseDonateModal} 
          onDonationComplete={handleDonationComplete}
        />
      )}
      <ApplicationForm 
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
        applicantType={selectedType}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ScholarshipApplicationForm
        isOpen={isScholarshipFormOpen}
        onClose={() => setIsScholarshipFormOpen(false)}
        onSubmit={handleApplicationSubmit}
      />

      {/* Add Profile button in the navbar */}
      <div className="navbar-right">
        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            {session?.user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <span className="text-white">Profile</span>
        </button>
      </div>

      {/* Add Profile modal */}
      <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}

