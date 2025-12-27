import React, { JSX } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle';
  blur?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
  interactive?: boolean;
  as?: keyof JSX.IntrinsicElements;
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  onClick?: () => void;
  tabIndex?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  blur = 'md',
  responsive = false,
  interactive = false,
  as: Component = 'div',
  role: customRole,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  onClick,
  tabIndex,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'glass-card-elevated text-gray-900 dark:text-white';
      case 'subtle':
        return 'glass-card-subtle text-gray-800 dark:text-gray-100';
      default:
        return 'glass-card text-gray-900 dark:text-white';
    }
  };

  const getBlurClasses = () => {
    switch (blur) {
      case 'sm':
        return 'backdrop-blur-sm';
      case 'lg':
        return 'backdrop-blur-lg';
      default:
        return 'backdrop-blur-md';
    }
  };

  const getResponsiveClasses = () => {
    if (responsive) {
      return 'p-4 sm:p-6 md:p-8';
    }
    return '';
  };

  const getInteractiveClasses = () => {
    if (interactive || onClick) {
      return 'glass-card-interactive cursor-pointer';
    }
    return '';
  };

  // Determine the appropriate role and aria attributes
  const accessibilityProps: Record<string, string | number | undefined> = {};
  
  if (customRole) {
    accessibilityProps.role = customRole;
  } else if (interactive || onClick) {
    accessibilityProps.role = 'button';
  } else {
    accessibilityProps.role = 'region';
  }
  
  if (ariaLabel) {
    accessibilityProps['aria-label'] = ariaLabel;
  } else if (ariaLabelledBy) {
    accessibilityProps['aria-labelledby'] = ariaLabelledBy;
  } else if (!customRole || customRole === 'region') {
    accessibilityProps['aria-label'] = 'Glass card content';
  }

  if (tabIndex !== undefined) {
    accessibilityProps.tabIndex = tabIndex;
  } else if (interactive || onClick) {
    accessibilityProps.tabIndex = 0;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Component 
      className={`${getVariantClasses()} ${getBlurClasses()} ${getResponsiveClasses()} ${getInteractiveClasses()} ${className}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      {...accessibilityProps}
    >
      {children}
    </Component>
  );
};

export default GlassCard;