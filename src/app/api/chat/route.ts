export const runtime = 'edge';

import { getRequestContext } from '@cloudflare/next-on-pages';
import { callAI } from '../../../lib/ai';
import { STAGE_IDS } from '../../../lib/stages';
import type { PipelineState, StageId, ChatAPIResponse } from '../../../lib/types';

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
    const { env } = getRequestContext();
    const { message, sessionId } = await request.json() as { message: string; sessionId: string };

    const id = env.PIPELINE_SESSION.idFromName(sessionId);
    const stub = env.PIPELINE_SESSION.get(id);

    const stateRes = await stub.fetch(new Request('https://do/get'));
    const state = await stateRes.json() as PipelineState;

    const recentHistory = state.history.slice(-12).map(h => ({
      role: h.role,
      content: h.content,
    }));

    const contextPrefix = `[Project: "${state.projectName || 'unnamed'}" | Stage: ${state.currentStage} | Completed: ${state.completedStages.join(', ') || 'none'}]`;

    const aiResult = await callAI(env.AI, recentHistory, message, contextPrefix, state.currentStage);

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

    await stub.fetch(new Request('https://do/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userMessage: message,
        assistantMessage: aiResult.reply,
        currentStage: newStage,
        projectName,
        completedStages,
      }),
    }));

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
