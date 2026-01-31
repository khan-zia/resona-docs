## Domain context

`domain_context` is optional structured context that helps the model understand your business.

- `context.text`: Freeform background or memory (max **2000** chars). Prefer this over bloating `system_instructions`.
- `context.general`: Array of key/value facts (hours, timezone, locations).
- `context.terms`: Canonical terms, acronyms, or spellings the model should use.

Example:

```json
{
  "context": {
    "text": "This agent books dental appointments.",
    "general": [
      { "key": "Business", "value": "Bright Dental" },
      { "key": "Timezone", "value": "America/Los_Angeles" }
    ],
    "terms": ["checkup", "cleaning", "crown"]
  }
}
```
