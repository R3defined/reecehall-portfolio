import { useState, useRef, useEffect } from 'react';
import DraggableWindow from './DraggableWindow';
import { userConfig } from '../../config/userConfig';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  applicationReason: string;
  message: string;
  howDidYouFindMe: string;
  links: string;
}

const ApplicationForm = ({ isOpen, onClose }: ApplicationFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    applicationReason: '',
    message: '',
    howDidYouFindMe: '',
    links: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.applicationReason) newErrors.applicationReason = 'Please tell us what brings you here';
    if (!formData.message.trim()) newErrors.message = 'Please describe your vision, challenge, or idea';
    if (!formData.howDidYouFindMe.trim()) newErrors.howDidYouFindMe = 'Please tell us how you found me';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
          setFormData({
            name: '',
            email: '',
            applicationReason: '',
            message: '',
            howDidYouFindMe: '',
            links: ''
          });
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const renderMainForm = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Join the Network</h2>
        <p className="text-gray-400">Your gateway into the Redefined ecosystem</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-4 py-3 bg-gray-800 border ${errors.name ? 'border-red-400' : 'border-gray-600'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
          placeholder="Enter your full name"
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-4 py-3 bg-gray-800 border ${errors.email ? 'border-red-400' : 'border-gray-600'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
          placeholder="your.email@company.com"
        />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">What brings you here? *</label>
        <select
          value={formData.applicationReason}
          onChange={(e) => handleInputChange('applicationReason', e.target.value)}
          className={`w-full px-4 py-3 bg-gray-800 border ${errors.applicationReason ? 'border-red-400' : 'border-gray-600'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
        >
          <option value="">Select what brings you here</option>
          <option value="collaboration">Collaboration</option>
          <option value="mentorship">Mentorship</option>
          <option value="inquiry">General Inquiry</option>
          <option value="other">Other</option>
        </select>
        {errors.applicationReason && <p className="text-red-400 text-xs mt-1">{errors.applicationReason}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Describe your vision / challenge / idea *</label>
        <textarea
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          rows={4}
          className={`w-full px-4 py-3 bg-gray-800 border ${errors.message ? 'border-red-400' : 'border-gray-600'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200`}
          placeholder="Tell me about your vision, the challenge you're facing, or the idea you want to bring to life..."
        />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">How did you find me? *</label>
        <input
          type="text"
          value={formData.howDidYouFindMe}
          onChange={(e) => handleInputChange('howDidYouFindMe', e.target.value)}
          className={`w-full px-4 py-3 bg-gray-800 border ${errors.howDidYouFindMe ? 'border-red-400' : 'border-gray-600'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
          placeholder="LinkedIn, GitHub, referral, search engine, etc."
        />
        {errors.howDidYouFindMe && <p className="text-red-400 text-xs mt-1">{errors.howDidYouFindMe}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Attach any links (Optional)</label>
        <input
          type="text"
          value={formData.links}
          onChange={(e) => handleInputChange('links', e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          placeholder="Portfolio, LinkedIn, project links, etc."
        />
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-xs text-gray-400 leading-relaxed">
              By submitting, you agree to be contacted by Reece and the Redefined team. Your data is never sold.
              This form is protected by reCAPTCHA and SSL encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );


  const renderSuccessState = () => (
    <div className="text-center space-y-6 animate-fade-in">
      {/* Launchpad-style success animation */}
      <div className="relative">
        <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-bounce-in">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {/* Success ripple effect */}
        <div className="absolute inset-0 w-32 h-32 bg-green-400 rounded-3xl mx-auto animate-ping opacity-20"></div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-100">Application Received!</h2>
        <p className="text-lg text-gray-300 max-w-md mx-auto">
          Welcome to the network. Your journey into the Redefined ecosystem begins now.
        </p>
        
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mx-auto max-w-md">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">What happens next:</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Review within 24-48 hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Consultation call if it's a good fit</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Custom proposal and next steps</span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <p className="text-sm text-gray-500 mb-3">While you wait, check out the latest updates:</p>
          <a 
            href="https://blog.reecehall.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
          >
            <span>Read the Build Log</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <p className="text-xs text-gray-500 italic">
          "Building the future, one connection at a time." — Reece Hall
        </p>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center space-y-4">
      <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-200">Submission Failed</h3>
      <p className="text-gray-400">There was an error submitting your application. Please try again or contact me directly.</p>
      <button
        onClick={() => setSubmitStatus('idle')}
        className="text-blue-400 hover:text-blue-300 text-sm"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <DraggableWindow
      title="Join the Network - Application"
      onClose={onClose}
      initialPosition={{ x: 100, y: 50 }}
      initialSize={{ width: 500, height: 600 }}
      className="!bg-gray-900 animate-bounce-in"
    >
      <div className="h-full flex flex-col p-6">
        {submitStatus === 'success' && (
          <div className="flex-grow overflow-y-auto pr-2 -mr-2 min-h-0">
            <div className="pb-4">
              {renderSuccessState()}
            </div>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="flex-grow overflow-y-auto pr-2 -mr-2 min-h-0">
            <div className="pb-4">
              {renderErrorState()}
            </div>
          </div>
        )}
        
        {submitStatus === 'idle' && (
          <>
            {/* Scrollable form content */}
            <div className="flex-grow overflow-y-auto pr-2 -mr-2 min-h-0">
              <div className="pb-4">
                {renderMainForm()}
              </div>
            </div>

            {/* Fixed submit button at bottom */}
            <div className="flex-shrink-0 pt-4 border-t border-gray-700 bg-gray-900">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting && (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application'}</span>
                {!isSubmitting && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </DraggableWindow>
  );
};

export default ApplicationForm;