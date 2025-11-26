import {
  Book,
  Gamepad2,
  Languages,
  MessageSquare,
  Shield,
  User,
  Users,
} from "lucide-react";

export const navLinks = [
  { href: "/", label: "Chat", icon: MessageSquare },
  { href: "/tutor", label: "Tutor", icon: Book },
  { href: "/translate", label: "Translate", icon: Languages },
  { href: "/community", label: "Community", icon: Users },
  { href: "/games", label: "Games", icon: Gamepad2 },
];

export const bottomNavLinks = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/privacy", label: "Privacy", icon: Shield },
];
