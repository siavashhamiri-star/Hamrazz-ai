
"use client";

import { useEffect } from "react";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // As the owner, you are auto-signed-in.
    // This page will redirect you to the homepage.
    if (!loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <h1 className="text-xl font-bold font-headline mt-4">
          Signing in as Owner...
        </h1>
      </div>
    </div>
  );
}
