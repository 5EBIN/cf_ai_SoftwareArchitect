'use client';
import { useState, useEffect } from 'react';
import { useSession } from './useSession';
import type { Message, Snippet, StageId, ChatAPIResponse } from '../lib/types';

export function usePipeline() {
  const sessionId = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [currentStage, setCurrentStage] = useState<StageId>('requirements');
  const [completedStages, setCompletedStages] = useState<StageId[]>([]);
  const [projectName, setProjectName] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [stageAdvanced, setStageAdvanced] = useState<boolean>(false);

  // Mount: add welcome message
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: '👋 Welcome to PipelineAI! I\'ll guide you through planning a complete software project.\n\nWe\'ll walk through: Requirements → Tech Stack → UI Design → Code Snippets → Review\n\nWhat are you building?',
      timestamp: Date.now(),
    }]);
  }, []);

  async function sendMessage(text: string) {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId }),
      });
      const data = await res.json() as ChatAPIResponse;

      setCurrentStage(data.stage);
      setCompletedStages(data.completedStages);
      setProjectName(data.projectName || '');

      if (data.previousStage !== data.stage) {
        setStageAdvanced(true);
        setTimeout(() => setStageAdvanced(false), 3000);
      }

      // Merge new snippets (deduplicate by id)
      if (data.snippets && data.snippets.length > 0) {
        setSnippets(prev => {
          const existingIds = new Set(prev.map(s => s.id));
          const newOnes = data.snippets.filter(s => !existingIds.has(s.id));
          return [...prev, ...newOnes];
        });
      }

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply,
        bullets: data.bullets,
        snippetCount: data.snippets?.length ?? 0,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Sorry, something went wrong: ${String(err)}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsThinking(false);
    }
  }

  async function clearSession() {
    await fetch(`/api/clear/${sessionId}`, { method: 'POST' });
    const newId = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    localStorage.setItem('pai_session', newId);
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: '👋 Welcome to PipelineAI! I\'ll guide you through planning a complete software project.\n\nWe\'ll walk through: Requirements → Tech Stack → UI Design → Code Snippets → Review\n\nWhat are you building?',
      timestamp: Date.now(),
    }]);
    setSnippets([]);
    setCurrentStage('requirements');
    setCompletedStages([]);
    setProjectName('');
    setStageAdvanced(false);
  }

  async function saveProject() {
    await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        data: { projectName, currentStage, completedStages, snippets },
      }),
    });
  }

  return {
    messages,
    snippets,
    currentStage,
    completedStages,
    projectName,
    isThinking,
    stageAdvanced,
    sendMessage,
    clearSession,
    saveProject,
    sessionId,
    setCurrentStage,
  };
}
