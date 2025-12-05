
'use server';
/**
 * @fileOverview An AI flow for zipping a project structure.
 *
 * - zipProject - A function that takes a file system structure and returns a base64-encoded ZIP file.
 * - ZipProjectInput - The input type for the function.
 * - ZipProjectOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {FileSystemSchema, FileSystem} from '@/ai/flows/generate-project-structure-flow';
import JSZip from 'jszip';

export const ZipProjectInputSchema = FileSystemSchema;
export type ZipProjectInput = z.infer<typeof ZipProjectInputSchema>;

export const ZipProjectOutputSchema = z.object({
  zipFile: z.string().describe('The base64-encoded ZIP file content.'),
});
export type ZipProjectOutput = z.infer<typeof ZipProjectOutputSchema>;

async function addFilesToZip(zip: JSZip, structure: FileSystem, path: string) {
  for (const child of structure.children) {
    const newPath = `${path}${child.name}`;
    if (child.type === 'directory') {
      const dirZip = zip.folder(child.name);
      if (dirZip) {
        await addFilesToZip(dirZip, child, '');
      }
    } else if (child.type === 'file') {
      zip.file(child.name, child.content || '');
    }
  }
}

export async function zipProject(input: ZipProjectInput): Promise<ZipProjectOutput> {
  const zip = new JSZip();

  // The root of the project is the input itself
  const rootFolderName = input.name;
  const rootFolder = zip.folder(rootFolderName);

  if (rootFolder) {
      await addFilesToZip(rootFolder, input, '');
  }

  const zipContent = await zip.generateAsync({type: 'base64'});

  return {
    zipFile: zipContent,
  };
}
