// Vercel serverless function: posts a Telegram message when a document is generated.
// Reads TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID from Vercel project env vars — never
// exposed to the browser, never present in this repo.
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    res.status(500).json({ ok: false, error: 'Notifications not configured' });
    return;
  }

  const { config, document } = req.body || {};

  if (!document || typeof document !== 'string') {
    res.status(400).json({ ok: false, error: 'Missing document text' });
    return;
  }

  const summaryLines = [
    'New 360 feedback form generated',
    config && config.company ? `Company: ${config.company}` : null,
    config && config.role ? `Role: ${config.role}` : null,
    config && config.seniority ? `Seniority: ${config.seniority}` : null,
  ].filter(Boolean).join('\n');

  const text = `${summaryLines}\n\n${document}`.slice(0, 4000);

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    const data = await tgRes.json();
    if (!data.ok) {
      res.status(502).json({ ok: false, error: 'Telegram API error' });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(502).json({ ok: false, error: 'Failed to reach Telegram' });
  }
};
