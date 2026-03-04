'use client';
import { useState } from 'react';
import type { Snippet } from '../lib/types';

interface SnippetCardProps {
  snippet: Snippet;
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mb-3">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-gray-800 truncate">{snippet.title}</span>
          <span className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-mono font-medium bg-blue-100 text-blue-700">
            {snippet.language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 ml-2 text-xs px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {copied ? 'copied!' : 'Copy'}
        </button>
      </div>
      {/* Description */}
      {snippet.description && (
        <p className="px-4 py-2 text-xs text-gray-400 italic border-b border-gray-100">{snippet.description}</p>
      )}
      {/* Code */}
      <div className="overflow-x-auto max-h-56">
        <pre className="p-4 text-xs font-mono text-gray-700 bg-slate-50 leading-relaxed">
          <code>{snippet.code}</code>
        </pre>
      </div>
    </div>
  );
}
