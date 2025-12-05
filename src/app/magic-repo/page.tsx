
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FolderTree, Send, Wand2, FileDown, Rocket, Lightbulb } from "lucide-react";
import { generateProjectStructure, FileSystem } from "@/ai/flows/generate-project-structure-flow";
import { zipProject } from "@/ai/flows/zip-project-flow";

const FileTree = ({ node, level = 0 }: { node: FileSystem, level?: number }) => {
  return (
    <div style={{ paddingLeft: `${level * 20}px` }}>
      <div className="flex items-center gap-2">
        <span className="text-primary">{node.type === "directory" ? "📁" : "📄"}</span>
        <span>{node.name}</span>
      </div>
      {node.type === "directory" &&
        node.children.map((child, index) => (
          <FileTree key={index} node={child} level={level + 1} />
        ))}
    </div>
  );
};


export default function MagicRepoPage() {
    const [command, setCommand] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isZipping, setIsZipping] = useState(false);
    const [fileStructure, setFileStructure] = useState<FileSystem>({
        name: "my-project",
        type: "directory",
        children: [],
    });

    const handleRunCommand = async () => {
        if (!command) return;
        setIsLoading(true);
        try {
            const result = await generateProjectStructure({ command, currentStructure: fileStructure });
            setFileStructure(result.newStructure);
        } catch (error) {
            console.error("Error generating project structure:", error);
        } finally {
            setIsLoading(false);
            setCommand("");
        }
    };

    const handleDownload = async () => {
        setIsZipping(true);
        try {
            const result = await zipProject(fileStructure);
            const link = document.createElement("a");
            link.href = `data:application/zip;base64,${result.zipFile}`;
            link.download = `${fileStructure.name}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error zipping project:", error);
        } finally {
            setIsZipping(false);
        }
    }

  return (
    <div className="space-y-8">
        <Alert variant="default" className="bg-primary/10 border-primary/30">
            <Rocket className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-bold">Welcome to the Magic Repository!</AlertTitle>
            <AlertDescription>
                Turn your ideas into projects, instantly. Use simple, natural language commands to build a complete file structure for your next application. When you're done, download the entire project as a ZIP file.
            </AlertDescription>
        </Alert>

        <Alert variant="default">
             <Lightbulb className="h-4 w-4" />
            <AlertTitle>Example Commands</AlertTitle>
            <AlertDescription>
               <ul className="list-disc list-inside mt-2 text-xs font-mono">
                  <li>create a file named "index.html"</li>
                  <li>add a folder named "css"</li>
                  <li>put a file "style.css" inside "css"</li>
                  <li>add a h1 with "Hello World" to index.html</li>
                </ul>
            </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Wand2 /> Command Console</CardTitle>
                    <CardDescription>
                        Type your command below to build your project structure.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="e.g., 'create a file named index.html'"
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRunCommand()}
                            disabled={isLoading}
                        />
                        <Button onClick={handleRunCommand} disabled={isLoading || !command.trim()} size="icon">
                            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleDownload} disabled={isZipping || fileStructure.children.length === 0} className="w-full">
                        {isZipping ? <><Loader2 className="animate-spin mr-2"/>Zipping Project...</> : <><FileDown className="mr-2" />Download Project</>}
                    </Button>
                </CardFooter>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FolderTree/> Project Structure</CardTitle>
                    <CardDescription>Your project's file tree will appear here live.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[200px] bg-muted/50 rounded-lg p-4 font-mono text-sm">
                    {fileStructure.children.length > 0 ? (
                        <FileTree node={fileStructure} />
                    ) : (
                        <p className="text-muted-foreground">Your project is empty. Run a command to get started.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
