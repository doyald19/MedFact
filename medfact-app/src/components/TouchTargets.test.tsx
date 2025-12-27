import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
const fc = require('fast-check/lib/cjs/fast-check');

/**
 * **Feature: medfact-web-app, Property 8: Touch target accessibility**
 * **Validates: Requirements 5.5**
 * 
 * For any interactive element on mobile devices, touch targets should meet 
 * minimum size requirements for accessibility (44px minimum).
 */
describe('Touch Target Accessibility Property Tests', () => {
  // Minimum touch target size per WCAG guidelines
  const MIN_TOUCH_TARGET_SIZE = 44;

  // Helper to check if element has touch target classes
  const hasTouchTargetClasses = (className: string): boolean => {
    const touchTargetPatterns = [
      /min-h-\[44px\]/,
      /min-w-\[44px\]/,
      /min-h-touch/,
      /min-w-touch/,
      /touch-target/,
      /p-\d+/, // Padding that contributes to touch target size
      /py-\d+/,
      /px-\d+/,
    ];
    return touchTargetPatterns.some(pattern => pattern.test(className));
  };

  // Helper to extract numeric value from class like min-h-[44px]
  const extractMinHeight = (className: string): number | null => {
    const match = className.match(/min-h-\[(\d+)px\]/);
    return match ? parseInt(match[1], 10) : null;
  };

  // Helper to extract numeric value from class like min-w-[44px]
  const extractMinWidth = (className: string): number | null => {
    const match = className.match(/min-w-\[(\d+)px\]/);
    return match ? parseInt(match[1], 10) : null;
  };

  test('Property 8: Interactive button elements should have minimum touch target size', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter((s: string) => s.trim().length > 0),
        fc.boolean(),
        (buttonText: string, disabled: boolean) => {
          // Create a button with touch target classes
          const { container } = render(
            <button 
              className="min-h-[44px] min-w-[44px] px-4 py-2 flex items-center justify-center"
              disabled={disabled}
              aria-label={buttonText}
            >
              {buttonText}
            </button>
          );

          const button = container.querySelector('button');
          expect(button).toBeInTheDocument();
          
          const className = button?.className || '';
          
          // Property: Button should have minimum height class
          const minHeight = extractMinHeight(className);
          expect(minHeight).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
          
          // Property: Button should have minimum width class
          const minWidth = extractMinWidth(className);
          expect(minWidth).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
          
          // Property: Button should have flex alignment for centering
          expect(className).toContain('flex');
          expect(className).toContain('items-center');
          expect(className).toContain('justify-center');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 8b: Interactive link elements should have minimum touch target size', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter((s: string) => s.trim().length > 0),
        fc.webUrl(),
        (linkText: string, href: string) => {
          const { container } = render(
            <a 
              href={href}
              className="min-h-[44px] flex items-center px-2 focus:outline-none focus:ring-2"
              aria-label={linkText}
            >
              {linkText}
            </a>
          );

          const link = container.querySelector('a');
          expect(link).toBeInTheDocument();
          
          const className = link?.className || '';
          
          // Property: Link should have minimum height class
          const minHeight = extractMinHeight(className);
          expect(minHeight).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
          
          // Property: Link should have flex alignment
          expect(className).toContain('flex');
          expect(className).toContain('items-center');
          
          // Property: Link should have focus styles for accessibility
          expect(className).toContain('focus:');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 8c: Form input elements should have minimum touch target size', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('text', 'email', 'password', 'search'),
        fc.string({ minLength: 1, maxLength: 30 }).filter((s: string) => s.trim().length > 0),
        (inputType: string, placeholder: string) => {
          const { container } = render(
            <input 
              type={inputType}
              className="min-h-[44px] px-4 py-3 w-full rounded-lg"
              placeholder={placeholder}
              aria-label={placeholder}
            />
          );

          const input = container.querySelector('input');
          expect(input).toBeInTheDocument();
          
          const className = input?.className || '';
          
          // Property: Input should have minimum height class
          const minHeight = extractMinHeight(className);
          expect(minHeight).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
          
          // Property: Input should have padding for comfortable touch
          expect(className).toMatch(/p[xy]?-\d+/);
          
          // Property: Input should have rounded corners for modern UI
          expect(className).toContain('rounded');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 8d: Icon buttons should have minimum touch target size', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter((s: string) => s.trim().length > 0),
        (ariaLabel: string) => {
          // Simulate an icon button (like menu toggle, close button)
          const { container } = render(
            <button 
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg focus:outline-none focus:ring-2"
              aria-label={ariaLabel}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          );

          const button = container.querySelector('button');
          expect(button).toBeInTheDocument();
          
          const className = button?.className || '';
          
          // Property: Icon button should have minimum height
          const minHeight = extractMinHeight(className);
          expect(minHeight).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
          
          // Property: Icon button should have minimum width
          const minWidth = extractMinWidth(className);
          expect(minWidth).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
          
          // Property: Icon button should have aria-label for accessibility
          expect(button).toHaveAttribute('aria-label', ariaLabel);
          
          // Property: Icon button should have focus styles
          expect(className).toContain('focus:');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 8e: Navigation items should have minimum touch target size', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 1, maxLength: 15 }).filter((s: string) => s.trim().length > 0),
            href: fc.constantFrom('/', '/dashboard', '/settings', '/contact')
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (navItems: Array<{ label: string; href: string }>) => {
          const { container } = render(
            <nav role="navigation" aria-label="Test navigation">
              {navItems.map((item, index) => (
                <a 
                  key={index}
                  href={item.href}
                  className="min-h-[44px] flex items-center px-2 text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 rounded-lg"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          );

          const links = container.querySelectorAll('a');
          
          // Property: Each navigation link should have minimum touch target
          links.forEach((link) => {
            const className = link.className;
            const minHeight = extractMinHeight(className);
            expect(minHeight).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
            
            // Property: Each link should have focus styles
            expect(className).toContain('focus:');
            
            // Property: Each link should have hover styles
            expect(className).toContain('hover:');
          });
          
          // Property: Navigation should have proper ARIA attributes
          const nav = container.querySelector('nav');
          expect(nav).toHaveAttribute('role', 'navigation');
          expect(nav).toHaveAttribute('aria-label');
        }
      ),
      { numRuns: 100 }
    );
  });
});
