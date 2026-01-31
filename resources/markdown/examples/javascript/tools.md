## Tool calls and tool results

Tool calls arrive as `tool.call` events. Each call includes a `tool_use_id`, the tool `name`, and the `arguments` payload. Your app executes the tool and sends a `tool.result` back over the same channel.

### Tool call event shape

```json
{
  "type": "tool.call",
  "payload": {
    "tool_use_id": "tool_123",
    "name": "lookup_weather",
    "arguments": { "city": "Riyadh" }
  }
}
```

### Minimal handler + response

In a production app, tool execution should run on your backend (or a trusted environment), not inside the browser. For demos, you can stub tool results locally. This snippet assumes the `handleTokenEvent` function from the transcript section is in scope.

```javascript
const toolsEl = document.getElementById('tools');
const pendingTools = new Map();

const renderToolCall = (toolCall) => {
    if (!toolsEl) return;
    // Append a simple card for the tool call.
    const id = toolCall.tool_use_id;
    toolsEl.innerHTML += `
      <div data-tool="${id}">
        <strong>${toolCall.name}</strong>
        <pre>${JSON.stringify(toolCall.arguments, null, 2)}</pre>
      </div>
    `;
};

const executeTool = async (name, args) => {
    // Replace with your real tool execution.
    return { ok: true, name, args };
};

const sendToolResult = (sendJson, toolUseId, response) => {
    // Always send tool.result back over the same channel.
    sendJson({
        type: 'tool.result',
        timestamp: new Date().toISOString(),
        payload: {
            tool_use_id: toolUseId,
            response,
        },
    });
};

const handleToolCall = async (event, sendJson) => {
    const toolCall = event.payload;
    if (!toolCall) return;

    // Track locally so you can render status or retries later.
    pendingTools.set(toolCall.tool_use_id, toolCall);
    renderToolCall(toolCall);

    // Execute the tool and send a result payload.
    const result = await executeTool(toolCall.name, toolCall.arguments);
    sendToolResult(sendJson, toolCall.tool_use_id, result);
};

const handleSessionEvent = async (event, sendJson) => {
    if (event.type === 'token') {
        handleTokenEvent(event);
    }
    if (event.type === 'tool.call') {
        await handleToolCall(event, sendJson);
    }
};
```

### Hooking it up (both transports)

- **WebRTC:** call `handleSessionEvent(payload, (msg) => dataChannel.send(JSON.stringify(msg)))`
- **WebSocket:** call `handleSessionEvent(payload, (msg) => ws.send(JSON.stringify(msg)))`
