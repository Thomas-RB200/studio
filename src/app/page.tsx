'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useScoreboard } from '@/context/ScoreboardContext';
import type { UserRole } from '@/lib/types';

import DashboardLayout from '@/components/dashboard-layout';
import ThemeCustomizer from '@/components/theme-customizer';
import AdsManager from '@/components/ads-manager';
import UserManager from '@/components/user-manager';
import LiveView from '@/components/live-view';
import OverlayLinks from '@/components/overlay-links';
import HealthMonitor from '@/components/health-monitor';

// Hyper Admin, Super Admin, and Admin have access to the dashboard.
const ADMIN_ROLES: UserRole[] = ['Hyper Admin', 'Super Admin', 'Admin'];

export default function DashboardPage() {
  const [activeView, setActiveView] = useState('live');
  const { 
    theme, setTheme, 
    ads, setAds,
    users, setUsers,
    currentUser,
    isInitialized,
  } = useScoreboard();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    if (!currentUser) {
      router.push('/login');
    } else if (!ADMIN_ROLES.includes(currentUser.role)) {
      // If a user without admin rights (like a Referee) lands here, redirect them.
      router.push('/referee');
    }
  }, [currentUser, router, isInitialized]);

  useEffect(() => {
    // If the current user is an 'Admin', default their view to 'users'
    // and prevent them from seeing other views if they try to navigate.
    if (currentUser?.role === 'Admin') {
      // Admins can see live, users, and overlays.
      if (!['live', 'users', 'overlays'].includes(activeView)) {
         setActiveView('users'); // Default to users view.
      }
    }
  }, [currentUser, activeView]);

  const renderView = () => {
    switch (activeView) {
      case 'theme':
        return <ThemeCustomizer theme={theme} setTheme={setTheme} />;
      case 'ads':
        return <AdsManager ads={ads} setAds={setAds} />;
      case 'users':
        return <UserManager users={users} setUsers={setUsers} />;
      case 'overlays':
        return <OverlayLinks />;
      case 'health':
        return <HealthMonitor />;
      case 'live':
      default:
        return <LiveView />;
    }
  };

  if (!isInitialized || !currentUser || !ADMIN_ROLES.includes(currentUser.role)) {
    return <div className="flex items-center justify-center h-screen">Authenticating...</div>;
  }

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}
    </DashboardLayout>
  );
}
