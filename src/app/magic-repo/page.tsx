
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, FileText, Download, Folder } from "lucide-react";
import { generateProjectStructure, FileSystem } from "@/ai/flows/generate-project-structure-flow";
import { ScrollArea } from "@/components/ui/scroll-area";

type FileNode = {
  type: 'file';
  name: string;
  content: string;
};

type DirectoryNode = FileSystem;

const FileSystemViewer = ({ fs }: { fs: DirectoryNode }) => {
    const renderNode = (node: FileNode | DirectoryNode, level: number) => {
        const indent = { paddingLeft: `${level * 1.5}rem` };
        if (node.type === 'directory') {
            return (
                <div key={node.name}>
                    <div style={indent} className="flex items-center gap-2 font-semibold">
                       <Folder className="w-4 h-4 text-primary" /> {node.name}/
                    </div>
                    {node.children.map(child => renderNode(child, level + 1))}
                </div>
            );
        } else {
            return (
                 <div key={node.name} style={indent} className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    {node.name}
                </div>
            )
        }
    };

    return (
        <Card className="bg-muted/50 h-full">
            <CardHeader>
                <CardTitle>Project Structure</CardTitle>
            </CardHeader>
            <CardContent className="font-mono text-sm">
              <ScrollArea className="h-72">
                {renderNode(fs, 0)}
              </ScrollArea>
            </CardContent>
        </Card>
    );
};


export default function MagicRepoPage() {
  const [command, setCommand] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [fileSystem, setFileSystem] = useState<FileSystem>({ type: 'directory', name: 'my-project', children: [] });

  const handleCommand = async () => {
    if (!command.trim()) return;
    setIsLoading(true);

    try {
        const result = await generateProjectStructure({
            command: command,
            currentStructure: fileSystem
        });
        setFileSystem(result.newStructure);
        toast({ title: "Project Updated!", description: `Command "${command}" was executed.` });
    } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Error", description: "Could not execute the command." });
    } finally {
        setCommand("");
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="text-center">
            <Wand2 className="w-12 h-12 mx-auto text-primary"/>
            <CardTitle className="text-3xl font-headline mt-4">Magic Repository</CardTitle>
            <CardDescription className="max-w-2xl mx-auto">
                Welcome to the future of development. Describe your project through conversation, and I will build the structure for you. When you're ready, you can download the complete project as a single ZIP file.
            </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Command Console</CardTitle>
                    <CardDescription>Use simple commands to build your project.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="e.g., CREATE FILE index.html with a h1 tag"
                            value={command}
                            onChange={e => setCommand(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleCommand()}
                            disabled={isLoading}
                            className="font-mono"
                        />
                        <Button onClick={handleCommand} disabled={isLoading || !command.trim()}>
                            {isLoading ? <Loader2 className="animate-spin" /> : "Run"}
                        </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded-md">
                        <p className="font-semibold">Example Commands:</p>
                        <ul className="list-disc list-inside">
                            <li><span className="font-mono">create a file named "index.html"</span></li>
                            <li><span className="font-mono">add a folder named "css"</span></li>
                            <li><span className="font-mono">put a file "style.css" inside "css"</span></li>
                            <li><span className="font-mono">add a h1 with "Hello World" to index.html</span></li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
             <Button className="w-full" size="lg" disabled={fileSystem.children.length === 0}>
                <Download className="mr-2"/>
                Generate and Download Project.zip (Coming Soon)
            </Button>
        </div>
        <div className="lg:col-span-1">
            <FileSystemViewer fs={fileSystem} />
        </div>
      </div>
    </div>
  );
}
