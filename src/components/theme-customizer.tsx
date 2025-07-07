'use client';

import { useState, useEffect } from 'react';
import type { Theme, Scoreboard as ScoreboardType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import { useScoreboard } from '@/context/ScoreboardContext';

interface ThemeCustomizerProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  scoreboard?: ScoreboardType | null;
  updateScoreboard?: (id: string, updates: Partial<ScoreboardType>) => void;
  onSaveChanges?: () => void;
  onCancel?: () => void;
}

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="relative">
        <Input type="text" value={value} onChange={onChange} className="pr-12"/>
        <Input
            type="color"
            value={value}
            onChange={onChange}
            className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-10 p-1 bg-transparent border-none cursor-pointer"
        />
      </div>
    </div>
);


export default function ThemeCustomizer({ theme, setTheme, scoreboard, updateScoreboard, onSaveChanges, onCancel }: ThemeCustomizerProps) {
  const { toast } = useToast();
  const { currentUser } = useScoreboard();
  const [localTheme, setLocalTheme] = useState(theme);
  const [localTeamA, setLocalTeamA] = useState('');
  const [localTeamB, setLocalTeamB] = useState('');

  const isReferee = currentUser?.role === 'Referee';

  useEffect(() => {
    setLocalTheme(theme);
    if (scoreboard) {
        setLocalTeamA(scoreboard.teams.teamA);
        setLocalTeamB(scoreboard.teams.teamB);
    }
  }, [theme, scoreboard]);

  const handleThemeChange = (key: keyof Theme, value: any) => {
    setLocalTheme(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
             toast({
                title: "Error",
                description: "Image size should not exceed 2MB.",
                variant: "destructive",
            });
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            handleThemeChange('backgroundImage', reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };


  const handleSaveChanges = () => {
    // Only admins can change the global theme
    if (!isReferee) {
        setTheme(localTheme);
    }

    // Referees can change their court's team names
    if (scoreboard && updateScoreboard && scoreboard.id) {
        updateScoreboard(scoreboard.id, { teams: { teamA: localTeamA, teamB: localTeamB } });
    }

    toast({
      title: "Cambios Guardados",
      description: "La configuración se ha actualizado.",
    });

    if (onSaveChanges) {
      onSaveChanges();
    }
  };

  return (
    <div className="p-4 space-y-6">
       <div className='flex justify-between items-center mb-6'>
        <h1 className="text-3xl font-bold">Personalización</h1>
        <div className="flex items-center gap-2">
          {onCancel && <Button variant="outline" onClick={onCancel}>Volver a Controles</Button>}
          <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {isReferee && (
            <Card className="lg:col-span-3">
                <CardHeader>
                <CardTitle>Nombres de los Equipos</CardTitle>
                <CardDescription>Personaliza los nombres de las parejas para el partido actual.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="teamAName">Pareja A</Label>
                    <Input
                    id="teamAName"
                    value={localTeamA}
                    onChange={(e) => setLocalTeamA(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="teamBName">Pareja B</Label>
                    <Input
                    id="teamBName"
                    value={localTeamB}
                    onChange={(e) => setLocalTeamB(e.target.value)}
                    />
                </div>
                </CardContent>
            </Card>
        )}
        
        {!isReferee && (
          <>
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
                <CardDescription>Personaliza el título principal del marcador.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="scoreboardTitle">Título del Marcador</Label>
                  <Input
                    id="scoreboardTitle"
                    value={localTheme.scoreboardTitle}
                    onChange={(e) => handleThemeChange('scoreboardTitle', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Esquema de Colores</CardTitle>
                <CardDescription>Ajusta la apariencia visual del marcador.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ColorInput label="Primary Color" value={localTheme.primaryColor} onChange={(e) => handleThemeChange('primaryColor', e.target.value)} />
                <ColorInput label="Accent Color" value={localTheme.accentColor} onChange={(e) => handleThemeChange('accentColor', e.target.value)} />
                <ColorInput label="Text Color" value={localTheme.textColor} onChange={(e) => handleThemeChange('textColor', e.target.value)} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Background</CardTitle>
                    <CardDescription>Choose a background for the public page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <RadioGroup 
                        value={localTheme.backgroundType} 
                        onValueChange={(value: 'color' | 'image') => handleThemeChange('backgroundType', value)}
                        className="flex space-x-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="color" id="r-color" />
                            <Label htmlFor="r-color">Color</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="image" id="r-image" />
                            <Label htmlFor="r-image">Image</Label>
                        </div>
                    </RadioGroup>

                    {localTheme.backgroundType === 'color' ? (
                        <ColorInput label="Background Color" value={localTheme.backgroundColor} onChange={(e) => handleThemeChange('backgroundColor', e.target.value)} />
                    ) : (
                        <div className="grid gap-2">
                            <Label htmlFor="bg-image-upload">Upload Image</Label>
                            <Input id="bg-image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
                            {localTheme.backgroundImage && (
                                <div className="mt-2 rounded-md overflow-hidden aspect-video relative">
                                    <Image src={localTheme.backgroundImage} alt="Background Preview" layout="fill" objectFit="cover" />
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
