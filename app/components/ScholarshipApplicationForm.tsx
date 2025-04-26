'use client';

import { useState } from 'react';

export interface ApplicationFormData {
  name: string;
  email: string;
  scholarshipType: string;
  interest: string;
  skills: string[];
  additionalInfo: string;
}

interface ScholarshipApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationFormData) => void;
}

export default function ScholarshipApplicationForm({
  isOpen,
  onClose,
  onSubmit,
}: ScholarshipApplicationFormProps) {
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    scholarshipType: 'STEM',
    interest: '',
    skills: [],
    additionalInfo: '',
  });
  const [currentSkill, setCurrentSkill] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const addSkill = () => {
    if (currentSkill && !formData.skills.includes(currentSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-2xl w-full max-w-2xl overflow-hidden border border-white/10">
        {/* Header */}
        <div className="relative p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-2xl font-light text-white">Scholarship Application</h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-400">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                         text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 
                         focus:ring-blue-500/20 transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-400">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                         text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 
                         focus:ring-blue-500/20 transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Scholarship Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-400">
              Scholarship Type <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={formData.scholarshipType}
              onChange={e => setFormData(prev => ({ ...prev, scholarshipType: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                       text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                       transition-all duration-200"
            >
              <option value="STEM">STEM Scholarship</option>
              <option value="Arts">Arts Scholarship</option>
              <option value="Athletic">Athletic Scholarship</option>
            </select>
          </div>

          {/* Area of Interest */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-400">
              Area of Interest <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.interest}
              onChange={e => setFormData(prev => ({ ...prev, interest: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                       text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 
                       focus:ring-blue-500/20 transition-all duration-200"
              placeholder="e.g. Computer Science, Fine Arts, etc."
            />
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-blue-400">
              Skills <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentSkill}
                onChange={e => setCurrentSkill(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                         text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 
                         focus:ring-blue-500/20 transition-all duration-200"
                placeholder="e.g. Programming, Design, etc."
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                         transition-colors duration-200 flex items-center gap-2"
              >
                Add
              </button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 
                             border border-blue-500/30 rounded-full text-blue-400 text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-blue-300 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-400">Additional Information</label>
            <textarea
              value={formData.additionalInfo}
              onChange={e => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                       text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 
                       focus:ring-blue-500/20 transition-all duration-200 min-h-[120px]"
              placeholder="Tell us more about yourself and why you're applying for this scholarship"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/10 text-white border border-white/20 
                       rounded-lg transition-all duration-300 hover:bg-white/20
                       shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="relative px-6 py-3 bg-white text-gray-900 font-medium rounded-lg 
                       transition-all duration-300 hover:bg-gray-100
                       shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]
                       after:absolute after:inset-0 after:rounded-lg after:border after:border-white/50 
                       after:transition-all after:duration-300
                       hover:after:border-blue-400/50 hover:after:scale-105 hover:after:opacity-0
                       group overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Submit Application
                <svg 
                  className="w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-white 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                            blur-xl">
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 