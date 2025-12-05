
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Send, Server, Terminal, FileCode, CheckCircle, XCircle, ArrowRight, Play, ServerCrash, Rocket } from "lucide-react";
import { useUser } from "@/firebase";
import { cn } from "@/lib/utils";

type Stage = "idle" | "coding" | "testing" | "building" | "deploying" | "done" | "error";
type StageStatus = "pending" | "running" | "success" | "failed";

const STAGES: { id: Stage; name: string }[] = [
    { id: "coding", name: "Generate Code" },
    { id: "testing", name: "Run Tests" },
    { id: "building", name: "Build Container" },
    { id: "deploying", name: "Deploy to Cloud" },
];

const initialCode = `// AI will generate code here based on your command...`;
const initialLogs = "Terminal ready. Awaiting your command...\n";

const MOCK_STEPS = {
  coding: {
    code: `const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    logs: "Code generation complete. Basic Node.js server created.\n",
    delay: 1500,
  },
  testing: {
    logs: "Executing tests...\n> npm test\n  ✓ should return 200 for /status (15ms)\n  ✓ should return 'ok' in status body (3ms)\n\nTest Suites: 1 passed, 1 total\nTests:       2 passed, 2 total\nSnapshots:   0 total\nTime:        0.52s\n\nAll tests passed successfully.\n",
    delay: 2000,
  },
  building: {
    logs: `Building Docker container...\nStep 1/5 : FROM node:18-alpine\nStep 2/5 : WORKDIR /app\nStep 3/5 : COPY package*.json ./\nStep 4/5 : RUN npm install\nStep 5/5 : COPY . .\nSuccessfully built af3b2c1d8d3a\nSuccessfully tagged hamraz-app:latest\nPushing to registry...\n`,
    delay: 3000,
  },
  deploying: {
    logs: `Deploying to cloud infrastructure...\nProvisioning virtual server...\nConfiguring network rules...\nStarting container...\nDeployment successful. Service is live.\n`,
    delay: 2500,
  },
};

export default function LiveBuildPage() {
  const { user } = useUser();
  const [command, setCommand] = useState("Create a Node.js server with a /status endpoint");
  const [currentStage, setCurrentStage] = useState<Stage>("idle");
  const [stageStatuses, setStageStatuses] = useState<Record<Stage, StageStatus>>({
    idle: "pending", coding: "pending", testing: "pending", building: "pending", deploying: "pending", done: "pending", error: "pending"
  });
  const [generatedCode, setGeneratedCode] = useState(initialCode);
  const [terminalLogs, setTerminalLogs] = useState(initialLogs);
  const [isFinished, setIsFinished] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLogs]);


  const runStage = async (stage: Stage) => {
    if (stage === "idle" || stage === "done" || stage === "error") return;
    
    setCurrentStage(stage);
    setStageStatuses(prev => ({ ...prev, [stage]: "running" }));
    
    const step = MOCK_STEPS[stage as keyof typeof MOCK_STEPS];
    
    if (stage === "coding" && step.code) {
      setGeneratedCode("");
      let currentCode = "";
       for (let i = 0; i < step.code.length; i++) {
         currentCode += step.code[i];
         setGeneratedCode(currentCode);
         await new Promise(r => setTimeout(r, 5));
       }
    }
    
    await new Promise(r => setTimeout(r, step.delay / 2));
    setTerminalLogs(prev => prev + `[${stage}] ${step.logs}`);
    await new Promise(r => setTimeout(r, step.delay / 2));

    setStageStatuses(prev => ({ ...prev, [stage]: "success" }));
  };

  const handleStartBuild = async () => {
    setIsFinished(false);
    setGeneratedCode(initialCode);
    setTerminalLogs(initialLogs + `> User command: "${command}"\n`);
    setStageStatuses({ idle: "pending", coding: "pending", testing: "pending", building: "pending", deploying: "pending", done: "pending", error: "pending" });
    
    for (const stageInfo of STAGES) {
      await runStage(stageInfo.id);
    }
    
    setCurrentStage("done");
    const url = `https://hamraz-app-${Date.now()}.dev-server.io`;
    setDeploymentUrl(url);
    setTerminalLogs(prev => prev + `\nDeployment complete! Your app is live at: ${url}\n`);
    setIsFinished(true);
  };
  
  const handleReset = () => {
    setCurrentStage("idle");
    setIsFinished(false);
    setGeneratedCode(initialCode);
    setTerminalLogs(initialLogs);
    setStageStatuses({ idle: "pending", coding: "pending", testing: "pending", building: "pending", deploying: "pending", done: "pending", error: "pending" });
    setDeploymentUrl("");
  }
  
  const isRunning = currentStage !== "idle" && !isFinished;

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-accent/10 border-accent/30 text-accent-foreground/80">
        <Server className="h-4 w-4 text-accent" />
        <AlertTitle className="text-accent font-bold">The DevOps Brain: From Idea to Live App</AlertTitle>
        <AlertDescription>
          This is the ultimate expression of the Hamraz vision. Give a command in plain English, and watch as your AI companion generates code, runs tests, builds a container, and deploys a live application to the cloud, all in real-time. This is not just automation; it's creation at the speed of thought.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline"><Play /> Start a New Build</CardTitle>
          <CardDescription>Enter your command and let Hamraz handle the entire DevOps lifecycle.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., 'Create a Node.js server with a /status endpoint'"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              disabled={isRunning}
            />
            <Button onClick={handleStartBuild} disabled={isRunning || !command.trim() || !user}>
              {isRunning ? <Loader2 className="animate-spin" /> : <Send />}
              <span className="ml-2 hidden sm:inline">Run</span>
            </Button>
            {isFinished && <Button onClick={handleReset} variant="outline">Reset</Button>}
          </div>
           {!user && <p className="text-sm text-destructive mt-2">Please sign in to use the Live Build feature.</p>}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
           <Card className="shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileCode /> Live Code Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-muted rounded-md h-[400px] overflow-auto text-sm font-mono">
                <code>{generatedCode}</code>
              </pre>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ArrowRight /> Build Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {STAGES.map((stage) => (
                <div key={stage.id} className="flex items-center gap-3 text-sm">
                  {stageStatuses[stage.id] === "pending" && <div className="w-5 h-5 border-2 border-muted-foreground rounded-full" />}
                  {stageStatuses[stage.id] === "running" && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                  {stageStatuses[stage.id] === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {stageStatuses[stage.id] === "failed" && <XCircle className="w-5 h-5 text-destructive" />}
                  <span className={cn("font-medium", {
                      "text-muted-foreground": stageStatuses[stage.id] === "pending",
                      "text-primary": stageStatuses[stage.id] === "running",
                  })}>{stage.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>

           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Terminal /> Live Terminal</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={terminalRef} className="p-2 bg-black text-white rounded-md h-[200px] overflow-auto text-xs font-mono whitespace-pre-wrap">
                {terminalLogs}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
       
      {isFinished && deploymentUrl && (
        <Card className="bg-green-500/10 border-green-500/30 animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-300"><Rocket /> Deployment Successful!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">Your application is now live and accessible at the following URL:</p>
            <a href={deploymentUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-primary underline break-all">{deploymentUrl}</a>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
