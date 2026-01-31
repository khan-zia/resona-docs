## Realtime events

Events are delivered over the WebRTC data channel or the WebSocket connection. Every event includes a `type` and may include `session_id`, `timestamp`, and `payload`.

### Token event (user speech)

```json
{
  "type": "token",
  "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
  "timestamp": "2026-01-22T15:10:12.114Z",
  "tokens": [
    {
      "text": "Hello ",
      "isFinal": false,
      "speaker": "1"
    },
    {
      "text": "there",
      "isFinal": true,
      "speaker": "1"
    }
  ]
}
```

### Token event (assistant)

```json
{
  "type": "token",
  "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
  "timestamp": "2026-01-22T15:10:20.881Z",
  "tokens": [
    {
      "text": "Hi, how can I help today?",
      "isFinal": true,
      "speaker": "assistant"
    }
  ]
}
```

### Tool call

```json
{
  "type": "tool.call",
  "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
  "timestamp": "2026-01-22T15:10:32.381Z",
  "payload": {
    "tool_use_id": "toolu_01HPT0VQ8F2QK2K0D2G4Z9QJ1A",
    "name": "lookup_customer",
    "arguments": { "phone": "+1 415 555 0142" }
  }
}
```

### Tool result

```json
{
  "type": "tool.result",
  "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
  "timestamp": "2026-01-22T15:10:35.902Z",
  "payload": {
    "tool_use_id": "toolu_01HPT0VQ8F2QK2K0D2G4Z9QJ1A",
    "response": {
      "customer_id": "cust_921",
      "name": "Taylor Reed",
      "last_visit": "2025-11-04"
    },
    "error": null,
    "summary": "Customer found"
  }
}
```

### Notes and constraints

- Events are JSON objects with `type` and optional `session_id`, `timestamp`, and `payload`.
- Some events can omit `session_id` or `timestamp` (token events and handshake errors may omit them).
- Token events include only `text`, `isFinal`, and optional `speaker` (no confidence or per‑token timing fields).
- `tool.call` must be answered within **60 seconds** with `tool.result`.
- If you cannot execute a tool, send `tool.result` with `error` populated.
- `tool.result` requires `tool_use_id`; if missing or unknown, the server ignores the result.
- `tool.result` error values mark a call as failed; `summary` is optional.
- Large tool responses are truncated to **1500 characters** internally.
- WebRTC data channel label is `events` and should be `ordered: true`.
