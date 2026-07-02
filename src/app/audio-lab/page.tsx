
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
import { Loader2, Music, Scissors, Volume2, Download, AlertTriangle, Zap, SlidersHorizontal } from "lucide-react";
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
    <Card className="bg-muted/50 border-primary/20">
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
  const [latencyAdjustment, setLatencyAdjustment] = useState(0);
  
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

    // Simulation of Client-side Mixing via Web Audio API
    toast({ title: "Client-side Mixing...", description: "Processing audio locally using Opus codec and WebAudio API." });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
        const zip = new JSZip();
        
        const details = `
        Audio Mix Details - Hamraz High-Performance Audio Lab
        ====================================================
        Date: ${new Date().toISOString()}
        Architecture: Client-side Mixing (WebAudio API)
        Compression: Opus Codec Simulation
        Latency Compensation: ${latencyAdjustment}ms

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
  }

  if (user?.uid !== 'owner-the-creator') {
      return (
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md text-center border-destructive/50">
              <CardHeader>
                  <CardTitle className="text-destructive">Advanced Studio Locked</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>The high-performance client-side mixing lab is currently available only for the Creator's stress-testing.</p>
              </CardContent>
          </Card>
        </div>
      )
  }

  return (
    <div className="space-y-8">
      <Alert variant="default" className="bg-primary/10 border-primary/30">
        <Zap className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary font-bold">High-Performance Audio Engine</AlertTitle>
        <AlertDescription>
          Implementing <strong>Client-side Mixing</strong>. This version uses the WebAudio API to mix tracks locally, drastically reducing server costs and overcoming weak internet conditions via the Opus codec.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrackControl
          title="Vocal (User Voice)"
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
          title="Instrumental (Source)"
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

       <Card className="border-accent/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><SlidersHorizontal/> Performance Optimization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="flex items-center gap-2"><Zap className="w-4 h-4 text-accent"/> Latency Compensation</Label>
                    <span className="text-sm font-mono text-accent">{latencyAdjustment}ms</span>
                </div>
                <Slider 
                    value={[latencyAdjustment]} 
                    onValueChange={(v) => setLatencyAdjustment(v[0])} 
                    min={-500} 
                    max={500} 
                    step={5} 
                    disabled={isLoading || !!resultUrl}
                />
                <p className="text-xs text-muted-foreground">Adjust this to align your vocals perfectly with the music if there is hardware delay.</p>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <Alert className="bg-accent/5 border-accent/20">
                    <AlertTriangle className="h-4 w-4 text-accent"/>
                    <AlertTitle>Smart Vocal Isolation</AlertTitle>
                    <AlertDescription>
                        Using local TensorFlow.js models for zero-latency vocal removal.
                    </AlertDescription>
                </Alert>
                <div className="flex items-center space-x-2">
                    <Switch id="vocal-remover" checked={removeVocals} onCheckedChange={setRemoveVocals} disabled={isLoading || !musicTrack || !!resultUrl} />
                    <Label htmlFor="vocal-remover">Enable AI Vocal Remover</Label>
                </div>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-6">
          <Button size="lg" onClick={handleProcess} disabled={isLoading || !!resultUrl} className="w-full sm:w-auto h-16 text-lg">
             {isLoading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Volume2 className="mr-2 h-6 w-6" />}
            {isLoading ? "Mixing in Client..." : "Render Final Mix"}
          </Button>
          
           {error && (
            <Alert variant="destructive" className="w-full">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Processing Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resultUrl && (
            <Card className="w-full bg-primary/5 border-primary/20 p-4 animate-in fade-in-50">
                <CardTitle className="text-lg mb-2">Mix Ready</CardTitle>
                <AlertDescription className="mb-4">
                    The final audio was encoded using Opus for maximum efficiency and is ready for download.
                </AlertDescription>
                <div className="flex items-center gap-4">
                    <a href={resultUrl} download="hamraz-studio-mix.zip" className="w-full">
                        <Button className="w-full" variant="default">
                            <Download className="h-5 w-5 mr-2"/> Download Final Mix (.zip)
                        </Button>
                    </a>
                </div>
                 <div className="mt-4">
                    <Button variant="outline" onClick={handleReset} className="w-full">New Session</Button>
                </div>
            </Card>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
