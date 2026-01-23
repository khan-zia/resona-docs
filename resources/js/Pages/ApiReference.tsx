import { Head } from '@inertiajs/react';
import DocsLayout from '../Layouts/DocsLayout';
import {
    DocsBadge,
    DocsCard,
    DocsChecklist,
    DocsCodeBlock,
    DocsEndpointGroup,
    DocsEyebrow,
    DocsKeyValueList,
    DocsPageShell,
    DocsSectionHeader,
    DocsStatCard,
    DocsTable,
} from '../components/docs';
import classes from '../utils/classes';
import { useState } from 'react';

const apiNav = [
    { id: 'base-urls', label: 'Base URLs' },
    { id: 'auth', label: 'Authentication' },
    { id: 'voices', label: 'Voices Catalog' },
    { id: 'agent-object', label: 'Agent Profile Object' },
    { id: 'domain-context', label: 'Domain Context' },
    { id: 'system-instructions', label: 'System Instructions' },
    { id: 'tools-json', label: 'Tools JSON Rules' },
    { id: 'agent-endpoints', label: 'Agent Profile Endpoints' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'websocket', label: 'WebSocket Transport' },
    { id: 'webrtc-sdp', label: 'WebRTC SDP' },
    { id: 'webrtc-ice', label: 'WebRTC ICE Signaling' },
    { id: 'events', label: 'Realtime Events' },
    { id: 'errors', label: 'Error Events' },
    { id: 'limits', label: 'Limits' },
];

const voiceRows = [
    ['Mateo', 'Best for Spanish, steady & formal', 'Best for Spanish'],
    ['Clara', 'Best for Spanish, crisp & calm', 'Best for Spanish'],
    ['Lukas', 'Best for German, smooth & subtle', 'Best for German'],
    ['Frida', 'Best for German, warm & energetic', 'Best for German'],
    ['Luc', 'Best for French, clear & formal', 'Best for French'],
    ['Rui', 'Best for Portuguese, calm & clear', 'Best for Portuguese'],
    ['Sofia', 'Best for Portuguese, friendly & natural', 'Best for Portuguese'],
    ['Nabil', 'Best for Arabic, crisp & confident', 'Best for Arabic'],
    ['Layla', 'Best for Arabic, natural & clear', 'Best for Arabic'],
    ['Elif', 'Best for Turkish, friendly & clear', 'Best for Turkish'],
    ['Oskar', 'Best for Swedish, natural & relaxed', 'Best for Swedish'],
    ['Luca', 'Best for Italian, crisp & charismatic', 'Best for Italian'],
    ['Irina', 'Best for Russian, friendly & formal', 'Best for Russian'],
];

const generalVoices = [
    ['Grant', 'Deep, resonant & stoic', 'Best for English'],
    ['Aiden', 'Bright, uplifting, gentle', 'Best for English'],
    ['Mira', 'Calm, steady & approachable', 'Best for English'],
    ['Derek', 'Confident, enunciating & energetic', 'Best for English'],
    ['Lena', 'Lively, warm & expressive', 'Best for English'],
    ['Theo', 'Soft, friendly & laid-back', 'Best for English'],
    ['Rupert', 'British, clear & mature', 'Best for English'],
];

const allVoiceRows = [...generalVoices, ...voiceRows];

const endpointGroups = [
    {
        title: 'Agent profiles',
        description: 'Create, update, and delete profiles.',
        endpoints: [
            { method: 'POST', path: '/api/v1/agent-profiles' },
            { method: 'PUT', path: '/api/v1/agent-profiles/{agent_id}' },
            { method: 'DELETE', path: '/api/v1/agent-profiles/{agent_id}' },
        ],
    },
    {
        title: 'Sessions',
        description: 'Create realtime sessions for WebRTC or WebSocket.',
        endpoints: [{ method: 'POST', path: '/api/v1/sessions' }],
    },
];

const agentProfileResponse = String.raw`{
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
}`;

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

const createProfileValidationError = String.raw`{
    "message": "The name field must be at least 2 characters.",
    "errors": {
        "name": ["Profile name must be at least 2 characters."]
    }
}`;

const updateProfileRequest = String.raw`{
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
}`;

