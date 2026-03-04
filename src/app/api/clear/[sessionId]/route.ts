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

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { env } = getRequestContext();
    const { sessionId } = await params;

    const id = env.PIPELINE_SESSION.idFromName(sessionId);
    const stub = env.PIPELINE_SESSION.get(id);

    await stub.fetch(new Request('https://do/clear', { method: 'POST' }));

    return Response.json({ ok: true }, { headers: corsHeaders });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500, headers: corsHeaders });
  }
}
