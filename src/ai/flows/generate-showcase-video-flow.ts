
'use server';

/**
 * @fileOverview Generates a promotional, story-driven video sequence for the Hamraz app.
 *
 * - generateShowcaseVideo - A function that initiates the video generation process for a sequence of clips.
 * - GenerateShowcaseVideoOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {Readable} from 'stream';
import {MediaPart} from 'genkit';

const GenerateShowcaseVideoInputSchema = z.object({
  language: z.enum(['en', 'fa']).describe('The language for the video generation prompt.'),
});
export type GenerateShowcaseVideoInput = z.infer<typeof GenerateShowcaseVideoInputSchema>;


const GenerateShowcaseVideoOutputSchema = z.object({
  videoUrls: z.array(z.string()).describe('The data URIs of the generated video sequence.'),
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

const prompts = {
  en: [
    `Scene 1: A cinematic, hopeful shot of a visionary looking at a screen with glowing data streams, representing the birth of the "Hamraz" idea. The mood is full of potential and inspiration. Epic, hopeful background music begins.`,
    `Scene 2: Abstract visuals representing the collaboration between a human visionary and a friendly AI. Visualize concepts like sparks of ideas, connecting dots of light, and a growing digital tree with branches representing creativity, learning, and community. The music swells.`,
    `Scene 3: Show diverse people from different cultures connecting through glowing lines of communication. End with a shot of the Earth, with glowing points of light representing the global Hamraz community, all connected. The music reaches a powerful and emotional climax. This sequence must be a masterpiece.`
    ],
  fa: [
    `سکانس ۱: یک شات سینمایی و امیدوارکننده از یک رویاپرداز که به صفحه‌ای با جریان‌های داده درخشان نگاه می‌کند و نمایانگر تولد ایده "همراز" است. حال و هوا پر از پتانسیل و الهام است. موسیقی پس‌زمینه حماسی و امیدوارکننده آغاز می‌شود.`,
    `سکانس ۲: تصاویر بصری انتزاعی که نمایانگر همکاری بین یک رویاپرداز انسانی و یک هوش مصنوعی دوستانه است. مفاهیمی مانند جرقه‌های ایده‌ها، اتصال نقاط نورانی، و یک درخت دیجیتالی در حال رشد با شاخه‌هایی که نماد خلاقیت، یادگیری و جامعه هستند را به تصویر بکشید. موسیقی اوج می‌گیرد.`,
    `سکانس ۳: افراد متنوع از فرهنگ‌های مختلف را نشان دهید که از طریق خطوط درخشان ارتباطی به هم متصل می‌شوند. با یک شات از کره زمین که نقاط نورانی درخشان به نمایندگی از جامعه جهانی همراز، همه به هم متصل هستند، پایان دهید. موسیقی به اوج قدرتمند و احساسی خود می‌رسد. این سکانس باید یک شاهکار باشد.`
    ]
};


export async function generateShowcaseVideo(input: GenerateShowcaseVideoInput): Promise<GenerateShowcaseVideoOutput> {
  const languagePrompts = prompts[input.language];
  const videoUrls: string[] = [];

  for (const prompt of languagePrompts) {
      let {operation} = await ai.generate({
        model: googleAI.model('veo-3.0-generate-preview'),
        prompt: prompt,
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
