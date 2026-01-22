import { Head } from '@inertiajs/react';
import DocsLayout from '../Layouts/DocsLayout';
import {
    DocsBadge,
    DocsCard,
    DocsCodeBlock,
    DocsEndpointGroup,
    DocsEyebrow,
    DocsKeyValueList,
    DocsPageShell,
    DocsSectionHeader,
    DocsStatCard,
} from '../components/docs';

const apiNav = [
    { id: 'base-urls', label: 'Base URLs' },
    { id: 'auth', label: 'Authentication' },
    { id: 'agent-profiles', label: 'Agent profiles' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'usage', label: 'Usage' },
    { id: 'webrtc-api', label: 'Realtime: WebRTC' },
    { id: 'websocket-api', label: 'Realtime: WebSocket' },
    { id: 'events', label: 'Event payloads' },
    { id: 'webhooks', label: 'Webhooks' },
    { id: 'errors', label: 'Errors & status codes' },
];

const endpointGroups = [
    {
        title: 'Agent profiles',
        description: 'Create, update, and duplicate voice agents.',
        endpoints: [
            { method: 'GET', path: '/v1/agent-profiles' },
            { method: 'POST', path: '/v1/agent-profiles' },
            { method: 'PUT', path: '/v1/agent-profiles/{agent_id}' },
            { method: 'DELETE', path: '/v1/agent-profiles/{agent_id}' },
            { method: 'POST', path: '/v1/agent-profiles/{agent_id}/duplicate' },
        ],
    },
    {
        title: 'Sessions',
        description: 'Create realtime sessions and inspect session history.',
        endpoints: [
            { method: 'POST', path: '/v1/sessions' },
            { method: 'GET', path: '/v1/sessions' },
            { method: 'GET', path: '/v1/sessions/{session_id}' },
        ],
    },
    {
        title: 'Usage',
        description: 'Track billable seconds and plan limits.',
        endpoints: [{ method: 'GET', path: '/v1/usage' }],
    },
];

const authHeaderExample = String.raw`Authorization: Bearer resona_live_********`;

const createProfileRequest = String.raw`{
  "name": "Concierge",
  "voice_id": 12,
  "system_instructions": "You are a helpful concierge.",
  "agent_speaks_first": true,
  "tools_json": [
    {
      "name": "lookup_booking",
      "description": "Find a booking by confirmation code.",
      "input_schema": {
        "type": "object",
        "properties": {
          "confirmation_code": { "type": "string" }
        },
        "required": ["confirmation_code"]
      }
    }
  ]
}`;

const profileResponse = String.raw`{
  "agent_id": "agent-8fef6f3c-2f1a-4e5c-b4d6-6d1c9f36a4a1",
  "name": "Concierge",
  "voice_id": 12,
  "system_instructions": "You are a helpful concierge.",
  "domain_context": null,
  "agent_speaks_first": true,
  "tools_json": [
    {
      "name": "lookup_booking",
      "description": "Find a booking by confirmation code.",
      "input_schema": {
        "type": "object",
        "properties": { "confirmation_code": { "type": "string" } },
        "required": ["confirmation_code"]
      }
    }
  ],
  "tool_summary": "lookup_booking(confirmation_code)",
  "is_default": false,
  "created_at": "2026-01-22T18:12:01Z",
  "updated_at": "2026-01-22T18:12:01Z"
}`;

const duplicateProfileRequest = String.raw`{
  "name": "Concierge (Copy)"
}`;

const createSessionRequest = String.raw`{
  "agent_id": "agent-8fef6f3c-2f1a-4e5c-b4d6-6d1c9f36a4a1",
  "transport": "webrtc",
  "codec": "pcm16"
}`;

const createSessionResponse = String.raw`{
  "session_id": "session-5bda2f14-6b7a-4a67-9c75-9bde3f03e2df",
  "token": "session_token_...",
  "expires_at": "2026-01-22T20:12:11Z",
  "transport": "webrtc",
  "webrtc_url": "https://realtime.resona.ai/webrtc/sdp",
  "websocket_url": null,
  "cluster_slug": "shared",
  "cluster_base_url": "https://realtime.resona.ai",
  "audio_format": {
    "output_codec": "opus",
    "output_sample_rate": 48000
  },
  "ice_servers": [
    { "urls": ["stun:stun.cloudflare.com:3478"], "username": "resona", "credential": "..." }
  ]
}`;

