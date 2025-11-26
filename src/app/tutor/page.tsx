"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generatePersonalizedLessons, GeneratePersonalizedLessonsOutput } from "@/ai/flows/generate-personalized-lessons-flow";
import { Loader2, Sparkles } from "lucide-react";

const formSchema = z.object({
  language: z.enum(["Persian", "English"]),
  skillLevel: z.string().min(1, "Please enter your skill level."),
  learningGoals: z.string().min(1, "Please enter your learning goals."),
  gradeLevel: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function TutorPage() {
  const [lesson, setLesson] = useState<GeneratePersonalizedLessonsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "Persian",
      skillLevel: "Beginner",
      learningGoals: "Basic conversation and vocabulary",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setLesson(null);
    try {
      const result = await generatePersonalizedLessons(values);
      setLesson(result);
    } catch (error) {
      console.error("Error generating lesson:", error);
      // You could show a toast notification here
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Create Your Lesson</CardTitle>
            <CardDescription>
              Tell us what you want to learn, and our AI tutor will create a personalized lesson for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Persian">Persian</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="skillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Level</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Beginner, Intermediate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="learningGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Learning Goals</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Grammar, Vocabulary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gradeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade Level (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 6-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Lesson
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Generating your personalized lesson...</p>
            </div>
          </div>
        )}
        {lesson && (
          <Card className="shadow-lg animate-in fade-in-50">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">{lesson.lessonTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Lesson Content</h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{lesson.lessonContent}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Exercises</h3>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  {lesson.exercises.map((exercise, index) => (
                    <li key={index}>{exercise}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline">Start Practice Session</Button>
            </CardFooter>
          </Card>
        )}
        {!isLoading && !lesson && (
          <div className="flex items-center justify-center h-full rounded-lg border-2 border-dashed">
            <div className="text-center p-8">
              <Sparkles className="mx-auto h-12 w-12 text-muted" />
              <p className="mt-4 text-muted-foreground">Your generated lesson will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
