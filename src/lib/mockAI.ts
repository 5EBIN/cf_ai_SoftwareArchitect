import type { AIResponse, StageId } from './types';

const STAGE_ORDER: StageId[] = ['requirements', 'techstack', 'uidesign', 'snippets', 'review'];

const MOCK_RESPONSES: Record<StageId, AIResponse> = {
  requirements: {
    reply:
      "Great idea! Let me help you define the requirements. Based on what you've shared, here are the core functional requirements for your project. I'll capture the user stories, key features, and scope boundaries. Once we've nailed down what we're building, we can move on to choosing the right tech stack.",
    stage: 'requirements',
    advanceStage: true,
    nextStage: 'techstack',
    snippets: [],
    bullets: [
      'Core feature set defined — authentication, data management, dashboard',
      'User roles identified — Admin, Member, Guest with distinct permissions',
      'MVP scope locked: excludes real-time sync and mobile app in v1',
      'Non-functional requirements: <200ms API response, 99.9% uptime target',
    ],
    stageTitle: 'Requirements & Scope',
  },
  techstack: {
    reply:
      "Based on your requirements, here's my recommended tech stack. I've chosen tools that balance developer experience, scalability, and ecosystem maturity. This stack will let you move fast while keeping the architecture clean.",
    stage: 'techstack',
    advanceStage: true,
    nextStage: 'uidesign',
    snippets: [],
    bullets: [
      'Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS',
      'Backend: Next.js API Routes on Cloudflare Edge Workers',
      'Database: Cloudflare D1 (SQLite at edge) + Drizzle ORM',
      'Auth: Clerk — handles sessions, OAuth, and MFA out of the box',
      'Deployment: Cloudflare Pages with CI/CD via GitHub Actions',
    ],
    stageTitle: 'Technology Stack',
  },
  uidesign: {
    reply:
      "Here's the complete UI structure for your app. I've mapped out all screens, the component hierarchy, and the primary user journey from onboarding to the core workflow.",
    stage: 'uidesign',
    advanceStage: true,
    nextStage: 'snippets',
    snippets: [],
    bullets: [
      '5 main screens: Landing, Auth, Dashboard, Detail View, Settings',
      'Shared component library: Button, Card, Modal, DataTable, Sidebar',
      'User journey: Sign up → Onboarding wizard → Dashboard → Core action',
      'Responsive layout: sidebar nav on desktop, bottom tab bar on mobile',
    ],
    stageTitle: 'UI Design & Flow',
  },
  snippets: {
    reply:
      "Here are the key code snippets for your project — the main layout component, a data fetching hook, and the API route pattern. These are production-ready and follow the conventions of your chosen stack.",
    stage: 'snippets',
    advanceStage: true,
    nextStage: 'review',
    snippets: [
      {
        id: 'mock-layout',
        title: 'app/layout.tsx',
        language: 'tsx',
        description: 'Root layout with auth provider and global styles',
        code: `import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with Next.js + Cloudflare',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}`,
      },
      {
        id: 'mock-hook',
        title: 'hooks/useData.ts',
        language: 'ts',
        description: 'Generic data fetching hook with loading and error state',
        code: `'use client';
import { useState, useEffect } from 'react';

export function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json() as Promise<T>;
      })
      .then(setData)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}`,
      },
      {
        id: 'mock-api',
        title: 'app/api/items/route.ts',
        language: 'ts',
        description: 'Edge API route — list and create items',
        code: `export const runtime = 'edge';
import { getRequestContext } from '@cloudflare/next-on-pages';

export async function GET() {
  const { env } = getRequestContext();
  const items = await env.DB.prepare('SELECT * FROM items ORDER BY created_at DESC').all();
  return Response.json(items.results);
}

export async function POST(req: Request) {
  const { env } = getRequestContext();
  const { name } = await req.json() as { name: string };
  await env.DB.prepare('INSERT INTO items (name, created_at) VALUES (?, ?)')
    .bind(name, Date.now())
    .run();
  return Response.json({ ok: true }, { status: 201 });
}`,
      },
    ],
    bullets: [
      'Root layout wired with ClerkProvider for auth context',
      'Generic useData hook — reusable across all data-fetching components',
      'Edge API route pattern for D1 database access',
      'All snippets follow project conventions — edge runtime, TypeScript strict',
    ],
    stageTitle: 'Code Snippets',
  },
  review: {
    reply:
      "Here's your complete project plan. You have a solid, production-ready architecture. I've summarised the build order, flagged the main risks, and estimated a realistic timeline for an indie developer or small team.",
    stage: 'review',
    advanceStage: false,
    nextStage: null,
    snippets: [],
    bullets: [
      'Build order: Auth → DB schema → API routes → UI components → Polish',
      'Biggest risk: Cloudflare D1 query limits on free tier — monitor early',
      'Timeline estimate: 3–4 weeks solo, 1–2 weeks with a team of 2',
      'Next step: Run `npm create cloudflare@latest` and wire up Clerk',
    ],
    stageTitle: 'Final Review',
  },
};

export function getMockAIResponse(currentStage: StageId, userMessage: string): AIResponse {
  const base = MOCK_RESPONSES[currentStage];
  // Add a touch of the user's message into the reply to feel responsive
  const preview = userMessage.length > 40 ? userMessage.slice(0, 40) + '...' : userMessage;
  return {
    ...base,
    reply: `[MOCK] You said: "${preview}"\n\n${base.reply}`,
  };
}
