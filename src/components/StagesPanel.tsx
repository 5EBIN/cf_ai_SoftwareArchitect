'use client';
import { STAGE_IDS, STAGE_CONFIG } from '../lib/stages';
import type { StageId } from '../lib/types';

interface StagesPanelProps {
  currentStage: StageId;
  completedStages: StageId[];
  onStageClick: (stage: StageId) => void;
}

export default function StagesPanel({ currentStage, completedStages, onStageClick }: StagesPanelProps) {
  const progress = Math.round((completedStages.length / STAGE_IDS.length) * 100);

  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-200 overflow-hidden">
      <div className="px-4 py-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pipeline Stages</p>
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-3">
        {STAGE_IDS.map((stageId, index) => {
          const config = STAGE_CONFIG[stageId];
          const isActive = stageId === currentStage;
          const isCompleted = completedStages.includes(stageId);
          const isLocked = !isActive && !isCompleted;
          const prevCompleted = index === 0 || completedStages.includes(STAGE_IDS[index - 1]);

          return (
            <div key={stageId} className="relative">
              {/* Connector line */}
              {index < STAGE_IDS.length - 1 && (
                <div
                  className="absolute left-6 top-10 w-0.5 h-5 z-0"
                  style={{ backgroundColor: isCompleted ? '#059669' : '#e4e7ef' }}
                />
              )}

              <button
                onClick={() => isCompleted && onStageClick(stageId)}
                disabled={isLocked}
                className={`relative z-10 w-full flex items-start gap-3 p-3 rounded-xl mb-1 text-left transition-all ${
                  isActive
                    ? 'border-l-2'
                    : isCompleted
                    ? 'hover:bg-gray-50 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={isActive ? {
                  borderLeftColor: config.color,
                  backgroundColor: config.bgColor,
                } : undefined}
              >
                <span className="text-lg flex-shrink-0 mt-0.5">{config.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: isActive ? config.color : isCompleted ? '#374151' : '#9ca3af' }}
                    >
                      {config.name}
                    </span>
                    {isActive && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: config.color, color: '#fff' }}
                      >
                        Active
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-green-100 text-green-700">
                        ✓ Done
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{config.description}</p>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-400">Progress</span>
          <span className="text-xs font-semibold text-gray-600">{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: '#059669' }}
          />
        </div>
      </div>
    </aside>
  );
}
