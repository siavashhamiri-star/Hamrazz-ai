
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
} from "lucide-react";

export const navLinks = [
  { href: "/", label: "Chat", icon: MessageSquare },
  { href: "/tutor", label: "Tutor", icon: Book },
  { href: "/translate", label: "Translate", icon: Languages },
  { href: "/community", label: "Community", icon: Users },
  { href: "/channels", label: "Channels", icon: PlaySquare },
  { href: "/dubbing", label: "Dubbing", icon: Mic },
  { href: "/lipsync", label: "Lip Sync", icon: MicVocal },
  { href: "/contest", label: "Hall of Fame", icon: Award },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/pitch", label: "Pitch Idea", icon: Lightbulb },
  { href: "/collaborate", label: "Collaborate", icon: Handshake },
  { href: "/investors", label: "Investors", icon: DollarSign },
  { href: "/camera", label: "Camera", icon: Camera },
  { href: "/poetry", label: "Poetry", icon: Feather },
  { href: "/antics", label: "Antics", icon: SmilePlus },
  { href: "/moments", label: "Moments", icon: Heart },
  { href: "/gratitude", label: "Gratitude", icon: Sunrise },
  { href: "/dreams", label: "Dreams", icon: Cloud },
  { href: "/pets", label: "Pets & Kids", icon: PawPrint },
  { href: "/feedback", label: "Feedback", icon: Lightbulb },
  { href: "/ads", label: "Advertisements", icon: Film },
  { href: "/genesis", label: "Genesis", icon: Book },
  { href: "/showcase", label: "Showcase", icon: Trophy },
  { href: "/sync", label: "Sync & Tools", icon: Share2 },
  { href: "/magic-repo", label: "Magic Repo", icon: Wand2 },
];

export const bottomNavLinks = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/board", label: "Board", icon: Award },
  { href: "/privacy", label: "Privacy", icon: Shield },
];

export const creatorLinks = [
    { 
        href: "#", 
        label: "Creative Suite", 
        icon: Palette, 
        description: "An all-in-one suite for digital artists and designers." 
    },
    { 
        href: "#", 
        label: "DevKit", 
        icon: Terminal, 
        description: "A collection of powerful tools for modern developers." 
    },
];
