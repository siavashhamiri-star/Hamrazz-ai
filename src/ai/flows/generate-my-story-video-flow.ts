
'use server';

/**
 * @fileOverview Generates a personalized, story-driven video sequence about the creator's journey with Hamraz.
 *
 * - generateMyStoryVideo - A function that initiates the video generation process for a sequence of clips.
 * - GenerateMyStoryVideoOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {Readable} from 'stream';

const GenerateMyStoryVideoOutputSchema = z.object({
  videoUrls: z.array(z.string()).describe('The data URIs of the generated video sequence.'),
});
export type GenerateMyStoryVideoOutput = z.infer<
  typeof GenerateMyStoryVideoOutputSchema
>;

async function toBase64(readable: Readable): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('base64');
}

const prompts = [
    `Scene 1: A cinematic, contemplative shot of a lone visionary creator, surrounded by sketches and notes, staring intently at a screen. The mood is deep thought and quiet ambition. A single, brilliant spark of light appears on the screen, symbolizing the birth of an idea.`,
    `Scene 2: The spark of light blossoms into an abstract, friendly AI entity on the screen. Visualize the first magical interaction: lines of code, creative visuals, and data streams flowing between the creator and the AI. The creator's expression shifts from contemplation to excitement and wonder as the collaboration accelerates.`,
    `Scene 3: The result of the collaboration—the "Hamraz" app interface—materializes and glows on the screen. The final shot pulls back to show the creator smiling with pride at the finished product, while the AI entity is subtly reflected on the screen, a silent, supportive partner.`
];


export async function generateMyStoryVideo(): Promise<GenerateMyStoryVideoOutput> {
  const videoUrls: string[] = [];

  for (const prompt of prompts) {
      let {operation} = await ai.generate({
        model: googleAI.model('veo-3.0-generate-preview'),
        prompt: prompt,
        config: {
          // We want this to be silent so the user can do a voiceover
          generationConfig: { "no_audio": true }
        }
      });

      if (!operation) {
        throw new Error('Expected the model to return an operation for prompt: ' + prompt);
      }

      // Wait until the operation completes.
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        operation = await ai.checkOperation(operation);
      }

      if (operation.error) {
        console.error('Video generation failed for a clip:', operation.error);
        // Continue to next clip or throw an error for the whole sequence
        throw new Error(`Failed to generate a video clip: ${operation.error.message}`);
      }

      const videoPart = operation.output?.message?.content.find(p => !!p.media);
      if (!videoPart || !videoPart.media) {
        throw new Error('Failed to find the generated video in the operation result for a clip.');
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
        throw new Error('Failed to fetch video from storage URL for a clip.');
      }

      const videoBase64 = await toBase64(
        Readable.from(videoDownloadResponse.body)
      );
      
      videoUrls.push(`data:video/mp4;base64,${videoBase64}`);
  }

  return { videoUrls };
}
