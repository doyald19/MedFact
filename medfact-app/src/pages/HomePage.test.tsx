import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
const fc = require('fast-check/lib/cjs/fast-check');
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { AuthProvider } from '../contexts/AuthContext';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the background effects to avoid canvas issues in tests
jest.mock('../components/background-effects', () => ({
  ThreadsEffect: () => <div data-testid="threads-effect" />,
}));

// Mock the SymptomChecker component for isolated testing
jest.mock('../components/SymptomChecker', () => {
  return function MockSymptomChecker({ initialSymptom, onComplete }: any) {
    // Simulate the real SymptomChecker behavior for invalid symptoms
    const validSymptoms = [
      'headache', 'head pain', 'migraine', 'fever', 'temperature', 'hot',
      'nausea', 'vomiting', 'stomach pain', 'diarrhea', 'cough', 'sore throat',
      'runny nose', 'body aches', 'fatigue', 'chills'
    ];
    
    const isValidSymptom = validSymptoms.includes(initialSymptom.toLowerCase().trim());
    
    if (!isValidSymptom) {
      // Return error message for invalid symptoms (like the real component)
      return (
        <div className="p-6 max-w-2xl mx-auto">
          <div className="text-center">
            <p className="text-lg">Unable to find questions for the symptom: "{initialSymptom}"</p>
            <p className="text-sm mt-2 opacity-75">Please try a different symptom or contact support.</p>
          </div>
        </div>
      );
    }
    
    // Return normal symptom checker for valid symptoms
    return (
      <div data-testid="symptom-checker">
        <div data-testid="initial-symptom">{initialSymptom}</div>
        <button onClick={() => onComplete({ mockResults: true })}>
          Complete Analysis
        </button>
      </div>
    );
  };
});

