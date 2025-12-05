
import {z} from 'genkit';

export const GenerateTutorialInputSchema = z.object({
  featureName: z.string().describe('The name of the feature for which to generate a tutorial (e.g., "Magic Repo", "Showcase").'),
});
export type GenerateTutorialInput = z.infer<typeof GenerateTutorialInputSchema>;

export const GenerateTutorialOutputSchema = z.object({
  title: z.string().describe('The title of the tutorial.'),
  introduction: z.string().describe('A brief introduction to the feature.'),
  steps: z.array(z.object({
    title: z.string().describe('The title of the tutorial step.'),
    description: z.string().describe('The detailed description of the tutorial step.'),
  })).describe('An array of steps to follow in the tutorial.'),
});
export type GenerateTutorialOutput = z.infer<typeof GenerateTutorialOutputSchema>;
