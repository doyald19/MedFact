import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
const fc = require('fast-check/lib/cjs/fast-check');
import GlassCard from './GlassCard';

/**
 * **Feature: medfact-web-app, Property 13: Interactive feedback consistency**
 * **Validates: Requirements 8.4**
 * 
 * For any interactive element, hover and focus states should provide visual feedback
 * while maintaining the glass aesthetic.
 */
describe('Interactive Feedback Consistency Property Tests', () => {
  // Define typed constants for property tests
  const variants = ['default', 'elevated', 'subtle'] as const;
  const blurLevels = ['sm', 'md', 'lg'] as const;
  
  /**
   * Property 13: Interactive feedback consistency
   * For any interactive element, hover and focus states should provide visual feedback
   * while maintaining the glass aesthetic.
   */
  test('Property 13: Interactive GlassCard should have interactive classes when onClick is provided', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...variants),
        fc.string({ minLength: 1, maxLength: 50 }).filter((s: string) => s.trim().length > 0),
        (variant: 'default' | 'elevated' | 'subtle', content: string) => {
          const handleClick = jest.fn();
          const { container } = render(
            <GlassCard variant={variant} onClick={handleClick}>
              {content}
            </GlassCard>
          );

          const glassCard = container.firstChild as HTMLElement;
          
          // Property: Interactive cards should have glass-card-interactive class
          expect(glassCard.className).toContain('glass-card-interactive');
          
          // Property: Interactive cards should have cursor-pointer class
          expect(glassCard.className).toContain('cursor-pointer');
          
          // Property: Interactive cards should have button role
          expect(glassCard).toHaveAttribute('role', 'button');
          
          // Property: Interactive cards should be focusable
          expect(glassCard).toHaveAttribute('tabIndex', '0');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 13b: Interactive GlassCard should respond to click events', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...variants),
        fc.string({ minLength: 1, maxLength: 50 }).filter((s: string) => s.trim().length > 0),
        (variant: 'default' | 'elevated' | 'subtle', content: string) => {
          const handleClick = jest.fn();
          const { container } = render(
            <GlassCard variant={variant} onClick={handleClick}>
              {content}
            </GlassCard>
          );

          const glassCard = container.firstChild as HTMLElement;
          
          // Property: Clicking should trigger the onClick handler
          fireEvent.click(glassCard);
          expect(handleClick).toHaveBeenCalledTimes(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 13c: Interactive GlassCard should respond to keyboard events', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...variants),
        fc.string({ minLength: 1, maxLength: 50 }).filter((s: string) => s.trim().length > 0),
        fc.constantFrom('Enter', ' '),
        (variant: 'default' | 'elevated' | 'subtle', content: string, key: string) => {
          const handleClick = jest.fn();
          const { container } = render(
            <GlassCard variant={variant} onClick={handleClick}>
              {content}
            </GlassCard>
          );

          const glassCard = container.firstChild as HTMLElement;
          
          // Property: Pressing Enter or Space should trigger the onClick handler
          fireEvent.keyDown(glassCard, { key });
          expect(handleClick).toHaveBeenCalledTimes(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 13d: Non-interactive GlassCard should not have interactive classes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...variants),
        fc.string({ minLength: 1, maxLength: 50 }).filter((s: string) => s.trim().length > 0),
        (variant: 'default' | 'elevated' | 'subtle', content: string) => {
          const { container } = render(
            <GlassCard variant={variant}>
              {content}
            </GlassCard>
          );

          const glassCard = container.firstChild as HTMLElement;
          
          // Property: Non-interactive cards should NOT have glass-card-interactive class
          expect(glassCard.className).not.toContain('glass-card-interactive');
          
          // Property: Non-interactive cards should NOT have cursor-pointer class
          expect(glassCard.className).not.toContain('cursor-pointer');
          
          // Property: Non-interactive cards should have region role
          expect(glassCard).toHaveAttribute('role', 'region');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 13e: Interactive prop should enable interactive behavior', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...variants),
        fc.string({ minLength: 1, maxLength: 50 }).filter((s: string) => s.trim().length > 0),
        (variant: 'default' | 'elevated' | 'subtle', content: string) => {
          const { container } = render(
            <GlassCard variant={variant} interactive>
              {content}
            </GlassCard>
          );

          const glassCard = container.firstChild as HTMLElement;
          
          // Property: Cards with interactive prop should have glass-card-interactive class
          expect(glassCard.className).toContain('glass-card-interactive');
          
          // Property: Cards with interactive prop should have cursor-pointer class
          expect(glassCard.className).toContain('cursor-pointer');
          
          // Property: Cards with interactive prop should have button role
          expect(glassCard).toHaveAttribute('role', 'button');
          
          // Property: Cards with interactive prop should be focusable
          expect(glassCard).toHaveAttribute('tabIndex', '0');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 13f: Interactive elements should maintain glassmorphism styling', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...variants),
        fc.constantFrom(...blurLevels),
        fc.string({ minLength: 1, maxLength: 50 }).filter((s: string) => s.trim().length > 0),
        (variant: 'default' | 'elevated' | 'subtle', blur: 'sm' | 'md' | 'lg', content: string) => {
          const handleClick = jest.fn();
          const { container } = render(
            <GlassCard variant={variant} blur={blur} onClick={handleClick}>
              {content}
            </GlassCard>
          );

          const glassCard = container.firstChild as HTMLElement;
          
          // Property: Interactive cards should still have glassmorphism variant class
          const expectedVariantClass = variant === 'default' ? 'glass-card' : `glass-card-${variant}`;
          expect(glassCard.className).toContain(expectedVariantClass);
          
          // Property: Interactive cards should still have blur class
          expect(glassCard.className).toContain(`backdrop-blur-${blur}`);
          
          // Property: Interactive cards should still have text contrast classes
          expect(glassCard.className).toMatch(/text-(gray-900|gray-800)/);
          expect(glassCard.className).toMatch(/dark:text-(white|gray-100)/);
        }
      ),
      { numRuns: 100 }
    );
  });
});
