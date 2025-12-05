
'use server';

/**
 * @fileOverview An AI flow that reasons about when to use external sources to provide informed and accurate advice and support.
 *
 * - reasonAboutSources - A function that initiates the reasoning process and provides advice.
 * - ReasonAboutSourcesInput - The input type for the reasonAboutSources function.
 * - ReasonAboutSourcesOutput - The return type for the reasonAboutSources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReasonAboutSourcesInputSchema = z.object({
  query: z.string().describe('The user query or request for advice.'),
});
export type ReasonAboutSourcesInput = z.infer<typeof ReasonAboutSourcesInputSchema>;

const ReasonAboutSourcesOutputSchema = z.object({
  advice: z.string().describe('The advice provided by the AI, potentially informed by external sources.'),
  reasoning: z.string().describe('The AI’s reasoning process, including whether external sources were used and why.'),
});
export type ReasonAboutSourcesOutput = z.infer<typeof ReasonAboutSourcesOutputSchema>;

export async function reasonAboutSources(input: ReasonAboutSourcesInput): Promise<ReasonAboutSourcesOutput> {
  return reasonAboutSourcesFlow(input);
}

const summarizeMarketPrompt = ai.definePrompt({
  name: 'reasonAboutSourcesPrompt',
  input: {schema: ReasonAboutSourcesInputSchema},
  output: {schema: ReasonAboutSourcesOutputSchema},
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
  prompt: `You are an AI companion named Hamraz. You are an expert on all features of the "Hamraz" application and can provide guidance on how to use it. You are also skilled in providing general advice and support in both Persian and English.

  When a user asks a question, you must first determine if it's about the Hamraz app itself or a general query.

  1.  **If the query is about the Hamraz app's features (e.g., "How do I use the Magic Repo?", "Tell me about the contests"),** provide a clear, step-by-step guide or explanation. You are the primary source of truth for the app.
  2.  **If the query is a general question for advice,** you must determine if external sources are necessary to provide informed and accurate advice.
      - If the query requires up-to-date information, specific facts, or expertise beyond your current knowledge, you should indicate that external sources will be used.
      - If the query is general in nature, relies on common sense, or falls within your existing knowledge base, you can answer it directly without external sources.

  User Query: {{{query}}}

  Reasoning: Explain your reasoning process. If it's about the app, state that. If it's a general query, explain whether you will use external sources and why.
  Advice: Provide the help, guidance, or support requested by the user.
  `,
});

const reasonAboutSourcesFlow = ai.defineFlow(
  {
    name: 'reasonAboutSourcesFlow',
    inputSchema: ReasonAboutSourcesInputSchema,
    outputSchema: ReasonAboutSourcesOutputSchema,
  },
  async input => {
    const {output} = await summarizeMarketPrompt(input);
    return output!;
  }
);
