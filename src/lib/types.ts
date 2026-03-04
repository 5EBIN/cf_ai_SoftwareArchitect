export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  bullets?: string[];
  snippetCount?: number;
  timestamp: number;
}

export interface Snippet {
  id: string;
  title: string;
  language: string;
  description: string;
  code: string;
}

export interface PipelineState {
  history: Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }>;
  currentStage: StageId;
  projectName: string;
  completedStages: StageId[];
  createdAt: number;
  lastActive: number;
}

export type StageId = 'requirements' | 'techstack' | 'uidesign' | 'snippets' | 'review';

export interface AIResponse {
  reply: string;
  stage: StageId;
  advanceStage: boolean;
  nextStage: StageId | null;
  snippets: Snippet[];
  bullets: string[];
  stageTitle: string;
}

export interface ChatAPIResponse extends AIResponse {
  previousStage: StageId;
  completedStages: StageId[];
  projectName: string;
}
