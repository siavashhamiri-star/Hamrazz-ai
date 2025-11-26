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
  sourceLanguage: z.enum(['en', 'fa']).describe('The source language of the text. en for English, fa for Persian.'),
  targetLanguage: z.enum(['en', 'fa']).describe('The target language for the translation. en for English, fa for Persian.'),
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
