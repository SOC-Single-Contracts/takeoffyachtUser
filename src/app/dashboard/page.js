"use client";

import React from 'react';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Loading } from '@/components/ui/loading';
import Featured from './featured/page';

const Dashboard = () => {
  const { session, status } = useProtectedRoute();

  if (status === "loading") {
    return <Loading />;
  }
  return (
      <Featured />
  );
};

export default Dashboard;