## Agent profile endpoints

Base URL: `https://resona.dev`

### Endpoints

- `POST /api/v1/agent-profiles`
- `PUT /api/v1/agent-profiles/{agent_id}`
- `DELETE /api/v1/agent-profiles/{agent_id}`

### Create profile (request)

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

### Create profile (201 response)

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

### Validation error (422)

```json
{
  "message": "The name field must be at least 2 characters.",
  "errors": {
    "name": ["Profile name must be at least 2 characters."]
  }
}
```

### Update profile (request)

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
  "agent_speaks_first": true,
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
  ]
}
```

### Tools validation error (422)

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "tools_json": ["Tool #1 name must match /^[a-zA-Z0-9_-]{1,64}$/."]
  }
}
```

### Delete profile (200)

```json
{ "message": "Profile deleted successfully." }
```

### Delete last profile error (422)

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "profile": ["Cannot delete your last profile."]
  }
}
```
