
import {z} from 'genkit';

export const ReasonAboutSourcesInputSchema = z.object({
  query: z.string().describe('The user query or request for advice.'),
});
export type ReasonAboutSourcesInput = z.infer<typeof ReasonAboutSourcesInputSchema>;

export const ReasonAboutSourcesOutputSchema = z.object({
  advice: z.string().describe('The advice provided by the AI, potentially informed by external sources.'),
  reasoning: z.string().describe('The AI’s reasoning process, including whether external sources were used and why.'),
});
export type ReasonAboutSourcesOutput = z.infer<typeof ReasonAboutSourcesOutputSchema>;
