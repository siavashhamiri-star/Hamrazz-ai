
import {
  Award,
  Book,
  Feather,
  Gamepad2,
  Languages,
  Lightbulb,
  MessageSquare,
  Shield,
  Megaphone,
  User,
  Users,
  Handshake,
  Camera,
  Trophy,
  PlaySquare,
  Film,
  Mic,
  Palette,
  MicVocal,
  SmilePlus,
  Heart,
  Sunrise,
  Cloud,
  PawPrint,
  Terminal,
  DollarSign,
  Share2,
  Wand2,
  FileArchive,
  Cpu,
  Clapperboard,
  BookHeart,
  FileVideo,
  HelpCircle,
  RadioTower,
  BrainCircuit,
  Server,
  Music,
} from "lucide-react";

export const navLinks = [
  { href: "/", label: "Chat", icon: MessageSquare },
  { href: "/tutor", label: "Tutor", icon: Book },
  { href: "/translate", label: "Translate", icon: Languages },
  { href: "/community", label: "Community", icon: Users },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/channels", label: "Channels", icon: PlaySquare },
  { href: "/camera", label: "Studio", icon: RadioTower },
  { href: "/contest", label: "Hall of Fame", icon: Award },
  { href: "/dubbing", label: "Dubbing", icon: Mic },
  { href: "/lipsync", label: "Lip Sync", icon: MicVocal },
  {
    href: "/magic-repo",
    label: "Magic Repo",
    icon: Wand2,
  },
  { href: "/transcribe-video", label: "Transcribe", icon: FileVideo },
  {
    href: "/pitch",
    label: "Pitch Idea",
    icon: Lightbulb,
  },
  { href: "/collaborate", label: "Collaborate", icon: Handshake },
  { href: "/ads", label: "Ads", icon: Megaphone },
  { href: "/showcase", label: "Showcase", icon: Clapperboard },
  { href: "/my-story", label: "My Story", icon: BookHeart },
  { href: "/devops", label: "DevOps", icon: Cpu },
  { href: "/live-build", label: "Live Build", icon: Server },
  { href: "/investors", label: "Investors", icon: DollarSign },
  { href: "/ai", label: "AI Interview", icon: BrainCircuit },
  { href: "/tutorial", label: "Tutorial", icon: HelpCircle },
];

export const bottomNavLinks = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/genesis", label: "Genesis", icon: Book },
  { href: "/board", label: "Board", icon: Award },
  { href: "/privacy", label: "Privacy", icon: Shield },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
];

export const creatorLinks = [
    {
        href: "#",
        label: "Afarinan",
        icon: Palette,
        description: "The platform for creators. Showcase your portfolio and connect with a global community of innovators."
    },
    {
        href: "#",
        label: "Zabanshenas",
        icon: Languages,
        description: "The premier language learning app. Master new languages with engaging lessons and AI-powered tools."
    },
    {
        href: "#",
        label: "Karaoke",
        icon: Music,
        description: "Sing your heart out! The ultimate karaoke app with a vast library of songs and fun features."
    },
];
