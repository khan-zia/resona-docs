## Tools JSON rules

Tools are validated strictly. Keep schemas small, explicit, and consistent.

- Max **15 tools** per profile.
- `tools_json` must be **7,500 characters or less** (minified).
- Provide **either** `input_schema` **or** `parameters` for every tool, not both.
- Every object schema must include `additionalProperties: false`.
- Optional parameters across all tools cannot exceed **24**.
- Max JSON Schema nesting depth is **5** levels.

For the full validation matrix and supported keywords, see the API Reference.
