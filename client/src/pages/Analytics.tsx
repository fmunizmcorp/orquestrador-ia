/**
 * Analytics Page  
 * Advanced analytics and monitoring dashboard
 * SPRINT 49 - P0-9: Added Error Boundary for better error handling
 */
import React from 'react';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const Analytics: React.FC = () => {
  return (
    <ErrorBoundary>
      <AnalyticsDashboard />
    </ErrorBoundary>
  );
};
