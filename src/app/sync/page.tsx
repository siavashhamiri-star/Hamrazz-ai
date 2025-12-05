
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
import { Loader2, UploadCloud, FileZip, ArrowRight, Github } from "lucide-react";

type Step = "upload" | "configure" | "download";

export default function SyncPage() {
  const [step, setStep] = useState<Step>("upload");
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
      // In a real implementation, we would use a library like JSZip here.
      // For this prototype, we'll simulate the process.
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
          title: "ZIP File Ready!",
          description: "Your project is ready to be downloaded and uploaded to GitHub.",
      });
      setIsLoading(false);
      setStep("download");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-3"><Github /> GitHub Sync Helper</CardTitle>
          <CardDescription>
            This tool helps you prepare your project files for an easy upload to GitHub.
          </CardDescription>
        </CardHeader>
      </Card>
      
      {step === 'upload' && (
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
      )}
      
      {step === 'configure' && (
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
      )}

      {step === 'download' && (
           <Card>
               <CardHeader>
                  <CardTitle>Step 3: Download and Upload</CardTitle>
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
      )}
      
    </div>
  );
}
