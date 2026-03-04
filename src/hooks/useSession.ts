'use client';
import { useState } from 'react';

export function useSession(): string {
  const [sessionId] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    const stored = localStorage.getItem('pai_session');
    if (stored) return stored;
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    localStorage.setItem('pai_session', id);
    return id;
  });
  return sessionId;
}
