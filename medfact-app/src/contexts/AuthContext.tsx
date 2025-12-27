import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, SignupData, UserPreferences } from '../types';

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock authentication service - in a real app, this would connect to a backend
class AuthService {
  private static readonly STORAGE_KEY = 'medfact_user';
  private static readonly SESSION_KEY = 'medfact_session';

  static async login(email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation - in real app, this would be server-side
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Invalid credentials');
    }

    // Create mock user
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0], // Use email prefix as name
      createdAt: new Date(),
      preferences: {
        theme: 'auto',
        notifications: true,
        dataRetention: 30
      }
    };

    // Store user in localStorage (encrypted in real app)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(this.SESSION_KEY, `session_${Date.now()}`);

    return user;
  }

  static async signup(userData: SignupData): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Mock validation
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error('All fields are required');
    }

    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    if (!userData.email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    // Check if user already exists (mock check)
    const existingUser = localStorage.getItem(this.STORAGE_KEY);
    if (existingUser) {
      const parsed = JSON.parse(existingUser);
      if (parsed.email === userData.email) {
        throw new Error('An account with this email already exists');
      }
    }

    // Create new user
    const user: User = {
      id: `user_${Date.now()}`,
      email: userData.email,
      name: userData.name,
      createdAt: new Date(),
      preferences: {
        theme: 'auto',
        notifications: true,
        dataRetention: 30
      }
    };

    // Store user in localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(this.SESSION_KEY, `session_${Date.now()}`);

    return user;
  }

  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.SESSION_KEY);
  }

  static getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEY);
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      
      if (!userData || !sessionData) {
        return null;
      }

      const user = JSON.parse(userData);
      // Convert date strings back to Date objects
      user.createdAt = new Date(user.createdAt);
      
      return user;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const user = await AuthService.login(email, password);
      setUser(user);
    } catch (error) {
      throw error; // Re-throw to be handled by the component
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<void> => {
    setIsLoading(true);
    try {
      const user = await AuthService.signup(userData);
      setUser(user);
    } catch (error) {
      throw error; // Re-throw to be handled by the component
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    AuthService.logout();
    setUser(null);
  };

  const updateUser = (updates: Partial<User>): void => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('medfact_user', JSON.stringify(updatedUser));
      
      // Dispatch custom event for settings propagation across components
      window.dispatchEvent(new CustomEvent('settingsUpdated', { 
        detail: { user: updatedUser } 
      }));
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateUser,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;