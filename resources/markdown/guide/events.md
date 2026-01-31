## Events overview

Events are sent over the WebRTC data channel or the WebSocket connection. Your client should route them to transcript and tool handlers.

- `token`: Transcript tokens for the user and agent.
- `tool.call`: A tool request from the model.
- `tool.result`: Your response to a tool call.
- `error`: Session‑level errors.

For complete handling patterns, see [Transcripts](/examples#transcripts) and [Tool calls](/examples#tools) in Examples.
