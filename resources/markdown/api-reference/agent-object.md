## Agent profile object

This is the response shape returned by create/update profile endpoints.

```json
{
  "agent_id": "agent-3e6f2a41-0f6b-4c4b-a4d5-9e2a4b1e2a3c",
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
    },
    {
      "name": "book_appointment",
      "description": "Book an appointment",
      "input_schema": {
        "type": "object",
        "properties": {
          "customer_id": { "type": "string" },
          "date": { "type": "string" },
          "time": { "type": "string" },
          "reason": { "type": "string" }
        },
        "required": ["customer_id", "date", "time"],
        "additionalProperties": false
      }
    }
  ],
  "agent_speaks_first": false,
  "is_default": false,
  "created_at": "2026-01-22T15:04:39.000000Z",
  "updated_at": "2026-01-22T15:18:02.000000Z"
}
```

### Notes on key fields

- `agent_id` is the public identifier used in requests (not the numeric database id).
- `voice` is case‑insensitive on input and stored as a canonical name.
- `tools_json` is stored as JSON and returned as an array.
- `domain_context` is stored as JSON and returned as an object (or `null`).
