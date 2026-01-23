import { Head } from '@inertiajs/react';
import DocsLayout from '../Layouts/DocsLayout';
import {
    DocsBadge,
    DocsCard,
    DocsChecklist,
    DocsCodeBlock,
    DocsEyebrow,
    DocsKeyValueList,
    DocsPageShell,
    DocsSectionHeader,
    DocsStatCard,
    DocsStepCard,
} from '../components/docs';
import classes from '../utils/classes';
import { useState } from 'react';

const guideNav = [
    { id: 'quickstart', label: 'Quickstart' },
    { id: 'base-urls', label: 'Base URLs' },
    { id: 'auth', label: 'Authentication' },
    { id: 'agent-profiles', label: 'Agent Profiles' },
    { id: 'tools-json', label: 'Tools JSON Rules' },
    { id: 'sessions', label: 'Create Session' },
    { id: 'webrtc', label: 'WebRTC Integration' },
    { id: 'websocket', label: 'WebSocket Integration' },
    { id: 'events', label: 'Events & Tool Calls' },
    { id: 'errors-limits', label: 'Errors & Limits' },
];

const quickstartSteps = [
    {
        title: 'Create an agent profile',
        body: 'Define instructions, tools, and a voice by name (case-insensitive).',
    },
    {
        title: 'Start a session',
        body: 'Request a session with transport = webrtc or websocket.',
    },
    {
        title: 'Connect to realtime',
        body: 'Use the returned cluster_base_url for WebRTC or WebSocket.',
    },
    {
        title: 'Handle events + tools',
        body: 'Listen for token/tool events and reply with tool.result.',
    },
];

const createProfileRequest = String.raw`{
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
}`;

const createSessionRequest = String.raw`{
    "agent_id": "agent-3e6f2a41-0f6b-4c4b-a4d5-9e2a4b1e2a3c",
    "transport": "webrtc",
    "codec": "pcm16"
}`;

const webrtcSessionResponse = String.raw`{
    "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
    "token": "tkn_1f9b3a7c9d4e8b2a5c7d9e1f3a5b7c9d",
    "expires_at": "2026-01-22T16:04:39.000Z",
    "transport": "webrtc",
    "webrtc_url": "https://us-east.resona.dev/webrtc/sdp",
    "websocket_url": null,
    "cluster_slug": "us-east",
    "cluster_base_url": "https://us-east.resona.dev",
    "audio_format": {
        "input_codec": "pcm16",
        "output_codec": "opus",
        "output_sample_rate": 48000
    },
    "ice_servers": [
        {
            "urls": ["turn:turn.cloudflare.com:3478?transport=udp"],
            "username": "1705937079:tenant-42",
            "credential": "9f4a2b0f2f4b4a7f8a3b1eaf9a6f1d2e"
        }
    ]
}`;

const websocketSessionResponse = String.raw`{
    "session_id": "session-3a5d2e71-0d1f-4bd7-a0d1-8f3e6f2f0a91",
    "token": "tkn_9d12b7a3c9f8e1d4b5a6c7e8f9a0b1c2",
    "expires_at": "2026-01-22T16:09:12.000Z",
    "transport": "websocket",
    "webrtc_url": null,
    "websocket_url": "https://us-east.resona.dev/ws/audio",
    "cluster_slug": "us-east",
    "cluster_base_url": "https://us-east.resona.dev",
    "audio_format": {
        "input_codec": "pcm16",
        "input_sample_rate": 16000,
        "output_codec": "pcm16",
        "output_sample_rate": 48000
    }
}`;

const websocketHandshake = String.raw`{
    "type": "handshake",
    "session_id": "session-3a5d2e71-0d1f-4bd7-a0d1-8f3e6f2f0a91",
    "token": "tkn_9d12b7a3c9f8e1d4b5a6c7e8f9a0b1c2",
    "codec": "pcm16"
}`;

