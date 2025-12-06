

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
  Volume2,
  Building,
  Sofa,
} from "lucide-react";

export const navLinks = [
  { href: "/", label: "Chat", icon: MessageSquare },
  { href: "/tutor", label: "Tutor", icon: Book },
  { href: "/translate", label: "Translate", icon: Languages },
  { href: "/text-to-speech", label: "Voice Actor", icon: Volume2 },
  { href: "/community", label: "Community", icon: Users },
  { href: "/panel", label: "Panel", icon: Sofa },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/gamers", label: "Gamers", icon: Gamepad2 },
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
  { href: "/referrals", label: "Referrals", icon: Share2 },
  { href: "/showcase", label: "Showcase", icon: Clapperboard },
  { href: "/my-story", label: "My Story", icon: BookHeart },
  { href: "/devops", label: "DevOps", icon: Cpu },
  { href: "/live-build", label: "Live Build", icon: Server },
  { href: "/investors", label: "Investors", icon: DollarSign },
  { href: "/ai", label: "AI Interview", icon: BrainCircuit },
  { href: "/tutorial", label: "Tutorial", icon: HelpCircle },
  { href: "/anthem", label: "Anthem", icon: Music },
];

export const bottomNavLinks = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/genesis", label: "Genesis", icon: Book },
  { href: "/board", label: "Board", icon: Award },
  { href: "/pledge", label: "Pledge", icon: Handshake },
  { href: "/privacy", label: "Privacy", icon: Shield },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
];

export const creatorLinks = [
    {
        href: "#",
        label: "A City of Capabilities",
        icon: Building,
        description: "My ideas are not limited to one app. They are a collection of interconnected concepts that form a 'city of capabilities.' Hamraz is the heart of this city, and apps like Afarinan (for showcasing talent), Zabanshenas (for learning), and Karaoke (for performing) are its vital districts. This is an ever-expanding ecosystem, and more ideas will be added to complete it."
    },
    {
        href: "#",
        label: "Afarinan",
        icon: Palette,
        description: "The perfect companion to Hamraz. Use Hamraz to create projects, videos, and ideas, then showcase them on Afarinan—your professional portfolio to connect with a global community of innovators. Using both platforms together unlocks a unique world of capabilities, turning your vision into a celebrated reality."
    },
    {
        href: "#",
        label: "Zabanshenas",
        icon: Languages,
        description: "The premier language learning app. Master new languages with engaging lessons and then showcase your skills by creating content in Hamraz for your Afarinan portfolio."
    },
    {
        href: "#",
        label: "Karaoke",
        icon: Music,
        description: "Sing your heart out! Record your performances in the Karaoke app, then publish them through Hamraz to gain visibility and fans on your Afarinan profile."
    },
    {
        href: "#",
        label: "Poetry",
        icon: Feather,
        description: "A dedicated space for poetry lovers. Recite beautiful poems in this app, then use Hamraz's Text-to-Speech or Studio features to create captivating video content for your Afarinan portfolio."
    },
];

    
