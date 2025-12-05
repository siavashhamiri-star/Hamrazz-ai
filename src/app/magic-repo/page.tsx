
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
import { Loader2, FolderTree, Send, Wand2, Rocket, Lightbulb, Github, CheckCircle, Video } from "lucide-react";
import { generateProjectStructure, FileSystem } from "@/ai/flows/generate-project-structure-flow";
import { useUser } from "@/firebase";

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
    const { user } = useUser();
    const [command, setCommand] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [githubConnected, setGithubConnected] = useState(false);
    const [repoUrl, setRepoUrl] = useState("");
    const [fileStructure, setFileStructure] = useState<FileSystem>({
        name: "my-hamraz-project",
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
    
    const handleConnectToGithub = () => {
        setIsLoading(true);
        setTimeout(() => {
            setGithubConnected(true);
            setIsLoading(false);
        }, 1500);
    }

    const handlePublish = async () => {
        setIsPublishing(true);
        setIsPublished(false);
        try {
            // In a real app, this would involve a backend process to:
            // 1. Authenticate with GitHub
            // 2. Create a new repository via GitHub API
            // 3. Commit and push the generated file structure
            
            // Simulate the steps with delays
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate repo creation
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate file push
            
            // Generate a plausible repo URL for the demo
            const generatedRepoUrl = `https://github.com/${user?.displayName?.toLowerCase().replace(/\s/g, '') || 'user'}/${fileStructure.name}`;
            setRepoUrl(generatedRepoUrl);
            setIsPublished(true);

        } catch (error) {
            console.error("Error publishing to GitHub:", error);
        } finally {
            setIsPublishing(false);
        }
    }
    
    const resetAll = () => {
        setIsPublished(false);
        setGithubConnected(false);
        setFileStructure({
            name: "my-hamraz-project",
            type: "directory",
            children: [],
        });
        setRepoUrl("");
    }

  return (
    <div className="space-y-8">
        <Alert variant="default" className="bg-primary/10 border-primary/30">
            <Rocket className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-bold">The One-Click Workshop</AlertTitle>
            <AlertDescription>
                Build your project with simple commands, then publish it directly to a new GitHub repository with a single click. From idea to repository, instantly.
            </AlertDescription>
        </Alert>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-headline"><Video /> Tutorial: Idea to GitHub in 60 Seconds</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    {/* Placeholder for a tutorial video */}
                    <video src="https://videos.pexels.com/video-files/852413/852413-hd_1280_720_25fps.mp4" className="w-full h-full object-cover" controls loop autoPlay muted>
                        Your browser does not support the video tag.
                    </video>
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Wand2 /> 1. Command Console</CardTitle>
                    <CardDescription>
                        Type your command below to build your project structure.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <Alert variant="default" className="mb-4">
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle className="text-sm">Example Commands</AlertTitle>
                        <AlertDescription className="text-xs">
                           <ul className="list-disc list-inside font-mono">
                              <li>create a file named "index.html"</li>
                              <li>add a folder named "css"</li>
                              <li>add a h1 with "Hello World" to index.html</li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="e.g., 'create a file named index.html'"
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRunCommand()}
                            disabled={isLoading || isPublishing || isPublished}
                        />
                        <Button onClick={handleRunCommand} disabled={isLoading || isPublishing || isPublished || !command.trim()} size="icon">
                            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FolderTree/> 2. Project Structure</CardTitle>
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

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Rocket /> 3. Publish</CardTitle>
                <CardDescription>Connect your GitHub account to publish your project directly.</CardDescription>
            </CardHeader>
            <CardContent>
                {isPublished ? (
                    <Alert variant="default" className="bg-green-500/10 border-green-500/30">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-700">Successfully Published!</AlertTitle>
                        <AlertDescription>
                            <p>Your project is now live on GitHub. You can view it here:</p>
                            <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-primary underline mt-2 block break-all">
                                {repoUrl}
                            </a>
                        </AlertDescription>
                        <div className="mt-4">
                            <Button onClick={resetAll}>Create Another Project</Button>
                        </div>
                    </Alert>
                ) : !githubConnected ? (
                    <div className="text-center">
                        <p className="mb-4 text-muted-foreground">You need to connect your GitHub account first.</p>
                        <Button onClick={handleConnectToGithub} disabled={isLoading || !user}>
                             {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Connecting...</> : <><Github className="mr-2 h-4 w-4"/> Connect to GitHub</>}
                        </Button>
                    </div>
                ) : (
                     <div className="text-center">
                        <p className="mb-4 flex items-center justify-center gap-2 text-green-600 font-semibold"><CheckCircle/> GitHub Account Connected!</p>
                        <Button onClick={handlePublish} disabled={isPublishing || fileStructure.children.length === 0} size="lg">
                            {isPublishing ? <><Loader2 className="animate-spin mr-2"/>Publishing...</> : <><Rocket className="mr-2" />Publish to GitHub</>}
                        </Button>
                        {fileStructure.children.length === 0 && <p className="text-xs text-destructive mt-2">Your project is empty. Add some files before publishing.</p>}
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
