## Base URLs

Use the control plane for REST requests and the realtime cluster for audio and event traffic. The session response tells you which realtime cluster to use.

- **Control plane:** `https://resona.dev/api`
- **Realtime cluster:** `https://<cluster_slug>.resona.dev`

Always use `cluster_base_url` from session creation for realtime requests.

Need copy‑pasteable code? Start with the [Examples page](/examples).
