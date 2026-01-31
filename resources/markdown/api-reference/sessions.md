## Sessions

Create short‑lived credentials for realtime connections.

### Endpoint

- `POST /api/v1/sessions`

### Create session (WebRTC request)

```json
{
  "agent_id": "agent-3e6f2a41-0f6b-4c4b-a4d5-9e2a4b1e2a3c",
  "transport": "webrtc",
  "codec": "pcm16"
}
```

### Create session (WebSocket request)

```json
{
  "agent_id": "agent-3e6f2a41-0f6b-4c4b-a4d5-9e2a4b1e2a3c",
  "transport": "websocket",
  "codec": "pcm16",
  "sample_rate": 48000
}
```

### WebRTC response (201)

```json
{
  "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
  "token": "tkn_1f9b3a7c9d4e8b2a5c7d9e1f3a5b7c9d",
  "expires_at": "2026-01-22T16:04:39.000Z",
  "transport": "webrtc",
  "webrtc_url": "https://us-east.resona.dev/webrtc/sdp",
  "websocket_url": null,
  "cluster_slug": "us-east",
  "cluster_base_url": "https://us-east.resona.dev",
  "audio_format": {
    "input_codec": "pcm16",
    "output_codec": "opus",
    "output_sample_rate": 48000
  },
  "ice_servers": [
    {
      "urls": ["turn:turn.cloudflare.com:3478?transport=udp"],
      "username": "1705937079:tenant-42",
      "credential": "9f4a2b0f2f4b4a7f8a3b1eaf9a6f1d2e"
    }
  ]
}
```

### WebSocket response (201)

```json
{
  "session_id": "session-3a5d2e71-0d1f-4bd7-a0d1-8f3e6f2f0a91",
  "token": "tkn_9d12b7a3c9f8e1d4b5a6c7e8f9a0b1c2",
  "expires_at": "2026-01-22T16:09:12.000Z",
  "transport": "websocket",
  "webrtc_url": null,
  "websocket_url": "https://us-east.resona.dev/ws/audio",
  "cluster_slug": "us-east",
  "cluster_base_url": "https://us-east.resona.dev",
  "audio_format": {
    "input_codec": "pcm16",
    "input_sample_rate": 48000,
    "output_codec": "pcm16",
    "output_sample_rate": 48000
  }
}
```

### Validation error (422)

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "agent_id": ["Agent profile id must be a valid agent identifier"]
  }
}
```

### Field notes

- `transport` is required (`webrtc` or `websocket`).
- `codec` defaults to `pcm16`. WebRTC only supports `pcm16`; WebSocket supports `pcm16` or `mulaw`.
- `sample_rate` is WebSocket‑only. For `pcm16`, use a value divisible by 50 (20 ms framing). If omitted, the default is 16 kHz. For `mulaw`, the only valid value is 8000.
- `audio_format` describes the negotiated input/output for your session.
- WebRTC responses include `ice_servers` (TURN) for NAT traversal.
