'use client';
import { useRef, useEffect, useState, KeyboardEvent } from 'react';
import MessageBubble from './MessageBubble';
import StageHeader from './StageHeader';
import { STAGE_CONFIG } from '../lib/stages';
import type { Message, StageId } from '../lib/types';

interface ChatPanelProps {
  messages: Message[];
  currentStage: StageId;
  stageAdvanced: boolean;
  isThinking: boolean;
  onSendMessage: (text: string) => void;
}

export default function ChatPanel({
  messages,
  currentStage,
  stageAdvanced,
  isThinking,
  onSendMessage,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const config = STAGE_CONFIG[currentStage];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  function handleSend() {
    const text = input.trim();
    if (!text || isThinking) return;
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    onSendMessage(text);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      <StageHeader currentStage={currentStage} stageAdvanced={stageAdvanced} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex gap-2.5 mb-4 animate-fade-up">
            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 mt-0.5">
              AI
            </div>
            <div className="bg-white border border-gray-200 rounded-xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-5 pb-2 flex gap-2 flex-wrap">
        {config.quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSendMessage(prompt)}
            disabled={isThinking}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="px-4 pb-4">
        <div
          className="flex items-end gap-2 bg-white border-2 rounded-2xl p-2 transition-colors shadow-sm focus-within:shadow-md"
          style={{ borderColor: 'transparent' }}
          onFocus={() => {}}
        >
          <div
            className="flex-1 flex items-end gap-2 rounded-xl border-2 transition-colors"
            style={{ borderColor: 'transparent' }}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              placeholder="Ask PipelineAI anything..."
              disabled={isThinking}
              className="flex-1 resize-none bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 py-1.5 px-3 max-h-28 leading-relaxed disabled:opacity-50"
              style={{ minHeight: '36px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
            style={{ backgroundColor: config.color }}
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
