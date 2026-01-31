## Transport choice

Choose the transport that matches your environment. Detailed, copy‑pasteable code is in the [Examples page](/examples).

### WebRTC (recommended for browsers)

- Built‑in jitter buffering and media routing.
- Best for web apps and interactive voice UIs.
- Events travel over a data channel named `events`.

See: [WebRTC example](/examples#webrtc)

### WebSocket (recommended for custom clients)

- Works great for native apps, embedded devices, and server‑to‑server audio.
- You control framing and sample rate negotiation.
- Audio and JSON events share one connection.

See: [WebSocket example](/examples#websocket)
