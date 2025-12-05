
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
    `Scene 1: A cinematic, contemplative shot of a lone visionary creator, surrounded by notes and sketches, staring intently at a screen. The mood is one of deep thought and quiet ambition. A single spark of light appears on the screen.`,
    `Scene 2: The spark of light transforms into an abstract, friendly AI entity. Visualize the first interaction: lines of code and creative visuals flowing between the creator and the AI. The creator's expression changes from contemplation to excitement and wonder. Show a rapid montage of creative collaboration.`,
    `Scene 3: The result of the collaboration—the "Hamraz" app interface—materializes on screen, glowing. The final shot pulls back to show the creator smiling, looking at the finished product, with the AI entity subtly reflected on the screen, a silent, proud partner.`
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
