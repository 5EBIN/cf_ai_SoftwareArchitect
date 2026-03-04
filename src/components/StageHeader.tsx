import { STAGE_CONFIG } from '../lib/stages';
import type { StageId } from '../lib/types';

interface StageHeaderProps {
  currentStage: StageId;
  stageAdvanced: boolean;
}

export default function StageHeader({ currentStage, stageAdvanced }: StageHeaderProps) {
  const config = STAGE_CONFIG[currentStage];

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white flex-shrink-0">
      <div className="flex items-center gap-3">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
          style={{ backgroundColor: config.bgColor, color: config.color }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: config.color }}
          />
          {config.name}
        </span>
        <span className="text-sm text-gray-400">{config.headerTitle}</span>
      </div>
      <div
        className={`transition-opacity duration-300 ${stageAdvanced ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
          ✓ Stage complete — advancing
        </span>
      </div>
    </div>
  );
}
