import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Settings, 
  Mail, 
  User,
  LogOut,
  Save,
  Bell,
  Moon,
  Sun,
  Monitor,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard, GalaxyEffect, BackgroundEffectErrorBoundary } from '../components';
import { UserPreferences } from '../types';

interface ProfileFormData {
  name: string;
  email: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

const SettingsPage: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: user?.preferences?.theme || 'auto',
    notifications: user?.preferences?.notifications ?? true,
    dataRetention: user?.preferences?.dataRetention || 30
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');


  // Sync with user data when it changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email
      });
      setPreferences({
        theme: user.preferences?.theme || 'auto',
        notifications: user.preferences?.notifications ?? true,
        dataRetention: user.preferences?.dataRetention || 30
      });
    }
  }, [user]);

  const validateProfile = (): boolean => {
    const newErrors: FormErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (profileData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    if (!validateProfile()) {
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user through context (handles localStorage and event dispatch)
      updateUser({
        name: profileData.name,
        email: profileData.email,
        preferences: preferences
      });

      setSaveStatus('success');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteData = async () => {
    if (window.confirm('Are you sure you want to delete all your health data? This action cannot be undone.')) {
      if (user) {
        localStorage.removeItem(`health_reports_${user.id}`);
        window.dispatchEvent(new CustomEvent('healthDataDeleted'));
        alert('Your health data has been deleted.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/');
    return null;
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'auto', label: 'System', icon: Monitor }
  ];

  const retentionOptions = [
    { value: 7, label: '7 days' },
    { value: 30, label: '30 days' },
    { value: 90, label: '90 days' },
    { value: 365, label: '1 year' }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Galaxy Background Effect */}
      <BackgroundEffectErrorBoundary>
        <GalaxyEffect particleCount={120} interactive={true} mouseInfluence={60} />
      </BackgroundEffectErrorBoundary>
      
      {/* Header Navigation */}
      <header className="relative z-10 p-6">
        <GlassCard className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-white font-semibold text-xl">MedFact</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-white/70 glass-link min-h-[44px] px-2"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                <span>Home</span>
              </Link>
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 text-white/70 glass-link min-h-[44px] px-2"
              >
                <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center space-x-2 text-white font-medium min-h-[44px] px-2"
                aria-current="page"
              >
                <Settings className="w-4 h-4" aria-hidden="true" />
                <span>Settings</span>
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center space-x-2 text-white/70 glass-link min-h-[44px] px-2"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Contact</span>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <User className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-white/70 glass-link min-h-[44px] px-2"
              aria-label="Log out of your account"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </GlassCard>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Page Header */}
          <GlassCard className="text-center py-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                <Settings className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-white/70">
              Manage your profile and preferences
            </p>
          </GlassCard>

          {/* Status Messages */}
          {saveStatus === 'success' && (
            <div className="flex items-center space-x-2 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-300 text-sm">Settings saved successfully!</p>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center space-x-2 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">Failed to save settings. Please try again.</p>
            </div>
          )}


          {/* Profile Section */}
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile Information
            </h2>
            
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-white/80 text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className={`w-full px-4 py-3 min-h-[44px] bg-white/10 border ${
                    errors.name ? 'border-red-500/50' : 'border-white/20'
                  } rounded-lg text-white placeholder-white/50 glass-input`}
                  placeholder="Your name"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
                {errors.name && (
                  <p className="mt-1 text-red-400 text-sm">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className={`w-full px-4 py-3 min-h-[44px] bg-white/10 border ${
                    errors.email ? 'border-red-500/50' : 'border-white/20'
                  } rounded-lg text-white placeholder-white/50 glass-input`}
                  placeholder="your@email.com"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <p className="mt-1 text-red-400 text-sm">{errors.email}</p>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Preferences Section */}
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Preferences
            </h2>
            
            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Theme
                </label>
                <div className="flex space-x-3">
                  {themeOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handlePreferenceChange('theme', option.value as UserPreferences['theme'])}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 min-h-[44px] rounded-lg border glass-button ${
                          preferences.theme === option.value
                            ? 'bg-blue-500/30 border-blue-400/50 text-white'
                            : 'bg-white/5 border-white/20 text-white/70'
                        }`}
                        aria-pressed={preferences.theme === option.value}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notifications Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-white/70" aria-hidden="true" />
                  <div>
                    <p className="text-white font-medium">Notifications</p>
                    <p className="text-white/60 text-sm">Receive health reminders and updates</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePreferenceChange('notifications', !preferences.notifications)}
                  className={`relative w-12 h-6 rounded-full transition-colors glass-button ${
                    preferences.notifications ? 'bg-blue-500' : 'bg-white/20'
                  }`}
                  role="switch"
                  aria-checked={preferences.notifications}
                  aria-label="Toggle notifications"
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      preferences.notifications ? 'left-7' : 'left-1'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {/* Data Retention */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Data Retention Period
                </label>
                <select
                  value={preferences.dataRetention}
                  onChange={(e) => handlePreferenceChange('dataRetention', parseInt(e.target.value))}
                  className="w-full px-4 py-3 min-h-[44px] bg-white/10 border border-white/20 rounded-lg text-white glass-input"
                  aria-label="Data retention period"
                >
                  {retentionOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-white/60 text-sm">
                  Health reports older than this will be automatically deleted
                </p>
              </div>
            </div>
          </GlassCard>


          {/* Danger Zone */}
          <GlassCard>
            <h2 className="text-xl font-semibold text-red-400 mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Danger Zone
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div>
                  <p className="text-white font-medium">Delete Health Data</p>
                  <p className="text-white/60 text-sm">
                    Permanently delete all your health reports and analysis history
                  </p>
                </div>
                <button
                  onClick={handleDeleteData}
                  className="flex items-center space-x-2 px-4 py-2 min-h-[44px] bg-red-500/20 text-red-300 rounded-lg glass-button"
                  aria-label="Delete all health data"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 min-h-[44px] bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg glass-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={isSaving}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
