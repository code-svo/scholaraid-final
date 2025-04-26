import { FC } from 'react';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  applicantType: string;
}

const ApplicationForm: FC<ApplicationFormProps> = ({ isOpen, onClose, applicantType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-gray-900 rounded-lg p-8 max-w-2xl w-full mx-4 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Scholarship Application</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-200">Applicant Type</label>
            <input 
              type="text" 
              value={applicantType} 
              disabled 
              className="mt-1 w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Full Name</label>
            <input 
              type="text" 
              required
              className="mt-1 w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Email</label>
            <input 
              type="email" 
              required
              className="mt-1 w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
            />
          </div>

          {/* Academic Information */}
          <div>
            <label className="block text-sm font-medium text-gray-200">Current GPA</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              max="4.0"
              required
              className="mt-1 w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Field of Study</label>
            <select 
              required
              className="mt-1 w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
            >
              <option value="">Select field</option>
              <option value="computer-science">Computer Science</option>
              <option value="engineering">Engineering</option>
              <option value="business">Business</option>
              <option value="arts">Arts</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Additional Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-200">Family Income Category</label>
            <select 
              required
              className="mt-1 w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
            >
              <option value="">Select category</option>
              <option value="lower">Lower Class (Below $30,000/year)</option>
              <option value="middle">Middle Class ($30,000-$100,000/year)</option>
              <option value="upper">Upper Class (Above $100,000/year)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Leadership Experience</label>
            <select 
              required
              className="mt-1 w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
            >
              <option value="">Select experience</option>
              <option value="none">No Experience</option>
              <option value="club">Club/Organization Leader</option>
              <option value="volunteer">Volunteer Coordinator</option>
              <option value="work">Work Team Leader</option>
              <option value="other">Other Leadership Role</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-200">Brief Statement</label>
            <textarea 
              required
              placeholder="Tell us about your achievements and why you deserve this scholarship (100-150 words)"
              className="mt-1 w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 h-24"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-200">Wallet Address</label>
            <input 
              type="text" 
              required
              placeholder="0x..."
              className="mt-1 w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <button 
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;