import type { Message } from '../lib/types';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex gap-2.5 mb-4 animate-fade-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-white border-2 border-gray-200 text-gray-500'
        }`}
      >
        {isUser ? 'U' : 'AI'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-blue-600 text-white rounded-xl rounded-br-sm'
              : 'bg-white border border-gray-200 text-gray-800 rounded-xl rounded-bl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

          {/* Bullets (assistant only) */}
          {!isUser && message.bullets && message.bullets.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-1.5">
              {message.bullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-blue-600">
                  <span className="flex-shrink-0 mt-0.5">→</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          )}

          {/* Snippet tag (assistant only) */}
          {!isUser && message.snippetCount !== undefined && message.snippetCount > 0 && (
            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                ⌘ {message.snippetCount} snippet{message.snippetCount > 1 ? 's' : ''} added to panel
              </span>
            </div>
          )}
        </div>
        <span className="text-xs text-gray-400 px-1">{time}</span>
      </div>
    </div>
  );
}
