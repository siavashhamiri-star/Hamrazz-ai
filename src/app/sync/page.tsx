
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud, FileZip, ArrowRight, Github, FileArchive, Unarchive, CheckCircle, ExternalLink, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ZipCreator = () => {
    const [step, setStep] = useState<"upload" | "configure" | "download">("upload");
    const [files, setFiles] = useState<File[]>([]);
    const [repoName, setRepoName] = useState("");
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(Array.from(e.target.files));
            setStep("configure");
            toast({ title: `${e.target.files.length} files selected`, description: "Ready to configure your repository." });
        }
    };
    
    const handleGenerateZip = async () => {
        if (!repoName || !username) {
            toast({
                variant: "destructive",
                title: "Incomplete Information",
                description: "Please enter your GitHub username and repository name.",
            });
            return;
        }
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({
            title: "ZIP File Ready!",
            description: "Your project is ready to be downloaded and uploaded to GitHub.",
        });
        setIsLoading(false);
        setStep("download");
    }

    const StepIcon = ({ icon: Icon, stepNumber, title, active, completed }: { icon: React.ElementType, stepNumber: number, title: string, active: boolean, completed: boolean }) => (
        <div className={cn("flex items-center gap-4 transition-opacity", !active && !completed ? "opacity-30" : "opacity-100")}>
            <div className={cn("relative flex h-12 w-12 items-center justify-center rounded-full border-2", 
                completed ? "bg-green-100 border-green-500 text-green-600" : 
                active ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border"
            )}>
                {completed ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                 <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{stepNumber}</span>
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create GitHub Project ZIP</CardTitle>
                <CardDescription>A guided wizard to package your project for GitHub.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                    {/* Step 1: Upload */}
                    <div className="space-y-4">
                        <StepIcon icon={UploadCloud} stepNumber={1} title="Upload Project Files" active={step === 'upload'} completed={step !== 'upload'} />
                        {step === 'upload' && (
                             <div className="pl-16">
                                <Label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <p className="mb-2 text-sm text-muted-foreground text-center">
                                            <span className="font-semibold">Click to select project folder</span>
                                        </p>
                                    </div>
                                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} multiple webkitdirectory="" directory="" />
                                </Label>
                             </div>
                        )}
                    </div>

                    <div className="h-8 w-px bg-border ml-6" />

                    {/* Step 2: Configure */}
                    <div className="space-y-4">
                        <StepIcon icon={Github} stepNumber={2} title="Configure Repository" active={step === 'configure'} completed={step === 'download'} />
                         {step === 'configure' && (
                            <div className="pl-16 space-y-4 animate-in fade-in-0 duration-500">
                                <div className="space-y-2">
                                    <Label htmlFor="username">GitHub Username</Label>
                                    <Input id="username" placeholder="e.g., ahura-creator" value={username} onChange={e => setUsername(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="repo-name">Repository Name</Label>
                                    <Input id="repo-name" placeholder="e.g., my-hamraz-app" value={repoName} onChange={e => setRepoName(e.target.value)} />
                                </div>
                                 <Button onClick={handleGenerateZip} disabled={isLoading}>
                                    {isLoading ? <><Loader2 className="mr-2 animate-spin"/> Generating...</> : <>Generate Project ZIP <ArrowRight className="ml-2" /></>}
                                </Button>
                            </div>
                         )}
                    </div>
                    
                    <div className="h-8 w-px bg-border ml-6" />

                    {/* Step 3: Download */}
                     <div className="space-y-4">
                        <StepIcon icon={FileZip} stepNumber={3} title="Download & Finish" active={step === 'download'} completed={false}/>
                        {step === 'download' && (
                             <div className="pl-16 space-y-4 animate-in fade-in-0 duration-500">
                                <Button className="w-full" size="lg">
                                    <FileZip className="mr-2" /> Download Project.zip
                                </Button>
                                <Alert variant="default" className="border-primary/50 bg-primary/10">
                                  <Info className="h-4 w-4 text-primary" />
                                  <AlertTitle className="text-primary">Final Step on GitHub</AlertTitle>
                                  <AlertDescription>
                                    <p className="mb-2">
                                      On your new **empty** GitHub repository page, click the link that says **"uploading an existing file"**.
                                    </p>
                                    <div className="p-4 border rounded-lg bg-background/50 text-center font-mono text-sm text-muted-foreground">
                                      <p>...or create a new repository on the command line</p>
                                      <p>echo "# my-repo" &gt;&gt; README.md</p>
                                      <p>git init</p>
                                      <p>...</p>
                                      <p>...or push an existing repository from the command line</p>
                                      <p>...</p>
                                      <p>...or <span className="font-bold text-primary underline">uploading an existing file</span>.</p>
                                    </div>
                                  </AlertDescription>
                                </Alert>
                                <a href={`https://github.com/${username}/${repoName}`} target="_blank" rel="noopener noreferrer">
                                    <Button variant="secondary" className="w-full">Go to GitHub Repository <ExternalLink className="ml-2" /></Button>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Button variant="outline" size="sm" onClick={() => { setStep('upload'); setFiles([]); setRepoName(''); setUsername(''); }}>Start Over</Button>
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

        // In a real app, you would use a library like JSZip to read the file contents.
        // Here, we simulate it with some dummy data.
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
  return (
    <div className="max-w-2xl mx-auto space-y-8">
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-3"><FileArchive /> Project Sync & Tools</CardTitle>
          <CardDescription>
            Use these tools to package your project for GitHub, inspect ZIP files, or learn about professional command-line tools.
          </CardDescription>
        </CardHeader>
      </Card>
      
        <Tabs defaultValue="to-zip" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="to-zip"><FileZip className="mr-2"/>Files to ZIP</TabsTrigger>
                <TabsTrigger value="from-zip"><Unarchive className="mr-2"/>ZIP to Files</TabsTrigger>
            </TabsList>
            <TabsContent value="to-zip" className="mt-6">
                <ZipCreator />
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
