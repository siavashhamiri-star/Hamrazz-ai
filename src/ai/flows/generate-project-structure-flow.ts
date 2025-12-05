
'use server';
/**
 * @fileOverview An AI flow for generating project file structures from natural language commands.
 *
 * - generateProjectStructure - A function that takes a user's command and an existing file structure and returns the new structure.
 * - GenerateProjectStructureInput - The input type for the function.
 * - GenerateProjectStructureOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Recursive schema for file system nodes
const BaseNodeSchema = z.object({
  name: z.string().describe('The name of the file or directory.'),
});

type DirectoryNode = z.infer<typeof BaseNodeSchema> & {
  type: 'directory';
  children: (FileNode | DirectoryNode)[];
};

type FileNode = z.infer<typeof BaseNodeSchema> & {
  type: 'file';
  content: string;
};

const FileNodeSchema: z.ZodType<FileNode> = BaseNodeSchema.extend({
  type: z.literal('file'),
  content: z.string().describe('The content of the file.'),
});

const DirectoryNodeSchema: z.ZodType<DirectoryNode> = BaseNodeSchema.extend({
  type: z.literal('directory'),
  children: z.lazy(() => z.array(z.union([FileNodeSchema, DirectoryNodeSchema]))),
});

const FileSystemSchema = DirectoryNodeSchema;
export type FileSystem = z.infer<typeof FileSystemSchema>;

const GenerateProjectStructureInputSchema = z.object({
  command: z.string().describe('The user command to modify the project structure (e.g., "create a file named index.html").'),
  currentStructure: FileSystemSchema.describe('The current file system structure as a JSON object. The root is always the first directory.'),
});
export type GenerateProjectStructureInput = z.infer<typeof GenerateProjectStructureInputSchema>;

const GenerateProjectStructureOutputSchema = z.object({
  newStructure: FileSystemSchema.describe('The updated file system structure as a JSON object after applying the command.'),
});
export type GenerateProjectStructureOutput = z.infer<typeof GenerateProjectStructureOutputSchema>;

export async function generateProjectStructure(input: GenerateProjectStructureInput): Promise<GenerateProjectStructureOutput> {
  return generateProjectStructureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectStructurePrompt',
  input: {schema: GenerateProjectStructureInputSchema},
  output: {schema: GenerateProjectStructureOutputSchema},
  prompt: `You are an AI assistant that helps build project file structures. You will receive a user's command and the current project structure in JSON format.
Your task is to interpret the command and return the **new, complete** project structure as JSON.

- If the user wants to create a file, add a new file node.
- If the user wants to create a directory, add a new directory node.
- If the user wants to add content to a file, find that file and update its content.
- Always return the entire, updated file structure. Do not describe your changes; only output the final JSON.

User Command: "{{command}}"

Current Project Structure:
\`\`\`json
{{{json currentStructure}}}
\`\`\`

Analyze the command and the current structure, then generate the new structure.
`,
});

const generateProjectStructureFlow = ai.defineFlow(
  {
    name: 'generateProjectStructureFlow',
    inputSchema: GenerateProjectStructureInputSchema,
    outputSchema: GenerateProjectStructureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