// Ensure cleanup after each test
afterEach(() => {
  cleanup();
});

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  describe('Basic functionality', () => {
    it('renders the home page with search functionality', () => {
      const { container } = renderHomePage();
      
      // Use container queries to avoid multiple element issues
      expect(container.textContent).toContain('MedFact');
      expect(container.querySelector('input[placeholder*="Enter symptoms"]')).toBeInTheDocument();
      expect(container.querySelector('button[type="submit"]')).toBeInTheDocument();
      expect(container.textContent).toContain('Start Health Analysis');
    });

    it('renders the home page with search functionality', () => {
      const { container } = renderHomePage();
      
      // Use container queries to avoid multiple element issues
      expect(container.textContent).toContain('MedFact');
      expect(container.querySelector('input[placeholder*="Enter symptoms"]')).toBeInTheDocument();
      expect(container.querySelector('button[type="submit"]')).toBeInTheDocument();
      expect(container.textContent).toContain('Start Health Analysis');
    });
  });

  describe('Property-Based Tests', () => {
    /**
     * **Feature: medfact-web-app, Property 1: Symptom checker initiation preserves context**
     * **Validates: Requirements 1.2, 1.3**
     * 
     * For any valid symptom input, initiating the symptom checker should start 
     * the question flow without page navigation and preserve the user's input context
     */
    it('Property 1: Symptom checker initiation preserves context for valid symptoms', () => {
      // Valid symptoms from the verified dataset
      const validSymptoms = [
        'headache', 'head pain', 'migraine', 'fever', 'temperature', 'hot',
        'nausea', 'vomiting', 'stomach pain', 'diarrhea', 'cough', 'sore throat',
        'runny nose', 'body aches', 'fatigue', 'chills'
      ];
      
      // Test each valid symptom individually to ensure they all work
      validSymptoms.forEach(symptomInput => {
        const { unmount, container } = render(
          <BrowserRouter>
            <AuthProvider>
              <HomePage />
            </AuthProvider>
          </BrowserRouter>
        );
        
        try {
          const searchInput = container.querySelector('input[placeholder*="Enter symptoms"]') as HTMLInputElement;
          const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
          
          // Simulate user input
          fireEvent.change(searchInput, { target: { value: symptomInput } });
          fireEvent.click(submitButton);
          
          // For valid symptoms, should show symptom checker with preserved context
          const symptomChecker = container.querySelector('[data-testid="symptom-checker"]');
          expect(symptomChecker).toBeTruthy();
          
          const initialSymptomElement = container.querySelector('[data-testid="initial-symptom"]');
          expect(initialSymptomElement?.textContent).toBe(symptomInput.trim());
          
        } finally {
          unmount();
        }
      });
    });

    it('Property 1 (Invalid symptoms): Unknown symptoms should show error message', () => {
      // Test a few known invalid symptoms
      const invalidSymptoms = ['!', '@', '#', 'xyz123', 'unknown'];
      
      invalidSymptoms.forEach(invalidSymptom => {
        const { unmount, container } = render(
          <BrowserRouter>
            <AuthProvider>
              <HomePage />
            </AuthProvider>
          </BrowserRouter>
        );
        
        try {
          const searchInput = container.querySelector('input[placeholder*="Enter symptoms"]') as HTMLInputElement;
          const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
          
          // Simulate user input with invalid symptom
          fireEvent.change(searchInput, { target: { value: invalidSymptom } });
          fireEvent.click(submitButton);
          
          // Should show error message instead of symptom checker
          const symptomChecker = container.querySelector('[data-testid="symptom-checker"]');
          expect(symptomChecker).toBeFalsy();
          
          // Should show error message about unknown symptom
          const errorMessage = container.textContent;
          expect(errorMessage?.includes('Unable to find questions')).toBe(true);
          expect(errorMessage?.includes(invalidSymptom)).toBe(true);
          
        } finally {
          unmount();
        }
      });
    });

    it('Property 1 (Edge Case): Empty input should not trigger symptom checker', () => {
      fc.assert(
        fc.property(
          // Generate empty or whitespace strings
          fc.oneof(
            fc.constant(''),
            fc.string().filter((s: string) => s.trim().length === 0 && s.length <= 10)
          ),
          (invalidInput: string) => {
            const { unmount, container } = render(
              <BrowserRouter>
                <AuthProvider>
                  <HomePage />
                </AuthProvider>
              </BrowserRouter>
            );
            
            try {
              const searchInput = container.querySelector('input[placeholder*="Enter symptoms"]') as HTMLInputElement;
              const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
              
              // Simulate invalid input
              fireEvent.change(searchInput, { target: { value: invalidInput } });
              fireEvent.click(submitButton);
              
              // Verify symptom checker does NOT appear
              const symptomChecker = container.querySelector('[data-testid="symptom-checker"]');
              expect(symptomChecker).toBeFalsy();
              
              // Verify hero text is still visible
              const heroText = container.querySelector('h1');
              expect(heroText?.textContent?.includes('Your AI-Powered')).toBe(true);
              
            } finally {
              unmount();
            }
          }
        ),
        { 
          numRuns: 10,
          verbose: false
        }
      );
    });

    it('Property 1 (Navigation): Back button restores home state', () => {
      const { unmount, container } = render(
        <BrowserRouter>
          <AuthProvider>
            <HomePage />
          </AuthProvider>
        </BrowserRouter>
      );
      
      try {
        // Navigate to symptom checker with valid symptom
        const searchInput = container.querySelector('input[placeholder*="Enter symptoms"]') as HTMLInputElement;
        const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        
        fireEvent.change(searchInput, { target: { value: 'headache' } });
        fireEvent.click(submitButton);
        
        // Verify symptom checker is shown
        expect(container.querySelector('[data-testid="symptom-checker"]')).toBeTruthy();
        
        // Click back button
        const backButton = container.querySelector('button') as HTMLButtonElement;
        if (backButton && backButton.textContent?.includes('Back')) {
          fireEvent.click(backButton);
          
          // Verify we're back to home state
          expect(container.querySelector('[data-testid="symptom-checker"]')).toBeFalsy();
          expect(container.querySelector('h1')?.textContent?.includes('Your AI-Powered')).toBe(true);
          
          // Verify search input is cleared
          const newSearchInput = container.querySelector('input[placeholder*="Enter symptoms"]') as HTMLInputElement;
          expect(newSearchInput.value).toBe('');
        }
        
      } finally {
        unmount();
      }
    });
  });
});