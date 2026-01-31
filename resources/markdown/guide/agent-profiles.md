## Agent profiles

Profiles define how your agent behaves and which tools it can use. Voice names are case‑insensitive.

**Key fields**

- `name`: Human‑friendly label for the profile.
- `voice`: TTS voice name (case‑insensitive).
- `system_instructions`: The agent’s core behavior.
- `domain_context`: Optional structured business context.
- `tools_json`: JSON Schema definitions for tool calls.
- `agent_speaks_first`: If `true`, the agent opens the conversation.

### Create profile (example)

```json
{
  "name": "Dental Concierge",
  "voice": "Grant",
  "system_instructions": "Be concise and confirm appointment details.",
  "domain_context": {
    "context": {
      "text": "This agent books dental appointments.",
      "general": [
        { "key": "Business", "value": "Bright Dental" },
        { "key": "Timezone", "value": "America/Los_Angeles" }
      ],
      "terms": ["checkup", "cleaning", "crown"]
    }
  },
  "agent_speaks_first": false,
  "tools_json": [
    {
      "name": "lookup_customer",
      "description": "Find a customer by phone number",
      "input_schema": {
        "type": "object",
        "properties": {
          "phone": { "type": "string" }
        },
        "required": ["phone"],
        "additionalProperties": false
      }
    }
  ]
}
```
