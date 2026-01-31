## Create a session

Sessions are short‑lived credentials tied to a specific transport and cluster. Your backend creates the session and passes the response to the client.

### WebRTC request

```json
{
  "agent_id": "agent-3e6f2a41-0f6b-4c4b-a4d5-9e2a4b1e2a3c",
  "transport": "webrtc",
  "codec": "pcm16"
}
```

### WebSocket request

```json
{
  "agent_id": "agent-3e6f2a41-0f6b-4c4b-a4d5-9e2a4b1e2a3c",
  "transport": "websocket",
  "codec": "pcm16",
  "sample_rate": 48000
}
```

### Response highlights

- `session_id` and `token` are required for realtime connections.
- `cluster_base_url` points to the realtime cluster.
- `audio_format` describes negotiated input/output codecs and sample rates.

For full response fields, see the API Reference.
