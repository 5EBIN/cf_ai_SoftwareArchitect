import type { PipelineState, StageId } from './types';

export class PipelineSession implements DurableObject {
  private state: DurableObjectState;
  private data: PipelineState | null = null;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/get') {
      let pipeline = await this.state.storage.get<PipelineState>('pipeline');
      if (!pipeline) {
        pipeline = {
          history: [],
          currentStage: 'requirements' as StageId,
          projectName: '',
          completedStages: [],
          createdAt: Date.now(),
          lastActive: Date.now(),
        };
        await this.state.storage.put('pipeline', pipeline);
      }
      this.data = pipeline;
      return Response.json(pipeline);
    }

    if (request.method === 'POST' && url.pathname === '/update') {
      const body = await request.json() as {
        userMessage?: string;
        assistantMessage?: string;
        currentStage?: StageId;
        projectName?: string;
        completedStages?: StageId[];
      };

      let pipeline = await this.state.storage.get<PipelineState>('pipeline') ?? {
        history: [],
        currentStage: 'requirements' as StageId,
        projectName: '',
        completedStages: [],
        createdAt: Date.now(),
        lastActive: Date.now(),
      };

      if (body.userMessage) {
        pipeline.history.push({ role: 'user', content: body.userMessage, timestamp: Date.now() });
      }
      if (body.assistantMessage) {
        pipeline.history.push({ role: 'assistant', content: body.assistantMessage, timestamp: Date.now() });
      }
      if (body.currentStage !== undefined) {
        pipeline.currentStage = body.currentStage;
      }
      if (body.projectName !== undefined) {
        pipeline.projectName = body.projectName;
      }
      if (body.completedStages !== undefined) {
        pipeline.completedStages = body.completedStages;
      }

      // Cap history at 60 entries
      if (pipeline.history.length > 60) {
        pipeline.history = pipeline.history.slice(-60);
      }
      pipeline.lastActive = Date.now();

      await this.state.storage.put('pipeline', pipeline);
      return Response.json({ ok: true });
    }

    if (request.method === 'POST' && url.pathname === '/clear') {
      const defaultState: PipelineState = {
        history: [],
        currentStage: 'requirements' as StageId,
        projectName: '',
        completedStages: [],
        createdAt: Date.now(),
        lastActive: Date.now(),
      };
      await this.state.storage.put('pipeline', defaultState);
      return Response.json({ ok: true });
    }

    return new Response('Not found', { status: 404 });
  }
}
