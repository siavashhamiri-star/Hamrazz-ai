'use server';
/**
 * @fileOverview Summarizes lesson content to identify key concepts for review.
 *
 * - summarizeLessonContent - A function that summarizes lesson content.
 * - SummarizeLessonContentInput - The input type for the summarizeLessonContent function.
 * - SummarizeLessonContentOutput - The return type for the summarizeLessonContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLessonContentInputSchema = z.object({
  lessonContent: z
    .string()
    .describe('The content of the lesson to be summarized.'),
});
export type SummarizeLessonContentInput = z.infer<typeof SummarizeLessonContentInputSchema>;

const SummarizeLessonContentOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the lesson content, highlighting key concepts.'),
});
export type SummarizeLessonContentOutput = z.infer<typeof SummarizeLessonContentOutputSchema>;

export async function summarizeLessonContent(
  input: SummarizeLessonContentInput
): Promise<SummarizeLessonContentOutput> {
  return summarizeLessonContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLessonContentPrompt',
  input: {schema: SummarizeLessonContentInputSchema},
  output: {schema: SummarizeLessonContentOutputSchema},
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
  prompt: `You are an AI tutor. Summarize the following lesson content, identifying key concepts for review. Return the summary in a concise manner.\n\nLesson Content: {{{lessonContent}}}`,
});

const summarizeLessonContentFlow = ai.defineFlow(
  {
    name: 'summarizeLessonContentFlow',
    inputSchema: SummarizeLessonContentInputSchema,
    outputSchema: SummarizeLessonContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
