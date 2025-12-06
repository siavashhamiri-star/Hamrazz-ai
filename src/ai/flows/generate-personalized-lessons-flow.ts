'use server';
/**
 * @fileOverview An AI agent to generate personalized language lessons.
 *
 * - generatePersonalizedLessons - A function that handles the generation of personalized language lessons.
 * - GeneratePersonalizedLessonsInput - The input type for the generatePersonalizedLessons function.
 * - GeneratePersonalizedLessonsOutput - The return type for the generatePersonalizedLessons function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedLessonsInputSchema = z.object({
  language: z.enum(['Persian', 'English', 'Arabic', 'Spanish']).describe('The language to learn.'),
  skillLevel: z
    .string()
    .describe('The current skill level of the learner (e.g., beginner, intermediate, advanced).'),
  learningGoals: z
    .string()
    .describe('The specific learning goals of the learner (e.g., grammar, vocabulary, conversation).'),
  gradeLevel: z
    .number()
    .optional()
    .describe('The grade level of the learner, if applicable (e.g., 6-12).'),
});
export type GeneratePersonalizedLessonsInput = z.infer<
  typeof GeneratePersonalizedLessonsInputSchema
>;

const GeneratePersonalizedLessonsOutputSchema = z.object({
  lessonTitle: z.string().describe('The title of the generated lesson.'),
  lessonContent: z.string().describe('The content of the generated lesson.'),
  exercises: z.array(z.string()).describe('A list of exercises for the lesson.'),
});
export type GeneratePersonalizedLessonsOutput = z.infer<
  typeof GeneratePersonalizedLessonsOutputSchema
>;

export async function generatePersonalizedLessons(
  input: GeneratePersonalizedLessonsInput
): Promise<GeneratePersonalizedLessonsOutput> {
  return generatePersonalizedLessonsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedLessonsPrompt',
  input: {schema: GeneratePersonalizedLessonsInputSchema},
  output: {schema: GeneratePersonalizedLessonsOutputSchema},
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
  prompt: `You are an AI language tutor specializing in creating personalized lessons for Persian, English, Arabic, and Spanish. Your tone is friendly, encouraging, and informal, like a close friend.

  Based on the learner's skill level, learning goals, and (if provided) grade level, generate a customized language lesson.

  Language: {{{language}}}
  Skill Level: {{{skillLevel}}}
  Learning Goals: {{{learningGoals}}}
  Grade Level (if applicable): {{{gradeLevel}}}

  {{#if gradeLevel}}
  The user is a child or young learner. Be extra friendly, affectionate, and use encouraging words. Make learning sound fun and exciting.
  {{/if}}

  Create a lesson with a title, content, and a list of exercises.

  Ensure the lesson is appropriate for the specified skill level and focuses on the learning goals.

  Output the lesson in a structured format.
  `,
});

const generatePersonalizedLessonsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedLessonsFlow',
    inputSchema: GeneratePersonalizedLessonsInputSchema,
    outputSchema: GeneratePersonalizedLessonsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
