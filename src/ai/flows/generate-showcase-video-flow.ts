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

const GenerateShowcaseVideoInputSchema = z.object({
  language: z.enum(['en', 'fa']).describe('The language for the video generation prompt.'),
});
export type GenerateShowcaseVideoInput = z.infer<typeof GenerateShowcaseVideoInputSchema>;


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

const prompts = {
  en: `A cinematic shot of an old car driving down a deserted road at sunset.
    Create an emotional, and hopeful promotional video telling a story.
    Show abstract visuals representing the collaboration between a human visionary and a friendly AI.
    Visualize concepts like sparks of ideas, connecting dots of light, a growing digital tree with branches representing creativity, learning, and community.
    Show diverse people from different cultures connecting through glowing lines of communication.
    Visualize a single user's journey from a curious learner to a confident creator.
    The visual style should be elegant, clean, with a mix of glowing data streams, warm human moments, and epic background sounds.
    End with a shot of the Earth, with glowing points of light representing the global Hamraz community, all connected.`,
  fa: `یک شات سینمایی از یک ماشین قدیمی که هنگام غروب در جاده‌ای خلوت رانندگی می‌کند.
    یک ویدیوی تبلیغاتی احساسی و امیدوارکننده بسازید که داستانی را روایت می‌کند.
    تصاویر بصری انتزاعی را نشان دهید که نمایانگر همکاری بین یک رویاپرداز انسانی و یک هوش مصنوعی دوستانه است.
    مفاهیمی مانند جرقه‌های ایده‌ها، اتصال نقاط نورانی، و یک درخت دیجیتالی در حال رشد با شاخه‌هایی که نماد خلاقیت، یادگیری و جامعه هستند را به تصویر بکشید.
    افراد متنوع از فرهنگ‌های مختلف را نشان دهید که از طریق خطوط درخشان ارتباطی به هم متصل می‌شوند.
    سفر یک کاربر را از یک یادگیرنده کنجکاو به یک خالق با اعتماد به نفس به تصویر بکشید.
    سبک بصری باید زیبا، تمیز، با ترکیبی از جریان‌های داده درخشان، لحظات گرم انسانی و صداهای پس‌زمینه حماسی باشد.
    با یک شات از کره زمین که نقاط نورانی درخشان به نمایندگی از جامعه جهانی همراز، همه به هم متصل هستند، پایان دهید.`
};


export async function generateShowcaseVideo(input: GenerateShowcaseVideoInput): Promise<GenerateShowcaseVideoOutput> {
  const prompt = prompts[input.language];
  
  let {operation} = await ai.generate({
    model: googleAI.model('veo-3.0-generate-preview'),
    prompt: prompt,
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
