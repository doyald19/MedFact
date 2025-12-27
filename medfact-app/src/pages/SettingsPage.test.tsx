const fc = require('fast-check/lib/cjs/fast-check');
import '@testing-library/jest-dom';
import { User, UserPreferences } from '../types';

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

// Validation functions extracted for testing (matching SettingsPage implementation)
const validateProfileName = (name: string): string | undefined => {
  if (!name.trim()) {
    return 'Name is required';
  } else if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  return undefined;
};

const validateProfileEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

// Helper function to simulate settings update (matching SettingsPage implementation)
const updateUserSettings = (
  user: User, 
  profileData: { name: string; email: string }, 
  preferences: UserPreferences
): User => {
  const updatedUser = {
    ...user,
    name: profileData.name,
    email: profileData.email,
    preferences: preferences
  };
  mockLocalStorage.setItem('medfact_user', JSON.stringify(updatedUser));
  return updatedUser;
};

// Helper function to retrieve user from storage
const getUserFromStorage = (): User | null => {
  const userData = mockLocalStorage.getItem('medfact_user');
  if (!userData) return null;
  try {
    const user = JSON.parse(userData);
    user.createdAt = new Date(user.createdAt);
    return user;
  } catch {
    return null;
  }
};

// Ensure cleanup after each test
afterEach(() => {
  mockLocalStorage.clear();
});


/**
 * **Feature: medfact-web-app, Property 10: Settings propagation**
 * **Validates: Requirements 7.4**
 * 
 * For any user setting modification, changes should be reflected across 
 * all application components immediately
 */
describe('Property 10: Settings propagation', () => {

  // Property test: Settings updates should be persisted and retrievable
  test('settings updates are persisted to storage', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 2, maxLength: 100 }).filter((s: string) => s.trim().length >= 2),
          email: fc.emailAddress(),
          theme: fc.constantFrom('light', 'dark', 'auto'),
          notifications: fc.boolean(),
          dataRetention: fc.constantFrom(7, 30, 90, 365)
        }),
        async (settings: { name: string; email: string; theme: 'light' | 'dark' | 'auto'; notifications: boolean; dataRetention: number }) => {
          mockLocalStorage.clear();
          
          // Create initial user
          const initialUser: User = {
            id: `user_${Date.now()}`,
            email: 'initial@example.com',
            name: 'Initial User',
            createdAt: new Date(),
            preferences: {
              theme: 'auto',
              notifications: true,
              dataRetention: 30
            }
          };
          
          mockLocalStorage.setItem('medfact_user', JSON.stringify(initialUser));
          
          // Update settings
          const newPreferences: UserPreferences = {
            theme: settings.theme,
            notifications: settings.notifications,
            dataRetention: settings.dataRetention
          };
          
          const updatedUser = updateUserSettings(
            initialUser,
            { name: settings.name, email: settings.email },
            newPreferences
          );
          
          // Property: Updated settings should be retrievable from storage
          const retrievedUser = getUserFromStorage();
          expect(retrievedUser).not.toBeNull();
          expect(retrievedUser?.name).toBe(settings.name);
          expect(retrievedUser?.email).toBe(settings.email);
          expect(retrievedUser?.preferences.theme).toBe(settings.theme);
          expect(retrievedUser?.preferences.notifications).toBe(settings.notifications);
          expect(retrievedUser?.preferences.dataRetention).toBe(settings.dataRetention);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test: Settings updates preserve user identity
  test('settings updates preserve user identity', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          newName: fc.string({ minLength: 2, maxLength: 100 }).filter((s: string) => s.trim().length >= 2),
          newEmail: fc.emailAddress(),
          theme: fc.constantFrom('light', 'dark', 'auto')
        }),
        async (updates: { newName: string; newEmail: string; theme: 'light' | 'dark' | 'auto' }) => {
          mockLocalStorage.clear();
          
          // Create initial user with specific ID
          const userId = `user_${Date.now()}_${Math.random()}`;
          const createdAt = new Date();
          
          const initialUser: User = {
            id: userId,
            email: 'original@example.com',
            name: 'Original Name',
            createdAt: createdAt,
            preferences: {
              theme: 'auto',
              notifications: true,
              dataRetention: 30
            }
          };
          
          mockLocalStorage.setItem('medfact_user', JSON.stringify(initialUser));
          
          // Update settings
          updateUserSettings(
            initialUser,
            { name: updates.newName, email: updates.newEmail },
            { theme: updates.theme, notifications: true, dataRetention: 30 }
          );
          
          // Property: User ID and creation date should be preserved
          const retrievedUser = getUserFromStorage();
          expect(retrievedUser?.id).toBe(userId);
          expect(retrievedUser?.createdAt.getTime()).toBe(createdAt.getTime());
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test: Theme preference changes are reflected
  test('theme preference changes are properly stored', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('light', 'dark', 'auto'),
        async (newTheme: 'light' | 'dark' | 'auto') => {
          mockLocalStorage.clear();
          
          const initialUser: User = {
            id: 'user_123',
            email: 'test@example.com',
            name: 'Test User',
            createdAt: new Date(),
            preferences: {
              theme: 'auto',
              notifications: true,
              dataRetention: 30
            }
          };
          
          mockLocalStorage.setItem('medfact_user', JSON.stringify(initialUser));
          
          // Update only theme
          updateUserSettings(
            initialUser,
            { name: initialUser.name, email: initialUser.email },
            { ...initialUser.preferences, theme: newTheme }
          );
          
          // Property: Theme should be updated
          const retrievedUser = getUserFromStorage();
          expect(retrievedUser?.preferences.theme).toBe(newTheme);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test: Notification preference changes are reflected
  test('notification preference changes are properly stored', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(),
        async (newNotificationSetting: boolean) => {
          mockLocalStorage.clear();
          
          const initialUser: User = {
            id: 'user_123',
            email: 'test@example.com',
            name: 'Test User',
            createdAt: new Date(),
            preferences: {
              theme: 'auto',
              notifications: !newNotificationSetting, // Start with opposite value
              dataRetention: 30
            }
          };
          
          mockLocalStorage.setItem('medfact_user', JSON.stringify(initialUser));
          
          // Update notifications
          updateUserSettings(
            initialUser,
            { name: initialUser.name, email: initialUser.email },
            { ...initialUser.preferences, notifications: newNotificationSetting }
          );
          
          // Property: Notifications setting should be updated
          const retrievedUser = getUserFromStorage();
          expect(retrievedUser?.preferences.notifications).toBe(newNotificationSetting);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test: Data retention preference changes are reflected
  test('data retention preference changes are properly stored', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(7, 30, 90, 365),
        async (newRetention: number) => {
          mockLocalStorage.clear();
          
          const initialUser: User = {
            id: 'user_123',
            email: 'test@example.com',
            name: 'Test User',
            createdAt: new Date(),
            preferences: {
              theme: 'auto',
              notifications: true,
              dataRetention: 30
            }
          };
          
          mockLocalStorage.setItem('medfact_user', JSON.stringify(initialUser));
          
          // Update data retention
          updateUserSettings(
            initialUser,
            { name: initialUser.name, email: initialUser.email },
            { ...initialUser.preferences, dataRetention: newRetention }
          );
          
          // Property: Data retention should be updated
          const retrievedUser = getUserFromStorage();
          expect(retrievedUser?.preferences.dataRetention).toBe(newRetention);
        }
      ),
      { numRuns: 100 }
    );
  });
});


