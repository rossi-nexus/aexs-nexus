import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const key = Deno.env.get("GOOGLE_API_KEY");
  if (!key) return new Response("no key", { status: 500 });
  const trials: Record<string, unknown> = {};
  const OAI = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
  const tryModel = async (label: string, model: string) => {
    const r = await fetch(OAI, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: [{ role: "user", content: "say ok" }], max_tokens: 8 }),
    });
    trials[label] = { status: r.status, body: (await r.text()).slice(0, 300) };
  };
  await tryModel("bare_25pro", "gemini-2.5-pro");
  await tryModel("prefixed_25pro", "models/gemini-2.5-pro");
  await tryModel("bare_25flash", "gemini-2.5-flash");
  await tryModel("prefixed_25flash", "models/gemini-2.5-flash");
  await tryModel("bare_15flash", "gemini-1.5-flash");
  await tryModel("bare_20flash", "gemini-2.0-flash");
  return new Response(JSON.stringify(trials, null, 2), { headers: { ...cors, "Content-Type": "application/json" }});
});
