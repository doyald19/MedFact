import React, { Component, ErrorInfo, ReactNode } from 'react';
import GlassCard from './ui/GlassCard';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorId: ''
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI with glassmorphism styling
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
          <GlassCard className="max-w-md w-full p-6 sm:p-8 text-center" variant="elevated">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" aria-hidden="true" />
              </div>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            
            <p className="text-white/70 mb-6 text-sm sm:text-base">
              We encountered an unexpected error. Please try again or return to the home page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
                <p className="text-red-300 text-xs font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center space-x-2 px-4 py-2 min-h-[44px] bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label="Try again"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center space-x-2 px-4 py-2 min-h-[44px] bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Go to home page"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                <span>Go Home</span>
              </button>
            </div>

            <p className="mt-6 text-white/40 text-xs">
              Error ID: {this.state.errorId}
            </p>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
