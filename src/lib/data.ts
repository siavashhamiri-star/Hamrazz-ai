
import {
  Award,
  Book,
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
} from "lucide-react";

export const navLinks = [
  { href: "/", label: "Chat", icon: MessageSquare },
  { href: "/tutor", label: "Tutor", icon: Book },
  { href: "/translate", label: "Translate", icon: Languages },
  { href: "/community", label: "Community", icon: Users },
  { href: "/channels", label: "Channels", icon: PlaySquare },
  { href: "/dubbing", label: "Dubbing", icon: Mic },
  { href: "/lipsync", label: "Lip Sync", icon: MicVocal },
  { href: "/contest", label: "Contest", icon: Palette },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/pitch", label: "Pitch Idea", icon: Lightbulb },
  { href: "/collaborate", label: "Collaborate", icon: Handshake },
  { href: "/camera", label: "Camera", icon: Camera },
  { href: "/feedback", label: "Feedback", icon: Lightbulb },
  { href: "/ads", label: "Advertisements", icon: Film },
  { href: "/showcase", label: "Showcase", icon: Trophy },
];

export const bottomNavLinks = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/board", label: "Board", icon: Award },
  { href: "/privacy", label: "Privacy", icon: Shield },
];

    
    