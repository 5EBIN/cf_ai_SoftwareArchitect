import type { StageId } from './types';

export const STAGE_IDS: StageId[] = ['requirements', 'techstack', 'uidesign', 'snippets', 'review'];

export interface StageConfig {
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  headerTitle: string;
  quickPrompts: string[];
}

export const STAGE_CONFIG: Record<StageId, StageConfig> = {
  requirements: {
    name: 'Requirements',
    description: 'Features, user stories & scope',
    icon: '📋',
    color: '#2563eb',
    bgColor: '#eff4ff',
    headerTitle: 'Requirements & Functional Spec',
    quickPrompts: [
      'Describe my project idea',
      'List the core features',
      'Define user roles and permissions',
      'What are the must-have vs nice-to-have?',
    ],
  },
  techstack: {
    name: 'Tech Stack',
    description: 'Languages, frameworks & tools',
    icon: '◈',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    headerTitle: 'Technology Stack Selection',
    quickPrompts: [
      'Recommend a tech stack',
      'Should I use PostgreSQL or MongoDB?',
      'What frontend framework fits best?',
      'Compare options for my backend',
    ],
  },
  uidesign: {
    name: 'UI Design',
    description: 'Screens, components & user flow',
    icon: '🎨',
    color: '#059669',
    bgColor: '#ecfdf5',
    headerTitle: 'UI Design & User Flow',
    quickPrompts: [
      'List all screens I need',
      'Design the main dashboard layout',
      'What components will I reuse?',
      'Walk through the user journey',
    ],
  },
  snippets: {
    name: 'Code Snippets',
    description: 'Functions, components & config',
    icon: '⌘',
    color: '#d97706',
    bgColor: '#fffbeb',
    headerTitle: 'Code Snippets & Functions',
    quickPrompts: [
      'Generate the main component',
      'Show key utility functions',
      'Create the API service layer',
      'Generate data models / types',
    ],
  },
  review: {
    name: 'Review',
    description: 'Final plan & next steps',
    icon: '✦',
    color: '#dc2626',
    bgColor: '#fef2f2',
    headerTitle: 'Final Review & Next Steps',
    quickPrompts: [
      'Summarize the full plan',
      'What are the biggest risks?',
      'What should I build first?',
      'Estimate the build timeline',
    ],
  },
};
