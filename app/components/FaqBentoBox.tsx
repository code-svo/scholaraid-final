import React, { useState } from 'react';

const faqs = [
  {
    question: 'What is ScholarAid?',
    answer: 'ScholarAid is a transparent, onchain scholarship platform that connects students with funding opportunities using blockchain technology.'
  },
  {
    question: 'How do I apply for a scholarship?',
    answer: 'Click the "Apply Now" button on the homepage or in your profile section, fill out the application form, and submit your details.'
  },
  {
    question: 'How are donations handled?',
    answer: 'All donations are processed onchain for full transparency. You can view recent donations and total funds raised in real time.'
  },
  {
    question: 'Do I need a crypto wallet to use ScholarAid?',
    answer: 'Yes, you need a crypto wallet (such as Coinbase Wallet or MetaMask) to donate or apply for scholarships.'
  },
  {
    question: 'Is my data secure?',
    answer: 'We use best practices for security and privacy. Sensitive data is never shared without your consent.'
  }
];

export default function FaqBentoBox() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-bento-glow bg-black/60 border border-green-800/40 rounded-2xl p-8 shadow-xl backdrop-blur-xl w-full">
      <h3 className="text-2xl font-semibold mb-6 text-green-400">FAQs</h3>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="rounded-xl bg-black/30 border border-green-800/20 p-4 transition-all duration-300">
            <button
              className="w-full flex justify-between items-center text-left text-lg font-medium text-white focus:outline-none"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              aria-expanded={openIndex === idx}
            >
              <span>{faq.question}</span>
              <svg
                className={`w-5 h-5 ml-2 transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-green-400' : 'text-green-700'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === idx && (
              <div className="mt-3 text-green-200 text-base animate-fade-in">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 