const listSessionsResponse = String.raw`{
  "data": [
    {
      "session_id": "session-5bda2f14-6b7a-4a67-9c75-9bde3f03e2df",
      "transport": "webrtc",
      "status": "finished",
      "created_at": "2026-01-22T18:12:01Z",
      "expires_at": "2026-01-22T20:12:11Z",
      "started_at": "2026-01-22T18:12:04Z",
      "ended_at": "2026-01-22T18:15:44Z",
      "metadata": { "agent_id": "agent-..." }
    }
  ],
  "links": { "first": "...", "last": "...", "prev": null, "next": null },
  "meta": { "current_page": 1, "per_page": 15, "total": 1 }
}`;

const sessionDetailResponse = String.raw`{
  "session_id": "session-5bda2f14-6b7a-4a67-9c75-9bde3f03e2df",
  "transport": "webrtc",
  "status": "finished",
  "created_at": "2026-01-22T18:12:01Z",
  "updated_at": "2026-01-22T18:16:01Z",
  "expires_at": "2026-01-22T20:12:11Z",
  "started_at": "2026-01-22T18:12:04Z",
  "ended_at": "2026-01-22T18:15:44Z",
  "metadata": { "agent_id": "agent-..." },
  "metrics": { "duration_ms": 223000 },
  "transcript": [
    { "speaker": "user", "text": "I need a booking." },
    { "speaker": "assistant", "text": "Happy to help." }
  ],
  "tool_calls": []
}`;

const usageResponse = String.raw`{
  "current_month": {
    "total_seconds": 1200,
    "total_minutes": 20,
    "raw_seconds": 1340,
    "raw_minutes": 22
  },
  "plan": {
    "slug": "starter",
    "name": "Starter",
    "included_minutes": 50,
    "grace_seconds": 120,
    "overage_rate_cents": 200,
    "concurrency_limit": 2
  },
  "overage": { "seconds": 0, "minutes": 0, "cost_cents": 0 },
  "records": { "data": [], "links": {}, "meta": {} }
}`;

const webrtcSdpRequest = String.raw`{
  "session_id": "session-...",
  "token": "session_token_...",
  "sdp_offer": "v=0...",
  "ice_restart": false
}`;

const webrtcSdpResponse = String.raw`{
  "sdp_answer": "v=0...",
  "ice_servers": [{ "urls": ["stun:stun.cloudflare.com:3478"] }],
  "peer_connection_id": "session-..."
}`;

const webrtcCandidatesRequest = String.raw`{
  "session_id": "session-...",
  "token": "session_token_...",
  "candidates": [{ "candidate": "candidate:...", "sdpMid": "0", "sdpMLineIndex": 0 }],
  "complete": false,
  "wait": false
}`;

const webrtcCandidatesResponse = String.raw`{
  "candidates": [{ "candidate": "candidate:...", "sdpMid": "0", "sdpMLineIndex": 0 }],
  "complete": false
}`;

const websocketHandshake = String.raw`{
  "type": "handshake",
  "session_id": "session-...",
  "token": "session_token_...",
  "codec": "pcm16"
}`;

const websocketAck = String.raw`{
  "type": "ack",
  "session_id": "session-...",
  "pipeline": { "status": "ready" }
}`;

const toolCallEvent = String.raw`{
  "type": "tool.call",
  "session_id": "session-...",
  "timestamp": "2026-01-22T18:12:04Z",
  "payload": {
    "tool_use_id": "tool_1",
    "name": "lookup_booking",
    "arguments": { "confirmation_code": "ABC123" }
  }
}`;

const toolResultEvent = String.raw`{
  "type": "tool.result",
  "session_id": "session-...",
  "timestamp": "2026-01-22T18:12:07Z",
  "payload": {
    "tool_use_id": "tool_1",
    "response": { "status": "confirmed" }
  }
}`;

const toolStatusEvent = String.raw`{
  "type": "tool.status",
  "session_id": "session-...",
  "timestamp": "2026-01-22T18:12:05Z",
  "payload": {
    "tool_use_id": "tool_1",
    "status": "running",
    "summary": "Looking up booking"
  }
}`;

const tokenEvent = String.raw`{
  "type": "token",
  "tokens": [{ "text": "Hello!", "isFinal": true, "speaker": "assistant" }]
}`;

const errorEvent = String.raw`{
  "type": "error",
  "code": "invalid_token",
  "message": "Handshake token is invalid or expired"
}`;

