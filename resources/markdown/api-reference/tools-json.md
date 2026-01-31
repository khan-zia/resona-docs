## Tools JSON validation rules

`tools_json` is validated strictly. Requests are rejected if any tool violates these rules.

### Tool list limits

- Max **15 tools** per profile
- `tools_json` size **≤ 7,500 chars** (minified)
- Optional parameters across all tools **≤ 24**
- Max schema nesting depth **5** levels

Optional parameters are calculated as **properties minus required** across the entire tools array.

### Tool object shape

- Allowed keys: `name`, `description`, `input_schema`, `parameters`
- `name` is required and must match `^[a-zA-Z0-9_-]{1,64}$`
- `description` is optional but must be a string
- Provide **either** `input_schema` **or** `parameters`, not both
- All tools in a request must use the same key (`input_schema` or `parameters`)
- `input_schema` / `parameters` must be a JSON Schema object

### Strict object rules

These apply to **every** object schema, including nested ones.

- `additionalProperties` is required and must be `false`
- `properties` is required and must be an object keyed by parameter names
- `required` is required, must be an array of strings, and every entry must exist in `properties`

### JSON Schema types

| Type |
| --- |
| object |
| array |
| string |
| integer |
| number |
| boolean |
| null |

### String formats

| Format |
| --- |
| date-time |
| time |
| date |
| duration |
| email |
| hostname |
| uri |
| ipv4 |
| ipv6 |
| uuid |

### Allowed keywords

**Allowed:** `type`, `properties`, `required`, `items`, `enum`, `const`, `format`, `pattern`, `anyOf`, `allOf`, `$ref`, `$defs`

**Not supported:** `oneOf`, `not`, `if`, `then`, `else`, `minimum`, `maximum`, `minLength`, `maxLength`, `maxItems`, `uniqueItems`

### $ref and pattern rules

- `$ref` must be local (starts with `#`)
- Recursive references are rejected
- `$ref` is not allowed inside `allOf`
- `pattern` cannot include backreferences, lookahead/lookbehind, or word‑boundary tokens
- Quantifiers `{n}` or `{n,m}` are allowed only when `n/m` are **99 or less**

Example:

```json
[
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
```
