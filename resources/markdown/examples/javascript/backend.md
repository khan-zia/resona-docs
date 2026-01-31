## Session broker

Your backend is the only place where `RESONA_API_KEY` should exist. It creates sessions and returns short-lived credentials to the client.

### What it should do

- Authenticate your users (even in a demo, use a basic guard).
- Create sessions with the right `agent_id`, `transport`, and `codec`.
- Return only what the client needs: `session_id`, `token`, and transport URLs.

### Setup checklist

- Node 18+ (for built-in `fetch`)
- `npm install express`
- `RESONA_API_KEY` in the environment
- Client files inside `public/` and `AGENT_ID` updated in the client scripts

```javascript
// server.js
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Keep your API key on the server only.
const RESONA_API_KEY = process.env.RESONA_API_KEY;
const RESONA_API_BASE_URL = process.env.RESONA_API_BASE_URL ?? 'https://resona.dev/api';

app.post('/session', async (req, res) => {
    if (!RESONA_API_KEY) {
        return res.status(500).json({ error: 'Missing RESONA_API_KEY' });
    }

    const { agent_id, transport, codec = 'pcm16', sample_rate } = req.body;
    const payload = { agent_id, transport, codec };

    // Only include sample_rate for WebSocket sessions, and only when valid.
    const numericSampleRate = Number(sample_rate);
    if (transport === 'websocket' && Number.isFinite(numericSampleRate)) {
        payload.sample_rate = numericSampleRate;
    }

    // Create the session on Resona and pass through the response.
    const response = await fetch(RESONA_API_BASE_URL + '/api/v1/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + RESONA_API_KEY,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.status(response.status).json(data);
});

app.listen(3000, () => {
    console.log('Resona examples running on http://localhost:3000');
});
```
