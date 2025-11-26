"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";
import { useUserProfile } from "@/hooks/use-user-profile";

const avatars = PlaceHolderImages.filter(img => img.id.startsWith("avatar-"));

export default function ProfilePage() {
  const { user } = useUser();
  const { userProfile, updateUserProfile, loading } = useUserProfile(user?.uid);

  const handleSelectAvatar = (avatarId: string) => {
    if (updateUserProfile) {
      updateUserProfile({ selectedAvatarId: avatarId });
    }
  };
  
  if (loading) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
    )
  }

  if (!user) {
    return (
        <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Please Sign In</CardTitle>
                <CardDescription>You need to be signed in to view and edit your profile.</CardDescription>
            </CardHeader>
        </Card>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Select Your AI Companion</CardTitle>
        <CardDescription>Choose the avatar you'd like to interact with.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              className="relative cursor-pointer group"
              onClick={() => handleSelectAvatar(avatar.id)}
            >
              <Avatar className={cn(
                "w-full h-auto aspect-square rounded-lg border-4 transition-all",
                userProfile?.selectedAvatarId === avatar.id ? "border-primary" : "border-transparent group-hover:border-primary/50"
              )}>
                <AvatarImage src={avatar.imageUrl} alt={avatar.description} data-ai-hint={avatar.imageHint} />
                <AvatarFallback>{avatar.id.slice(-2)}</AvatarFallback>
              </Avatar>
              {userProfile?.selectedAvatarId === avatar.id && (
                <div className="absolute -top-2 -right-2 bg-background rounded-full">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