const webhookPayload = String.raw`{
  "session_id": "session-...",
  "transport": "webrtc",
  "status": "finished",
  "reason": "completed",
  "started_at": "2026-01-22T18:12:01Z",
  "ended_at": "2026-01-22T18:15:44Z",
  "metrics": { "duration_ms": 223000 },
  "transcript": [
    { "speaker": "user", "text": "I need a booking." },
    { "speaker": "assistant", "text": "Happy to help." }
  ],
  "tool_calls": [],
  "events": { "counts": { "token": 42 }, "lastEventAt": "2026-01-22T18:15:44Z" },
  "audio": { "codec": "pcm16", "sample_rate": 16000, "channel_count": 1 },
  "metadata": { "agent_id": "agent-..." }
}`;

export default function ApiReference() {
    return (
        <>
            <Head title="API Reference" />
            <DocsLayout
                title="API Reference"
                subtitle="Endpoints, payloads, and realtime protocols for Resona customers."
                active="api"
            >
                <DocsPageShell
                    aside={
                        <DocsCard variant="deep" size="sm" className="flex flex-col gap-4">
                            <div className="text-xs uppercase tracking-[0.3em] text-emerald-200">On this page</div>
                            <div className="flex flex-col gap-3 text-sm text-slate-300">
                                {apiNav.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className="rounded-lg px-2 py-1 transition hover:bg-white/5 hover:text-white"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </DocsCard>
                    }
                    asideClassName="lg:sticky lg:top-28 h-max"
                    main={
                        <>
                            <section id="base-urls" className="scroll-mt-28">
                                <DocsCard variant="glass" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Base URLs</DocsEyebrow>}
                                        title="Start with the control plane, then connect to the realtime cluster."
                                        description="Use the session response to discover the cluster_base_url for realtime connections."
                                    />
                                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                                        <DocsStatCard
                                            label="Control Plane"
                                            value="https://api.resona.ai"
                                            caption="REST API for profiles, sessions, usage"
                                        />
                                        <DocsStatCard
                                            label="Realtime"
                                            value="cluster_base_url"
                                            caption="Returned from POST /v1/sessions"
                                        />
                                        <DocsStatCard label="Auth" value="Bearer" caption="API key per tenant" />
                                    </div>
                                </DocsCard>
                            </section>

                            <section id="auth" className="scroll-mt-28">
                                <DocsCard variant="muted" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Authentication</DocsEyebrow>}
                                        title="Send your API key in every control plane request."
                                    />
                                    <DocsCodeBlock className="mt-6" language="http" code={authHeaderExample} />
                                </DocsCard>
                            </section>

                            <DocsCard variant="deep" size="lg">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>Control plane endpoints</DocsEyebrow>}
                                    title="Core REST endpoints"
                                />
                                <div className="mt-6 grid gap-6">
                                    {endpointGroups.map((group) => (
                                        <DocsEndpointGroup
                                            key={group.title}
                                            title={group.title}
                                            description={group.description}
                                            endpoints={group.endpoints}
                                        />
                                    ))}
                                </div>
                            </DocsCard>

                            <section id="agent-profiles" className="scroll-mt-28">
                                <DocsCard variant="glass" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Agent profiles</DocsEyebrow>}
                                        title="Create an agent profile"
                                    />
                                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                                        <DocsCodeBlock language="json" code={createProfileRequest} />
                                        <DocsCodeBlock language="json" code={profileResponse} />
                                    </div>
                                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                                        <DocsCodeBlock language="json" code={duplicateProfileRequest} />
                                        <DocsKeyValueList
                                            items={[
                                                { label: 'GET /v1/agent-profiles', value: 'List profiles' },
                                                { label: 'PUT /v1/agent-profiles/{agent_id}', value: 'Update fields' },
                                                { label: 'DELETE /v1/agent-profiles/{agent_id}', value: 'Delete profile' },
                                                { label: 'POST /v1/agent-profiles/{agent_id}/duplicate', value: 'Duplicate with new name' },
                                            ]}
                                        />
                                    </div>
                                </DocsCard>
                            </section>

                            <section id="sessions" className="scroll-mt-28">
                                <DocsCard variant="muted" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Sessions</DocsEyebrow>}
                                        title="Create and inspect realtime sessions"
                                    />
                                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                                        <DocsCodeBlock language="json" code={createSessionRequest} />
                                        <DocsCodeBlock language="json" code={createSessionResponse} />
                                    </div>
                                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                                        <DocsCodeBlock language="json" code={listSessionsResponse} />
                                        <DocsCodeBlock language="json" code={sessionDetailResponse} />
                                    </div>
                                    <div className="mt-6 text-sm text-slate-300">
                                        <p>
                                            Filters for <span className="font-mono text-slate-200">GET /v1/sessions</span>:
                                            <span className="font-semibold text-white"> status</span>,
                                            <span className="font-semibold text-white"> transport</span>,
                                            <span className="font-semibold text-white"> from_date</span>,
                                            <span className="font-semibold text-white"> to_date</span>,
                                            <span className="font-semibold text-white"> metadata_key</span>,
                                            <span className="font-semibold text-white"> per_page</span>.
                                        </p>
                                    </div>
                                </DocsCard>
                            </section>

                            <section id="usage" className="scroll-mt-28">
                                <DocsCard variant="deep" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Usage</DocsEyebrow>}
                                        title="Track minutes and overage"
                                    />
                                    <DocsCodeBlock className="mt-6" language="json" code={usageResponse} />
                                </DocsCard>
                            </section>

                            <section id="webrtc-api" className="scroll-mt-28">
                                <DocsCard variant="glass" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Realtime API</DocsEyebrow>}
                                        title="WebRTC SDP + ICE endpoints"
                                        description="Use the cluster_base_url from the session response."
                                    />
                                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                                        <DocsCodeBlock language="json" code={webrtcSdpRequest} />
                                        <DocsCodeBlock language="json" code={webrtcSdpResponse} />
                                    </div>
                                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                                        <DocsCodeBlock language="json" code={webrtcCandidatesRequest} />
                                        <DocsCodeBlock language="json" code={webrtcCandidatesResponse} />
                                    </div>
                                </DocsCard>
                            </section>

                            <section id="websocket-api" className="scroll-mt-28">
                                <DocsCard variant="muted" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Realtime API</DocsEyebrow>}
                                        title="WebSocket audio handshake"
                                    />
                                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                                        <DocsCodeBlock language="json" code={websocketHandshake} />
                                        <DocsCodeBlock language="json" code={websocketAck} />
                                    </div>
                                </DocsCard>
                            </section>

                            <section id="events" className="scroll-mt-28">
                                <DocsCard variant="deep" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Event payloads</DocsEyebrow>}
                                        title="Realtime events over WebRTC or WebSocket"
                                    />
                                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                                        <DocsCodeBlock language="json" code={tokenEvent} />
                                        <DocsCodeBlock language="json" code={toolCallEvent} />
                                        <DocsCodeBlock language="json" code={toolResultEvent} />
                                        <DocsCodeBlock language="json" code={toolStatusEvent} />
                                    </div>
                                    <DocsCodeBlock className="mt-6" language="json" code={errorEvent} />
                                </DocsCard>
                            </section>

                            <section id="webhooks" className="scroll-mt-28">
                                <DocsCard variant="glass" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Webhooks</DocsEyebrow>}
                                        title="Session completion webhook"
                                        description="Configure your webhook URL in the dashboard to receive this payload."
                                    />
                                    <DocsCodeBlock className="mt-6" language="json" code={webhookPayload} />
                                </DocsCard>
                            </section>

                            <section id="errors" className="scroll-mt-28">
                                <DocsCard variant="muted" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Errors</DocsEyebrow>}
                                        title="Common status codes"
                                    />
                                    <DocsKeyValueList
                                        items={[
                                            { label: '401 Unauthorized', value: 'Missing or invalid API key' },
                                            { label: '402 Usage Limit Reached', value: 'Plan minutes exhausted' },
                                            { label: '403 Forbidden', value: 'Tenant suspended or token invalid' },
                                            { label: '422 Unprocessable Entity', value: 'Validation error' },
                                            { label: '429 Too Many Requests', value: 'Concurrency or rate limit exceeded' },
                                            { label: '502 Bad Gateway', value: 'Realtime registration failed' },
                                        ]}
                                    />
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        <DocsBadge tone="emerald">Retry with backoff</DocsBadge>
                                        <DocsBadge tone="slate">Check payload</DocsBadge>
                                    </div>
                                </DocsCard>
                            </section>
                        </>
                    }
                />
            </DocsLayout>
        </>
    );
}
