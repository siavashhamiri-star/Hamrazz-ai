import { cn } from "@/lib/utils";

export default function SoundcloudIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
    >
      <path d="M17.5 12c0-2.5-2-4.5-4.5-4.5S8.5 9.5 8.5 12" />
      <path d="M15 12v4.5" />
      <path d="M12.5 16.5h-5" />
      <path d="M9 16.5v-2" />
      <path d="M6.5 14.5v-1" />
      <path d="M4 13.5v-1" />
    </svg>
  );
}
