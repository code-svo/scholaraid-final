"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-950">
      <div className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl p-10 max-w-md w-full flex flex-col items-center border border-white/10">
        <div className="mb-6 flex flex-col items-center">
          <svg className="w-12 h-12 mb-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="7" y="11" width="10" height="6" rx="2" fill="currentColor" strokeWidth="1.5"/>
            <rect x="9" y="7" width="6" height="4" rx="2" fill="currentColor" strokeWidth="1.5"/>
            <circle cx="9.5" cy="14" r="1" fill="#fff"/>
            <circle cx="14.5" cy="14" r="1" fill="#fff"/>
            <rect x="11" y="17" width="2" height="2" rx="1" fill="#fff"/>
          </svg>
          <h1 className="text-2xl font-bold text-white mb-1">Sign in to ScholarAid</h1>
          <p className="text-blue-400/80 text-sm text-center">Access your profile, scholarships, and more</p>
        </div>

        <button
          onClick={() => signIn("google", { 
            callbackUrl: "/",
            redirect: true
          })}
          className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl 
                     bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold 
                     shadow-lg hover:from-blue-400 hover:to-purple-400 
                     transition-all duration-300 text-lg
                     relative overflow-hidden group"
        >
          <div className="absolute inset-0 w-full h-full transition-all duration-300 
                        bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 
                        group-hover:opacity-100"></div>
          <svg className="w-6 h-6 relative z-10" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.6 0 5 .8 7 2.3l6.4-6.4C33.5 6.1 28.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"/>
              <path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 17.1 19.4 14 24 14c2.6 0 5 .8 7 2.3l6.4-6.4C33.5 6.1 28.1 4 24 4c-7.2 0-13.4 3.1-17.7 8.1z"/>
              <path fill="#FBBC05" d="M24 44c5.8 0 10.7-1.9 14.3-5.1l-6.6-5.4C29.7 35.2 27 36 24 36c-5.7 0-10.6-2.9-13.7-7.2l-7 5.4C6.6 40.9 14.1 44 24 44z"/>
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.2 3.2-4.7 7.5-11.7 7.5-6.6 0-12-5.4-12-12s5.4-12 12-12c2.6 0 5 .8 7 2.3l6.4-6.4C33.5 6.1 28.1 4 24 4c-7.2 0-13.4 3.1-17.7 8.1z"/>
            </g>
          </svg>
          <span className="relative z-10">Sign in with Google</span>
        </button>

        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 