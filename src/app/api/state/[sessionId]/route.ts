export const runtime = 'edge';

import { getRequestContext } from '@cloudflare/next-on-pages';
import type { PipelineState } from '../../../../lib/types';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { env } = getRequestContext();
    const { sessionId } = await params;

    const id = env.PIPELINE_SESSION.idFromName(sessionId);
    const stub = env.PIPELINE_SESSION.get(id);

    const res = await stub.fetch(new Request('https://do/get'));
    const state = await res.json() as PipelineState;

    return Response.json(state, { headers: corsHeaders });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500, headers: corsHeaders });
  }
}
