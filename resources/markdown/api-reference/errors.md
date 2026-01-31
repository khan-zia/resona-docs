## Error events

Error events are terminal and the socket is closed immediately after they are sent. `session_id` and `timestamp` may be omitted for handshake errors.

```json
{ "type": "error", "code": "invalid_handshake", "message": "Handshake payload must be valid JSON" }
```

```json
{ "type": "error", "code": "invalid_token", "message": "Handshake token is invalid or expired" }
```

```json
{ "type": "error", "code": "codec_mismatch", "message": "Requested codec pcm16 does not match session codec mulaw" }
```

```json
{ "type": "error", "code": "invalid_channel", "message": "Session channel does not support WebRTC signaling" }
```

```json
{ "type": "error", "code": "handshake_required", "message": "Handshake frame required before events" }
```

```json
{ "type": "error", "code": "invalid_event", "message": "Event payload must be valid JSON" }
```

```json
{
  "type": "error",
  "code": "limit_exceeded",
  "message": "Concurrent session limit exceeded for tenant",
  "timestamp": "2026-01-22T15:11:02.119Z"
}
```
