'use client';

import type { Ad } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, PlusCircle, Trash2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateAdImage } from '@/ai/flows/generate-ad-image-flow';


interface AdsManagerProps {
  ads: Ad[];
  setAds: (ads: Ad[]) => void;
}

export default function AdsManager({ ads, setAds }: AdsManagerProps) {
    const { toast } = useToast();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [currentAd, setCurrentAd] = useState<Partial<Ad> & { index?: number }>({});
    const [isGenerating, setGenerating] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // The result is a Base64 data URI string
                setCurrentAd({ ...currentAd, imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateImage = async () => {
        const hint = currentAd['data-ai-hint'];
        if (!hint) {
            toast({
                title: "Hint Required",
                description: "Please provide an AI Hint to generate an image.",
                variant: "destructive",
            });
            return;
        }

        setGenerating(true);
        try {
            const result = await generateAdImage(hint);
            if (result.imageUrl) {
                setCurrentAd({ ...currentAd, imageUrl: result.imageUrl });
                toast({ title: "Success", description: "Image generated successfully." });
            } else {
                throw new Error("No image URL returned");
            }
        } catch (error) {
            console.error("AI image generation failed:", error);
            toast({
                title: "Generation Failed",
                description: "Could not generate image. Please try again.",
                variant: "destructive",
            });
        } finally {
            setGenerating(false);
        }
    };

    const handleSaveAd = () => {
        if (!currentAd.title || !currentAd.imageUrl) {
            toast({
                title: "Error",
                description: "Title and a selected image are required.",
                variant: "destructive",
            });
            return;
        }

        if (currentAd.index !== undefined) {
            // Editing existing ad
            const updatedAds = [...ads];
            updatedAds[currentAd.index] = currentAd as Ad;
            setAds(updatedAds);
            toast({ title: "Success", description: "Ad updated successfully." });
        } else {
            // Adding new ad
            const newAd: Ad = {
                id: (ads.length + 1).toString(),
                ...currentAd,
            } as Ad;
            setAds([...ads, newAd]);
            toast({ title: "Success", description: "Ad added successfully." });
        }
        setDialogOpen(false);
    };

    const handleEdit = (ad: Ad, index: number) => {
        setCurrentAd({ ...ad, index });
        setDialogOpen(true);
    };

    const handleAddNew = () => {
        setCurrentAd({});
        setDialogOpen(true);
    }

    const handleDelete = (index: number) => {
        setAds(ads.filter((_, i) => i !== index));
        toast({ title: "Success", description: "Ad deleted successfully." });
    };

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Ad Management</CardTitle>
                <CardDescription>Add, edit, or delete advertisements shown in the carousel.</CardDescription>
            </div>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>AI Hint</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map((ad, index) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <Image
                      src={ad.imageUrl}
                      alt={ad.title}
                      width={100}
                      height={25}
                      className="rounded-md object-cover bg-muted"
                      data-ai-hint={ad['data-ai-hint']}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{ad.title}</TableCell>
                  <TableCell>{ad['data-ai-hint'] || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(ad, index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{currentAd.index !== undefined ? 'Edit Ad' : 'Add New Ad'}</DialogTitle>
                <DialogDescription>
                    Fill in the details for the advertisement. Use the AI hint to generate an image.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input id="title" value={currentAd.title || ''} onChange={(e) => setCurrentAd({...currentAd, title: e.target.value})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="aiHint" className="text-right">AI Hint</Label>
                    <div className="col-span-3 flex items-center gap-2">
                        <Input id="aiHint" value={currentAd['data-ai-hint'] || ''} onChange={(e) => setCurrentAd({...currentAd, 'data-ai-hint': e.target.value})} className="flex-grow" placeholder="e.g. sports drink" />
                        <Button variant="outline" size="icon" onClick={handleGenerateImage} disabled={isGenerating} title="Generate with AI">
                            {isGenerating ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div> : <Sparkles className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="image" className="text-right pt-2">Image</Label>
                    <div className="col-span-3">
                        <Input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
                        <p className="text-xs text-muted-foreground mb-2">Upload an image manually, or generate one using the AI Hint.</p>
                        {currentAd.imageUrl && (
                            <div className="mt-2 rounded-md overflow-hidden aspect-[4/1] relative bg-muted flex items-center justify-center">
                                <Image src={currentAd.imageUrl} alt="Ad preview" layout="fill" objectFit="contain" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" onClick={handleSaveAd}>Save changes</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
