// Vercel serverless function: /api/analyze
// Proxies conversation analysis to a configured AI provider using server-side secrets.
// If no provider key is configured, returns { ok: false, reason: 'no-key' } so the
// client falls back to the local heuristic analyzer.

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'method-not-allowed' });
    return;
  }
  const body = (req.body ?? {}) as { text?: string; provider?: string };
  const text = (body.text ?? '').toString().slice(0, 4000);
  if (!text.trim()) {
    res.status(400).json({ ok: false, reason: 'empty-text' });
    return;
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const provider = body.provider ?? (geminiKey ? 'gemini' : openaiKey ? 'openai' : 'local');

  if (provider === 'local' || (!geminiKey && !openaiKey)) {
    res.status(200).json({ ok: false, reason: 'no-key', analysis: null });
    return;
  }

  const systemPrompt = `You are a careful, non-diagnostic cognitive reflection assistant. Analyze the user's message and return ONLY valid JSON matching this schema: {"conversation_summary":string,"situation":string[],"emotions":[{"name":string,"evidence":string,"confidence":number,"intensity":null|"number","certainty":"possible"|"likely"|"confirmed"|"uncertain"}],"thoughts":[{"original_text":string,"normalized_text":string,"type":string,"certainty":"possible"|"likely"|"confirmed"|"uncertain"}],"cognitive_patterns":[{"name":string,"evidence":string,"confidence":number,"requires_confirmation":boolean}],"possible_needs":string[],"reported_behaviours":string[],"alternative_perspectives":string[],"suggested_exercises":string[],"professional_support_considerations":string[],"proposed_graph_nodes":[{"tempId":string,"kind":string,"label":string,"description":string,"evidence":string,"confidence":number,"certainty":string,"valence":string,"intensity":number,"tags":string[]}],"proposed_graph_edges":[{"tempId":string,"source":string,"target":string,"relation":string,"weight":number,"confidence":number}],"clarifying_questions":string[]}. Never diagnose. Label inferences as possible. Preserve original wording. Do not invent memories.`;

  try {
    if (provider === 'gemini' && geminiKey) {
      const model = process.env.GEMINI_MODEL ?? 'gemini-1.5-flash';
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser message:\n${text}` }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
        }),
      });
      if (!r.ok) throw new Error(`gemini ${r.status}`);
      const data = await r.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const analysis = JSON.parse(raw);
      res.status(200).json({ ok: true, analysis });
      return;
    }
    if (openaiKey) {
      const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: text }],
          response_format: { type: 'json_object' },
          temperature: 0.4,
        }),
      });
      if (!r.ok) throw new Error(`openai ${r.status}`);
      const data = await r.json();
      const raw = data?.choices?.[0]?.message?.content ?? '';
      const analysis = JSON.parse(raw);
      res.status(200).json({ ok: true, analysis });
      return;
    }
    res.status(200).json({ ok: false, reason: 'no-key', analysis: null });
  } catch (err) {
    res.status(200).json({ ok: false, reason: 'provider-error', error: String(err), analysis: null });
  }
}
