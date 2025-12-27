/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.1)',
          border: 'rgba(255, 255, 255, 0.2)',
          'border-dark': 'rgba(255, 255, 255, 0.1)',
        }
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 12px 40px rgba(0, 0, 0, 0.15)',
        'glass-xl': '0 16px 48px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'glass': '16px',
        'glass-lg': '20px',
        'glass-xl': '24px',
      },
      // Responsive spacing for touch targets (minimum 44px for accessibility)
      minHeight: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      minWidth: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      // Screen breakpoints (mobile-first)
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.glass-card': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '@media (max-width: 768px)': {
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          }
        },
        '.glass-card-dark': {
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '@media (max-width: 768px)': {
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          }
        },
        '.glass-card-elevated': {
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '20px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease-in-out',
          '@media (max-width: 768px)': {
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          }
        },
        '.glass-card-subtle': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease-in-out',
          '@media (max-width: 768px)': {
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }
        },
        '.glass-hover': {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.15)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          }
        },
        '.glass-focus': {
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: '2px solid rgba(59, 130, 246, 0.5)',
            outlineOffset: '2px',
          },
          '&:focus-visible': {
            outline: '2px solid rgba(59, 130, 246, 0.7)',
            outlineOffset: '2px',
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)',
          }
        },
        // Interactive button with glassmorphism hover/focus
        '.glass-button': {
          transition: 'all 0.2s ease-in-out',
          '&:hover:not(:disabled)': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.35)',
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
          '&:focus-visible': {
            outline: '2px solid rgba(59, 130, 246, 0.7)',
            outlineOffset: '2px',
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)',
          },
          '&:active:not(:disabled)': {
            transform: 'translateY(0)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          }
        },
        // Interactive input with glassmorphism focus
        '.glass-input': {
          transition: 'all 0.2s ease-in-out',
          '&:hover:not(:disabled)': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.12)',
          },
          '&:focus': {
            borderColor: 'rgba(59, 130, 246, 0.5)',
            background: 'rgba(255, 255, 255, 0.15)',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
            outline: 'none',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          }
        },
        // Interactive link with glassmorphism hover
        '.glass-link': {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            color: 'rgba(255, 255, 255, 1)',
            textShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
          },
          '&:focus-visible': {
            outline: '2px solid rgba(59, 130, 246, 0.7)',
            outlineOffset: '2px',
            borderRadius: '4px',
          }
        },
        // Interactive card with glassmorphism hover
        '.glass-card-interactive': {
          transition: 'all 0.3s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.15)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
          },
          '&:focus-visible': {
            outline: '2px solid rgba(59, 130, 246, 0.7)',
            outlineOffset: '2px',
          },
          '&:active': {
            transform: 'translateY(-2px)',
          }
        },
        // Option button for symptom checker
        '.glass-option': {
          transition: 'all 0.2s ease-in-out',
          '&:hover:not(:disabled)': {
            background: 'rgba(255, 255, 255, 0.15)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            transform: 'translateX(4px)',
          },
          '&:focus-visible': {
            outline: '2px solid rgba(59, 130, 246, 0.7)',
            outlineOffset: '2px',
            borderColor: 'rgba(59, 130, 246, 0.5)',
          },
          '&:active:not(:disabled)': {
            background: 'rgba(255, 255, 255, 0.2)',
            transform: 'translateX(2px)',
          }
        },
        // Primary action button with gradient
        '.glass-button-primary': {
          transition: 'all 0.2s ease-in-out',
          '&:hover:not(:disabled)': {
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: '0 12px 32px rgba(59, 130, 246, 0.3)',
          },
          '&:focus-visible': {
            outline: '2px solid rgba(59, 130, 246, 0.7)',
            outlineOffset: '2px',
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)',
          },
          '&:active:not(:disabled)': {
            transform: 'translateY(0) scale(1)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          }
        },
        // Touch target utilities for mobile accessibility (minimum 44px)
        '.touch-target': {
          minWidth: '44px',
          minHeight: '44px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        '.touch-target-lg': {
          minWidth: '48px',
          minHeight: '48px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        // Responsive glass card adjustments
        '.glass-responsive': {
          padding: '1rem',
          '@media (min-width: 640px)': {
            padding: '1.5rem',
          },
          '@media (min-width: 768px)': {
            padding: '2rem',
          },
        },
        // Mobile-optimized text sizes
        '.text-responsive-sm': {
          fontSize: '0.875rem',
          '@media (min-width: 640px)': {
            fontSize: '1rem',
          },
        },
        '.text-responsive-base': {
          fontSize: '1rem',
          '@media (min-width: 640px)': {
            fontSize: '1.125rem',
          },
        },
        '.text-responsive-lg': {
          fontSize: '1.125rem',
          '@media (min-width: 640px)': {
            fontSize: '1.25rem',
          },
          '@media (min-width: 768px)': {
            fontSize: '1.5rem',
          },
        },
        '.text-responsive-xl': {
          fontSize: '1.5rem',
          '@media (min-width: 640px)': {
            fontSize: '2rem',
          },
          '@media (min-width: 768px)': {
            fontSize: '2.5rem',
          },
        },
        '.text-responsive-2xl': {
          fontSize: '2rem',
          '@media (min-width: 640px)': {
            fontSize: '2.5rem',
          },
          '@media (min-width: 768px)': {
            fontSize: '3rem',
          },
          '@media (min-width: 1024px)': {
            fontSize: '3.75rem',
          },
        },
      }
      addUtilities(newUtilities)
    }
  ],
}