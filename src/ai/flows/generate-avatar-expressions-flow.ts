'use server';

/**
 * @fileOverview Generates appropriate facial expressions and body language for an AI avatar based on the conversation context.
 *
 * - generateAvatarExpressions - A function that generates avatar expressions.
 * - GenerateAvatarExpressionsInput - The input type for the generateAvatarExpressions function.
 * - GenerateAvatarExpressionsOutput - The return type for the generateAvatarExpressions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAvatarExpressionsInputSchema = z.object({
  message: z.string().describe('The user message or AI response.'),
  currentEmotion: z.string().optional().describe('The current emotion of the avatar.'),
});
export type GenerateAvatarExpressionsInput = z.infer<typeof GenerateAvatarExpressionsInputSchema>;

const GenerateAvatarExpressionsOutputSchema = z.object({
  facialExpression: z.string().describe('The recommended facial expression for the avatar.'),
  bodyLanguage: z.string().describe('The recommended body language for the avatar.'),
  emotion: z.string().describe('The emotion that avatar should express.'),
});
export type GenerateAvatarExpressionsOutput = z.infer<typeof GenerateAvatarExpressionsOutputSchema>;

export async function generateAvatarExpressions(input: GenerateAvatarExpressionsInput): Promise<GenerateAvatarExpressionsOutput> {
  return generateAvatarExpressionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAvatarExpressionsPrompt',
  input: {schema: GenerateAvatarExpressionsInputSchema},
  output: {schema: GenerateAvatarExpressionsOutputSchema},
  prompt: `You are an AI avatar expression generator. You will receive a message and the avatar's current emotion, and you will generate appropriate facial expressions and body language for the avatar.

Message: {{{message}}}
Current Emotion: {{{currentEmotion}}}

Consider the message and the current emotion, and decide on a new facial expression, body language, and overall emotion for the avatar to express.  The emotion should either match or be appropriately different from the current emotion.

{{#if currentEmotion}}Previous emotion was {{{currentEmotion}}}.  Decide if the emotion should stay the same, or change to appropriately match the message.{{/if}}

Output the facial expression, body language, and emotion as JSON. Make your decision based on the context of the message. Focus on conveying emotions like affection, surprise, sadness, excitement, empathy, anger, and love.
`,
});

const generateAvatarExpressionsFlow = ai.defineFlow(
  {
    name: 'generateAvatarExpressionsFlow',
    inputSchema: GenerateAvatarExpressionsInputSchema,
    outputSchema: GenerateAvatarExpressionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
