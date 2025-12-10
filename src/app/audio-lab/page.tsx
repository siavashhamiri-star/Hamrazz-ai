
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Music, Scissors, Volume2, Download, AlertTriangle } from "lucide-react";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import JSZip from 'jszip';

const TrackControl = ({
  title,
  trackNumber,
  onFileChange,
  fileName,
  volume,
  onVolumeChange,
  fade,
  onFadeChange,
  disabled,
}: {
  title: string;
  trackNumber: number;
  onFileChange: (file: File | null) => void;
  fileName: string | null;
  volume: number;
  onVolumeChange: (value: number) => void;
  fade: { fadeIn: number; fadeOut: number };
  onFadeChange: (type: 'fadeIn' | 'fadeOut', value: number) => void;
  disabled: boolean;
}) => {
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor={`track-upload-${trackNumber}`}>Upload Audio File</Label>
          <Input
            id={`track-upload-${trackNumber}`}
            type="file"
            accept="audio/*"
            onChange={(e) => onFileChange(e.target.files ? e.target.files[0] : null)}
            disabled={disabled}
            className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          {fileName && <p className="text-xs text-muted-foreground truncate pt-1">Loaded: {fileName}</p>}
        </div>
        <div className="space-y-2">
          <Label>Volume</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[volume]}
              onValueChange={(v) => onVolumeChange(v[0])}
              max={100}
              step={1}
              disabled={disabled}
            />
            <span className="text-xs font-mono w-10 text-center">{volume}%</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label>Fade In (s)</Label>
            <Slider
                value={[fade.fadeIn]}
                onValueChange={(v) => onFadeChange('fadeIn', v[0])}
                max={10}
                step={0.5}
                disabled={disabled}
            />
             <p className="text-center text-xs font-mono">{fade.fadeIn}s</p>
            </div>
            <div className="space-y-2">
            <Label>Fade Out (s)</Label>
            <Slider
                value={[fade.fadeOut]}
                onValueChange={(v) => onFadeChange('fadeOut', v[0])}
                max={10}
                step={0.5}
                disabled={disabled}
            />
            <p className="text-center text-xs font-mono">{fade.fadeOut}s</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};


