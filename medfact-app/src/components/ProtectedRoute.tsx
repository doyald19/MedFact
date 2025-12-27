import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts';
import GlassCard from './ui/GlassCard';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // If not loading and no user, set redirect after a brief delay
    // This prevents immediate redirect and allows for session restoration
    if (!isLoading && !user) {
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, user]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard variant="elevated" className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Checking authentication...
            </p>
          </div>
        </GlassCard>
      </div>
    );
  }

  // If user is authenticated, render the protected content
  if (user) {
    return <>{children}</>;
  }

  // If should redirect (after loading is complete and no user), redirect to login
  if (shouldRedirect) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ 
          from: location.pathname,
          message: 'Please sign in to access this page'
        }} 
        replace 
      />
    );
  }

  // Default loading state (brief moment before redirect)
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard variant="elevated" className="p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Verifying access...
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default ProtectedRoute;