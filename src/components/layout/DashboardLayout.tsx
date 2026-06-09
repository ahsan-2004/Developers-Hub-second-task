import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { WalkthroughBanner } from './WalkthroughBanner';
import { RoleViewProvider } from '../../context/RoleViewContext';

export const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <RoleViewProvider initialViewMode={user?.role ?? 'entrepreneur'}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          
          <main className="flex-1 overflow-y-auto">
            <div className="bg-white border-b border-gray-200 py-6 shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-700 uppercase tracking-wide">Developer workspace</p>
                    <h1 className="mt-2 text-3xl font-semibold text-gray-900">Welcome back, Ahsan Malik</h1>
                    <p className="mt-2 text-gray-600 max-w-2xl">Configured with an advanced collaboration dashboard that blends scheduling, calling, document workflows, payments, and security into one cohesive experience.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
              <WalkthroughBanner />
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </RoleViewProvider>
  );
};