export default function AudioLabPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [vocalTrack, setVocalTrack] = useState<File | null>(null);
  const [musicTrack, setMusicTrack] = useState<File | null>(null);
  const [vocalVolume, setVocalVolume] = useState(80);
  const [musicVolume, setMusicVolume] = useState(40);
  const [vocalFade, setVocalFade] = useState({ fadeIn: 0, fadeOut: 2 });
  const [musicFade, setMusicFade] = useState({ fadeIn: 2, fadeOut: 5 });
  const [removeVocals, setRemoveVocals] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!vocalTrack && !musicTrack) {
        toast({ variant: "destructive", title: "No files uploaded", description: "Please upload at least one audio track." });
        return;
    }
    
    setIsLoading(true);
    setResultUrl(null);
    setError(null);

    toast({ title: "Processing audio...", description: "This is a simulation. In a real app, this would take time." });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
        const zip = new JSZip();
        
        const details = `
        Audio Mix Details - Hamraz Audio Lab
        =====================================
        Date: ${new Date().toISOString()}

        Vocal Track: ${vocalTrack?.name || 'N/A'}
        - Volume: ${vocalVolume}%
        - Fade In: ${vocalFade.fadeIn}s
        - Fade Out: ${vocalFade.fadeOut}s

        Music Track: ${musicTrack?.name || 'N/A'}
        - Volume: ${musicVolume}%
        - Fade In: ${musicFade.fadeIn}s
        - Fade Out: ${musicFade.fadeOut}s
        
        Vocal Remover AI: ${removeVocals ? 'Enabled' : 'Disabled'}
        `;

        zip.file("details.txt", details);

        if (vocalTrack) {
            zip.file(`tracks/vocals_${vocalTrack.name}`, vocalTrack);
        }
        if (musicTrack) {
            zip.file(`tracks/music_${musicTrack.name}`, musicTrack);
        }

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        setResultUrl(url);

    } catch (err) {
        console.error("Error creating zip file:", err);
        setError("Could not generate the output file.");
    }

    setIsLoading(false);
  };
  
  const handleReset = () => {
      setVocalTrack(null);
      setMusicTrack(null);
      if(resultUrl) {
          URL.revokeObjectURL(resultUrl);
      }
      setResultUrl(null);
      setError(null);
      const vocalInput = document.getElementById('track-upload-1') as HTMLInputElement;
      if (vocalInput) vocalInput.value = '';
      const musicInput = document.getElementById('track-upload-2') as HTMLInputElement;
      if (musicInput) musicInput.value = '';
  }

  if (user?.uid !== 'owner-the-creator') {
      return (
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md text-center">
              <CardHeader>
                  <CardTitle className="text-destructive">Under Construction</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>This advanced audio lab is currently under development and is only available to the Creator for testing.</p>
              </CardContent>
          </Card>
        </div>
      )
  }

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-primary/10 border-primary/30">
        <Music className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary font-bold">Welcome to the Audio Lab</AlertTitle>
        <AlertDescription>
          This is a prototype of an advanced audio editing studio. Here, you can mix vocal and music tracks, apply fades, and even simulate vocal removal. This interface allows us to refine the user experience before building the complex backend processing engine.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrackControl
          title="Vocal Track"
          trackNumber={1}
          onFileChange={setVocalTrack}
          fileName={vocalTrack?.name || null}
          volume={vocalVolume}
          onVolumeChange={setVocalVolume}
          fade={vocalFade}
          onFadeChange={(type, value) => setVocalFade(prev => ({...prev, [type]: value}))}
          disabled={isLoading || !!resultUrl}
        />
        <TrackControl
          title="Music/Instrumental Track"
          trackNumber={2}
          onFileChange={setMusicTrack}
          fileName={musicTrack?.name || null}
          volume={musicVolume}
          onVolumeChange={setMusicVolume}
          fade={musicFade}
          onFadeChange={(type, value) => setMusicFade(prev => ({...prev, [type]: value}))}
          disabled={isLoading || !!resultUrl}
        />
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Scissors/> Processing &amp; Output</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Alert>
                <AlertTriangle className="h-4 w-4"/>
                <AlertTitle>Vocal Remover (AI Simulation)</AlertTitle>
                <AlertDescription>
                    This is a highly experimental and computationally expensive feature. It attempts to isolate or remove vocals from a mixed track.
                </AlertDescription>
            </Alert>
            <div className="flex items-center space-x-2">
                <Switch id="vocal-remover" checked={removeVocals} onCheckedChange={setRemoveVocals} disabled={isLoading || !musicTrack || !!resultUrl} />
                <Label htmlFor="vocal-remover">Attempt to remove vocals from Music Track</Label>
            </div>
             <p className="text-xs text-muted-foreground">
                Note: This requires a music track with vocals to have an effect. The AI will try to create an instrumental version.
            </p>
        </CardContent>
        <CardFooter className="flex-col gap-6">
          <Button size="lg" onClick={handleProcess} disabled={isLoading || !!resultUrl}>
             {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Volume2 className="mr-2 h-5 w-5" />}
            {isLoading ? "Processing..." : "Mix & Render Audio"}
          </Button>
          
           {error && (
            <Alert variant="destructive" className="w-full">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resultUrl && (
            <Card className="w-full bg-muted/50 p-4 animate-in fade-in-50">
                <CardTitle className="text-lg mb-2">Result</CardTitle>
                <AlertDescription className="mb-4">
                    A ZIP file has been generated containing your audio tracks and a summary of the processing details.
                </AlertDescription>
                <div className="flex items-center gap-4">
                    <a href={resultUrl} download="hamraz-audiolab-mix.zip" className="w-full">
                        <Button className="w-full">
                            <Download className="h-5 w-5 mr-2"/> Download Mix (.zip)
                        </Button>
                    </a>
                </div>
                 <div className="mt-4">
                    <Button variant="outline" onClick={handleReset}>Start a New Mix</Button>
                </div>
            </Card>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

    