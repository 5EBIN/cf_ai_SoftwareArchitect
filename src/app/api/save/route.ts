export const runtime = 'edge';

import { getRequestContext } from '@cloudflare/next-on-pages';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const { env } = getRequestContext();
    const { sessionId, data } = await request.json() as { sessionId: string; data: unknown };

    await env.PIPELINE_KV.put(
      'pipeline_' + sessionId,
      JSON.stringify({ data, savedAt: Date.now() })
    );

    return Response.json({ ok: true }, { headers: corsHeaders });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500, headers: corsHeaders });
  }
}
