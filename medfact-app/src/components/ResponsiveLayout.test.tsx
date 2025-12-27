import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import GlassCard from './ui/GlassCard';

/**
 * **Feature: medfact-web-app, Property 7: Responsive layout adaptation**
 * **Validates: Requirements 5.1, 5.2, 5.3**
 */
describe('Responsive Layout Property Tests', () => {
  const variants = ['default', 'elevated', 'subtle'] as const;
  const blurLevels = ['sm', 'md', 'lg'] as const;

  test('Property 7: GlassCard maintains glassmorphism styling across all variants', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 2 }),
        fc.integer({ min: 0, max: 2 }),
        fc.boolean(),
        fc.string({ minLength: 1, maxLength: 50 }).filter((s: string) => s.trim().length > 0),
        (variantIdx: number, blurIdx: number, responsive: boolean, content: string) => {
          const variant = variants[variantIdx];
          const blur = blurLevels[blurIdx];
          
          const { container } = render(
            <GlassCard variant={variant} blur={blur} responsive={responsive}>
              {content}
            </GlassCard>
          );

          const glassCard = container.firstChild as HTMLElement;
          
          expect(glassCard.className).toMatch(/glass-card/);
          expect(glassCard.className).toMatch(/backdrop-blur-(sm|md|lg)/);
          expect(glassCard.className).toMatch(/text-(gray-900|gray-800)/);
          expect(glassCard.className).toMatch(/dark:text-(white|gray-100)/);
          
          if (responsive) {
            expect(glassCard.className).toMatch(/p-4|sm:p-6|md:p-8/);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 7b: GlassCard responsive prop adds appropriate responsive classes', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }).filter((s: string) => s.trim().length > 0),
        (content: string) => {
          const { container: responsiveContainer } = render(
            <GlassCard responsive={true}>{content}</GlassCard>
          );
          
          const { container: nonResponsiveContainer } = render(
            <GlassCard responsive={false}>{content}</GlassCard>
          );

          const responsiveCard = responsiveContainer.firstChild as HTMLElement;
          const nonResponsiveCard = nonResponsiveContainer.firstChild as HTMLElement;

          const responsiveClasses = responsiveCard.className;
          expect(responsiveClasses).toContain('p-4');
          expect(responsiveClasses).toContain('sm:p-6');
          expect(responsiveClasses).toContain('md:p-8');

          const nonResponsiveClasses = nonResponsiveCard.className;
          expect(nonResponsiveClasses).not.toContain('sm:p-6');
          expect(nonResponsiveClasses).not.toContain('md:p-8');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 7c: All GlassCard variants maintain text readability', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 2 }),
        fc.string({ minLength: 1, maxLength: 100 }).filter((s: string) => s.trim().length > 0),
        (variantIdx: number, content: string) => {
          const variant = variants[variantIdx];
          
          const { container } = render(
            <GlassCard variant={variant}>{content}</GlassCard>
          );

          const glassCard = container.firstChild as HTMLElement;
          const className = glassCard.className;

          const hasHighContrastText = 
            className.includes('text-gray-900') || 
            className.includes('text-gray-800');
          expect(hasHighContrastText).toBe(true);

          const hasDarkModeText = 
            className.includes('dark:text-white') || 
            className.includes('dark:text-gray-100');
          expect(hasDarkModeText).toBe(true);

          expect(glassCard.textContent?.trim().length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 7d: GlassCard blur levels adapt correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 2 }),
        fc.string({ minLength: 1, maxLength: 20 }).filter((s: string) => s.trim().length > 0),
        (blurIdx: number, content: string) => {
          const blur = blurLevels[blurIdx];
          
          const { container } = render(
            <GlassCard blur={blur}>{content}</GlassCard>
          );

          const glassCard = container.firstChild as HTMLElement;
          
          expect(glassCard.className).toContain(`backdrop-blur-${blur}`);
          expect(glassCard.className).toContain('glass-card');
          expect(glassCard.className).toMatch(/text-(gray-900|gray-800)/);
        }
      ),
      { numRuns: 100 }
    );
  });
});
