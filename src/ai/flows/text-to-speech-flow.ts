
'use server';

/**
 * @fileOverview Converts text to speech using a generative AI model, with emotional and stylistic controls.
 *
 * - textToSpeech - A function that takes text and returns the audio data.
 * - TextToSpeechInput - The input type for the function.
 * - TextToSpeechOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import wav from 'wav';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  voiceName: z.string().optional().describe('The name of the voice to use (e.g., "Algenib", "en-US-Studio-F").'),
  emotion: z.enum(["neutral", "happy", "sad", "relaxed", "excited", "angry"]).optional().describe("The emotion to convey in the speech."),
  style: z.enum(["narrative", "poetic", "conversational", "formal"]).optional().describe("The speaking style to adopt.")
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a base64-encoded data URI.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {

  // Construct a more descriptive prompt for the model based on the new inputs.
  const prompt = `
    ${input.style ? `Adopt a ${input.style} style.` : ''}
    ${input.emotion ? `Speak with a ${input.emotion} emotion.` : ''}
    Read the following text:
    
    ${input.text}
    `;
    
  const {media} = await ai.generate({
    model: googleAI.model('gemini-2.5-flash-preview-tts'),
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {voiceName: input.voiceName || 'Algenib'},
        },
      },
    },
    prompt: prompt.trim(),
  });

  if (!media) {
    throw new Error('No media returned from the text-to-speech model.');
  }

  const audioBuffer = Buffer.from(
    media.url.substring(media.url.indexOf(',') + 1),
    'base64'
  );

  const wavBase64 = await toWav(audioBuffer);

  return {
    audioDataUri: `data:audio/wav;base64,${wavBase64}`,
  };
}
