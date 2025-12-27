import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
const fc = require('fast-check/lib/cjs/fast-check');
import Icon, { getIconSizeClasses, IconSize } from './Icon';
import { Search, User, Home, Settings, Mail, Heart, AlertTriangle, Info, Shield, LucideIcon } from 'lucide-react';

/**
 * **Feature: medfact-web-app, Property 14: Icon consistency**
 * **Validates: Requirements 8.5**
 * 
 * For any icon in the application, Lucide-React icons should be used consistently
 * with standardized sizing and styling.
 */
describe('Icon Consistency Property Tests', () => {
  const lucideIcons: LucideIcon[] = [Search, User, Home, Settings, Mail, Heart, AlertTriangle, Info, Shield];
  const iconSizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

  /**
   * Property 14: Icon consistency
   * For any icon, Lucide-React icons should be used with consistent sizing and styling.
   */
  test('Property 14: Icon component should render Lucide-React icons with consistent sizing', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...lucideIcons),
        fc.constantFrom(...iconSizes),
        (IconComponent: LucideIcon, size: IconSize) => {
          const { container } = render(
            <Icon icon={IconComponent} size={size} />
          );

          const svgElement = container.querySelector('svg');
          
          // Property: Icon should render as SVG element
          expect(svgElement).toBeInTheDocument();
          
          // Property: Icon should have correct size classes
          const expectedClasses = getIconSizeClasses(size);
          expectedClasses.split(' ').forEach(cls => {
            expect(svgElement?.className.baseVal || svgElement?.getAttribute('class')).toContain(cls);
          });
          
          // Property: Icon should have aria-hidden by default for decorative icons
          expect(svgElement).toHaveAttribute('aria-hidden', 'true');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 14b: Icon size classes should be consistent across all size presets', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...iconSizes),
        (size: IconSize) => {
          const sizeClasses = getIconSizeClasses(size);
          
          // Property: Size classes should contain width and height classes
          expect(sizeClasses).toMatch(/w-\d+(\.\d+)?/);
          expect(sizeClasses).toMatch(/h-\d+(\.\d+)?/);
          
          // Property: Width and height should be equal (square icons)
          const widthMatch = sizeClasses.match(/w-(\d+(\.\d+)?)/);
          const heightMatch = sizeClasses.match(/h-(\d+(\.\d+)?)/);
          expect(widthMatch?.[1]).toBe(heightMatch?.[1]);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 14c: Icon sizes should follow a consistent scale', () => {
    // Define expected size mappings
    const expectedSizeClasses: Record<IconSize, string> = {
      'xs': 'w-3.5 h-3.5',
      'sm': 'w-4 h-4',
      'md': 'w-5 h-5',
      'lg': 'w-6 h-6',
      'xl': 'w-8 h-8'
    };

    fc.assert(
      fc.property(
        fc.constantFrom(...iconSizes),
        (size: IconSize) => {
          const actualClasses = getIconSizeClasses(size);
          
          // Property: Each size should map to expected Tailwind classes
          expect(actualClasses).toBe(expectedSizeClasses[size]);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 14d: Icon component should accept custom className', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...lucideIcons),
        fc.constantFrom(...iconSizes),
        fc.constantFrom('text-red-500', 'text-blue-400', 'text-green-300', 'opacity-50'),
        (IconComponent: LucideIcon, size: IconSize, customClass: string) => {
          const { container } = render(
            <Icon icon={IconComponent} size={size} className={customClass} />
          );

          const svgElement = container.querySelector('svg');
          
          // Property: Custom class should be applied to the icon
          expect(svgElement?.className.baseVal || svgElement?.getAttribute('class')).toContain(customClass);
          
          // Property: Size classes should still be present
          const expectedSizeClasses = getIconSizeClasses(size);
          expectedSizeClasses.split(' ').forEach(cls => {
            expect(svgElement?.className.baseVal || svgElement?.getAttribute('class')).toContain(cls);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 14e: Icon component should support aria-label for accessible icons', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...lucideIcons),
        fc.string({ minLength: 1, maxLength: 50 }).filter((s: string) => s.trim().length > 0),
        (IconComponent: LucideIcon, ariaLabel: string) => {
          const { container } = render(
            <Icon icon={IconComponent} aria-hidden={false} aria-label={ariaLabel} />
          );

          const svgElement = container.querySelector('svg');
          
          // Property: When aria-hidden is false, aria-label should be applied
          expect(svgElement).toHaveAttribute('aria-hidden', 'false');
          expect(svgElement).toHaveAttribute('aria-label', ariaLabel);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 14f: Default icon size should be medium (md)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...lucideIcons),
        (IconComponent: LucideIcon) => {
          const { container } = render(
            <Icon icon={IconComponent} />
          );

          const svgElement = container.querySelector('svg');
          const expectedClasses = getIconSizeClasses('md');
          
          // Property: Default size should be 'md' (w-5 h-5)
          expectedClasses.split(' ').forEach(cls => {
            expect(svgElement?.className.baseVal || svgElement?.getAttribute('class')).toContain(cls);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 14g: All Lucide-React icons should render consistently', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...lucideIcons),
        fc.constantFrom(...lucideIcons),
        fc.constantFrom(...iconSizes),
        (Icon1: LucideIcon, Icon2: LucideIcon, size: IconSize) => {
          const { container: container1 } = render(
            <Icon icon={Icon1} size={size} />
          );
          const { container: container2 } = render(
            <Icon icon={Icon2} size={size} />
          );

          const svg1 = container1.querySelector('svg');
          const svg2 = container2.querySelector('svg');
          
          // Property: Both icons should have the same size classes
          const expectedClasses = getIconSizeClasses(size);
          expectedClasses.split(' ').forEach(cls => {
            expect(svg1?.className.baseVal || svg1?.getAttribute('class')).toContain(cls);
            expect(svg2?.className.baseVal || svg2?.getAttribute('class')).toContain(cls);
          });
          
          // Property: Both icons should have aria-hidden attribute
          expect(svg1).toHaveAttribute('aria-hidden', 'true');
          expect(svg2).toHaveAttribute('aria-hidden', 'true');
        }
      ),
      { numRuns: 100 }
    );
  });
});
