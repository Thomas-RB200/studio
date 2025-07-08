'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useScoreboard } from '@/context/ScoreboardContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from '@/lib/types';

export default function LoginPage() {
  const { login, currentUser, isInitialized } = useScoreboard();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isInitialized && currentUser) {
      // All admins go to the main dashboard. Only Referees go to the referee page.
      if (currentUser.role === 'Referee') {
        router.push('/referee');
      } else {
        router.push('/');
      }
    }
  }, [currentUser, router, isInitialized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, password);
    
    if (!user) {
      toast({
          title: "Login Failed",
          description: "Invalid credentials or your account is inactive.",
          variant: "destructive",
      });
    }
    // Redirection is handled by the useEffect above
  };
  
  if (!isInitialized || currentUser) {
    return <div className="flex items-center justify-center h-screen">Authenticated. Redirecting...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="hiper@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={!email || !password}>
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
