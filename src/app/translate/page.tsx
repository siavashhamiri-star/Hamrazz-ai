"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { translateUserMessage, TranslateUserMessageInput } from "@/ai/flows/translate-user-messages-flow";

export default function TranslatePage() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState<"en" | "fa">("en");
  const [targetLang, setTargetLang] = useState<"en" | "fa">("fa");
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsLoading(true);
    setTranslatedText("");
    try {
      const input: TranslateUserMessageInput = {
        text: sourceText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      };
      const result = await translateUserMessage(input);
      setTranslatedText(result.translatedText);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText("Sorry, an error occurred during translation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-headline">Translate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex items-center gap-2">
                <p className="text-sm font-medium">From:</p>
                <Select value={sourceLang} onValueChange={(value: "en" | "fa") => setSourceLang(value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fa">Persian</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="hidden md:flex justify-center">
                <Button variant="ghost" size="icon" onClick={handleSwapLanguages}>
                    <ArrowRightLeft className="h-5 w-5 text-muted-foreground"/>
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-sm font-medium">To:</p>
                <Select value={targetLang} onValueChange={(value: "en" | "fa") => setTargetLang(value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fa">Persian</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea
            placeholder="Enter text to translate..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="min-h-[200px] text-base"
          />
          <div className="relative min-h-[200px] rounded-md border bg-muted p-3">
             <Textarea
                readOnly
                placeholder={isLoading ? "Translating..." : "Translation will appear here..."}
                value={translatedText}
                className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-full resize-none text-base"
            />
            {isLoading && (
                 <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={handleTranslate} disabled={isLoading || !sourceText.trim()} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Translating...
              </>
            ) : (
              "Translate Text"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
