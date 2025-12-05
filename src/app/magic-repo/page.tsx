
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, FileText, Download, Folder, ArrowRight, CornerDownLeft, Sparkles } from "lucide-react";
import { generateProjectStructure, FileSystem } from "@/ai/flows/generate-project-structure-flow";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
                {fs.children.length > 0 ? renderNode(fs, 0) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                        <Sparkles className="w-8 h-8 mb-2"/>
                        <p>Your project structure will appear here.</p>
                    </div>
                )}
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

  const [guideStep, setGuideStep] = useState(0);
  const guideSteps = [
    { title: "Let's Start!", description: "Click 'Start Guide' to learn how to build a project with AI.", target: "start-button"},
    { title: "1. Give a command", description: 'Type a simple command here, like "create a file named index.html".', target: "command-input" },
    { title: "2. Run the command", description: "Now click 'Run' to execute the command.", target: "run-button" },
    { title: "3. See the result!", description: "Awesome! Your file structure appeared here. Try adding a folder next!", target: "fs-viewer" },
    { title: "4. Download your project", description: "When you are done, you can download the entire project as a ZIP file.", target: "download-button" },
    { title: "You're a pro!", description: "Now you know how to use the Magic Repo. You can restart the guide anytime.", target: "restart-button"}
  ];
  const currentGuide = guideSteps[guideStep];
  const isTarget = (id: string) => currentGuide?.target === id;

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
        if (guideStep === 2) setGuideStep(3);
    } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Error", description: "Could not execute the command." });
    } finally {
        setCommand("");
        setIsLoading(false);
    }
  };

  const handleRestartGuide = () => {
    setGuideStep(0);
    setFileSystem({ type: 'directory', name: 'my-project', children: [] });
  }

  const StepWrapper = ({ targetId, children, ...props }: { targetId: string, children: React.ReactNode } & React.ComponentProps<typeof TooltipContent>) => (
    <TooltipProvider>
      <Tooltip open={isTarget(targetId)}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        {isTarget(targetId) && (
            <TooltipContent side="top" className="max-w-xs text-center shadow-lg bg-primary text-primary-foreground border-primary" {...props}>
                <p className="font-bold text-base">{currentGuide.title}</p>
                <p>{currentGuide.description}</p>
            </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="text-center">
            <Wand2 className="w-12 h-12 mx-auto text-primary"/>
            <CardTitle className="text-3xl font-headline mt-4">Magic Repository</CardTitle>
            <CardDescription className="max-w-2xl mx-auto">
                Describe your project, and I will build it for you. Start with the interactive guide below or just start typing commands.
            </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Command Console</CardTitle>
                    <CardDescription>Use simple commands to build your project.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2 items-center">
                      <StepWrapper targetId="command-input">
                        <Input 
                            placeholder="e.g., CREATE FILE index.html with a h1 tag"
                            value={command}
                            onChange={e => {
                                setCommand(e.target.value);
                                if (guideStep === 1 && e.target.value.length > 5) {
                                    setGuideStep(2);
                                }
                            }}
                            onKeyDown={e => e.key === 'Enter' && handleCommand()}
                            disabled={isLoading}
                            className={cn("font-mono", isTarget("command-input") && "border-2 border-primary ring-4 ring-primary/20")}
                        />
                      </StepWrapper>
                      <StepWrapper targetId="run-button">
                        <Button onClick={handleCommand} disabled={isLoading || !command.trim()} className={cn(isTarget("run-button") && "animate-bounce")}>
                            {isLoading ? <Loader2 className="animate-spin" /> : "Run"}
                        </Button>
                      </StepWrapper>
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
                <CardFooter className="flex justify-between">
                    <StepWrapper targetId="restart-button">
                        <Button variant="outline" onClick={handleRestartGuide} className={cn(isTarget("restart-button") && "animate-bounce")}>
                            <CornerDownLeft className="mr-2 h-4 w-4"/>
                            Restart Guide
                        </Button>
                    </StepWrapper>
                     {guideStep === 0 && (
                        <StepWrapper targetId="start-button">
                            <Button onClick={() => setGuideStep(1)} className={cn(isTarget("start-button") && "animate-bounce")}>
                                Start Guide
                                <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </StepWrapper>
                     )}
                     {guideStep > 0 && guideStep < 3 && (
                        <p className="text-sm text-muted-foreground font-medium">Step {guideStep} of {guideSteps.length-2}</p>
                     )}
                </CardFooter>
            </Card>
            <StepWrapper targetId="download-button" side="bottom">
              <Button className={cn("w-full", isTarget("download-button") && "animate-bounce")} size="lg" disabled={fileSystem.children.length === 0}>
                  <Download className="mr-2"/>
                  Generate and Download Project.zip (Coming Soon)
              </Button>
            </StepWrapper>
        </div>
        <div className={cn("lg:col-span-1 relative", isTarget("fs-viewer") && "rounded-lg ring-4 ring-primary/50")}>
            {isTarget("fs-viewer") && <div className="absolute -inset-2 bg-primary/10 animate-pulse rounded-lg -z-10" onAnimationEnd={() => setGuideStep(4)}></div>}
            <FileSystemViewer fs={fileSystem} />
        </div>
      </div>
    </div>
  );
}
