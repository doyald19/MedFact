import React from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * Icon size presets for consistent sizing across the application
 * Following the design system requirements for Lucide-React icons
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  className?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
}

/**
 * Get pixel size for icon size preset
 */
const getIconSize = (size: IconSize): number => {
  switch (size) {
    case 'xs':
      return 14;
    case 'sm':
      return 16;
    case 'md':
      return 20;
    case 'lg':
      return 24;
    case 'xl':
      return 32;
    default:
      return 20;
  }
};

/**
 * Get Tailwind classes for icon size preset
 */
export const getIconSizeClasses = (size: IconSize): string => {
  switch (size) {
    case 'xs':
      return 'w-3.5 h-3.5';
    case 'sm':
      return 'w-4 h-4';
    case 'md':
      return 'w-5 h-5';
    case 'lg':
      return 'w-6 h-6';
    case 'xl':
      return 'w-8 h-8';
    default:
      return 'w-5 h-5';
  }
};

/**
 * Icon component wrapper for consistent Lucide-React icon usage
 * Provides standardized sizing and accessibility attributes
 */
const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 'md',
  className = '',
  'aria-hidden': ariaHidden = true,
  'aria-label': ariaLabel,
}) => {
  const pixelSize = getIconSize(size);
  const sizeClasses = getIconSizeClasses(size);

  return (
    <IconComponent
      size={pixelSize}
      className={`${sizeClasses} ${className}`}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    />
  );
};

export default Icon;
