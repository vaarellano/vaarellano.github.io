/* ── Claude.js — Anthropic API client ───────────────────────────────────── */
const Claude = (() => {
  const KEY   = 'ep_api_key';
  const URL   = 'https://api.anthropic.com/v1/messages';
  const MODEL = 'claude-opus-4-5';

  function getKey()      { return localStorage.getItem(KEY) || ''; }
  function saveKey(k)    { localStorage.setItem(KEY, k); }
  function clearKey()    { localStorage.removeItem(KEY); }

  function headers(apiKey) {
    return {
      'x-api-key':                                apiKey,
      'anthropic-version':                        '2023-06-01',
      'anthropic-dangerous-direct-browser-access':'true',
      'content-type':                             'application/json',
    };
  }

  // Streaming async generator — yields text chunks as they arrive
  async function* stream(prompt, apiKey) {
    const res = await fetch(URL, {
      method: 'POST',
      headers: headers(apiKey),
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: 1200,
        stream:     true,
        messages:   [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${res.status}`);
    }

    const reader  = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data: '));
      for (const line of lines) {
        const json = line.slice(6).trim();
        if (json === '[DONE]') return;
        try {
          const evt = JSON.parse(json);
          if (evt.type === 'content_block_delta' && evt.delta?.text) {
            yield evt.delta.text;
          }
        } catch {}
      }
    }
  }

  return { getKey, saveKey, clearKey, stream };
})();