export default function Guide() {
    const [activeSection, setActiveSection] = useState('quickstart');

    return (
        <>
            <Head title="Guide" />
            <DocsLayout
                title="Integration Guide"
                subtitle="Build professional voice experiences with Resona - from first request to production launch."
                active="guide"
            >
                <DocsPageShell
                    nav={
                        <div className="flex flex-col gap-1">
                            {guideNav.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className={classes(
                                        'rounded-lg px-2 py-1.5 text-sm font-medium transition',
                                        activeSection === item.id
                                            ? 'bg-white/10 text-white'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    )}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    }
                    onSectionChange={setActiveSection}
                    aside={null}
                    main={
                        <div className="max-w-4xl space-y-24">
                            <section id="quickstart" className="scroll-mt-32">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>Quickstart</DocsEyebrow>}
                                    title="Ship in an afternoon."
                                    description="Create a profile, start a session, and stream audio over WebRTC or WebSocket."
                                />
                                <div className="mt-12 grid gap-6 sm:grid-cols-2">
                                    {quickstartSteps.map((step, index) => (
                                        <DocsStepCard
                                            key={step.title}
                                            index={index + 1}
                                            title={step.title}
                                            body={step.body}
                                        />
                                    ))}
                                </div>
                            </section>

                            <section id="base-urls" className="scroll-mt-32">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>Production</DocsEyebrow>}
                                    title="Base URLs"
                                    description="Resona separates the control plane from realtime clusters. Always use the cluster_base_url returned by session creation."
                                />
                                <div className="mt-8 flex flex-col gap-6">
                                    <DocsStatCard
                                        label="Control Plane"
                                        value="https://resona.dev/api"
                                        caption="REST API for profiles and sessions"
                                    />
                                    <DocsStatCard
                                        label="Realtime"
                                        value="https://<cluster_slug>.resona.dev"
                                        caption="Use cluster_base_url from session response"
                                    />
                                </div>
                            </section>

                            <section id="auth" className="scroll-mt-32">
                                <DocsCard variant="accent" size="md">
                                    <div className="space-y-6">
                                        <DocsSectionHeader
                                            eyebrow={<DocsEyebrow tone="accent">Security</DocsEyebrow>}
                                            title="Authentication"
                                            description="All REST requests include your secret API key in the Authorization header."
                                        />
                                        <DocsCodeBlock language="bash" code={String.raw`Authorization: Bearer <api_key>`} />
                                    </div>
                                </DocsCard>
                            </section>

                            <section id="agent-profiles" className="scroll-mt-32">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>Foundation</DocsEyebrow>}
                                    title="Agent Profiles"
                                    description="Profiles bundle system instructions, tools, and voice settings. Voice names are case-insensitive."
                                />
                                <div className="mt-8 space-y-10">
                                    <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-bold text-white">Voice</h3>
                                            <p className="text-[14px] text-slate-400">Use the voice name (e.g., Grant), case-insensitive.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-bold text-white">Domain context</h3>
                                            <p className="text-[14px] text-slate-400">Optional structured context for business facts.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-bold text-white">Tools</h3>
                                            <p className="text-[14px] text-slate-400">Provide strict JSON Schema for tool calls.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-bold text-white">Agent speaks first</h3>
                                            <p className="text-[14px] text-slate-400">Boolean flag for greeting behavior.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Create Profile (Request)</p>
                                        <DocsCodeBlock language="json" code={createProfileRequest} />
                                    </div>
                                </div>
                            </section>

                            <section id="tools-json" className="scroll-mt-32">
                                <DocsCard variant="deep" size="lg">
                                    <DocsSectionHeader
                                        title="Tools JSON Rules"
                                        description={
                                            <>
                                                Tools are validated strictly. Keep schemas small, explicit, and consistent.
                                                <br />
                                                <span className="mt-2 block text-xs font-medium text-slate-500">
                                                    Full validation rules, supported keywords, and format lists are documented in the API Reference.
                                                </span>
                                            </>
                                        }
                                    />
                                    <DocsChecklist
                                        items={[
                                            'Max 15 tools per profile; tools_json size must be 7,500 chars or less (minified).',
                                            'Provide input_schema or parameters for every tool, not both, and keep it consistent across all tools.',
                                            'Every object schema must include additionalProperties: false.',
                                            'Optional parameters across all tools cannot exceed 24.',
                                            'Max JSON Schema nesting depth is 5 levels.',
                                        ]}
                                        className="mt-8"
                                    />
                                </DocsCard>
                            </section>

                            <section id="sessions" className="scroll-mt-32">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>Realtime</DocsEyebrow>}
                                    title="Create a Session"
                                    description="Sessions are short-lived credentials tied to a specific transport and cluster."
                                />
                                <div className="mt-8 space-y-6">
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Create Session (Request)</p>
                                        <DocsCodeBlock language="json" code={createSessionRequest} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">WebRTC Response</p>
                                        <DocsCodeBlock language="json" code={webrtcSessionResponse} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">WebSocket Response</p>
                                        <DocsCodeBlock language="json" code={websocketSessionResponse} />
                                    </div>
                                </div>
                            </section>

                            <section id="webrtc" className="scroll-mt-32">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Transport</DocsEyebrow>}
                                        title="WebRTC Integration"
                                        description={
                                            <>
                                                Use WebRTC for low-latency audio plus a data channel for events.
                                                <br />
                                                <span className="mt-2 block text-xs font-medium text-slate-500">
                                                    Full SDP, signaling, and candidate payloads are listed in the API Reference.
                                                </span>
                                            </>
                                        }
                                    />
                                    <DocsChecklist
                                        items={[
                                            'Create a session with transport = webrtc and codec = pcm16.',
                                            'Create RTCPeerConnection using ice_servers from session response.',
                                            'Add microphone track and create data channel named events.',
                                            'POST SDP offer to webrtc_url, apply sdp_answer.',
                                            'Exchange ICE candidates using /webrtc/signal (preferred) or /webrtc/candidates.',
                                        ]}
                                        className="mt-8"
                                    />
                            </section>

                            <section id="websocket" className="scroll-mt-32">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>Transport</DocsEyebrow>}
                                    title="WebSocket Integration"
                                    description="WebSocket sessions carry audio frames and JSON events over a single connection."
                                />
                                <div className="mt-8 space-y-6">
                                    <DocsChecklist
                                        items={[
                                            'Create a session with transport = websocket (codec pcm16 or mulaw).',
                                            'Connect to websocket_url and send the handshake payload.',
                                            'Stream PCM16 or mulaw frames and listen for events.',
                                        ]}
                                    />
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Handshake</p>
                                        <DocsCodeBlock language="json" code={websocketHandshake} />
                                    </div>
                                </div>
                            </section>

                            <section id="events" className="scroll-mt-32">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>Events</DocsEyebrow>}
                                    title="Events & Tool Calls"
                                    description={
                                        <>
                                            Token events stream transcripts. Tool calls must be answered within 60 seconds.
                                            <br />
                                            <span className="mt-2 block text-xs font-medium text-slate-500">
                                                Full event payloads and error envelopes are in the API Reference.
                                            </span>
                                        </>
                                    }
                                />
                                <div className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-white">token</h3>
                                        <p className="text-[14px] text-slate-400">User/assistant transcripts over data channel or WebSocket.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-white">tool.call</h3>
                                        <p className="text-[14px] text-slate-400">Execute a tool and reply with tool.result.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-white">tool.result</h3>
                                        <p className="text-[14px] text-slate-400">Echo tool_use_id with response or error.</p>
                                    </div>
                                </div>
                            </section>

                            <section id="errors-limits" className="scroll-mt-32">
                                <DocsCard variant="muted" size="lg">
                                    <DocsSectionHeader
                                        title="Errors & Limits"
                                        description={
                                            <>
                                                Plan for validation errors, transport mismatches, and hard limits.
                                                <br />
                                                <span className="mt-2 block text-xs font-medium text-slate-500">
                                                    The full list of public error codes and limits is documented in the API Reference.
                                                </span>
                                            </>
                                        }
                                    />
                                    <DocsChecklist
                                        items={[
                                            'Tool calls time out after 60 seconds if no tool.result is returned.',
                                            'Profile name must be 2-48 characters and unique per user.',
                                            'System instructions are capped at 7,500 characters.',
                                            'WebRTC only supports pcm16; WebSocket supports pcm16 or mulaw.',
                                        ]}
                                        className="mt-8"
                                    />
                                </DocsCard>
                            </section>
                        </div>
                    }
                />
            </DocsLayout>
        </>
    );
}
