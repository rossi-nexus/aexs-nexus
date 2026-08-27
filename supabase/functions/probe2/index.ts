import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const key = Deno.env.get("GOOGLE_API_KEY");
  const OAI = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
  const t: Record<string, unknown> = {};
  const go = async (label: string, model: string) => {
    const r = await fetch(OAI, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: [{ role: "user", content: "say ok in one word" }], max_tokens: 20 }),
    });
    t[label] = { status: r.status, body: (await r.text()).slice(0, 250) };
  };
  await go("flash_latest", "gemini-flash-latest");
  await go("pro_latest", "gemini-pro-latest");
  await go("flash_lite_latest", "gemini-flash-lite-latest");
  await go("3.6_flash", "gemini-3.6-flash");
  await go("3.1_pro_preview", "gemini-3.1-pro-preview");
  await go("3.5_flash", "gemini-3.5-flash");
  await go("3.1_flash_lite", "gemini-3.1-flash-lite");
  return new Response(JSON.stringify(t, null, 2), { headers: { ...cors, "Content-Type": "application/json" }});
});
