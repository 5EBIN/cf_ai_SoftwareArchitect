// MOCK BRANCH — no Cloudflare bindings, runs on Node.js for local UI testing
import { getSession, updateSession } from '../../../lib/mockSession';
import { getMockAIResponse } from '../../../lib/mockAI';
import { STAGE_IDS } from '../../../lib/stages';
import type { StageId, ChatAPIResponse } from '../../../lib/types';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const { message, sessionId } = await request.json() as { message: string; sessionId: string };

    const state = getSession(sessionId);
    const aiResult = getMockAIResponse(state.currentStage, message);

    let newStage: StageId = state.currentStage;
    let completedStages = [...state.completedStages];

    if (aiResult.advanceStage === true && aiResult.nextStage && STAGE_IDS.includes(aiResult.nextStage)) {
      if (!completedStages.includes(state.currentStage)) {
        completedStages.push(state.currentStage);
      }
      newStage = aiResult.nextStage;
    }

    let projectName = state.projectName;
    if (!projectName && state.history.length === 0) {
      projectName = message.slice(0, 60);
    }

    updateSession(sessionId, {
      userMessage: message,
      assistantMessage: aiResult.reply,
      currentStage: newStage,
      projectName,
      completedStages,
    });

    const response: ChatAPIResponse = {
      ...aiResult,
      stage: newStage,
      previousStage: state.currentStage,
      completedStages,
      projectName,
    };

    return Response.json(response, { headers: corsHeaders });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500, headers: corsHeaders });
  }
}
