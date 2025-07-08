'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Palette, Megaphone, Users, Tv, ExternalLink, LogOut, Link2, HeartPulse } from 'lucide-react';
import { useScoreboard } from '@/context/ScoreboardContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { ERROR_STORAGE_KEY } from '@/lib/error-reporting';
import type { UserRole } from '@/lib/types';
import { PadelIcon } from '@/components/icons';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

const VIEWER_ADMIN_ROLES: UserRole[] = ['Hyper Admin', 'Super Admin', 'Admin'];
const THEME_ADS_HEALTH_ROLES: UserRole[] = ['Hyper Admin', 'Super Admin'];
const MANAGE_USERS_ROLES: UserRole[] = ['Hyper Admin', 'Super Admin', 'Admin'];


export default function DashboardLayout({ children, activeView, setActiveView }: DashboardLayoutProps) {
  const { currentUser, logout } = useScoreboard();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ERROR_STORAGE_KEY && event.newValue) {
        if (currentUser && (currentUser.role === 'Hyper Admin' || currentUser.role === 'Super Admin')) {
            toast({
              variant: 'destructive',
              title: 'New Client-Side Error Reported',
              description: `An error was reported. Check the Health Monitor for details.`,
            });
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser, toast]);


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <PadelIcon className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold">Padelicius Score</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
             {/* Views for all admin types */}
            {currentUser && VIEWER_ADMIN_ROLES.includes(currentUser.role) && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setActiveView('live')} isActive={activeView === 'live'}>
                    <Tv />
                    Live
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setActiveView('overlays')} isActive={activeView === 'overlays'}>
                    <Link2 />
                    Overlays
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
            
            {/* Items for Hyper and Super Admin */}
            {currentUser && THEME_ADS_HEALTH_ROLES.includes(currentUser.role) && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setActiveView('theme')} isActive={activeView === 'theme'}>
                    <Palette />
                    Theme Customization
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setActiveView('ads')} isActive={activeView === 'ads'}>
                    <Megaphone />
                    Ad Management
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setActiveView('health')} isActive={activeView === 'health'}>
                      <HeartPulse />
                      Health Monitor
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}

             {/* User Management for Hyper, Super, and Admin */}
            {currentUser && MANAGE_USERS_ROLES.includes(currentUser.role) && (
                 <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setActiveView('users')} isActive={activeView === 'users'}>
                    <Users />
                    Courts & Users
                  </SidebarMenuButton>
                </SidebarMenuItem>
            )}

            {/* Personalize button for Referees */}
            {currentUser?.role === 'Referee' && (
               <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setActiveView('theme')} isActive={activeView === 'theme'}>
                    <Palette />
                    Personalizar
                  </SidebarMenuButton>
                </SidebarMenuItem>
            )}

          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            {/* View Public Link for all Admin roles */}
            {currentUser && VIEWER_ADMIN_ROLES.includes(currentUser.role) && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/stream" target="_blank">
                    <ExternalLink />
                    View Public Link
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
