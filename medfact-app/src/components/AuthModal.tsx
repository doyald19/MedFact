import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts';
import GlassCard from './ui/GlassCard';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

interface FormData {
  email: string;
  password: string;
  name: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  general?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const { login, signup, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Sync mode with initialMode prop when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setFormData({ email: '', password: '', name: '' });
      setErrors({});
      setShowPassword(false);
    }
  }, [isOpen, initialMode]);

  // Don't render if not open
  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Name validation for signup
    if (mode === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      } else if (formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters long';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setErrors({});
      
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await signup({
          email: formData.email,
          password: formData.password,
          name: formData.name
        });
      }
      
      // Close modal on success
      onClose();
      
      // Reset form
      setFormData({ email: '', password: '', name: '' });
      
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const switchMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setErrors({});
    setFormData({ email: '', password: '', name: '' });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm safe-area-inset"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-description"
    >
      <GlassCard 
        variant="elevated" 
        blur="lg"
        className="w-full max-w-md p-4 sm:p-6 relative animate-in fade-in-0 zoom-in-95 duration-300"
        role="document"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full glass-button border border-white/20"
          aria-label="Close authentication modal"
          disabled={isLoading}
          type="button"
        >
          <X size={20} className="text-gray-600 dark:text-gray-300" aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="mb-4 sm:mb-6 pr-10">
          <h2 
            id="auth-modal-title"
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2"
          >
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p id="auth-modal-description" className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            {mode === 'login' 
              ? 'Sign in to access your personalized health dashboard' 
              : 'Join MedFact to track your health journey'
            }
          </p>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm" role="alert" aria-live="polite">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name Field (Signup only) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  id="auth-name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  className={`w-full pl-10 pr-4 py-3 min-h-[44px] rounded-lg glass-card glass-input text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.name ? 'border-red-500 border-2' : ''
                  }`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-required="true"
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address <span className="text-red-500" aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                id="auth-email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className={`w-full pl-10 pr-4 py-3 min-h-[44px] rounded-lg glass-card glass-input text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  errors.email ? 'border-red-500 border-2' : ''
                }`}
                placeholder="Enter your email"
                disabled={isLoading}
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-required="true"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password <span className="text-red-500" aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                className={`w-full pl-10 pr-12 py-3 min-h-[44px] rounded-lg glass-card glass-input text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  errors.password ? 'border-red-500 border-2' : ''
                }`}
                placeholder="Enter your password"
                disabled={isLoading}
                aria-describedby={errors.password ? 'password-error' : 'password-hint'}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-required="true"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center rounded glass-button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-400" aria-hidden="true" />
                ) : (
                  <Eye size={18} className="text-gray-400" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password ? (
              <p id="password-error" className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                {errors.password}
              </p>
            ) : (
              <p id="password-hint" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 min-h-[44px] rounded-lg glass-card-elevated text-white font-medium glass-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{mode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
              </span>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Mode Switch */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button
              onClick={switchMode}
              disabled={isLoading}
              className="text-blue-600 dark:text-blue-400 font-medium glass-link disabled:opacity-50 min-h-[44px] px-1"
              type="button"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default AuthModal;