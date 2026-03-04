'use client';
import { usePipeline } from '../hooks/usePipeline';
import StagesPanel from '../components/StagesPanel';
import ChatPanel from '../components/ChatPanel';
import SnippetsPanel from '../components/SnippetsPanel';

export default function Home() {
  const {
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
  } = usePipeline();

  function handleCopyAll() {
    const text = snippets.map(s => `// ── ${s.title} (${s.language}) ──\n${s.code}`).join('\n\n');
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="grid h-screen overflow-hidden"
      style={{ gridTemplateRows: '56px 1fr', gridTemplateColumns: '240px 1fr 340px' }}
    >
      {/* Header */}
      <header className="col-span-3 flex items-center justify-between px-5 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-base">PipelineAI</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-600 max-w-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <span className="truncate">{projectName || 'No project — describe yours to get started'}</span>
          </div>
          <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
            {sessionId.slice(0, 8)}
          </span>
          <button
            onClick={() => { if (window.confirm('Start new project? This will clear the current session.')) clearSession(); }}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            New Project
          </button>
          <button
            onClick={saveProject}
            className="text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          >
            Save Plan
          </button>
        </div>
      </header>

      <StagesPanel
        currentStage={currentStage}
        completedStages={completedStages}
        onStageClick={setCurrentStage}
      />

      <ChatPanel
        messages={messages}
        currentStage={currentStage}
        stageAdvanced={stageAdvanced}
        isThinking={isThinking}
        onSendMessage={sendMessage}
      />

      <SnippetsPanel snippets={snippets} onCopyAll={handleCopyAll} />
    </div>
  );
}
