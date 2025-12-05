
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
import { Loader2, UploadCloud, FileZip, ArrowRight, Github, FileArchive, Unarchive, CheckCircle, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const ZipCreator = () => {
    const [step, setStep] = useState<"upload" | "configure" | "download">("upload");
    const [files, setFiles] = useState<File[]>([]);
    const [repoName, setRepoName] = useState("");
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
        setFiles(Array.from(e.target.files));
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

    if (step === 'download') {
         return (
           <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CheckCircle className="text-green-500" /> Step 3: Download and Upload</CardTitle>
                  <CardDescription>Your project is packaged and ready. Follow these final steps.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                    <Button className="w-full" size="lg">
                      <FileZip className="mr-2" /> Download Project.zip
                    </Button>
                    <div className="prose prose-sm dark:prose-invert text-muted-foreground">
                        <ol className="list-decimal list-inside space-y-2">
                            <li>Download the generated `.zip` file.</li>
                            <li>Go to your empty GitHub repository page.</li>
                            <li>Click on the **"uploading an existing file"** link.</li>
                            <li>Drag and drop the downloaded `.zip` file into the upload area. GitHub will automatically handle the extraction.</li>
                            <li>Add a commit message and click **"Commit changes"**.</li>
                        </ol>
                    </div>
              </CardContent>
               <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('configure')}>Back</Button>
                <a href={`https://github.com/${username}/${repoName}`} target="_blank" rel="noopener noreferrer">
                    <Button>Go to GitHub Repository <ArrowRight className="ml-2" /></Button>
                </a>
              </CardFooter>
          </Card>
      )
    }

    if (step === 'configure') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Step 2: Configure GitHub Repository</CardTitle>
                    <CardDescription>Enter the details of the GitHub repository where you want to upload the project.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">GitHub Username</Label>
                        <Input id="username" placeholder="e.g., ahura-creator" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="repo-name">Repository Name</Label>
                        <Input id="repo-name" placeholder="e.g., my-hamraz-app" value={repoName} onChange={e => setRepoName(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep('upload')}>Back</Button>
                    <Button onClick={handleGenerateZip} disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 animate-spin"/> Generating...</> : <>Generate Project ZIP <ArrowRight className="ml-2" /></>}
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Step 1: Upload Your Project Files</CardTitle>
                <CardDescription>Select all files and folders of your project. The structure will be preserved.</CardDescription>
            </CardHeader>
            <CardContent>
                <Label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground text-center">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                    </div>
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} multiple webkitdirectory="" directory="" />
                </Label>
                {files.length > 0 && <p className="text-sm text-muted-foreground mt-4">{files.length} files selected.</p>}
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={() => setStep('configure')} disabled={files.length === 0}>
                    Next Step <ArrowRight className="ml-2" />
                </Button>
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
                <CardDescription>Upload a ZIP file to view its contents.</CardDescription>
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
