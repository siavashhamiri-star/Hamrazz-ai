'use server';
/**
 * @fileOverview Transcribes audio from a video file to generate subtitles.
 *
 * - transcribeVideo - A function that handles the video transcription process.
 * - TranscribeVideoInput - The input type for the transcribeVideo function.
 * - TranscribeVideoOutput - The return type for the transcribeVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeVideoInput = z.infer<typeof TranscribeVideoInputSchema>;

const TranscribeVideoOutputSchema = z.object({
  transcription: z.string().describe('The full transcribed text from the video audio.'),
  subtitlesVtt: z.string().describe('The subtitles in WebVTT format.'),
});
export type TranscribeVideoOutput = z.infer<typeof TranscribeVideoOutputSchema>;

export async function transcribeVideo(input: TranscribeVideoInput): Promise<TranscribeVideoOutput> {
  return transcribeVideoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transcribeVideoPrompt',
  input: {schema: TranscribeVideoInputSchema},
  output: {schema: TranscribeVideoOutputSchema},
  model: 'googleai/gemini-2.5-pro',
  prompt: `You are a video transcription expert. You will receive a video file. Your task is to accurately transcribe the audio from the video.

Provide two outputs:
1.  A clean, full transcription of all spoken words.
2.  A subtitle track in WebVTT format, with accurate timestamps.

Video: {{media url=videoDataUri}}

Generate only the JSON output with the transcription and subtitlesVtt fields.`,
});

const transcribeVideoFlow = ai.defineFlow(
  {
    name: 'transcribeVideoFlow',
    inputSchema: TranscribeVideoInputSchema,
    outputSchema: TranscribeVideoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
