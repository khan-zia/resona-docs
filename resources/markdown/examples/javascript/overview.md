## Start simple, then grow.

These examples are intentionally small. Use them to validate the full loop (session creation, audio in, audio out, and events) before you invest in UI polish or infrastructure.

### What this page is for

- **End-to-end verification.** Confirm that sessions are created, tokens are returned, and the client can connect to realtime.
- **Clear responsibilities.** The backend owns secrets and session creation. The client owns realtime audio and events.
- **Quality-first defaults.** Fixed `20 ms` frames, matching `sample_rate` to capture, and avoiding accidental resampling.

### How the pieces fit

- **Session broker (backend).** Creates sessions and returns short-lived credentials. Keeps `RESONA_API_KEY` off the client.
- **Client app.** Opens the transport, sends audio, plays audio, and reacts to events.

### Picking a transport

- **WebRTC** is best for browsers. You get built-in jitter buffering and media routing with minimal configuration.
- **WebSocket** is best for custom clients or server-to-server audio. You control the format and pacing.

### Quality and safety defaults

- Never ship `RESONA_API_KEY` to the browser.
- Send exactly one `20 ms` PCM frame per WebSocket message.
- If you know the capture rate, pass `sample_rate` explicitly.
- If you cannot get an aligned rate, resample to `16 kHz` or `48 kHz` before sending audio.

For exact schema details and limits, see the [API Reference](/api-reference).
