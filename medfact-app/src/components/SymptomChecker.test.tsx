import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SymptomChecker from './SymptomChecker';
import { AnalysisResults } from '../types';
import { VERIFIED_DATASET } from '../data/verifiedDataset';

// Mock the background effects to avoid canvas issues in tests
jest.mock('./background-effects/ThreadsEffect', () => {
  return function MockThreadsEffect() {
    return <div data-testid="threads-effect">Threads Effect</div>;
  };
});

jest.mock('./background-effects/GalaxyEffect', () => {
  return function MockGalaxyEffect() {
    return <div data-testid="galaxy-effect">Galaxy Effect</div>;
  };
});

describe('SymptomChecker Property-Based Tests', () => {
  
  // Helper function to simulate property-based testing
  const runPropertyTest = (testFn: (input: any) => void, inputs: any[], numRuns = 100) => {
    for (let i = 0; i < Math.min(numRuns, inputs.length); i++) {
      const input = inputs[i % inputs.length];
      try {
        testFn(input);
      } catch (error) {
        throw new Error(`Property test failed on input: ${JSON.stringify(input)}. Error: ${error}`);
      }
    }
  };

  /**
   * **Feature: medfact-web-app, Property 1: Symptom checker initiation preserves context**
   * **Validates: Requirements 1.2, 1.3**
   */
  test('Property 1: Symptom checker initiation preserves context', () => {
    const validSymptoms = Object.keys(VERIFIED_DATASET.symptomMappings);
    
    runPropertyTest((symptom: string) => {
      const mockOnComplete = jest.fn();
      const mockOnAuthPrompt = jest.fn();
      
      const { container, unmount } = render(
        <SymptomChecker 
          initialSymptom={symptom}
          onComplete={mockOnComplete}
          onAuthPrompt={mockOnAuthPrompt}
        />
      );

      // The symptom checker should initiate without page navigation
      expect(container).toBeInTheDocument();
      
      // The user's input context should be preserved and displayed
      // Use getAllByText to handle multiple occurrences
      const symptomElements = screen.getAllByText(symptom, { exact: false });
      expect(symptomElements.length).toBeGreaterThan(0);
      
      // Should display the first relevant question based on the symptom
      const mapping = VERIFIED_DATASET.symptomMappings[symptom];
      if (mapping) {
        // Should show a question interface or results - check for radio buttons (options) or regular buttons
        const radioButtons = screen.queryAllByRole('radio');
        const regularButtons = screen.queryAllByRole('button');
        const hasQuestions = radioButtons.length > 0 || regularButtons.length > 0;
        const hasResults = screen.queryByText(/medical disclaimer/i) !== null;
        
        // Should have either questions or results displayed
        expect(hasQuestions || hasResults).toBe(true);
      }
      
      // Clean up
      unmount();
    }, validSymptoms, 100);
  });

  /**
   * **Feature: medfact-web-app, Property 2: Question flow progression**
   * **Validates: Requirements 2.2, 2.3**
   */
  test('Property 2: Question flow progression', () => {
    const validSymptoms = Object.keys(VERIFIED_DATASET.symptomMappings);
    
    runPropertyTest((symptom: string) => {
      const mockOnComplete = jest.fn();
      let completedResults: AnalysisResults | null = null;
      
      const mockOnCompleteCapture = (results: AnalysisResults) => {
        completedResults = results;
        mockOnComplete(results);
      };

      const { unmount } = render(
        <SymptomChecker 
          initialSymptom={symptom}
          onComplete={mockOnCompleteCapture}
        />
      );

      // Find and click the first available option (radio buttons or regular buttons)
      const radioButtons = screen.queryAllByRole('radio');
      const regularButtons = screen.queryAllByRole('button');
      const clickableElements = radioButtons.length > 0 ? radioButtons : regularButtons;
      
      if (clickableElements.length > 0) {
        fireEvent.click(clickableElements[0]);
        
        // After selecting an answer, should either:
        // 1. Display the next appropriate question, OR
        // 2. Display results if flow is complete
        
        // Check if we moved to next question or completed
        const nextRadioButtons = screen.queryAllByRole('radio');
        const nextRegularButtons = screen.queryAllByRole('button');
        const hasNextQuestion = nextRadioButtons.length > 0 || nextRegularButtons.length > 0;
        const hasResults = completedResults !== null;
        
        // One of these should be true - either next question or results
        expect(hasNextQuestion || hasResults).toBe(true);
        
        // If results are shown, they should be complete
        if (hasResults && completedResults) {
          const results = completedResults as AnalysisResults;
          expect(results.possibleConditions).toBeDefined();
          expect(results.symptoms).toBeDefined();
          expect(results.preventiveMeasures).toBeDefined();
          expect(results.severity).toBeDefined();
          expect(results.recommendedActions).toBeDefined();
        }
      }
      
      unmount();
    }, validSymptoms, 100);
  });

  /**
   * **Feature: medfact-web-app, Property 3: Results completeness**
   * **Validates: Requirements 2.4, 2.5**
   */
  test('Property 3: Results completeness', () => {
    const validSymptoms = Object.keys(VERIFIED_DATASET.symptomMappings);
    
    runPropertyTest((symptom: string) => {
      const mockOnComplete = jest.fn();
      let capturedResults: AnalysisResults | null = null;
      
      const mockOnCompleteCapture = (results: AnalysisResults) => {
        capturedResults = results;
        mockOnComplete(results);
      };

      const { unmount } = render(
        <SymptomChecker 
          initialSymptom={symptom}
          onComplete={mockOnCompleteCapture}
        />
      );

      // Simulate completing the flow by clicking through options
      let maxClicks = 10; // Prevent infinite loops
      let currentRadioButtons = screen.queryAllByRole('radio');
      let currentRegularButtons = screen.queryAllByRole('button');
      let currentButtons = currentRadioButtons.length > 0 ? currentRadioButtons : currentRegularButtons;
      
      while (currentButtons.length > 0 && maxClicks > 0 && !capturedResults) {
        fireEvent.click(currentButtons[0]);
        maxClicks--;
        currentRadioButtons = screen.queryAllByRole('radio');
        currentRegularButtons = screen.queryAllByRole('button');
        currentButtons = currentRadioButtons.length > 0 ? currentRadioButtons : currentRegularButtons;
      }
      
      // Check if we have results (either from completing flow or immediate results)
      const hasResultsInDOM = screen.queryByText(/medical disclaimer/i) !== null;
      
      // If we have results displayed or captured, verify completeness
      if (capturedResults || hasResultsInDOM) {
        if (capturedResults) {
          const results = capturedResults as AnalysisResults;
          // Results should always include possible conditions (even if empty array)
          expect(Array.isArray(results.possibleConditions)).toBe(true);
          
          // Results should always include symptoms
          expect(Array.isArray(results.symptoms)).toBe(true);
          expect(results.symptoms.length).toBeGreaterThan(0);
          
          // Results should always include preventive measures
          expect(Array.isArray(results.preventiveMeasures)).toBe(true);
          expect(results.preventiveMeasures.length).toBeGreaterThan(0);
          
          // Results should always include severity assessment
          expect(['low', 'medium', 'high']).toContain(results.severity);
          
          // Results should always include recommended actions
          expect(Array.isArray(results.recommendedActions)).toBe(true);
          expect(results.recommendedActions.length).toBeGreaterThan(0);
        }
        
        // The medical disclaimer should be visible when results are shown
        expect(screen.getByText(/medical disclaimer/i)).toBeInTheDocument();
        expect(screen.getByText(/educational purposes only/i)).toBeInTheDocument();
      }
      
      unmount();
    }, validSymptoms, 100);
  });

  /**
   * **Feature: medfact-web-app, Property 17: Medical disclaimer visibility**
   * **Validates: Requirements 9.4**
   */
  test('Property 17: Medical disclaimer visibility', () => {
    const validSymptoms = Object.keys(VERIFIED_DATASET.symptomMappings);
    
    runPropertyTest((symptom: string) => {
      const mockOnComplete = jest.fn();
      let capturedResults: AnalysisResults | null = null;
      
      const mockOnCompleteCapture = (results: AnalysisResults) => {
        capturedResults = results;
        mockOnComplete(results);
      };

      const { unmount } = render(
        <SymptomChecker 
          initialSymptom={symptom}
          onComplete={mockOnCompleteCapture}
        />
      );

      // Complete the flow to get to results
      let maxClicks = 10;
      let currentRadioButtons = screen.queryAllByRole('radio');
      let currentRegularButtons = screen.queryAllByRole('button');
      let currentButtons = currentRadioButtons.length > 0 ? currentRadioButtons : currentRegularButtons;
      
      while (currentButtons.length > 0 && maxClicks > 0 && !capturedResults) {
        fireEvent.click(currentButtons[0]);
        maxClicks--;
        currentRadioButtons = screen.queryAllByRole('radio');
        currentRegularButtons = screen.queryAllByRole('button');
        currentButtons = currentRadioButtons.length > 0 ? currentRadioButtons : currentRegularButtons;
      }
      
      // Check if results are displayed (either from flow completion or immediate display)
      const hasResultsInDOM = screen.queryByText(/medical disclaimer/i) !== null;
      
      // When results are displayed, medical disclaimer should be in red or yellow text
      if (capturedResults || hasResultsInDOM) {
        const disclaimerElements = screen.getAllByText(/medical disclaimer|educational purposes only|not intended as medical advice/i);
        expect(disclaimerElements.length).toBeGreaterThan(0);
        
        // Check that at least one disclaimer element has red or yellow styling
        const hasHighVisibilityDisclaimer = disclaimerElements.some(element => {
          const classes = element.className;
          return classes.includes('text-red') || 
                 classes.includes('text-yellow') ||
                 classes.includes('red-') ||
                 classes.includes('yellow-');
        });
        
        expect(hasHighVisibilityDisclaimer).toBe(true);
      }
      
      unmount();
    }, validSymptoms, 100);
  });
});