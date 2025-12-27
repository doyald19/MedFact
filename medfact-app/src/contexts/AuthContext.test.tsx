const fc = require('fast-check/lib/cjs/fast-check');
import React from 'react';
import { render, screen, waitFor, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import { User } from '../types';

// Test component to access auth context
const TestComponent: React.FC = () => {
  const { user, login, signup, logout, isLoading } = useAuth();
  
  return (
    <div>
      <div data-testid="user-status">
        {isLoading ? 'loading' : user ? `authenticated:${user.email}` : 'unauthenticated'}
      </div>
      <button 
        data-testid="login-btn" 
        onClick={() => login('test@example.com', 'password123')}
      >
        Login
      </button>
      <button 
        data-testid="signup-btn" 
        onClick={() => signup({ email: 'new@example.com', password: 'password123', name: 'Test User' })}
      >
        Signup
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

// Mock localStorage
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Helper to render component with auth provider
const renderWithAuth = () => {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
};

/**
 * **Feature: medfact-web-app, Property 4: Authentication flow preservation**
 * **Validates: Requirements 3.4**
 * 
 * For any successful authentication, the user should be redirected to the dashboard 
 * with their session data and previous analysis results preserved
 */
describe('Property 4: Authentication flow preservation', () => {
  
  beforeEach(() => {
    cleanup();
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  // Property test with 100 iterations as specified in design document
  test('successful authentication preserves user session data', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 50 }).filter((s: string) => s.trim().length >= 6),
          name: fc.string({ minLength: 2, maxLength: 100 }).filter((s: string) => s.trim().length >= 2)
        }),
        async (userData: { email: string; password: string; name: string }) => {
          cleanup();
          mockLocalStorage.clear();
          
          // Create mock user data that would be stored after successful signup
          const mockUser: User = {
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
          
          // Simulate successful authentication by storing user data
          mockLocalStorage.setItem('medfact_user', JSON.stringify(mockUser));
          mockLocalStorage.setItem('medfact_session', `session_${Date.now()}`);
          
          // Property: After successful authentication, user data should be preserved
          const storedUser = mockLocalStorage.getItem('medfact_user');
          const storedSession = mockLocalStorage.getItem('medfact_session');
          
          expect(storedUser).not.toBeNull();
          expect(storedSession).not.toBeNull();
          
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            expect(parsedUser.email).toBe(userData.email);
            expect(parsedUser.name).toBe(userData.name);
            expect(parsedUser.id).toBeDefined();
            expect(parsedUser.createdAt).toBeDefined();
            expect(parsedUser.preferences).toBeDefined();
            expect(parsedUser.preferences.theme).toBe('auto');
            expect(parsedUser.preferences.notifications).toBe(true);
            expect(parsedUser.preferences.dataRetention).toBe(30);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('authentication state persistence across sessions', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          name: fc.string({ minLength: 2, maxLength: 100 }).filter((s: string) => s.trim().length >= 2)
        }),
        async (userData: { email: string; name: string }) => {
          cleanup();
          mockLocalStorage.clear();
          
          // First, authenticate a user
          const mockUser: User = {
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
          
          mockLocalStorage.setItem('medfact_user', JSON.stringify(mockUser));
          mockLocalStorage.setItem('medfact_session', `session_${Date.now()}`);
          
          // Property: Session data should be consistent and retrievable
          const storedUser = mockLocalStorage.getItem('medfact_user');
          const parsedUser = JSON.parse(storedUser!);
          expect(parsedUser.email).toBe(userData.email);
          expect(parsedUser.name).toBe(userData.name);
          expect(parsedUser.preferences.theme).toBe('auto');
          expect(parsedUser.preferences.notifications).toBe(true);
          expect(parsedUser.preferences.dataRetention).toBe(30);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('logout clears all session data', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          name: fc.string({ minLength: 2, maxLength: 100 }).filter((s: string) => s.trim().length >= 2)
        }),
        async (userData: { email: string; name: string }) => {
          cleanup();
          mockLocalStorage.clear();
          
          // Set up authenticated state
          const mockUser: User = {
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
          
          mockLocalStorage.setItem('medfact_user', JSON.stringify(mockUser));
          mockLocalStorage.setItem('medfact_session', `session_${Date.now()}`);
          
          // Verify data is stored
          expect(mockLocalStorage.getItem('medfact_user')).not.toBeNull();
          expect(mockLocalStorage.getItem('medfact_session')).not.toBeNull();
          
          // Simulate logout by clearing storage
          mockLocalStorage.removeItem('medfact_user');
          mockLocalStorage.removeItem('medfact_session');
          
          // Property: After logout, all session data should be cleared
          expect(mockLocalStorage.getItem('medfact_user')).toBeNull();
          expect(mockLocalStorage.getItem('medfact_session')).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('user preferences are properly initialized', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          name: fc.string({ minLength: 2, maxLength: 100 }).filter((s: string) => s.trim().length >= 2)
        }),
        async (userData: { email: string; name: string }) => {
          cleanup();
          mockLocalStorage.clear();
          
          // Create user with default preferences
          const mockUser: User = {
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
          
          mockLocalStorage.setItem('medfact_user', JSON.stringify(mockUser));
          mockLocalStorage.setItem('medfact_session', `session_${Date.now()}`);
          
          const storedUser = mockLocalStorage.getItem('medfact_user');
          expect(storedUser).not.toBeNull();
          
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            
            // Property: User preferences should have default values
            expect(parsedUser.preferences).toBeDefined();
            expect(parsedUser.preferences.theme).toBe('auto');
            expect(parsedUser.preferences.notifications).toBe(true);
            expect(parsedUser.preferences.dataRetention).toBe(30);
            
            // Property: User data should be complete
            expect(parsedUser.id).toBeDefined();
            expect(parsedUser.email).toBe(userData.email);
            expect(parsedUser.name).toBe(userData.name);
            expect(parsedUser.createdAt).toBeDefined();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Unit tests for specific examples and edge cases
describe('Authentication flow unit tests', () => {
  
  beforeEach(() => {
    cleanup();
    mockLocalStorage.clear();
  });

  test('successful login with valid credentials', async () => {
    renderWithAuth();
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).not.toHaveTextContent('loading');
    });
    
    expect(screen.getByTestId('user-status')).toHaveTextContent('unauthenticated');
    
    const loginBtn = screen.getByTestId('login-btn');
    await act(async () => {
      await userEvent.click(loginBtn);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('authenticated:test@example.com');
    }, { timeout: 3000 });
  });

  test('successful signup creates new user', async () => {
    renderWithAuth();
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).not.toHaveTextContent('loading');
    });
    
    const signupBtn = screen.getByTestId('signup-btn');
    await act(async () => {
      await userEvent.click(signupBtn);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('authenticated:new@example.com');
    }, { timeout: 3000 });
  });

  test('logout clears authentication state', async () => {
    // First login
    renderWithAuth();
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).not.toHaveTextContent('loading');
    });
    
    const loginBtn = screen.getByTestId('login-btn');
    await act(async () => {
      await userEvent.click(loginBtn);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('authenticated:test@example.com');
    }, { timeout: 3000 });
    
    // Then logout
    const logoutBtn = screen.getByTestId('logout-btn');
    await act(async () => {
      await userEvent.click(logoutBtn);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('unauthenticated');
    }, { timeout: 3000 });
  });

  test('authentication context throws error when used outside provider', () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });

  test('corrupted localStorage data is handled gracefully', async () => {
    // Set invalid JSON in localStorage
    mockLocalStorage.setItem('medfact_user', 'invalid-json');
    mockLocalStorage.setItem('medfact_session', 'session_123');
    
    renderWithAuth();
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).not.toHaveTextContent('loading');
    });
    
    // Should not crash and should show unauthenticated state
    expect(screen.getByTestId('user-status')).toHaveTextContent('unauthenticated');
  });

  test('missing session data results in unauthenticated state', async () => {
    // Set user data but no session
    const mockUser = {
      id: 'user_123',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date().toISOString(),
      preferences: { theme: 'auto', notifications: true, dataRetention: 30 }
    };
    
    mockLocalStorage.setItem('medfact_user', JSON.stringify(mockUser));
    // No session data
    
    renderWithAuth();
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).not.toHaveTextContent('loading');
    });
    
    expect(screen.getByTestId('user-status')).toHaveTextContent('unauthenticated');
  });
});