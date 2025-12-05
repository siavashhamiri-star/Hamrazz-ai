
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud, FileZip, Github, FileArchive, Unarchive, CheckCircle, ExternalLink, Wand2, Lightbulb, ArrowRight, CornerDownLeft, PanelLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";


const InteractiveGuide = () => {
    const [step, setStep] = useState(0);
    const [files, setFiles] = useState<File[]>([]);
    const [repoName, setRepoName] = useState("");
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const { toast } = useToast();

    const guideSteps = [
        { title: "Let's Start!", description: "Click 'Next' to begin packaging your project.", target: "next-button" },
        { title: "Select Files", description: "First, click here to select your project folder. All its contents will be prepared.", target: "file-upload" },
        { title: "Name Your Project", description: "Now, enter your GitHub username and a name for your new project repository.", target: "config-form" },
        { title: "Create the ZIP", description: "Great! Now, click this button to create the ZIP file.", target: "generate-button" },
        { title: "Download Your File", description: "Perfect! Your project is zipped and ready. Click here to download it.", target: "download-button" },
        { title: "Upload to GitHub", description: "Finally, on your new, empty GitHub repository page, find and click the 'uploading an existing file' link to upload your project.", target: "github-link" },
        { title: "All Done!", description: "Congratulations! You've successfully prepared and located where to upload your project. Click 'Restart' to do another.", target: "restart-button" },
    ];

    const currentGuide = guideSteps[step];
    const isTarget = (id: string) => currentGuide?.target === id;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(Array.from(e.target.files));
            toast({ title: `${e.target.files.length} files selected`, description: "Ready for the next step." });
            if (step === 1) setStep(2);
        }
    };

    const handleGenerate = async () => {
         if (!repoName || !username) {
            toast({ variant: "destructive", title: "Missing Info", description: "Please enter your username and repository name." });
            return;
        }
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        setIsGenerated(true);
        if (step === 3) setStep(4);
    }
    
    const handleNext = () => {
        if (step < guideSteps.length - 1) {
            if (step === 1 && files.length === 0) {
                 toast({ variant: "destructive", title: "Action Required", description: "Please select your project files first." });
                 return;
            }
             if (step === 2 && (!username || !repoName)) {
                 toast({ variant: "destructive", title: "Action Required", description: "Please fill in your username and repository name." });
                 return;
            }
             if (step === 3 && !isGenerated) {
                 toast({ variant: "destructive", title: "Action Required", description: "Please generate the ZIP file first." });
                 return;
            }
            if(step === 4) {
                 toast({ title: "Simulating Download...", description: "Your file would be downloaded now." });
            }
            setStep(s => s + 1);
        }
    }
    
    const handleRestart = () => {
        setStep(0);
        setFiles([]);
        setRepoName("");
        setUsername("");
        setIsLoading(false);
        setIsGenerated(false);
    }

    const StepWrapper = ({ targetId, children }: { targetId: string, children: React.ReactNode }) => (
        <TooltipProvider>
            <Tooltip open={isTarget(targetId)}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                {isTarget(targetId) && (
                    <TooltipContent side="top" className="max-w-xs text-center shadow-lg bg-primary text-primary-foreground border-primary">
                        <p className="font-bold text-base">{currentGuide.title}</p>
                        <p>{currentGuide.description}</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );

    return (
        <Card>
             <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wand2 /> Interactive Project Packager</CardTitle>
                <CardDescription>A simple, step-by-step guide to prepare your project for GitHub.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-8 min-h-[350px] flex flex-col justify-center">

                    <StepWrapper targetId="file-upload">
                        <div className={cn("transition-opacity duration-300", step >= 1 ? "opacity-100" : "opacity-30 pointer-events-none")}>
                            <Label htmlFor="file-upload" className={cn(
                                "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50",
                                isTarget("file-upload") && "border-primary"
                            )}>
                                {isTarget("file-upload") && <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-lg -z-10"></div>}
                                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    {files.length > 0 ? `${files.length} files selected` : "1. Select Project Folder"}
                                </p>
                                <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} multiple webkitdirectory="" directory="" disabled={step !== 1}/>
                            </Label>
                        </div>
                    </StepWrapper>
                    
                    <StepWrapper targetId="config-form">
                         <div className={cn("relative transition-opacity duration-300", step >= 2 ? "opacity-100" : "opacity-30 pointer-events-none")}>
                            {isTarget("config-form") && <div className="absolute -inset-2 bg-primary/10 animate-pulse rounded-lg -z-10"></div>}
                            <div className={cn("p-4 border rounded-lg", isTarget("config-form") && "border-primary")}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="username">2. Your GitHub Username</Label>
                                        <Input id="username" placeholder="e.g., ahura-creator" value={username} onChange={e => setUsername(e.target.value)} disabled={step !== 2} />
                                    </div>
                                    <div>
                                        <Label htmlFor="repo-name">3. Your Project Name</Label>
                                        <Input id="repo-name" placeholder="e.g., my-hamraz-app" value={repoName} onChange={e => setRepoName(e.target.value)} disabled={step !== 2} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </StepWrapper>
                   
                    <div className="flex flex-col items-center gap-4">
                        <StepWrapper targetId="generate-button">
                             <div className={cn("transition-opacity duration-300", step >= 3 ? "opacity-100" : "opacity-30 pointer-events-none")}>
                                <Button onClick={handleGenerate} disabled={isLoading || step !== 3} className={cn("min-w-48", isTarget("generate-button") && "animate-bounce")}>
                                {isLoading ? <><Loader2 className="mr-2 animate-spin"/> Generating...</> : isGenerated ? <><CheckCircle className="mr-2"/> ZIP Generated!</> : <>4. Create Project ZIP</>}
                                </Button>
                            </div>
                        </StepWrapper>
                        
                        <StepWrapper targetId="download-button">
                             <div className={cn("text-center transition-opacity duration-300", step >= 4 ? "opacity-100" : "opacity-30 pointer-events-none")}>
                                <Button size="lg" className={cn(isTarget("download-button") && "animate-bounce")}>
                                <FileZip className="mr-2"/> 5. Download Project.zip
                                </Button>
                            </div>
                        </StepWrapper>
                    </div>

                    <StepWrapper targetId="github-link">
                         <div className={cn("p-4 border rounded-lg bg-muted/30 transition-opacity duration-300", step >= 5 ? "opacity-100" : "opacity-30 pointer-events-none")}>
                             {isTarget("github-link") && <div className="absolute -inset-2 bg-primary/10 animate-pulse rounded-lg -z-10"></div>}
                            <h4 className="font-semibold text-center mb-2">6. Final Step on GitHub</h4>
                             <div className="p-4 border rounded-lg bg-card text-center font-mono text-sm text-muted-foreground space-y-1 shadow-inner">
                              <p>...or create a new repository on the command line</p>
                              <p className="opacity-50">...</p>
                              <p>...or push an existing repository from the command line</p>
                              <p className="opacity-50">...</p>
                              <div className={cn("relative p-2 rounded-md", isTarget("github-link") && "bg-primary/20")}>
                                <p>...or <span className="font-bold text-primary underline">uploading an existing file</span>.</p>
                              </div>
                            </div>
                        </div>
                     </StepWrapper>

                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-4">
                 <StepWrapper targetId="restart-button">
                    <Button variant="outline" onClick={handleRestart}>
                        <CornerDownLeft className="mr-2 h-4 w-4"/>
                        Restart
                    </Button>
                </StepWrapper>
                {step < guideSteps.length - 1 && (
                    <StepWrapper targetId="next-button">
                        <Button onClick={handleNext} className={cn(isTarget("next-button") && "animate-bounce")}>
                            Next
                            <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                    </StepWrapper>
                )}
                 {step === guideSteps.length - 1 && (
                    <p className="text-sm font-medium text-green-600">All Done!</p>
                )}
            </CardFooter>
        </Card>
    );
};


const ZipExtractor = () => {
    const [zipFile, setZipFile] = useState<File | null>(null);
    const [extractedFiles, setExtractedFiles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            if (e.target.files[0].type === 'application/zip' || e.target.files[0].name.endsWith('.zip')) {
                setZipFile(e.target.files[0]);
            } else {
                toast({
                    variant: 'destructive',
                    title: "Invalid File Type",
                    description: "Please upload a .zip file.",
                });
            }
        }
    };
    
    const handleExtract = async () => {
        if (!zipFile) return;

        setIsLoading(true);
        setExtractedFiles([]);
        
        await new Promise(resolve => setTimeout(resolve, 1500));

        setExtractedFiles([
            'project/',
            'project/index.html',
            'project/style.css',
            'project/images/',
            'project/images/logo.png',
            'project/scripts/',
            'project/scripts/main.js'
        ]);

        setIsLoading(false);
        toast({
            title: "Extraction Complete",
            description: "Simulated file structure is shown below.",
        });
    }

    return (
         <Card>
            <CardHeader>
                <CardTitle>Extract ZIP File</CardTitle>
                <CardDescription>Upload a ZIP file to view its contents (simulated).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Label htmlFor="zip-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileZip className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground text-center">
                            <span className="font-semibold">Click to upload a .zip file</span>
                        </p>
                    </div>
                    <Input id="zip-upload" type="file" className="hidden" accept=".zip,application/zip" onChange={handleFileChange} />
                </Label>
                {zipFile && <p className="text-sm text-muted-foreground mt-2">Selected: {zipFile.name}</p>}

                {extractedFiles.length > 0 && (
                    <div className="p-4 bg-muted rounded-md border">
                        <h4 className="font-semibold mb-2">Extracted File Structure:</h4>
                        <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                            {extractedFiles.join('\n')}
                        </pre>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <Button onClick={handleExtract} disabled={!zipFile || isLoading} className="w-full">
                    {isLoading ? <><Loader2 className="mr-2 animate-spin"/>Extracting...</> : <><Unarchive className="mr-2"/>Extract Files</>}
                 </Button>
            </CardFooter>
        </Card>
    )
}

export default function SyncPage() {
    const { toggleSidebar } = useSidebar();
  return (
    <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
            <Alert className="flex-1">
            <Lightbulb className="h-4 w-4" />
            <AlertTitle className="font-bold">Sync & Tools</AlertTitle>
            <AlertDescription>
                This page contains tools to help you manage your projects. Use the interactive guide to package your project for GitHub, or use the extractor to inspect ZIP files.
            </AlertDescription>
            </Alert>
            <Button onClick={toggleSidebar} variant="outline" className="ml-4">
                <PanelLeft className="mr-2 h-4 w-4" />
                Open Menu
            </Button>
        </div>
      
        <Tabs defaultValue="to-zip" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="to-zip"><FileZip className="mr-2"/>Project Packager</TabsTrigger>
                <TabsTrigger value="from-zip"><Unarchive className="mr-2"/>ZIP Extractor</TabsTrigger>
            </TabsList>
            <TabsContent value="to-zip" className="mt-6">
                <InteractiveGuide />
            </TabsContent>
            <TabsContent value="from-zip" className="mt-6">
                <ZipExtractor />
            </TabsContent>
        </Tabs>

        <Card>
            <CardHeader>
                <CardTitle>Professional Tools Guide: Termux + Git</CardTitle>
                <CardDescription>For advanced users, Termux is a powerful terminal emulator for Android that allows you to use command-line tools like `git` directly on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="https://termux.dev/en/" target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="outline" className="w-full">Download Termux <ExternalLink className="ml-2"/></Button>
                    </Link>
                    <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="outline" className="w-full">Visit GitHub <Github className="ml-2"/></Button>
                    </Link>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Git Command Cheat Sheet:</h4>
                    <div className="space-y-2 text-sm p-4 bg-muted rounded-md font-mono">
                        <p><span className="text-primary font-bold">git init</span> - Initializes a new Git repository.</p>
                        <p><span className="text-primary font-bold">git add .</span> - Stages all changes for commit.</p>
                        <p><span className="text-primary font-bold">git commit -m "Your message"</span> - Saves your changes.</p>
                        <p><span className="text-primary font-bold">git remote add origin [URL]</span> - Connects your local repo to GitHub.</p>
                        <p><span className="text-primary font-bold">git push -u origin main</span> - Pushes your commits to GitHub.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      
    </div>
  );
}

    
