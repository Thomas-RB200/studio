'use server';
/**
 * @fileOverview An AI flow for generating ad images.
 *
 * - generateAdImage - A function that generates an image from a text prompt.
 * - GenerateAdImageInput - The input type for the generateAdImage function.
 * - GenerateAdImageOutput - The return type for the generateAdImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdImageInputSchema = z.string().describe('A text prompt describing the image to generate.');
export type GenerateAdImageInput = z.infer<typeof GenerateAdImageInputSchema>;

const GenerateAdImageOutputSchema = z.object({
  imageUrl: z.string().describe("The generated image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateAdImageOutput = z.infer<typeof GenerateAdImageOutputSchema>;

export async function generateAdImage(prompt: GenerateAdImageInput): Promise<GenerateAdImageOutput> {
  return generateAdImageFlow(prompt);
}

const generateAdImageFlow = ai.defineFlow(
  {
    name: 'generateAdImageFlow',
    inputSchema: GenerateAdImageInputSchema,
    outputSchema: GenerateAdImageOutputSchema,
  },
  async (prompt) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a simple, modern, high-quality logo for an advertisement based on the following hint: "${prompt}". The logo should be on a clean background, suitable for a banner ad.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed to produce an image.');
    }

    return { imageUrl: media.url };
  }
);
