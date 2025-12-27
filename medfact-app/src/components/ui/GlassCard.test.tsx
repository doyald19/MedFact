import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import GlassCard from './GlassCard';

/**
 * **Feature: medfact-web-app, Property 11: Glassmorphism consistency**
 * **Validates: Requirements 8.1, 8.2**
 * 
 * **Feature: medfact-web-app, Property 12: Text contrast accessibility**
 * **Validates: Requirements 8.3**
 */
describe('GlassCard Glassmorphism Consistency Property Tests', () => {
  // Define typed constants for property tests
  const variants = ['default', 'elevated', 'subtle'] as const;
  const blurLevels = ['sm', 'md', 'lg'] as const;
  
  test('Property 11: All glass card variants should have consistent glassmorphism class structure', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...variants),
        fc.constantFrom(...blurLevels),
        fc.string({ minLength: 1, maxLength: 100 }).filter((s: string) => s.trim().length > 0),
        (variant, blur, content) => {
          const { container } = render(
            <GlassCard variant={variant} blur={blur}>
              {content}
            </GlassCard>
          );

          const glassCard = container.firstChild as HTMLElement;
          
          // Check that the element exists
          expect(glassCard).toBeInTheDocument();
          
          // Property: All glass cards should have appropriate variant class
          const expectedVariantClass = variant === 'default' ? 'glass-card' : `glass-card-${variant}`;
          expect(glassCard.className).toContain(expectedVariantClass);
          
          // Property: All glass cards should have appropriate blur class
          const expectedBlurClass = `backdrop-blur-${blur}`;
          expect(glassCard.className).toContain(expectedBlurClass);
          
          // Property: All glass cards should have text color classes for contrast
          expect(glassCard.className).toMatch(/text-(gray-900|gray-800)/);
          expect(glassCard.className).toMatch(/dark:text-(white|gray-100)/);
          
          // Property: All glass cards should have accessibility attributes
          expect(glassCard).toHaveAttribute('role', 'region');
          expect(glassCard).toHaveAttribute('aria-label', 'Glass card content');
          
          // Property: Content should be preserved (accounting for DOM text normalization)
          expect(glassCard.textContent?.trim().length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 11b: Glass card variants should maintain consistent class hierarchy', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter((s: string) => s.trim().length > 0),
        (content: string) => {
          // Render all variants
          const { container: defaultContainer } = render(
            <GlassCard variant="default">{content}</GlassCard>
          );
          const { container: elevatedContainer } = render(
            <GlassCard variant="elevated">{content}</GlassCard>
          );
          const { container: subtleContainer } = render(
            <GlassCard variant="subtle">{content}</GlassCard>
          );

          const defaultCard = defaultContainer.firstChild as HTMLElement;
          const elevatedCard = elevatedContainer.firstChild as HTMLElement;
          const subtleCard = subtleContainer.firstChild as HTMLElement;

          // Property: All variants should have glassmorphism base classes
          [
            { card: defaultCard, expectedClass: 'glass-card' },
            { card: elevatedCard, expectedClass: 'glass-card-elevated' },
            { card: subtleCard, expectedClass: 'glass-card-subtle' }
          ].forEach(({ card, expectedClass }) => {
            expect(card.className).toContain(expectedClass);
            expect(card.className).toMatch(/backdrop-blur-(sm|md|lg)/);
            expect(card.className).toMatch(/text-(gray-900|gray-800)/);
            expect(card.className).toMatch(/dark:text-(white|gray-100)/);
            expect(card).toHaveAttribute('role', 'region');
            expect(card).toHaveAttribute('aria-label', 'Glass card content');
            expect(card.textContent?.trim().length).toBeGreaterThan(0);
          });

          // Property: Different variants should have different classes
          expect(defaultCard.className).not.toBe(elevatedCard.className);
          expect(defaultCard.className).not.toBe(subtleCard.className);
          expect(elevatedCard.className).not.toBe(subtleCard.className);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 11c: Glass card blur levels should be applied correctly', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...blurLevels),
        fc.string({ minLength: 1, maxLength: 20 }).filter((s: string) => s.trim().length > 0),
        (blur, content) => {
          const { container } = render(
            <GlassCard blur={blur}>{content}</GlassCard>
          );

          const glassCard = container.firstChild as HTMLElement;
          
          // Property: Should have the correct blur class
          expect(glassCard.className).toContain(`backdrop-blur-${blur}`);
          
          // Property: Should not have other blur classes
          const otherBlurLevels = ['sm', 'md', 'lg'].filter(level => level !== blur);
          otherBlurLevels.forEach(otherBlur => {
            expect(glassCard.className).not.toContain(`backdrop-blur-${otherBlur}`);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: medfact-web-app, Property 12: Text contrast accessibility**
   * **Validates: Requirements 8.3**
   */
  test('Property 12: Text contrast accessibility should be maintained across all variants', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...variants),
        fc.constantFrom(...blurLevels),
        fc.string({ minLength: 1, maxLength: 100 }).filter((s: string) => s.trim().length > 0),
        (variant, blur, content) => {
          const { container } = render(
            <GlassCard variant={variant} blur={blur}>
              {content}
            </GlassCard>
          );

          const glassCard = container.firstChild as HTMLElement;
          
          // Property: All glass cards should have high contrast text colors
          if (variant === 'default' || variant === 'elevated') {
            expect(glassCard.className).toContain('text-gray-900');
          } else {
            expect(glassCard.className).toContain('text-gray-800');
          }
          
          // Property: All variants should have appropriate dark mode text colors
          if (variant === 'subtle') {
            expect(glassCard.className).toContain('dark:text-gray-100');
          } else {
            expect(glassCard.className).toContain('dark:text-white');
          }
          
          // Property: Text color classes should be present for accessibility
          const hasLightModeTextColor = glassCard.className.includes('text-gray-900') || 
                                       glassCard.className.includes('text-gray-800');
          expect(hasLightModeTextColor).toBe(true);
          
          const hasDarkModeTextColor = glassCard.className.includes('dark:text-white') || 
                                      glassCard.className.includes('dark:text-gray-100');
          expect(hasDarkModeTextColor).toBe(true);
          
          // Property: Should not have low contrast text colors
          expect(glassCard.className).not.toContain('text-gray-400');
          expect(glassCard.className).not.toContain('text-gray-500');
          expect(glassCard.className).not.toContain('text-gray-600');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 12b: Text contrast should be consistent across different content types', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.string({ minLength: 1, maxLength: 20 }).filter((s: string) => s.trim().length > 0),
          fc.constantFrom('123', 'ABC', '!@#', 'Hello World', 'Test Content'),
          fc.string({ minLength: 1, maxLength: 10 })
        ),
        (content: string) => {
          const { container } = render(
            <GlassCard>{content}</GlassCard>
          );

          const glassCard = container.firstChild as HTMLElement;
          
          // Property: Regardless of content type, text contrast classes should be applied
          expect(glassCard.className).toMatch(/text-(gray-900|gray-800)/);
          expect(glassCard.className).toMatch(/dark:text-(white|gray-100)/);
          
          // Property: Content should be readable (not empty after normalization)
          if (typeof content === 'string' && content.trim().length > 0) {
            expect(glassCard.textContent?.trim().length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
