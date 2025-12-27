import React, { Component, ErrorInfo, ReactNode } from 'react';

interface BackgroundEffectErrorBoundaryProps {
  children: ReactNode;
  fallbackColor?: string;
}

interface BackgroundEffectErrorBoundaryState {
  hasError: boolean;
}

/**
 * Error boundary specifically for background effects.
 * Falls back to a static gradient background if Canvas/WebGL fails.
 */
class BackgroundEffectErrorBoundary extends Component<
  BackgroundEffectErrorBoundaryProps,
  BackgroundEffectErrorBoundaryState
> {
  constructor(props: BackgroundEffectErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): BackgroundEffectErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error silently - background effects are non-critical
    console.warn('Background effect failed to render:', error.message);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Return a static fallback background
      const fallbackColor = this.props.fallbackColor || 'transparent';
      return (
        <div
          className="fixed inset-0 w-full h-full pointer-events-none z-0"
          style={{ background: fallbackColor }}
          aria-hidden="true"
        />
      );
    }

    return this.props.children;
  }
}

export default BackgroundEffectErrorBoundary;
