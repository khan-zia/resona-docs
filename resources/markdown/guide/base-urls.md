## Base URLs

Resona uses a control plane for REST APIs and realtime clusters for low‑latency audio. Always use the `cluster_base_url` returned by session creation for realtime connections.

- **Control plane:** `https://resona.dev/api`
- **Realtime cluster:** `https://<cluster_slug>.resona.dev`

When you create a session, the response includes both `cluster_slug` and `cluster_base_url` so you never have to hard‑code cluster locations.
