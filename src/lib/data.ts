import {
  Award,
  Book,
  Gamepad2,
  Languages,
  MessageSquare,
  Palette,
  Shield,
  Star,
  User,
  Users,
} from "lucide-react";

export const navLinks = [
  { href: "/", label: "Chat", icon: MessageSquare },
  { href: "/tutor", label: "Tutor", icon: Book },
  { href: "/translate", label: "Translate", icon: Languages },
  { href: "/community", label: "Community", icon: Users },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/contest", label: "Contest", icon: Palette },
  { href: "/feedback", label: "Feedback", icon: Star },
];

export const bottomNavLinks = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/board", label: "Board", icon: Award },
  { href: "/privacy", label: "Privacy", icon: Shield },
];
