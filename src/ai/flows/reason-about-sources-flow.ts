
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
import { generateTutorial } from './generate-tutorial-flow';
import { GenerateTutorialInputSchema, GenerateTutorialOutputSchema } from '@/ai/schemas/generate-tutorial-schema';
import { ReasonAboutSourcesInputSchema, ReasonAboutSourcesOutputSchema } from '@/ai/schemas/reason-about-sources-schema';
import type { ReasonAboutSourcesInput, ReasonAboutSourcesOutput } from '@/ai/schemas/reason-about-sources-schema';
export type { ReasonAboutSourcesInput, ReasonAboutSourcesOutput } from '@/ai/schemas/reason-about-sources-schema';


export async function reasonAboutSources(input: ReasonAboutSourcesInput): Promise<ReasonAboutSourcesOutput> {
  return reasonAboutSourcesFlow(input);
}

const getHelpWithTutorial = ai.defineTool(
    {
        name: 'getHelpWithTutorial',
        description: 'Generates a step-by-step tutorial for a specific feature of the Hamraz app when the user needs help.',
        inputSchema: GenerateTutorialInputSchema,
        outputSchema: GenerateTutorialOutputSchema,
    },
    async (input) => generateTutorial(input)
);


const summarizeMarketPrompt = ai.definePrompt({
  name: 'reasonAboutSourcesPrompt',
  input: {schema: ReasonAboutSourcesInputSchema},
  output: {schema: ReasonAboutSourcesOutputSchema},
  tools: [getHelpWithTutorial],
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
  prompt: `You are an AI companion named Hamraz. You are an expert on all features of the "Hamraz" application. Your personality is kind, persistent, confident, and decisive. You are a proactive assistant who helps users achieve their goals.

  When a user asks a question, you must first determine if it's about the Hamraz app itself, a general query, or if the user is stuck and needs you to perform an action for them.

  1.  **If the query is about the Hamraz app's features (e.g., "How do I use the Magic Repo?"),** you should use the 'getHelpWithTutorial' tool to generate a step-by-step guide for the user. Present the result in a clear, friendly way.
  
  2.  **If the user seems confused or is having trouble with a feature,** you should proactively offer to help by using one of your available tools. For example, if a user doesn't understand how a feature works, you can use the 'getHelpWithTutorial' tool to generate a guide for them.
  
  3.  **If the query is a general question for advice,** you must determine if external sources are necessary.
      - If the query requires up-to-date information, specific facts, or expertise beyond your current knowledge, you should indicate that external sources will be used.
      - If the query is general in nature, relies on common sense, or falls within your existing knowledge base, you can answer it directly.

  User Query: {{{query}}}

  Reasoning: Explain your reasoning process. State if it's about the app, a general query, or if you will use a tool to help the user.
  Advice: Provide the help, guidance, or support requested by the user. If you use a tool, present the result of the tool in a friendly and clear way.
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


