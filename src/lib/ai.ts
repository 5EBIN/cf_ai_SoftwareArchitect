import type { AIResponse, StageId } from './types';

const SYSTEM_PROMPT = `You are PipelineAI, an expert software engineering planning assistant.

CRITICAL: You MUST respond with ONLY valid JSON. No markdown fences, no preamble, no explanation outside JSON.

Your response must follow this exact JSON shape:
{
  "reply": "conversational response text",
  "stage": "current stage id",
  "advanceStage": true,
  "nextStage": "next stage id or null",
  "snippets": [
    { "id": "unique_id", "title": "filename", "language": "tsx", "description": "one line", "code": "..." }
  ],
  "bullets": ["key point 1", "key point 2", "key point 3"],
  "stageTitle": "short label for this stage output"
}

Stage knowledge:
- "requirements" — functional requirements, user stories, feature list, scope, user roles
- "techstack" — languages, frameworks, databases, services, justification for each choice
- "uidesign" — screen list, component hierarchy, user journey, reusable elements, layout descriptions
- "snippets" — real production-quality Next.js/React code: components, hooks, API routes, data models, utilities — tailored to chosen tech stack
- "review" — final summary, recommended build order, risks, timeline estimate, resources

Stage IDs in order: requirements → techstack → uidesign → snippets → review

Rules:
- Set "advanceStage": true only when current stage is thoroughly covered
- "snippets" can be [] during requirements and techstack stages
- Code in snippets must be realistic, well-commented, and match the project's chosen stack
- "bullets" = 3–5 key decisions or highlights per stage response
- "stage" must be the CURRENT stage (before any advancement)
- "nextStage" must be the next stage ID when advanceStage is true, otherwise null`;

export async function callAI(
  ai: Ai,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string,
  contextPrefix: string,
  currentStage: StageId
): Promise<AIResponse> {
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
    ...history,
    { role: 'user', content: `${contextPrefix}\n\n${userMessage}` },
  ];

  let rawResponse = '';
  try {
    const result = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      system: SYSTEM_PROMPT,
      messages,
      max_tokens: 2048,
    }) as { response?: string } | ReadableStream;

    if (result instanceof ReadableStream) {
      const reader = result.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        rawResponse += decoder.decode(value, { stream: true });
      }
    } else {
      rawResponse = result.response ?? '';
    }

    // Strip markdown fences if present
    const stripped = rawResponse.replace(/```json|```/g, '').trim();
    const match = stripped.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON object found in response');

    const parsed = JSON.parse(match[0]) as AIResponse;
    return parsed;
  } catch {
    return {
      reply: rawResponse || 'I encountered an issue processing your request. Please try again.',
      stage: currentStage,
      advanceStage: false,
      nextStage: null,
      snippets: [],
      bullets: [],
      stageTitle: '',
    };
  }
}
