import { config } from 'dotenv';
config();

import '@/ai/flows/translate-user-messages-flow.ts';
import '@/ai/flows/generate-personalized-lessons-flow.ts';
import '@/ai/flows/summarize-lesson-content.flow.ts';
import '@/ai/flows/reason-about-sources-flow.ts';
import '@/ai/flows/generate-avatar-expressions-flow.ts';
import '@/ai/flows/transcribe-video-flow.ts';
import '@/ai/flows/generate-showcase-video-flow.ts';
import '@/ai/flows/generate-project-structure-flow.ts';
