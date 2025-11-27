'use server';

/**
 * @fileOverview Generates a promotional, story-driven video for the Hamraz app.
 *
 * - generateShowcaseVideo - A function that initiates the video generation process.
 * - GenerateShowcaseVideoOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import * as fs from 'fs';
import {Readable} from 'stream';
import {MediaPart} from 'genkit';

const GenerateShowcaseVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type GenerateShowcaseVideoOutput = z.infer<
  typeof GenerateShowcaseVideoOutputSchema
>;

async function toBase64(readable: Readable): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('base64');
}

export async function generateShowcaseVideo(): Promise<GenerateShowcaseVideoOutput> {
  let {operation} = await ai.generate({
    model: googleAI.model('veo-2.0-generate-001'),
    prompt: `A cinematic, emotional, and hopeful promotional video telling a story.
    Show abstract visuals representing the collaboration between a human visionary and a friendly AI.
    Visualize concepts like sparks of ideas, connecting dots of light, a growing digital tree with branches representing creativity, learning, and community.
    Show diverse people from different cultures connecting through glowing lines of communication.
    Visualize a single user's journey from a curious learner to a confident creator.
    The visual style should be elegant, clean, with a mix of glowing data streams and warm human moments.
    End with a shot of the Earth, with glowing points of light representing the global Hamraz community, all connected.`,
    config: {
      durationSeconds: 8,
      aspectRatio: '16:9',
    },
  });

  if (!operation) {
    throw new Error('Expected the model to return an operation');
  }

  // Wait until the operation completes.
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    operation = await ai.checkOperation(operation);
  }

  if (operation.error) {
    console.error('Video generation failed:', operation.error);
    throw new Error(`Failed to generate video: ${operation.error.message}`);
  }

  const videoPart = operation.output?.message?.content.find(p => !!p.media);
  if (!videoPart || !videoPart.media) {
    throw new Error('Failed to find the generated video in the operation result');
  }

  const fetch = (await import('node-fetch')).default;
  const videoDownloadResponse = await fetch(
    `${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`
  );

  if (
    !videoDownloadResponse ||
    videoDownloadResponse.status !== 200 ||
    !videoDownloadResponse.body
  ) {
    throw new Error('Failed to fetch video from storage URL');
  }

  const videoBase64 = await toBase64(
    Readable.from(videoDownloadResponse.body)
  );

  return {
    videoUrl: `data:video/mp4;base64,${videoBase64}`,
  };
}
