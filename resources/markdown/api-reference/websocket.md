## WebSocket transport

WebSocket carries audio frames and JSON events over a single connection.

### Handshake

```json
{
  "type": "handshake",
  "session_id": "session-3a5d2e71-0d1f-4bd7-a0d1-8f3e6f2f0a91",
  "token": "tkn_9d12b7a3c9f8e1d4b5a6c7e8f9a0b1c2",
  "codec": "pcm16"
}
```

### Server ACK

```json
{
  "type": "ack",
  "session_id": "session-3a5d2e71-0d1f-4bd7-a0d1-8f3e6f2f0a91",
  "status": "ready"
}
```

### Audio framing rules

- Each binary message must contain **exactly one 20 ms audio frame**.
- `pcm16` frame bytes = `sample_rate * 0.02 * 2`
  - 16 kHz: 640 bytes
  - 48 kHz: 1920 bytes
- `mulaw` is fixed at 8 kHz → **160 bytes per 20 ms**.
- Audio must be mono. `pcm16` must be little‑endian.
- If you send a different frame size, the server rejects the frame.

### Directional formats

- **Inbound audio (pcm16):** mono PCM16 at the negotiated `sample_rate` (default 16 kHz).
- **Inbound audio (mulaw):** 8 kHz fixed.
- **Outbound audio (pcm16):** raw PCM16 at `audio_format.output_sample_rate`.
- **Outbound audio (mulaw):** 8 kHz fixed.
