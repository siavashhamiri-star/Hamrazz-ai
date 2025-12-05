
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
import { Loader2, Wand2, FilePlus, FileText, Download } from "lucide-react";

type FileNode = {
  type: 'file';
  name: string;
  content: string;
};

type DirectoryNode = {
  type: 'directory';
  name: string;
  children: (FileNode | DirectoryNode)[];
};

type FileSystem = DirectoryNode;

const FileSystemViewer = ({ fs }: { fs: FileSystem }) => {
    const renderNode = (node: FileNode | DirectoryNode, level: number) => {
        const indent = { paddingLeft: `${level * 1.5}rem` };
        if (node.type === 'directory') {
            return (
                <div key={node.name}>
                    <div style={indent} className="flex items-center gap-2 font-semibold">
                       {node.name}/
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
        <Card className="bg-muted/50">
            <CardHeader>
                <CardTitle>Project Structure</CardTitle>
            </CardHeader>
            <CardContent className="font-mono text-sm">
                {renderNode(fs, 0)}
            </CardContent>
        </Card>
    );
};


export default function MagicRepoPage() {
  const [command, setCommand] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [fileSystem, setFileSystem] = useState<FileSystem>({ type: 'directory', name: 'root', children: [] });

  const handleCommand = async () => {
    if (!command.trim()) return;
    setIsLoading(true);

    // Simulate processing the command and updating the file system
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // This is a very basic parser. A real implementation would need a robust command parser.
    const parts = command.trim().split(' ');
    const action = parts[0]?.toUpperCase();
    const fileName = parts[2];

    if (action === 'CREATE' && parts[1]?.toUpperCase() === 'FILE' && fileName) {
        // Simple creation at root level for this prototype
        setFileSystem(prevFs => {
            const newChildren = [...prevFs.children];
            if (!newChildren.find(c => c.name === fileName)) {
                 newChildren.push({ type: 'file', name: fileName, content: '' });
            }
            return { ...prevFs, children: newChildren };
        });
        toast({ title: "File Created", description: `File "${fileName}" was added.` });
    } else if (action === 'ADD' && parts[1]?.toUpperCase() === 'CONTENT') {
        toast({ title: "Content Added (Simulated)", description: "In a real app, content would be added to the file." });
    } else {
        toast({ variant: "destructive", title: "Unknown Command", description: "Try 'CREATE FILE filename.ext'" });
    }

    setCommand("");
    setIsLoading(false);
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
                            placeholder="e.g., CREATE FILE index.html"
                            value={command}
                            onChange={e => setCommand(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleCommand()}
                            disabled={isLoading}
                            className="font-mono"
                        />
                        <Button onClick={handleCommand} disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : "Run"}
                        </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded-md">
                        <p className="font-semibold">Example Commands:</p>
                        <ul className="list-disc list-inside">
                            <li><span className="font-mono">CREATE FILE index.html</span></li>
                            <li><span className="font-mono">ADD CONTENT '...' TO index.html</span> (Simulated)</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
             <Button className="w-full" size="lg" disabled={fileSystem.children.length === 0}>
                <Download className="mr-2"/>
                Generate and Download Project.zip
            </Button>
        </div>
        <div className="lg:col-span-1">
            <FileSystemViewer fs={fileSystem} />
        </div>
      </div>
    </div>
  );
}
