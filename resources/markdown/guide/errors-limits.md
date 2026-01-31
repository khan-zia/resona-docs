## Errors & limits

Plan for validation errors, transport mismatches, and hard limits.

- Tool calls time out after **60 seconds** if no `tool.result` is returned.
- Profile names must be **2–48 characters** and unique per user.
- `system_instructions` are capped at **7,500 characters**.
- `tools_json` is capped at **7,500 characters** (minified).
- WebRTC supports `pcm16` only; WebSocket supports `pcm16` or `mulaw`.

For the full list of error codes and limits, see the API Reference.
