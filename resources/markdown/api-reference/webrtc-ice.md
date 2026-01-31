## WebRTC ICE signaling

Use WebSocket signaling (preferred) or HTTP polling as a fallback.

### A) WebSocket signaling

**Endpoint:** `wss://<cluster_slug>.resona.dev/webrtc/signal`

Client handshake:

```json
{
  "type": "handshake",
  "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
  "token": "tkn_1f9b3a7c9d4e8b2a5c7d9e1f3a5b7c9d"
}
```

Server ACK:

```json
{
  "type": "ack",
  "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df"
}
```

Client candidates:

```json
{
  "type": "candidate",
  "candidates": [
    {
      "candidate": "candidate:1 1 udp 2122260223 192.168.1.5 61922 typ host",
      "sdpMid": "0",
      "sdpMLineIndex": 0,
      "usernameFragment": "w1vT"
    }
  ],
  "complete": false
}
```

Server candidate payload:

```json
{
  "type": "ice.candidate",
  "candidate": {
    "candidate": "candidate:2 1 udp 2122260223 10.0.0.12 53455 typ host",
    "sdpMid": "0",
    "sdpMLineIndex": 0
  }
}
```

Completion:

```json
{ "type": "ice.candidate.complete" }
```

Rules:

- `handshake` must be the first message on the signaling socket.
- Send candidates as they are gathered; use `complete: true` when done.
- Server sends `ice.candidate` events and then `ice.candidate.complete`.
- No control commands are sent to clients over signaling.
- To restart ICE, create a new SDP offer (ICE restart enabled) and call `/webrtc/sdp` with `ice_restart` set to true.

### B) HTTP polling

**Endpoint:** `https://<cluster_slug>.resona.dev/webrtc/candidates`

Request:

```json
{
  "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
  "token": "tkn_1f9b3a7c9d4e8b2a5c7d9e1f3a5b7c9d",
  "candidates": [
    {
      "candidate": "candidate:1 1 udp 2122260223 192.168.1.5 61922 typ host",
      "sdpMid": "0",
      "sdpMLineIndex": 0,
      "usernameFragment": "w1vT"
    }
  ],
  "complete": false,
  "wait": true,
  "timeout_ms": 5000
}
```

Response:

```json
{
  "candidates": [
    {
      "candidate": "candidate:2 1 udp 2122260223 10.0.0.12 53455 typ host",
      "sdpMid": "0",
      "sdpMLineIndex": 0
    }
  ],
  "complete": false
}
```

Rules:

- This endpoint can upload local candidates and poll for remote candidates in one call.
- `wait: true` enables long‑polling; `timeout_ms` is clamped between 100 and 15000 ms.
- `timeout_ms` defaults to 5000 ms if omitted.
- `complete: true` signals that local ICE gathering is finished (candidates may be omitted).
- If `wait` is false, responses are immediate and may include previously returned candidates; deduplicate by candidate string if needed.