const toolsValidationError = String.raw`{
    "message": "The given data was invalid.",
    "errors": {
        "tools_json": ["Tool #1 name must match /^[a-zA-Z0-9_-]{1,64}$/."]
    }
}`;

const deleteProfileResponse = String.raw`{ "message": "Profile deleted successfully." }`;

const deleteProfileError = String.raw`{
    "message": "The given data was invalid.",
    "errors": {
        "profile": ["Cannot delete your last profile."]
    }
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

const sessionValidationError = String.raw`{
    "message": "The given data was invalid.",
    "errors": {
        "agent_id": ["Agent profile id must be a valid agent identifier"]
    }
}`;

const websocketHandshake = String.raw`{
    "type": "handshake",
    "session_id": "session-3a5d2e71-0d1f-4bd7-a0d1-8f3e6f2f0a91",
    "token": "tkn_9d12b7a3c9f8e1d4b5a6c7e8f9a0b1c2",
    "codec": "pcm16"
}`;

const websocketAck = String.raw`{
    "type": "ack",
    "session_id": "session-3a5d2e71-0d1f-4bd7-a0d1-8f3e6f2f0a91",
    "status": "ready"
}`;

const webrtcSdpRequest = String.raw`{
    "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
    "token": "tkn_1f9b3a7c9d4e8b2a5c7d9e1f3a5b7c9d",
    "sdp_offer": "v=0\r\no=- 46117352 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111 0 8\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:w1vT\r\na=ice-pwd:7gq1lBf9pW3uV1cYhZb3Pq\r\na=ice-options:trickle\r\na=fingerprint:sha-256 2A:97:5B:3C:8D:AA:14:1F:6E:11:40:9B:6E:3F:10:5D:81:5D:33:24:6F:AF:05:FE:E2:43:CB:19:60:4B:65:2E\r\na=setup:actpass\r\na=mid:0\r\na=sendrecv\r\na=rtcp-mux\r\na=rtcp-rsize\r\na=rtpmap:111 opus/48000/2\r\na=fmtp:111 minptime=10;useinbandfec=1;stereo=0;sprop-stereo=0;maxplaybackrate=48000\r\na=rtpmap:0 PCMU/8000\r\na=rtpmap:8 PCMA/8000\r\na=ssrc:12345678 cname:audio",
    "ice_restart": false
}`;

const webrtcSdpResponse = String.raw`{
    "sdp_answer": "v=0\r\no=- 89123711 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=msid-semantic: WMS\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111 0 8\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:K8pB\r\na=ice-pwd:5PpH2q7GmS0dQeYc4Wn1Yb\r\na=ice-options:trickle\r\na=fingerprint:sha-256 6F:3A:21:7C:9D:22:66:8E:4A:33:9B:CE:AA:18:9D:04:2B:77:11:42:6A:9C:5E:17:FE:AC:3A:BC:01:9F:20:BE\r\na=setup:active\r\na=mid:0\r\na=sendrecv\r\na=rtcp-mux\r\na=rtpmap:111 opus/48000/2\r\na=fmtp:111 minptime=10;useinbandfec=1;stereo=0;sprop-stereo=0;maxplaybackrate=48000\r\na=rtpmap:0 PCMU/8000\r\na=rtpmap:8 PCMA/8000\r\na=ssrc:87654321 cname:audio",
    "ice_servers": [
        {
            "urls": ["turn:turn.cloudflare.com:3478?transport=udp"],
            "username": "1705937079:tenant-42",
            "credential": "9f4a2b0f2f4b4a7f8a3b1eaf9a6f1d2e"
        }
    ],
    "peer_connection_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df"
}`;

const webrtcSignalHandshake = String.raw`{
    "type": "handshake",
    "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
    "token": "tkn_1f9b3a7c9d4e8b2a5c7d9e1f3a5b7c9d"
}`;

const webrtcSignalAck = String.raw`{
    "type": "ack",
    "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df"
}`;

const webrtcClientCandidates = String.raw`{
    "type": "candidate",
    "candidates": [
        {
            "candidate": "candidate:1 1 udp 2122260223 192.168.1.5 61922 typ host",
            "sdpMid": "0",
            "sdpMLineIndex": 0,
            "usernameFragment": "w1vT"
        }
    ],
    "complete": false
}`;

const webrtcServerCandidate = String.raw`{
    "type": "ice.candidate",
    "candidate": {
        "candidate": "candidate:2 1 udp 2122260223 10.0.0.12 53455 typ host",
        "sdpMid": "0",
        "sdpMLineIndex": 0
    }
}`;

const webrtcCandidateComplete = String.raw`{ "type": "ice.candidate.complete" }`;

const webrtcHttpCandidatesRequest = String.raw`{
    "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
    "token": "tkn_1f9b3a7c9d4e8b2a5c7d9e1f3a5b7c9d",
    "candidates": [
        {
            "candidate": "candidate:1 1 udp 2122260223 192.168.1.5 61922 typ host",
            "sdpMid": "0",
            "sdpMLineIndex": 0,
            "usernameFragment": "w1vT"
        }
    ],
    "complete": false,
    "wait": true,
    "timeout_ms": 5000
}`;

const webrtcHttpCandidatesResponse = String.raw`{
    "candidates": [
        {
            "candidate": "candidate:2 1 udp 2122260223 10.0.0.12 53455 typ host",
            "sdpMid": "0",
            "sdpMLineIndex": 0
        }
    ],
    "complete": false
}`;

const tokenEventUser = String.raw`{
    "type": "token",
    "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
    "timestamp": "2026-01-22T15:10:12.114Z",
    "tokens": [
        {
            "text": "Hello ",
            "isFinal": false,
            "speaker": "1"
        },
        {
            "text": "there",
            "isFinal": true,
            "speaker": "1"
        }
    ]
}`;

const tokenEventAssistant = String.raw`{
    "type": "token",
    "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
    "timestamp": "2026-01-22T15:10:20.881Z",
    "tokens": [
        {
            "text": "Hi, how can I help today?",
            "isFinal": true,
            "speaker": "assistant"
        }
    ]
}`;

const toolCallEvent = String.raw`{
    "type": "tool.call",
    "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
    "timestamp": "2026-01-22T15:10:32.381Z",
    "payload": {
        "tool_use_id": "toolu_01HPT0VQ8F2QK2K0D2G4Z9QJ1A",
        "name": "lookup_customer",
        "arguments": { "phone": "+1 415 555 0142" }
    }
}`;

const toolResultEvent = String.raw`{
    "type": "tool.result",
    "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
    "timestamp": "2026-01-22T15:10:35.902Z",
    "payload": {
        "tool_use_id": "toolu_01HPT0VQ8F2QK2K0D2G4Z9QJ1A",
        "response": {
            "customer_id": "cust_921",
            "name": "Taylor Reed",
            "last_visit": "2025-11-04"
        },
        "error": null,
        "summary": "Customer found"
    }
}`;

const errorInvalidHandshake = String.raw`{ "type": "error", "code": "invalid_handshake", "message": "Handshake payload must be valid JSON" }`;

const errorInvalidToken = String.raw`{ "type": "error", "code": "invalid_token", "message": "Handshake token is invalid or expired" }`;

const errorCodecMismatch = String.raw`{ "type": "error", "code": "codec_mismatch", "message": "Requested codec pcm16 does not match session codec mulaw" }`;

const errorInvalidChannel = String.raw`{ "type": "error", "code": "invalid_channel", "message": "Session channel does not support WebRTC signaling" }`;

const errorHandshakeRequired = String.raw`{ "type": "error", "code": "handshake_required", "message": "Handshake frame required before events" }`;

const errorInvalidEvent = String.raw`{ "type": "error", "code": "invalid_event", "message": "Event payload must be valid JSON" }`;

const errorLimitExceeded = String.raw`{
    "type": "error",
    "code": "limit_exceeded",
    "message": "Concurrent session limit exceeded for tenant",
    "timestamp": "2026-01-22T15:11:02.119Z"
}`;

export default function ApiReference() {
    const [activeSection, setActiveSection] = useState('base-urls');

    return (
        <>
            <Head title="API Reference" />
            <DocsLayout
                title="API Reference"
                subtitle="The complete technical specification for Resona's public REST and realtime APIs."
                active="api"
            >
                <DocsPageShell
                    nav={
                        <div className="flex flex-col gap-1">
                            {apiNav.map((item) => (
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
                            <section id="base-urls" className="scroll-mt-32">
                                <DocsSectionHeader
                                    title="Production URL Conventions"
                                    description="Use resona.dev for control plane requests and the cluster base URL for realtime endpoints."
                                />
                                <div className="mt-8 flex flex-col gap-6">
                                    <DocsStatCard
                                        label="Control Plane"
                                        value="https://resona.dev/api"
                                        caption="REST API base"
                                    />
                                    <DocsStatCard
                                        label="Realtime Cluster"
                                        value="https://<cluster_slug>.resona.dev"
                                        caption="Example: https://us-east.resona.dev"
                                    />
                                </div>
                                <p className="mt-6 text-sm text-slate-400">
                                    Session creation returns cluster_slug and cluster_base_url. Always use those values for realtime URLs.
                                </p>
                            </section>

                            <section id="auth" className="scroll-mt-32">
                                <DocsCard size="md">
                                    <div className="space-y-6">
                                        <DocsSectionHeader
                                            eyebrow={<DocsEyebrow>Security</DocsEyebrow>}
                                            title="Authentication"
                                            description="All REST requests must include your secret API key in the Authorization header."
                                        />
                                        <DocsCodeBlock language="bash" code={String.raw`Authorization: Bearer <api_key>`} />
                                    </div>
                                </DocsCard>
                            </section>

                            <section id="voices" className="scroll-mt-32">
                                    <DocsSectionHeader
                                        title="Voices Catalog"
                                        description={
                                            <>
                                                Voice names are case-insensitive in requests and normalized internally.
                                                <br />
                                                <span className="mt-2 block text-xs font-medium text-slate-500">
                                                    All voices can be used across Resona-supported languages, but the "Best for" voices above are tuned for those languages.
                                                </span>
                                            </>
                                        }
                                    />
                                    <div className="mt-8">
                                        <DocsTable
                                            headers={['Name', 'Description', 'Language hint']}
                                            rows={allVoiceRows}
                                        />
                                    </div>
                            </section>

                            <section id="agent-object" className="scroll-mt-32">
                                <DocsSectionHeader
                                    title="Agent Profile Object"
                                    description="This is the full response shape returned by create/update requests."
                                />
                                <div className="mt-8 space-y-10">
                                    <DocsCodeBlock language="json" code={agentProfileResponse} />
                                    <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-bold text-white"><code>agent_id</code></h3>
                                            <p className="text-[14px] text-slate-400">Route key (not the numeric database id).</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-bold text-white"><code>voice</code></h3>
                                            <p className="text-[14px] text-slate-400">Unique voice name from the catalog, case-insensitive in requests.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-bold text-white"><code>tools_json</code></h3>
                                            <p className="text-[14px] text-slate-400">Stored as JSON and returned as an array.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-bold text-white"><code>domain_context</code></h3>
                                            <p className="text-[14px] text-slate-400">Stored as JSON and returned as an object (or null).</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="domain-context" className="scroll-mt-32">
                                <DocsSectionHeader
                                    title="Domain Context"
                                    description="Optional structured context that helps the model understand your business."
                                />
                                <div className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-white">context.text</h3>
                                        <p className="text-[14px] text-slate-400">Freeform background or memory (max 2000 chars). Prefer this over bloating system_instructions.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-white">context.general</h3>
                                        <p className="text-[14px] text-slate-400">Array of key/value facts (hours, timezone, locations).</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-white">context.terms</h3>
                                        <p className="text-[14px] text-slate-400">Canonical terms, acronyms, or spellings the model should use.</p>
                                    </div>
                                </div>
                            </section>

                            <section id="system-instructions" className="scroll-mt-32">
                                <DocsCard variant="deep" size="lg">
                                    <DocsSectionHeader
                                        title="System Instructions Guidance"
                                        description="Use system_instructions for business policies, tone, and personality only."
                                    />
                                    <DocsChecklist
                                        className="mt-8"
                                        items={[
                                            'Do not describe tool-calling behavior in system_instructions.',
                                            'Keep tool behavior details inside tools_json schemas.',
                                            'Use clear tool names, descriptions, and precise input schemas.',
                                        ]}
                                    />
                                </DocsCard>
                            </section>

                            <section id="tools-json" className="scroll-mt-32">
                                <DocsSectionHeader
                                    title="Tools JSON Validation Rules"
                                    description="tools_json is validated strictly. Requests are rejected if any tool violates these rules."
                                />
                                <div className="mt-12 space-y-16">
                                    <div className="space-y-6">
                                        <DocsSectionHeader
                                            title="Tool List Limits"
                                            titleClassName="!text-lg"
                                            description={
                                                <>
                                                    Hard caps enforced by the API.
                                                    <br />
                                                    <span className="mt-1 block text-xs font-medium text-slate-500">
                                                        Optional parameters are calculated as properties minus required across the entire tools array.
                                                    </span>
                                                </>
                                            }
                                        />
                                        <div className="grid gap-x-12 gap-y-6 sm:grid-cols-3">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Max tools</p>
                                                <p className="text-xl font-bold text-white">15</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Size limit</p>
                                                <p className="text-xl font-bold text-white">7,500 <span className="text-xs font-normal text-slate-400">chars</span></p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Optional params</p>
                                                <p className="text-xl font-bold text-white">24</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <DocsSectionHeader
                                            title="Tool Object Shape"
                                            titleClassName="!text-lg"
                                            description="Each tool object may only contain these top-level keys."
                                        />
                                        <DocsChecklist
                                            items={[
                                                'Allowed keys: name, description, input_schema, parameters.',
                                                'name is required and must match ^[a-zA-Z0-9_-]{1,64}$.',
                                                'description is optional but must be a string.',
                                                'Provide input_schema or parameters, not both.',
                                                'All tools in a request must use the same key (input_schema or parameters).',
                                                'input_schema/parameters must be a JSON Schema object.',
                                            ]}
                                        />
                                    </div>

                                    <div className="space-y-6">
                                        <DocsSectionHeader
                                            title="Strict Object Rules"
                                            titleClassName="!text-lg"
                                            description="These apply to every object schema, including nested ones."
                                        />
                                        <DocsChecklist
                                            items={[
                                                'additionalProperties is required and must be false.',
                                                'properties is required and must be an object keyed by parameter names.',
                                                'required is required, must be an array of strings, and every entry must exist in properties.',
                                                'Max nesting depth is 5 levels.',
                                            ]}
                                        />
                                    </div>

                                    <div className="grid gap-12 sm:grid-cols-2">
                                        <div className="space-y-6">
                                            <DocsSectionHeader
                                                title="JSON Schema Types"
                                                titleClassName="!text-lg"
                                                description="Accepted types."
                                            />
                                            <DocsTable
                                                headers={['Type']}
                                                rows={[['object'], ['array'], ['string'], ['integer'], ['number'], ['boolean'], ['null']]}
                                            />
                                        </div>
                                        <div className="space-y-6">
                                            <DocsSectionHeader
                                                title="String Formats"
                                                titleClassName="!text-lg"
                                                description="Allowed formats."
                                            />
                                            <DocsTable
                                                headers={['Format']}
                                                rows={[
                                                    ['date-time'], ['time'], ['date'], ['duration'], ['email'],
                                                    ['hostname'], ['uri'], ['ipv4'], ['ipv6'], ['uuid']
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <DocsSectionHeader
                                            title="Allowed Keywords"
                                            titleClassName="!text-lg"
                                            description="The validator only supports a strict subset of JSON Schema."
                                        />
                                        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Allowed</p>
                                                <div className="flex flex-wrap gap-2 text-sm leading-relaxed text-slate-300">
                                                    <code>type</code>, <code>properties</code>, <code>required</code>, <code>items</code>, <code>enum</code>, <code>const</code>, <code>format</code>, <code>pattern</code>, <code>anyOf</code>, <code>allOf</code>, <code>$ref</code>, <code>$defs</code>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Not supported</p>
                                                <div className="flex flex-wrap gap-2 text-sm leading-relaxed text-slate-400">
                                                    <code>oneOf</code>, <code>not</code>, <code>if</code>, <code>then</code>, <code>else</code>, <code>minimum</code>, <code>maximum</code>, <code>minLength</code>, <code>maxLength</code>, <code>maxItems</code>, <code>uniqueItems</code>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <DocsSectionHeader
                                            title="$ref and pattern rules"
                                            titleClassName="!text-lg"
                                            description="Additional validation rules for references and regex patterns."
                                        />
                                        <DocsChecklist
                                            items={[
                                                '$ref must be local (starts with #).',
                                                'Recursive references are rejected.',
                                                '$ref is not allowed inside allOf.',
                                                'pattern cannot include backreferences, lookahead/lookbehind, or word-boundary tokens.',
                                                'Quantifiers {n} or {n,m} are allowed only when n/m are 99 or less.',
                                            ]}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section id="agent-endpoints" className="scroll-mt-32">
                                <DocsSectionHeader
                                    title="Agent Profile Endpoints"
                                    description="Base URL: https://resona.dev"
                                />
                                <div className="mt-8 space-y-6">
                                    {endpointGroups.filter((g) => g.title === 'Agent profiles').map((group) => (
                                        <DocsEndpointGroup
                                            key={group.title}
                                            title={group.title}
                                            description={group.description}
                                            endpoints={group.endpoints}
                                        />
                                    ))}
                                </div>
                                <div className="mt-10 space-y-10">
                                    <div className="space-y-4">
                                        <DocsBadge tone="emerald">POST /api/v1/agent-profiles</DocsBadge>
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Create Profile (Request)</p>
                                        <DocsCodeBlock language="json" code={createProfileRequest} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Create Profile (201 Response)</p>
                                        <DocsCodeBlock language="json" code={agentProfileResponse} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Validation Error (422)</p>
                                        <DocsCodeBlock language="json" code={createProfileValidationError} />
                                    </div>
                                    <div className="space-y-4">
                                        <DocsBadge tone="cyan">PUT /api/v1/agent-profiles/{'{agent_id}'}</DocsBadge>
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Update Profile (Request)</p>
                                        <DocsCodeBlock language="json" code={updateProfileRequest} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Tools Validation Error (422)</p>
                                        <DocsCodeBlock language="json" code={toolsValidationError} />
                                    </div>
                                    <div className="space-y-4">
                                        <DocsBadge tone="slate">DELETE /api/v1/agent-profiles/{'{agent_id}'}</DocsBadge>
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Delete Profile (200)</p>
                                        <DocsCodeBlock language="json" code={deleteProfileResponse} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Delete Last Profile Error (422)</p>
                                        <DocsCodeBlock language="json" code={deleteProfileError} />
                                    </div>
                                </div>
                            </section>

                            <section id="sessions" className="scroll-mt-32">
                                <DocsSectionHeader
                                    title="Sessions"
                                    description="Create short-lived credentials for realtime connections."
                                />
                                <div className="mt-8 space-y-6">
                                    {endpointGroups.filter((g) => g.title === 'Sessions').map((group) => (
                                        <DocsEndpointGroup
                                            key={group.title}
                                            title={group.title}
                                            description={group.description}
                                            endpoints={group.endpoints}
                                        />
                                    ))}
                                </div>
                                <div className="mt-10 space-y-8">
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Create Session (Request)</p>
                                        <DocsCodeBlock language="json" code={createSessionRequest} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">WebRTC Response (201)</p>
                                        <DocsCodeBlock language="json" code={webrtcSessionResponse} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">WebSocket Response (201)</p>
                                        <DocsCodeBlock language="json" code={websocketSessionResponse} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Validation Error (422)</p>
                                        <DocsCodeBlock language="json" code={sessionValidationError} />
                                    </div>
                                </div>
                                <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-emerald-400">transport</h4>
                                        <p className="text-sm leading-relaxed text-slate-400">Required. <code className="text-emerald-400">webrtc</code> or <code className="text-emerald-400">websocket</code>.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-emerald-400">codec</h4>
                                        <p className="text-sm leading-relaxed text-slate-400">Optional. Defaults to <code className="text-emerald-400">pcm16</code>. WebRTC requires <code className="text-emerald-400">pcm16</code>; WebSocket supports <code className="text-emerald-400">pcm16</code> or <code className="text-emerald-400">mulaw</code>.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-emerald-400">WebRTC input sample rate</h4>
                                        <p className="text-sm leading-relaxed text-slate-400">Any value &gt;= 16000 (not returned in response).</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-emerald-400">ICE servers</h4>
                                        <p className="text-sm leading-relaxed text-slate-400">Provisioned via Cloudflare TURN.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-emerald-400">WebSocket audio_format</h4>
                                        <p className="text-sm leading-relaxed text-slate-400"><code className="text-emerald-400">pcm16</code>: input 16000/output 48000; <code className="text-emerald-400">mulaw</code>: input 8000/output 8000.</p>
                                    </div>
                                </div>
                            </section>

                            <section id="websocket" className="scroll-mt-32">
                                <DocsSectionHeader
                                    title="WebSocket Transport"
                                    description="Full audio and events over WebSocket."
                                />
                                <div className="mt-8 space-y-8">
                                    <div className="space-y-4">
                                        <DocsBadge tone="cyan">Handshake</DocsBadge>
                                        <DocsCodeBlock language="json" code={websocketHandshake} />
                                    </div>
                                    <div className="space-y-4">
                                        <DocsBadge tone="emerald">Server ACK</DocsBadge>
                                        <DocsCodeBlock language="json" code={websocketAck} />
                                    </div>
                                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold text-emerald-400">Inbound audio</h4>
                                            <p className="text-sm leading-relaxed text-slate-400">16 kHz mono PCM16 little-endian (20ms chunks recommended).</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold text-emerald-400">Outbound audio (pcm16)</h4>
                                            <p className="text-sm leading-relaxed text-slate-400">Raw PCM16 frames at 48 kHz.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold text-emerald-400">Outbound audio (mulaw)</h4>
                                            <p className="text-sm leading-relaxed text-slate-400">Mulaw frames at 8 kHz.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="webrtc-sdp" className="scroll-mt-32">
                                <DocsSectionHeader
                                    title="WebRTC SDP Negotiation"
                                    description="POST your SDP offer to the webrtc_url from session creation."
                                />
                                <div className="mt-8 space-y-8">
                                    <DocsBadge tone="emerald">POST /webrtc/sdp</DocsBadge>
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Request</p>
                                        <DocsCodeBlock language="json" code={webrtcSdpRequest} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Response</p>
                                        <DocsCodeBlock language="json" code={webrtcSdpResponse} />
                                    </div>
                                    <DocsChecklist
                                        items={[
                                            'ice_restart is required only when renegotiating an existing peer.',
                                            'If you call /webrtc/sdp while a peer is active and ice_restart is false, the server returns a conflict error.',
                                            'sdp_offer must be a non-empty string and session_id/token must be valid.',
                                            'The server validates that the session is WebRTC-capable before negotiating.',
                                        ]}
                                    />
                                </div>
                            </section>

                            <section id="webrtc-ice" className="scroll-mt-32">
                                <DocsSectionHeader
                                    title="WebRTC ICE Candidate Exchange"
                                    description="Use WebSocket signaling (preferred) or HTTP polling as a fallback."
                                />
                                <div className="mt-8 space-y-10">
                                    <div className="space-y-8">
                                        <DocsSectionHeader
                                            title="A) WebSocket signaling"
                                            titleClassName="!text-lg"
                                            description="Endpoint: wss://<cluster_slug>.resona.dev/webrtc/signal"
                                        />
                                        <div className="mt-6 space-y-6">
                                            <div className="space-y-4">
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Client handshake</p>
                                                <DocsCodeBlock language="json" code={webrtcSignalHandshake} />
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Server ACK</p>
                                                <DocsCodeBlock language="json" code={webrtcSignalAck} />
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Client candidate payload</p>
                                                <DocsCodeBlock language="json" code={webrtcClientCandidates} />
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Server candidate payload</p>
                                                <DocsCodeBlock language="json" code={webrtcServerCandidate} />
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Completion</p>
                                                <DocsCodeBlock language="json" code={webrtcCandidateComplete} />
                                            </div>
                                            <DocsChecklist
                                                items={[
                                                    'Handshake must be the first message on the signaling socket.',
                                                    'Send candidates as they are gathered; use complete: true when done.',
                                                    'Server sends ice.candidate events and then ice.candidate.complete.',
                                                    'No control commands are sent to clients over signaling.',
                                                    'To restart ICE, create a new SDP offer (ICE restart enabled) and call /webrtc/sdp with ice_restart true.',
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <DocsSectionHeader
                                            title="B) HTTP polling"
                                            titleClassName="!text-lg"
                                            description="Endpoint: https://<cluster_slug>.resona.dev/webrtc/candidates"
                                        />
                                        <div className="mt-6 space-y-6">
                                            <div className="space-y-4">
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Request</p>
                                                <DocsCodeBlock language="json" code={webrtcHttpCandidatesRequest} />
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Response</p>
                                                <DocsCodeBlock language="json" code={webrtcHttpCandidatesResponse} />
                                            </div>
                                            <DocsChecklist
                                                items={[
                                                    'This endpoint can upload local candidates and poll for remote candidates in one call.',
                                                    'wait: true enables long-polling; timeout_ms is clamped between 100 and 15000 ms.',
                                                    'timeout_ms defaults to 5000 ms if omitted.',
                                                    'complete: true signals that local ICE gathering is finished (candidates may be omitted).',
                                                    'If wait is false, responses are immediate and may include previously returned candidates; deduplicate by candidate string if needed.',
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="events" className="scroll-mt-32">
                                <DocsSectionHeader
                                    title="Realtime Event Envelopes"
                                    description="Events are delivered over WebSocket or WebRTC data channel."
                                />
                                <div className="mt-8 space-y-10">
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Token event (user speech)</p>
                                        <DocsCodeBlock language="json" code={tokenEventUser} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Token event (assistant)</p>
                                        <DocsCodeBlock language="json" code={tokenEventAssistant} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Tool call</p>
                                        <DocsCodeBlock language="json" code={toolCallEvent} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Tool result</p>
                                        <DocsCodeBlock language="json" code={toolResultEvent} />
                                    </div>
                                </div>
                                <DocsChecklist
                                    className="mt-8"
                                    items={[
                                        'Events are JSON objects with type and optional session_id, timestamp, and payload.',
                                        'Some events can omit session_id or timestamp (token events and handshake errors may omit them).',
                                        'Token events only include text, isFinal, and optional speaker. No confidence or per-token timing fields are emitted.',
                                        'tool.call must be answered within 60 seconds with tool.result.',
                                        'If you cannot execute a tool, send tool.result with error populated.',
                                        'tool.result requires tool_use_id; if missing or unknown, the server ignores the result.',
                                        'tool.result error values mark a call as failed; summary is optional.',
                                        'Large tool responses are truncated to 1500 characters internally.',
                                    ]}
                                />
                                <div className="mt-8">
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-emerald-400">Data channel</h4>
                                        <p className="text-sm leading-relaxed text-slate-400"><code className="text-emerald-400">Label: events</code>, <code className="text-emerald-400">ordered: true</code></p>
                                    </div>
                                </div>
                            </section>

                            <section id="errors" className="scroll-mt-32">
                                <DocsSectionHeader
                                    title="Error Events"
                                    description="Error events are terminal and the socket is closed immediately after they are sent. session_id and timestamp may be omitted for handshake errors."
                                />
                                <div className="mt-8 space-y-6">
                                    <DocsCodeBlock language="json" code={errorInvalidHandshake} />
                                    <DocsCodeBlock language="json" code={errorInvalidToken} />
                                    <DocsCodeBlock language="json" code={errorCodecMismatch} />
                                    <DocsCodeBlock language="json" code={errorInvalidChannel} />
                                    <DocsCodeBlock language="json" code={errorHandshakeRequired} />
                                    <DocsCodeBlock language="json" code={errorInvalidEvent} />
                                    <DocsCodeBlock language="json" code={errorLimitExceeded} />
                                </div>
                            </section>

                            <section id="limits" className="scroll-mt-32">
                                <DocsSectionHeader
                                    title="Key Constraints and Limits"
                                    description="These limits apply to all public API usage."
                                />
                                <div className="mt-8">
                                    <DocsTable
                                        headers={['Constraint', 'Limit']}
                                        rows={[
                                            ['Profile name', '2-48 characters, unique per user'],
                                            ['System instructions', '7,500 characters'],
                                            ['Session duration', 'Up to 120 minutes (2 hours)'],
                                            ['Tools per profile', '15 max'],
                                            ['Tools JSON size', '7,500 characters (minified)'],
                                            ['Optional tool parameters', '24 max across all tools'],
                                            ['Domain context text', '2,000 characters'],
                                            ['Transport', 'Required: webrtc or websocket'],
                                            ['Codec', 'Defaults to pcm16; WebRTC only pcm16; WebSocket pcm16 or mulaw'],
                                        ]}
                                    />
                                </div>
                            </section>
                        </div>
                    }
                />
            </DocsLayout>
        </>
    );
}
