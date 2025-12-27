import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Settings, 
  Mail, 
  Send,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard, GalaxyEffect, BackgroundEffectErrorBoundary } from '../components';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState<ContactFormData>({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success - in real app, this would send to backend
      setSubmitStatus('success');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden safe-area-inset">
      {/* Skip to main content link for accessibility */}
      <a href="#contact-main" className="skip-link sr-only focus:not-sr-only">
        Skip to main content
      </a>
      
      {/* Galaxy Background Effect */}
      <BackgroundEffectErrorBoundary>
        <GalaxyEffect particleCount={120} interactive={true} mouseInfluence={60} />
      </BackgroundEffectErrorBoundary>
      
      {/* Header Navigation */}
      <header className="relative z-10 p-4 sm:p-6">
        <GlassCard className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 p-4 sm:p-6" aria-label="Contact page header">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 w-full sm:w-auto">
            <Link to="/" className="flex items-center space-x-2" aria-label="MedFact home">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center" aria-hidden="true">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-white font-semibold text-lg sm:text-xl">MedFact</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6" role="navigation" aria-label="Main navigation">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors min-h-[44px] px-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                <span>Home</span>
              </Link>
              {user && (
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors min-h-[44px] px-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                >
                  <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                  <span>Dashboard</span>
                </Link>
              )}
              {user && (
                <Link 
                  to="/settings" 
                  className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors min-h-[44px] px-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                  <span>Settings</span>
                </Link>
              )}
              <Link 
                to="/contact" 
                className="flex items-center space-x-2 text-white font-medium min-h-[44px] px-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                aria-current="page"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Contact</span>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Navigation */}
            <nav className="flex md:hidden items-center space-x-2" role="navigation" aria-label="Mobile navigation">
              <Link 
                to="/" 
                className="flex items-center justify-center text-white/70 hover:text-white transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                aria-label="Home"
              >
                <Home className="w-5 h-5" aria-hidden="true" />
              </Link>
              {user && (
                <>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center justify-center text-white/70 hover:text-white transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                    aria-label="Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5" aria-hidden="true" />
                  </Link>
                  <Link 
                    to="/settings" 
                    className="flex items-center justify-center text-white/70 hover:text-white transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                    aria-label="Settings"
                  >
                    <Settings className="w-5 h-5" aria-hidden="true" />
                  </Link>
                </>
              )}
            </nav>
            
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-white">
                  <User className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors min-h-[44px] px-3 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                  aria-label="Log out of your account"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/" 
                className="px-4 py-2 min-h-[44px] flex items-center bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                Sign In
              </Link>
            )}
          </div>
        </GlassCard>
      </header>


      {/* Main Content */}
      <main id="contact-main" className="relative z-10 px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
          {/* Page Header */}
          <GlassCard className="text-center py-6 sm:py-8 px-4 sm:px-6" aria-label="Contact page header">
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center" aria-hidden="true">
                <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Contact Us</h1>
            <p className="text-white/70 text-sm sm:text-base">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </GlassCard>

          {/* Contact Form */}
          <GlassCard className="p-4 sm:p-6" aria-label="Contact form">
            {submitStatus === 'success' ? (
              <div className="text-center py-6 sm:py-8" role="status" aria-live="polite">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Message Sent!</h2>
                <p className="text-white/70 mb-6 text-sm sm:text-base">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="px-6 py-2 min-h-[44px] bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate aria-label="Contact form">
                {submitStatus === 'error' && (
                  <div className="flex items-center space-x-2 p-3 sm:p-4 bg-red-500/20 border border-red-500/30 rounded-lg" role="alert" aria-live="polite">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" aria-hidden="true" />
                    <p className="text-red-300 text-sm">
                      Failed to send message. Please try again later.
                    </p>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label htmlFor="contact-name" className="block text-white/80 text-sm font-medium mb-2">
                    Name <span className="text-red-400" aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 min-h-[44px] bg-white/10 border ${
                      errors.name ? 'border-red-500/50 border-2' : 'border-white/20'
                    } rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-colors`}
                    placeholder="Your name"
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-required="true"
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="mt-1 text-red-400 text-sm" role="alert" aria-live="polite">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="contact-email" className="block text-white/80 text-sm font-medium mb-2">
                    Email <span className="text-red-400" aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 min-h-[44px] bg-white/10 border ${
                      errors.email ? 'border-red-500/50 border-2' : 'border-white/20'
                    } rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-colors`}
                    placeholder="your@email.com"
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-required="true"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="mt-1 text-red-400 text-sm" role="alert" aria-live="polite">{errors.email}</p>
                  )}
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="contact-subject" className="block text-white/80 text-sm font-medium mb-2">
                    Subject <span className="text-red-400" aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input
                    type="text"
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 min-h-[44px] bg-white/10 border ${
                      errors.subject ? 'border-red-500/50 border-2' : 'border-white/20'
                    } rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-colors`}
                    placeholder="What's this about?"
                    aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                    aria-invalid={errors.subject ? 'true' : 'false'}
                    aria-required="true"
                  />
                  {errors.subject && (
                    <p id="contact-subject-error" className="mt-1 text-red-400 text-sm" role="alert" aria-live="polite">{errors.subject}</p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="contact-message" className="block text-white/80 text-sm font-medium mb-2">
                    Message <span className="text-red-400" aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full px-4 py-3 bg-white/10 border ${
                      errors.message ? 'border-red-500/50 border-2' : 'border-white/20'
                    } rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-colors resize-none`}
                    placeholder="Tell us what's on your mind..."
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    aria-invalid={errors.message ? 'true' : 'false'}
                    aria-required="true"
                  />
                  {errors.message && (
                    <p id="contact-message-error" className="mt-1 text-red-400 text-sm" role="alert" aria-live="polite">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 min-h-[44px] bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" aria-hidden="true" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
