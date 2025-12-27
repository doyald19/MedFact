import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogIn, Menu, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, AuthModal, BackgroundEffectErrorBoundary } from '../components';
import { ThreadsEffect } from '../components/background-effects';
import SymptomChecker from '../components/SymptomChecker';
import { useAuth } from '../contexts';
import { AnalysisResults } from '../types';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [preservedSymptom, setPreservedSymptom] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setPreservedSymptom(searchInput.trim());
      setShowSymptomChecker(true);
    }
  };

  const handleBackToHome = () => {
    setShowSymptomChecker(false);
    setSearchInput('');
    setPreservedSymptom('');
  };

  const handleSymptomCheckerComplete = (results: AnalysisResults) => {
    // Save the health report if user is authenticated
    if (user) {
      const healthReport = {
        id: `report_${Date.now()}`,
        userId: user.id,
        timestamp: new Date(),
        initialSymptom: preservedSymptom,
        questions: [], // This would be populated by the SymptomChecker
        results,
        followUpDate: undefined
      };

      // Save to localStorage (in a real app, this would be saved to a backend)
      const existingReports = localStorage.getItem(`health_reports_${user.id}`);
      const reports = existingReports ? JSON.parse(existingReports) : [];
      reports.push(healthReport);
      localStorage.setItem(`health_reports_${user.id}`, JSON.stringify(reports));
    }
    
    console.log('Analysis complete:', results);
  };

  const handleAuthPrompt = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleSignup = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
  };

  // Close mobile menu when clicking outside or pressing Escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && showMobileMenu) {
      setShowMobileMenu(false);
    }
  };

  if (showSymptomChecker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative safe-area-inset">
        <BackgroundEffectErrorBoundary>
          <ThreadsEffect />
        </BackgroundEffectErrorBoundary>
        
        {/* Header with back button */}
        <header className="relative z-10 p-4 sm:p-6">
          <nav className="flex items-center justify-between max-w-7xl mx-auto" role="navigation" aria-label="Symptom checker navigation">
            {/* Back button and Logo */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleBackToHome}
                className="flex items-center space-x-2 px-3 py-2 min-h-[44px] text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Go back to home page"
              >
                <ArrowLeft size={20} aria-hidden="true" />
                <span className="hidden sm:inline">Back to Home</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center" aria-hidden="true">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-white text-lg sm:text-xl font-bold">MedFact</span>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {user ? (
                <>
                  <Link 
                    to="/dashboard"
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 min-h-[44px] text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                    aria-label={`Go to dashboard for ${user.name}`}
                  >
                    <User size={18} aria-hidden="true" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 min-h-[44px] bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Log out of your account"
                  >
                    <LogIn size={18} aria-hidden="true" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleLogin}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 min-h-[44px] text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                    aria-label="Log in to your account"
                  >
                    <LogIn size={18} aria-hidden="true" />
                    <span className="hidden sm:inline">Login</span>
                  </button>
                  <button 
                    onClick={handleSignup}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 min-h-[44px] bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Create a new account"
                  >
                    <User size={18} aria-hidden="true" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </button>
                </>
              )}
            </div>
          </nav>
        </header>

        {/* Symptom Checker Content */}
        <motion.div 
          className="relative z-10 p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SymptomChecker
            initialSymptom={preservedSymptom}
            onComplete={handleSymptomCheckerComplete}
            onAuthPrompt={handleAuthPrompt}
          />
        </motion.div>

        {/* Auth Modal for Symptom Checker view */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative safe-area-inset" onKeyDown={handleKeyDown}>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link sr-only focus:not-sr-only">
        Skip to main content
      </a>
      
      <BackgroundEffectErrorBoundary>
        <ThreadsEffect />
      </BackgroundEffectErrorBoundary>
      
      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <nav className="flex items-center justify-between max-w-7xl mx-auto" role="navigation" aria-label="Main navigation">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center" aria-hidden="true">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-white text-lg sm:text-xl font-bold">MedFact</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white/80 hover:text-white transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-2">
              Home
            </Link>
            {user && (
              <Link to="/dashboard" className="text-white/80 hover:text-white transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-2">
                Dashboard
              </Link>
            )}
            <a href="#about" className="text-white/80 hover:text-white transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-2">
              About
            </a>
            <a href="#contact" className="text-white/80 hover:text-white transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-2">
              Contact
            </a>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link 
                  to="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 min-h-[44px] text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                  aria-label={`Go to dashboard for ${user.name}`}
                >
                  <User size={18} aria-hidden="true" />
                  <span>{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 min-h-[44px] bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Log out of your account"
                >
                  <LogIn size={18} aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleLogin}
                  className="flex items-center space-x-2 px-4 py-2 min-h-[44px] text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                  aria-label="Log in to your account"
                >
                  <LogIn size={18} aria-hidden="true" />
                  <span>Login</span>
                </button>
                <button 
                  onClick={handleSignup}
                  className="flex items-center space-x-2 px-4 py-2 min-h-[44px] bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Create a new account"
                >
                  <User size={18} aria-hidden="true" />
                  <span>Sign Up</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-expanded={showMobileMenu}
            aria-controls="mobile-menu"
            aria-label={showMobileMenu ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {showMobileMenu ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div id="mobile-menu" className="md:hidden mt-4" role="menu">
            <GlassCard className="p-4" aria-label="Mobile navigation menu">
              <div className="space-y-2">
                <Link 
                  to="/" 
                  className="block text-white/80 hover:text-white transition-colors min-h-[44px] flex items-center px-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                  role="menuitem"
                >
                  Home
                </Link>
                {user && (
                  <Link 
                    to="/dashboard" 
                    className="block text-white/80 hover:text-white transition-colors min-h-[44px] flex items-center px-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                    role="menuitem"
                  >
                    Dashboard
                  </Link>
                )}
                <a 
                  href="#about" 
                  className="block text-white/80 hover:text-white transition-colors min-h-[44px] flex items-center px-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                  role="menuitem"
                >
                  About
                </a>
                <a 
                  href="#contact" 
                  className="block text-white/80 hover:text-white transition-colors min-h-[44px] flex items-center px-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                  role="menuitem"
                >
                  Contact
                </a>
                <hr className="border-white/20 my-2" />
                {user ? (
                  <>
                    <div className="flex items-center space-x-2 text-white/80 min-h-[44px] px-2">
                      <User size={18} aria-hidden="true" />
                      <span>{user.name}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors min-h-[44px] px-2 w-full focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                      role="menuitem"
                    >
                      <LogIn size={18} aria-hidden="true" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleLogin}
                      className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors min-h-[44px] px-2 w-full focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
                      role="menuitem"
                    >
                      <LogIn size={18} aria-hidden="true" />
                      <span>Login</span>
                    </button>
                    <button 
                      onClick={handleSignup}
                      className="flex items-center space-x-2 px-4 py-2 min-h-[44px] bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors border border-white/30 w-full justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                      role="menuitem"
                    >
                      <User size={18} aria-hidden="true" />
                      <span>Sign Up</span>
                    </button>
                  </>
                )}
              </div>
            </GlassCard>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main id="main-content" className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key="hero-content"
            className="text-center max-w-4xl mx-auto w-full"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Text */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
                Your AI-Powered
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Medical Assistant
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Get instant symptom analysis, health guidance, and personalized recommendations 
                through our intelligent question-and-answer system.
              </p>
            </div>

            {/* Search Section */}
            <GlassCard className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto" aria-label="Symptom search">
              <form onSubmit={handleSearchSubmit} className="space-y-4" role="search">
                <div className="relative">
                  <label htmlFor="symptom-search" className="sr-only">Enter symptoms, disease, or health issue</label>
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} aria-hidden="true" />
                  <input
                    id="symptom-search"
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Enter symptoms, disease, or health issue..."
                    className="w-full pl-12 pr-4 py-3 sm:py-4 min-h-[44px] rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200 text-base"
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 sm:py-4 min-h-[44px] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 border border-white/30 shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-base sm:text-lg"
                >
                  Start Health Analysis
                </button>
              </form>
              
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-white/60 text-sm sm:text-base">
                  Free symptom checking • No account required • Instant results
                </p>
              </div>
            </GlassCard>

            {/* Features Preview */}
            <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
              <GlassCard className="p-4 sm:p-6 text-center" aria-label="Smart Analysis feature">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4" aria-hidden="true">
                  <Search className="text-blue-400" size={20} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Smart Analysis</h3>
                <p className="text-white/70 text-sm">
                  AI-powered symptom analysis with personalized questions
                </p>
              </GlassCard>

              <GlassCard className="p-4 sm:p-6 text-center" aria-label="Personal Dashboard feature">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4" aria-hidden="true">
                  <User className="text-purple-400" size={20} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Personal Dashboard</h3>
                <p className="text-white/70 text-sm">
                  Track your health history and get personalized recommendations
                </p>
              </GlassCard>

              <GlassCard className="p-4 sm:p-6 text-center sm:col-span-2 md:col-span-1" aria-label="Expert Guidance feature">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4" aria-hidden="true">
                  <LogIn className="text-green-400" size={20} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Expert Guidance</h3>
                <p className="text-white/70 text-sm">
                  Evidence-based health information and next steps
                </p>
              </GlassCard>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 sm:mt-16 border-t border-white/10" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Info */}
            <div className="sm:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center" aria-hidden="true">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-white text-lg sm:text-xl font-bold">MedFact</span>
              </div>
              <p className="text-white/70 text-sm mb-4 max-w-md">
                Empowering individuals with AI-driven health insights and personalized medical guidance. 
                Always consult healthcare professionals for medical decisions.
              </p>
              <p className="text-white/50 text-xs">
                © 2024 MedFact. All rights reserved.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4">Quick Links</h4>
              <nav aria-label="Quick links">
                <div className="space-y-2">
                  <a href="#home" className="block text-white/70 hover:text-white text-sm transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
                    Home
                  </a>
                  <a href="#about" className="block text-white/70 hover:text-white text-sm transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
                    About Us
                  </a>
                  <a href="#contact" className="block text-white/70 hover:text-white text-sm transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
                    Contact
                  </a>
                  <a href="#privacy" className="block text-white/70 hover:text-white text-sm transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
                    Privacy Policy
                  </a>
                </div>
              </nav>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4">Support</h4>
              <nav aria-label="Support links">
                <div className="space-y-2">
                  <a href="#help" className="block text-white/70 hover:text-white text-sm transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
                    Help Center
                  </a>
                  <a href="#faq" className="block text-white/70 hover:text-white text-sm transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
                    FAQ
                  </a>
                  <a href="#terms" className="block text-white/70 hover:text-white text-sm transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
                    Terms of Service
                  </a>
                  <a href="#disclaimer" className="block text-white/70 hover:text-white text-sm transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
                    Medical Disclaimer
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default HomePage;