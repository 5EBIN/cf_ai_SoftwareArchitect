import SnippetCard from './SnippetCard';
import type { Snippet } from '../lib/types';

interface SnippetsPanelProps {
  snippets: Snippet[];
  onCopyAll: () => void;
}

export default function SnippetsPanel({ snippets, onCopyAll }: SnippetsPanelProps) {
  return (
    <aside className="flex flex-col h-full bg-white border-l border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">Code Snippets</span>
          {snippets.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
              {snippets.length}
            </span>
          )}
        </div>
        {snippets.length > 0 && (
          <button
            onClick={onCopyAll}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors font-medium"
          >
            Copy all
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {snippets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl">⌘</div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Code snippets will appear here as you plan your pipeline
            </p>
          </div>
        ) : (
          snippets.map(snippet => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))
        )}
      </div>
    </aside>
  );
}
