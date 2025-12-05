
"use client";

import { useState, useEffect } from "react";
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
import { Loader2, FolderTree, Send, Wand2, FileDown, Rocket, Lightbulb, Terminal, Github, Play } from "lucide-react";
import { generateProjectStructure, FileSystem } from "@/ai/flows/generate-project-structure-flow";
import { zipProject } from "@/ai/flows/zip-project-flow";
import { cn } from "@/lib/utils";

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

const SimulatedTerminal = () => {
    const [lines, setLines] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const commands = [
        { cmd: "git init", output: "Initialized empty Git repository in ./.git/" },
        { cmd: "git add .", output: "Staging all files..." },
        { cmd: "git commit -m \"Initial commit via Hamraz AI\"", output: "[main (root-commit) 1a2b3c4] Initial commit via Hamraz AI\n 2 files changed, 10 insertions(+)" },
        { cmd: "git remote add origin YOUR_REPO_URL", output: "Setting remote origin..." },
        { cmd: "git push -u origin main", output: "Enumerating objects: 3, done.\nCounting objects: 100% (3/3), done.\nDelta compression using up to 8 threads\nCompressing objects: 100% (2/2), done.\nWriting objects: 100% (3/3), 256 bytes | 256.00 KiB/s, done.\nTotal 3 (delta 0), reused 0 (delta 0)\nTo github.com:user/repo.git\n * [new branch]      main -> main" },
        { cmd: "echo '✅ Successfully uploaded to GitHub!'", output: "✅ Successfully uploaded to GitHub!" },
    ];
    
    const runSimulation = () => {
        setIsRunning(true);
        setLines([]);
        let currentLines: string[] = [];
        commands.forEach((item, index) => {
            setTimeout(() => {
                currentLines = [...currentLines, `$ ${item.cmd}`];
                setLines([...currentLines]);
                setTimeout(() => {
                    currentLines = [...currentLines, item.output];
                    setLines([...currentLines]);
                     if (index === commands.length - 1) {
                        setIsRunning(false);
                    }
                }, 500);
            }, index * 1500);
        });
    }

    return (
        <Alert variant="default" className="mt-8">
             <Github className="h-4 w-4" />
            <AlertTitle>Automated GitHub Setup Assistant</AlertTitle>
            <AlertDescription>
                <p>After downloading and unzipping, this assistant can guide you through uploading to GitHub. Let's simulate the terminal commands together.</p>
                <div className="mt-4 p-4 bg-muted rounded-md font-mono text-xs space-y-2 h-64 overflow-y-auto">
                  {lines.map((line, index) => (
                      <p key={index} className={cn("whitespace-pre-wrap", !line.startsWith('$') && "text-muted-foreground")}>{line}</p>
                  ))}
                  {!isRunning && lines.length === 0 && <p className="text-muted-foreground">Click "Run Setup" to start the simulation.</p>}
               </div>
            </AlertDescription>
            <div className="mt-4">
                <Button onClick={runSimulation} disabled={isRunning}>
                    {isRunning ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running...</> : <><Play className="mr-2 h-4 w-4" />Run Setup</>}
                </Button>
            </div>
        </Alert>
    );
}

export default function MagicRepoPage() {
    const [command, setCommand] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isZipping, setIsZipping] = useState(false);
    const [isProjectDownloaded, setIsProjectDownloaded] = useState(false);
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
            setIsProjectDownloaded(true);
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
                        {isZipping ? <><Loader2 className="animate-spin mr-2"/>Zipping Project...</> : <><FileDown className="mr-2" />Download Project (.zip)</>}
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

        {isProjectDownloaded && <SimulatedTerminal />}

    </div>
  );
}