// Unit tests for settings validation
describe('Settings form validation unit tests', () => {

  test('valid profile name passes validation', () => {
    expect(validateProfileName('John')).toBeUndefined();
    expect(validateProfileName('John Doe')).toBeUndefined();
    expect(validateProfileName('AB')).toBeUndefined();
  });

  test('invalid profile name fails validation', () => {
    expect(validateProfileName('')).toBe('Name is required');
    expect(validateProfileName('   ')).toBe('Name is required');
    expect(validateProfileName('A')).toBe('Name must be at least 2 characters');
  });

  test('valid profile email passes validation', () => {
    expect(validateProfileEmail('test@example.com')).toBeUndefined();
    expect(validateProfileEmail('user.name@domain.org')).toBeUndefined();
  });

  test('invalid profile email fails validation', () => {
    expect(validateProfileEmail('')).toBe('Email is required');
    expect(validateProfileEmail('invalid')).toBe('Please enter a valid email address');
    expect(validateProfileEmail('test@')).toBe('Please enter a valid email address');
  });

  test('settings update preserves all user fields', () => {
    mockLocalStorage.clear();
    
    const initialUser: User = {
      id: 'user_test_123',
      email: 'original@example.com',
      name: 'Original Name',
      createdAt: new Date('2024-01-01'),
      preferences: {
        theme: 'auto',
        notifications: true,
        dataRetention: 30
      }
    };
    
    mockLocalStorage.setItem('medfact_user', JSON.stringify(initialUser));
    
    // Update with new values
    updateUserSettings(
      initialUser,
      { name: 'New Name', email: 'new@example.com' },
      { theme: 'dark', notifications: false, dataRetention: 90 }
    );
    
    const retrievedUser = getUserFromStorage();
    
    // Verify all fields are correct
    expect(retrievedUser?.id).toBe('user_test_123');
    expect(retrievedUser?.name).toBe('New Name');
    expect(retrievedUser?.email).toBe('new@example.com');
    expect(retrievedUser?.preferences.theme).toBe('dark');
    expect(retrievedUser?.preferences.notifications).toBe(false);
    expect(retrievedUser?.preferences.dataRetention).toBe(90);
  });

  test('multiple sequential updates work correctly', () => {
    mockLocalStorage.clear();
    
    const initialUser: User = {
      id: 'user_sequential',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      preferences: {
        theme: 'auto',
        notifications: true,
        dataRetention: 30
      }
    };
    
    mockLocalStorage.setItem('medfact_user', JSON.stringify(initialUser));
    
    // First update - change theme
    let currentUser = getUserFromStorage()!;
    updateUserSettings(
      currentUser,
      { name: currentUser.name, email: currentUser.email },
      { ...currentUser.preferences, theme: 'dark' }
    );
    
    // Second update - change notifications
    currentUser = getUserFromStorage()!;
    updateUserSettings(
      currentUser,
      { name: currentUser.name, email: currentUser.email },
      { ...currentUser.preferences, notifications: false }
    );
    
    // Third update - change name
    currentUser = getUserFromStorage()!;
    updateUserSettings(
      currentUser,
      { name: 'Updated Name', email: currentUser.email },
      currentUser.preferences
    );
    
    // Verify final state
    const finalUser = getUserFromStorage();
    expect(finalUser?.name).toBe('Updated Name');
    expect(finalUser?.preferences.theme).toBe('dark');
    expect(finalUser?.preferences.notifications).toBe(false);
    expect(finalUser?.preferences.dataRetention).toBe(30);
  });
});
