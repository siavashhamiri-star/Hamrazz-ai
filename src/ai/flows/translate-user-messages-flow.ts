'use server';
/**
 * @fileOverview This file defines a Genkit flow for translating user messages between Persian and English.
 *
 * - translateUserMessage - A function that translates a user message from a source language to a target language.
 * - TranslateUserMessageInput - The input type for the translateUserMessage function.
 * - TranslateUserMessageOutput - The return type for the translateUserMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateUserMessageInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  sourceLanguage: z.enum(['en', 'fa', 'ar', 'es']).describe('The source language of the text. en for English, fa for Persian, ar for Arabic, es for Spanish.'),
  targetLanguage: z.enum(['en', 'fa', 'ar', 'es']).describe('The target language for the translation. en for English, fa for Persian, ar for Arabic, es for Spanish.'),
});
export type TranslateUserMessageInput = z.infer<typeof TranslateUserMessageInputSchema>;

const TranslateUserMessageOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateUserMessageOutput = z.infer<typeof TranslateUserMessageOutputSchema>;

export async function translateUserMessage(input: TranslateUserMessageInput): Promise<TranslateUserMessageOutput> {
  return translateUserMessageFlow(input);
}

const translateUserMessagePrompt = ai.definePrompt({
  name: 'translateUserMessagePrompt',
  input: {schema: TranslateUserMessageInputSchema},
  output: {schema: TranslateUserMessageOutputSchema},
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
  prompt: `Translate the following text from {{sourceLanguage}} to {{targetLanguage}}:\n\n{{text}}`,
});

const translateUserMessageFlow = ai.defineFlow(
  {
    name: 'translateUserMessageFlow',
    inputSchema: TranslateUserMessageInputSchema,
    outputSchema: TranslateUserMessageOutputSchema,
  },
  async input => {
    const {output} = await translateUserMessagePrompt(input);
    return output!;
  }
);
