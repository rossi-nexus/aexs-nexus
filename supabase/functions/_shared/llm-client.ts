// LLM gateway abstraction.
// Prefers direct Google AI (Gemini via OpenAI-compat endpoint) when GOOGLE_API_KEY is set.
// Falls back to the Lovable AI Gateway if only LOVABLE_API_KEY is set — this keeps
// backward compatibility during the Lovable → Vercel migration. Post-cutover, only
// GOOGLE_API_KEY should be configured on the new Supabase project.
//
// Also exports `getLLMConfig()` and `normalizeModel()` so direct-caller edge functions
// (the ones not yet migrated to `callLLM()`) can use the same routing logic without
// a full refactor.

const GATEWAY_URLS = {
  google: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
  lovable: "https://ai.gateway.lovable.dev/v1/chat/completions",
} as const;

export type LLMProvider = "google" | "lovable";

export interface LLMConfig {
  url: string;
  apiKey: string;
  providerHint: LLMProvider;
}

/**
 * Returns the current LLM gateway config based on env vars.
 * Prefers Google direct (post-migration). Falls back to Lovable gateway if only that key exists.
 * Throws if neither key is configured.
 */
export function getLLMConfig(): LLMConfig {
  const googleKey = Deno.env.get("GOOGLE_API_KEY");
  if (googleKey) {
    return { url: GATEWAY_URLS.google, apiKey: googleKey, providerHint: "google" };
  }
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  if (lovableKey) {
    return { url: GATEWAY_URLS.lovable, apiKey: lovableKey, providerHint: "lovable" };
  }
  throw new LLMError(
    "No LLM API key configured (need GOOGLE_API_KEY or LOVABLE_API_KEY)",
    500,
    "",
  );
}

/**
 * Adapts a model string to the current provider.
 * - Google direct: strips the "google/" prefix (Lovable used OpenRouter-style prefixing;
 *   Google's native endpoint expects bare model names like "gemini-2.5-flash").
 * - Lovable: passes through unchanged.
 */
export function normalizeModel(model: string, provider: LLMProvider): string {
  if (provider === "google" && model.startsWith("google/")) {
    return model.slice("google/".length);
  }
  return model;
}

export interface LLMMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
}

export interface LLMTool {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters: Record<string, unknown>;
  };
}

export interface CallLLMOptions {
  model: string;
  messages: LLMMessage[];
  tools?: LLMTool[];
  tool_choice?: unknown;
  max_tokens?: number;
  reasoning?: { effort: "low" | "medium" | "high" };
  /** Tag used for logging only. */
  requestKind?: string;
}

export interface LLMResult {
  raw: any;
  text: string;
  toolCall: { name: string; arguments: any } | null;
}

export class LLMError extends Error {
  status: number;
  body: string;
  constructor(message: string, status: number, body: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function callLLM(opts: CallLLMOptions): Promise<LLMResult> {
  const { url, apiKey, providerHint } = getLLMConfig();
  const model = normalizeModel(opts.model, providerHint);

  const body: Record<string, unknown> = {
    model,
    messages: opts.messages,
    max_tokens: opts.max_tokens ?? 4096,
  };
  // `reasoning` is an OpenRouter/Lovable extension; Google's OpenAI-compat endpoint
  // rejects it with HTTP 400. Only pass it through for the Lovable gateway.
  if (opts.reasoning && providerHint === "lovable") body.reasoning = opts.reasoning;
  if (opts.tools) body.tools = opts.tools;
  if (opts.tool_choice) body.tool_choice = opts.tool_choice;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new LLMError(
      `LLM gateway (${providerHint}) returned ${resp.status} (${opts.requestKind ?? "llm"})`,
      resp.status,
      text,
    );
  }

  const data = await resp.json();
  const choice = data?.choices?.[0];
  const msg = choice?.message ?? {};
  const text: string = typeof msg.content === "string" ? msg.content : "";
  let toolCall: { name: string; arguments: any } | null = null;
  const tc = Array.isArray(msg.tool_calls) ? msg.tool_calls[0] : undefined;
  if (tc?.function?.name) {
    let args: any = {};
    try {
      args = typeof tc.function.arguments === "string"
        ? JSON.parse(tc.function.arguments)
        : tc.function.arguments ?? {};
    } catch {
      args = {};
    }
    toolCall = { name: tc.function.name, arguments: args };
  }

  return { raw: data, text, toolCall };
}
