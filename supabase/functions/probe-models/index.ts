import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const key = Deno.env.get("GOOGLE_API_KEY");
  if (!key) return new Response(JSON.stringify({ error: "no GOOGLE_API_KEY" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }});

  const results: Record<string, unknown> = {};

  // 1. List models via OpenAI-compat
  try {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/models", {
      headers: { Authorization: `Bearer ${key}` },
    });
    const j = await r.json();
    results.oaiModels = { status: r.status, count: j?.data?.length, names: j?.data?.map((m: any) => m.id).slice(0, 40) };
  } catch (e) { results.oaiModels = { err: String(e) }; }

  // 2. Try invoking gemini-2.5-pro
  try {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gemini-2.5-pro", messages: [{ role: "user", content: "ping" }], max_tokens: 8 }),
    });
    results.probe25pro = { status: r.status, body: (await r.text()).slice(0, 500) };
  } catch (e) { results.probe25pro = { err: String(e) }; }

  // 3. Try gemini-2.5-flash
  try {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gemini-2.5-flash", messages: [{ role: "user", content: "ping" }], max_tokens: 8 }),
    });
    results.probe25flash = { status: r.status, body: (await r.text()).slice(0, 500) };
  } catch (e) { results.probe25flash = { err: String(e) }; }

  return new Response(JSON.stringify(results, null, 2), { headers: { ...corsHeaders, "Content-Type": "application/json" }});
});
