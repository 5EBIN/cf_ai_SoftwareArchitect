import type { PipelineState, StageId } from './types';

// In-memory store — lives for the lifetime of the Node.js dev server process
const sessions = new Map<string, PipelineState>();

function defaultState(): PipelineState {
  return {
    history: [],
    currentStage: 'requirements',
    projectName: '',
    completedStages: [],
    createdAt: Date.now(),
    lastActive: Date.now(),
  };
}

export function getSession(sessionId: string): PipelineState {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, defaultState());
  }
  return structuredClone(sessions.get(sessionId)!);
}

export function updateSession(
  sessionId: string,
  patch: {
    userMessage?: string;
    assistantMessage?: string;
    currentStage?: StageId;
    projectName?: string;
    completedStages?: StageId[];
  }
) {
  const s = getSession(sessionId);
  if (patch.userMessage) s.history.push({ role: 'user', content: patch.userMessage, timestamp: Date.now() });
  if (patch.assistantMessage) s.history.push({ role: 'assistant', content: patch.assistantMessage, timestamp: Date.now() });
  if (patch.currentStage !== undefined) s.currentStage = patch.currentStage;
  if (patch.projectName !== undefined) s.projectName = patch.projectName;
  if (patch.completedStages !== undefined) s.completedStages = patch.completedStages;
  if (s.history.length > 60) s.history = s.history.slice(-60);
  s.lastActive = Date.now();
  sessions.set(sessionId, s);
}

export function clearSession(sessionId: string) {
  sessions.set(sessionId, defaultState());
}
