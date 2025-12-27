import React from 'react';
import { render } from '@testing-library/react';
import ThreadsEffect from './ThreadsEffect';
import GalaxyEffect from './GalaxyEffect';

/**
 * **Feature: medfact-web-app, Property 15: Library integration**
 * **Validates: Requirements 9.1, 9.2**
 * 
 * For any page requiring background effects, the correct library component 
 * (Threads or Galaxy) should be imported and rendered
 */

describe('Background Effects Library Integration', () => {
  // Mock canvas context to prevent errors in test environment
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn(),
      })),
    })) as any;
    
    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn((cb) => {
      setTimeout(cb, 16);
      return 1;
    });
    
    global.cancelAnimationFrame = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Property 15: Library integration', () => {
    it('should render ThreadsEffect component with various prop combinations', () => {
      const testCases = [
        { density: 10, speed: 0.5, color: '#ffffff' },
        { density: 50, speed: 1, color: '#000000' },
        { density: 100, speed: 2, color: '#ff0000' },
        { density: 200, speed: 5, color: '#00ff00' },
        {}, // Default props
      ];

      testCases.forEach((props) => {
        const { container } = render(<ThreadsEffect {...props} />);
        
        // Verify that a canvas element is rendered
        const canvas = container.querySelector('canvas');
        expect(canvas).toBeInTheDocument();
        
        // Verify canvas has the correct classes for positioning
        expect(canvas).toHaveClass('fixed', 'inset-0', 'w-full', 'h-full', 'pointer-events-none', 'z-0');
        
        // Verify canvas has accessibility attributes
        expect(canvas).toHaveAttribute('aria-hidden', 'true');
        
        // Verify canvas has transparent background
        expect(canvas).toHaveStyle({ background: 'transparent' });
      });
    });

    it('should render GalaxyEffect component with various prop combinations', () => {
      const testCases = [
        { particleCount: 10, interactive: true, mouseInfluence: 25 },
        { particleCount: 50, interactive: false, mouseInfluence: 50 },
        { particleCount: 100, interactive: true, mouseInfluence: 100 },
        { particleCount: 300, interactive: false, mouseInfluence: 200 },
        {}, // Default props
      ];

      testCases.forEach((props) => {
        const { container } = render(<GalaxyEffect {...props} />);
        
        // Verify that a canvas element is rendered
        const canvas = container.querySelector('canvas');
        expect(canvas).toBeInTheDocument();
        
        // Verify canvas has the correct classes for positioning
        expect(canvas).toHaveClass('fixed', 'inset-0', 'w-full', 'h-full', 'pointer-events-none', 'z-0');
        
        // Verify canvas has accessibility attributes
        expect(canvas).toHaveAttribute('aria-hidden', 'true');
        
        // Verify canvas has transparent background
        expect(canvas).toHaveStyle({ background: 'transparent' });
      });
    });

    it('should handle ThreadsEffect with edge case props', () => {
      const edgeCases = [
        { density: 1, speed: 0.1, color: '#ffffff' },
        { density: 500, speed: 10, color: '#000000' },
      ];

      edgeCases.forEach((props) => {
        expect(() => {
          render(<ThreadsEffect {...props} />);
        }).not.toThrow();
      });
    });

    it('should handle GalaxyEffect with edge case props', () => {
      const edgeCases = [
        { particleCount: 1, interactive: true, mouseInfluence: 1 },
        { particleCount: 1000, interactive: false, mouseInfluence: 500 },
      ];

      edgeCases.forEach((props) => {
        expect(() => {
          render(<GalaxyEffect {...props} />);
        }).not.toThrow();
      });
    });

    it('should properly integrate library components without errors across different configurations', () => {
      const configurations = [
        { component: 'threads', props: { density: 25, speed: 1.5, color: '#ffffff' } },
        { component: 'threads', props: { density: 75, speed: 0.8, color: '#cccccc' } },
        { component: 'galaxy', props: { particleCount: 80, interactive: true, mouseInfluence: 60 } },
        { component: 'galaxy', props: { particleCount: 120, interactive: false, mouseInfluence: 40 } },
      ];

      configurations.forEach((config) => {
        expect(() => {
          if (config.component === 'threads') {
            render(<ThreadsEffect {...config.props} />);
          } else {
            render(<GalaxyEffect {...config.props} />);
          }
        }).not.toThrow();
      });
    });

    it('should ensure both components can coexist without conflicts', () => {
      expect(() => {
        const { container: container1 } = render(<ThreadsEffect density={30} />);
        const { container: container2 } = render(<GalaxyEffect particleCount={60} />);
        
        expect(container1.querySelector('canvas')).toBeInTheDocument();
        expect(container2.querySelector('canvas')).toBeInTheDocument();
      }).not.toThrow();
    });
  });
});