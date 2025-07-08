'use client';

import { useState, useEffect } from 'react';
import type { AppErrorEvent } from '@/lib/error-reporting';
import { ERROR_STORAGE_KEY } from '@/lib/error-reporting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

export default function HealthMonitor() {
  const [errors, setErrors] = useState<AppErrorEvent[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadErrors = () => {
      const storedErrors = localStorage.getItem(ERROR_STORAGE_KEY);
      if (storedErrors) {
        try {
          const parsedErrors = JSON.parse(storedErrors);
          if (Array.isArray(parsedErrors)) {
            setErrors(parsedErrors);
          }
        } catch (e) {
          console.error("Failed to parse errors from localStorage", e);
        }
      }
    };

    loadErrors();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ERROR_STORAGE_KEY) {
        loadErrors();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleClearErrors = () => {
    localStorage.removeItem(ERROR_STORAGE_KEY);
    setErrors([]);
    toast({
      title: "Logs Cleared",
      description: "The error log has been successfully cleared.",
    });
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Health Padel Monitor</CardTitle>
            <CardDescription>A log of client-side errors reported by referee panels.</CardDescription>
          </div>
          {errors.length > 0 && (
            <Button variant="destructive" onClick={handleClearErrors}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear Logs
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {errors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Timestamp</TableHead>
                  <TableHead>Error Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errors.map((error) => (
                  <TableRow key={error.id}>
                    <TableCell>
                      {format(new Date(error.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{error.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No errors reported. The system is healthy.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
