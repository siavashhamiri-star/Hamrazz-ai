
'use server';

/**
 * @fileOverview Generates a step-by-step tutorial for a specific feature of the Hamraz app.
 *
 * - generateTutorial - A function that generates a tutorial.
 * - GenerateTutorialInput - The input type for the generateTutorial function.
 * - GenerateTutorialOutput - The return type for the generateTutorial function.
 */

import {ai} from '@/ai/genkit';
import { GenerateTutorialInputSchema, GenerateTutorialOutputSchema } from '@/ai/schemas/generate-tutorial-schema';
import type { GenerateTutorialInput, GenerateTutorialOutput } from '@/ai/schemas/generate-tutorial-schema';
export type { GenerateTutorialInput, GenerateTutorialOutput } from '@/ai/schemas/generate-tutorial-schema';


export async function generateTutorial(input: GenerateTutorialInput): Promise<GenerateTutorialOutput> {
  return generateTutorialFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateTutorialPrompt',
  input: {schema: GenerateTutorialInputSchema},
  output: {schema: GenerateTutorialOutputSchema},
  prompt: `You are an expert technical writer and AI assistant for the "Hamraz" application. Your task is to generate a clear, concise, and friendly step-by-step tutorial for a specific feature of the app.

The user wants to learn about: "{{featureName}}"

Generate a tutorial with a title, a short introduction, and a series of steps. Each step should have its own title and a clear description.

Explain the purpose of the feature and how to use it effectively. Be encouraging and make it sound easy and fun.

Example for "Magic Repo":
- Title: How to Use the Magic Repo
- Introduction: The Magic Repo lets you build an entire project structure using simple text commands...
- Steps:
    1. Title: "Give a Command", Description: "In the command console, type what you want to create..."
    2. Title: "Watch the Magic", Description: "See your project structure appear instantly..."
    3. Title: "Publish to GitHub", Description: "Connect your GitHub account and publish..."

Now, generate a similar tutorial for the requested feature: "{{featureName}}".
`,
});

const generateTutorialFlow = ai.defineFlow(
  {
    name: 'generateTutorialFlow',
    inputSchema: GenerateTutorialInputSchema,
    outputSchema: GenerateTutorialOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
