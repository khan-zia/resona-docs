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
    DocsStepCard,
} from '../components/docs';

const guideNav = [
    { id: 'quickstart', label: 'Quickstart' },
    { id: 'authentication', label: 'Authentication' },
    { id: 'agent-profiles', label: 'Agent profiles' },
    { id: 'start-session', label: 'Start a session' },
    { id: 'webrtc', label: 'WebRTC sessions' },
    { id: 'websocket', label: 'WebSocket sessions' },
    { id: 'events-tools', label: 'Events & tool calls' },
    { id: 'audio-formats', label: 'Audio formats' },
    { id: 'webhooks', label: 'Webhooks' },
    { id: 'limits-retries', label: 'Limits & retries' },
];

const quickstartSteps = [
    {
        title: 'Create an API key',
        body: 'Generate a key in the Resona dashboard and store it in your backend.',
    },
    {
        title: 'Create an agent profile',
        body: 'Define instructions, a voice, and tools that your agent can call.',
    },
    {
        title: 'Start a session',
        body: 'Request a session token and realtime URL for WebRTC or WebSocket.',
    },
    {
        title: 'Stream audio + events',
        body: 'Send audio frames and respond to tool calls as they arrive.',
    },
];

const productionChecklist = [
    'Keep API keys on the server; never ship them to browsers.',
    'Use the session token + cluster URL from the session response for realtime connections.',
    'Handle tool.call events and reply with tool.result within the same session.',
    'Reconnect by creating a new session after errors or timeouts.',
];

const createAgentProfileCurl = String.raw`curl -X POST https://api.resona.ai/v1/agent-profiles \
  -H "Authorization: Bearer $RESONA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Concierge",
    "voice_id": 12,
    "system_instructions": "You are a helpful concierge for hotel bookings.",
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
  }'`;

const createSessionCurl = String.raw`curl -X POST https://api.resona.ai/v1/sessions \
  -H "Authorization: Bearer $RESONA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agent-8fef6f3c-2f1a-4e5c-b4d6-6d1c9f36a4a1",
    "transport": "webrtc",
    "codec": "pcm16"
  }'`;

const sessionResponseJson = String.raw`{
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
    {
      "urls": ["stun:stun.cloudflare.com:3478"],
      "username": "resona",
      "credential": "..."
    }
  ]
}`;

const webrtcSnippet = String.raw`const session = await fetch('/v1/sessions', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ agent_id: agentId, transport: 'webrtc', codec: 'pcm16' }),
}).then((res) => res.json());

const pc = new RTCPeerConnection({ iceServers: session.ice_servers });
const events = pc.createDataChannel('events');

events.onmessage = (event) => {
  const payload = JSON.parse(event.data);
  handleRealtimeEvent(payload);
};

pc.onicecandidate = async (event) => {
  if (!event.candidate) {
    await fetch(session.cluster_base_url + '/webrtc/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: session.session_id,
        token: session.token,
        complete: true,
      }),
    });
    return;
  }

  await fetch(session.cluster_base_url + '/webrtc/candidates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: session.session_id,
      token: session.token,
      candidates: [event.candidate],
    }),
  });
};

const media = await navigator.mediaDevices.getUserMedia({ audio: true });
media.getTracks().forEach((track) => pc.addTrack(track, media));

const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

const sdpAnswer = await fetch(session.webrtc_url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    session_id: session.session_id,
    token: session.token,
    sdp_offer: offer.sdp,
  }),
}).then((res) => res.json());

await pc.setRemoteDescription({ type: 'answer', sdp: sdpAnswer.sdp_answer });`;

const websocketSnippet = String.raw`const session = await fetch('/v1/sessions', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ agent_id: agentId, transport: 'websocket', codec: 'pcm16' }),
}).then((res) => res.json());

const ws = new WebSocket(session.websocket_url);
ws.binaryType = 'arraybuffer';

ws.onopen = () => {
  ws.send(
    JSON.stringify({
      type: 'handshake',
      session_id: session.session_id,
      token: session.token,
      codec: 'pcm16',
    }),
  );
};

ws.onmessage = (event) => {
  if (typeof event.data === 'string') {
    const payload = JSON.parse(event.data);
    handleRealtimeEvent(payload);
  }
};

function sendPcmFrame(frame) {
  ws.send(frame);
}

function sendToolResult(toolUseId, response) {
  ws.send(
    JSON.stringify({
      type: 'tool.result',
      session_id: session.session_id,
      timestamp: new Date().toISOString(),
      payload: {
        tool_use_id: toolUseId,
        response,
      },
    }),
  );
}`;

const tokenEventExample = String.raw`{
  "type": "token",
  "tokens": [
    { "text": "Hello!", "isFinal": true, "speaker": "assistant" }
  ]
}`;

const toolCallExample = String.raw`{
  "type": "tool.call",
  "session_id": "session-...",
  "timestamp": "2026-01-22T18:12:04Z",
  "payload": {
    "tool_use_id": "tool_1",
    "name": "lookup_booking",
    "arguments": { "confirmation_code": "ABC123" }
  }
}`;

const toolResultExample = String.raw`{
  "type": "tool.result",
  "session_id": "session-...",
  "timestamp": "2026-01-22T18:12:07Z",
  "payload": {
    "tool_use_id": "tool_1",
    "response": { "status": "confirmed", "room": "Deluxe" }
  }
}`;

const toolStatusExample = String.raw`{
  "type": "tool.status",
  "session_id": "session-...",
  "timestamp": "2026-01-22T18:12:05Z",
  "payload": {
    "tool_use_id": "tool_1",
    "status": "running",
    "summary": "Looking up booking"
  }
}`;

const errorExample = String.raw`{
  "type": "error",
  "code": "limit_exceeded",
  "message": "Concurrent session limit exceeded for tenant"
}`;

const webhookPayloadExample = String.raw`{
  "session_id": "session-5bda2f14-6b7a-4a67-9c75-9bde3f03e2df",
  "transport": "webrtc",
  "status": "finished",
  "reason": "completed",
  "started_at": "2026-01-22T18:12:01Z",
  "ended_at": "2026-01-22T18:15:44Z",
  "metrics": {
    "duration_ms": 223000
  },
  "transcript": [
    { "speaker": "user", "text": "I need a booking." },
    { "speaker": "assistant", "text": "Happy to help." }
  ],
  "tool_calls": [],
  "events": { "counts": { "token": 42 }, "lastEventAt": "2026-01-22T18:15:44Z" },
  "audio": { "codec": "pcm16", "sample_rate": 16000, "channel_count": 1 },
  "metadata": { "user_id": 991 }
}`;

const webhookVerifyExample = String.raw`import crypto from 'crypto';

const signature = req.headers['x-resona-signature'];
const payload = req.rawBody; // ensure this is the unmodified raw body

const expected = crypto
  .createHmac('sha256', process.env.RESONA_WEBHOOK_SECRET)
  .update(payload)
  .digest('hex');

if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
  throw new Error('Invalid signature');
}`;

export default function Guide() {
    return (
        <>
            <Head title="Guide" />
            <DocsLayout
                title="Guide"
                subtitle="A customer-focused guide to building voice experiences with Resona — from first request to production launch."
                active="guide"
            >
                <DocsPageShell
                    nav={
                        <DocsCard variant="deep" size="sm" className="flex flex-col gap-4">
                            <div className="text-xs uppercase tracking-[0.3em] text-emerald-200">On this page</div>
                            <div className="flex flex-col gap-3 text-sm text-slate-300">
                                {guideNav.map((item) => (
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
                    navClassName="lg:sticky lg:top-28 h-max"
                    main={
                        <>
                            <section id="quickstart" className="scroll-mt-28">
                                <DocsCard variant="glass" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Quickstart</DocsEyebrow>}
                                        title="Ship a Resona voice experience in one afternoon."
                                        description="You only need an API key, an agent profile, and a session token to start streaming audio."
                                    />
                                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                                        {quickstartSteps.map((step, index) => (
                                            <DocsStepCard
                                                key={step.title}
                                                index={index + 1}
                                                title={step.title}
                                                body={step.body}
                                            />
                                        ))}
                                    </div>
                                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                                        <DocsCodeBlock code={createAgentProfileCurl} language="bash" />
                                        <DocsCodeBlock code={createSessionCurl} language="bash" />
                                    </div>
                                </DocsCard>
                            </section>

                            <section id="authentication" className="scroll-mt-28">
                                <DocsCard variant="muted" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Authentication</DocsEyebrow>}
                                        title="Secure every request with a Bearer API key."
                                        description="Keep API keys on your server. The browser should only receive session tokens returned by the session endpoint."
                                    />
                                    <DocsCodeBlock
                                        className="mt-6"
                                        language="bash"
                                        code={String.raw`Authorization: Bearer resona_live_********`}
                                    />
                                </DocsCard>
                            </section>

                            <section id="agent-profiles" className="scroll-mt-28">
                                <DocsCard variant="deep" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Agent profiles</DocsEyebrow>}
                                        title="Define the agent your customers will hear."
                                        description="Profiles bundle instructions, a voice, and optional tools. Reuse a profile across many sessions."
                                    />
                                    <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                                        <DocsCodeBlock language="bash" code={createAgentProfileCurl} />
                                        <div className="flex flex-col gap-4 text-sm text-slate-300">
                                            <p>
                                                <span className="font-semibold text-white">Required:</span> name,
                                                tools_json.
                                            </p>
                                            <p>
                                                <span className="font-semibold text-white">Optional:</span> voice_id,
                                                system_instructions, domain_context, agent_speaks_first.
                                            </p>
                                            <p>
                                                Tool schemas accept JSON Schema objects. You can supply either
                                                <span className="font-semibold text-white"> input_schema</span> or
                                                <span className="font-semibold text-white"> parameters</span>.
                                            </p>
                                            <p>
                                                Limits: max 15 tools per profile, tool names must match
                                                <span className="font-mono text-slate-200"> /[a-zA-Z0-9_-]{1,64}/</span>.
                                            </p>
                                        </div>
                                    </div>
                                </DocsCard>
                            </section>

                            <section id="start-session" className="scroll-mt-28">
                                <DocsCard variant="glass" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Sessions</DocsEyebrow>}
                                        title="Create a session to receive realtime credentials."
                                        description="A session returns a short-lived token and a cluster URL. Use those values for every realtime connection."
                                    />
                                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                                        <DocsCodeBlock language="bash" code={createSessionCurl} />
                                        <DocsCodeBlock language="json" code={sessionResponseJson} />
                                    </div>
                                </DocsCard>
                            </section>

                            <section id="webrtc" className="scroll-mt-28">
                                <DocsCard variant="muted" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>WebRTC</DocsEyebrow>}
                                        title="Best for low-latency browser experiences."
                                        description="Use the WebRTC transport when you can use a microphone and data channel in the browser."
                                    />
                                    <div className="mt-6 flex flex-col gap-4 text-sm text-slate-300">
                                        <p>
                                            1. Create an RTCPeerConnection with <span className="font-semibold text-white">ice_servers</span>.
                                        </p>
                                        <p>
                                            2. Create a data channel named <span className="font-mono text-slate-200">events</span> for JSON events.
                                        </p>
                                        <p>
                                            3. Send your SDP offer to <span className="font-mono text-slate-200">webrtc_url</span> with the session token.
                                        </p>
                                        <p>4. Exchange ICE candidates via <span className="font-mono text-slate-200">/webrtc/candidates</span> or the signaling WS.</p>
                                    </div>
                                    <DocsCodeBlock className="mt-6" language="typescript" code={webrtcSnippet} />
                                </DocsCard>
                            </section>

                            <section id="websocket" className="scroll-mt-28">
                                <DocsCard variant="deep" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>WebSocket</DocsEyebrow>}
                                        title="Use WebSocket when WebRTC is not an option."
                                        description="Send raw audio frames over the socket and receive events as JSON messages."
                                    />
                                    <div className="mt-6 flex flex-col gap-4 text-sm text-slate-300">
                                        <p>
                                            Send a JSON handshake immediately after opening the socket. After the <span className="font-mono text-slate-200">ack</span>,
                                            stream raw audio frames as binary messages.
                                        </p>
                                    </div>
                                    <DocsCodeBlock className="mt-6" language="typescript" code={websocketSnippet} />
                                </DocsCard>
                            </section>

                            <section id="events-tools" className="scroll-mt-28">
                                <DocsCard variant="glass" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Events & tools</DocsEyebrow>}
                                        title="Listen for events and respond to tool calls." 
                                        description="Events are JSON envelopes delivered over the WebRTC data channel or the WebSocket connection."
                                    />
                                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                                        <DocsCodeBlock language="json" code={tokenEventExample} />
                                        <DocsCodeBlock language="json" code={toolCallExample} />
                                        <DocsCodeBlock language="json" code={toolResultExample} />
                                        <DocsCodeBlock language="json" code={toolStatusExample} />
                                    </div>
                                    <div className="mt-6">
                                        <DocsCodeBlock language="json" code={errorExample} />
                                    </div>
                                    <div className="mt-6 text-sm text-slate-300">
                                        <p>
                                            When you receive <span className="font-semibold text-white">tool.call</span>, invoke the tool in your system and reply
                                            with <span className="font-semibold text-white">tool.result</span> using the same <span className="font-mono text-slate-200">tool_use_id</span>.
                                        </p>
                                    </div>
                                </DocsCard>
                            </section>

                            <section id="audio-formats" className="scroll-mt-28">
                                <DocsCard variant="muted" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Audio formats</DocsEyebrow>}
                                        title="Match your codec and sample rate to the session." 
                                        description="The session response includes an audio_format object. Use it as the source of truth."
                                    />
                                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                                        <DocsKeyValueList
                                            items={[
                                                { label: 'WebRTC output', value: 'Opus @ 48kHz' },
                                                { label: 'WebRTC input', value: 'PCM16 (handled via WebRTC)' },
                                                { label: 'WebSocket PCM16 input', value: '16kHz, mono, little-endian' },
                                                { label: 'WebSocket PCM16 output', value: '48kHz, mono, little-endian' },
                                                { label: 'WebSocket µ-law input/output', value: '8kHz, mono' },
                                            ]}
                                        />
                                        <div className="text-sm text-slate-300">
                                            <p>
                                                Use <span className="font-semibold text-white">pcm16</span> for higher fidelity. Use
                                                <span className="font-semibold text-white"> mulaw</span> for telephony integrations.
                                            </p>
                                            <p className="mt-4">
                                                WebRTC sessions always negotiate PCM16 internally and return Opus audio to the browser.
                                            </p>
                                        </div>
                                    </div>
                                </DocsCard>
                            </section>

                            <section id="webhooks" className="scroll-mt-28">
                                <DocsCard variant="deep" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Webhooks</DocsEyebrow>}
                                        title="Get a summary when sessions finish." 
                                        description="Configure a webhook URL in the dashboard to receive session completion payloads."
                                    />
                                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                                        <DocsCodeBlock language="json" code={webhookPayloadExample} />
                                        <DocsCodeBlock language="typescript" code={webhookVerifyExample} />
                                    </div>
                                </DocsCard>
                            </section>

                            <section id="limits-retries" className="scroll-mt-28">
                                <DocsCard variant="glass" size="lg">
                                    <DocsSectionHeader
                                        eyebrow={<DocsEyebrow>Limits & retries</DocsEyebrow>}
                                        title="Design for limits, timeouts, and reconnects." 
                                        description="Your plan defines concurrency, and sessions expire automatically."
                                    />
                                    <DocsChecklist
                                        items={[
                                            'Session creation is rate-limited; back off on HTTP 429 responses.',
                                            'Maximum session duration is 2 hours. Create a new session to continue.',
                                            'If you receive error events, create a fresh session and reconnect.',
                                            'Use webhook retries and idempotent handlers to handle delivery retries.',
                                        ]}
                                    />
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        <DocsBadge tone="emerald">429 Too Many Requests</DocsBadge>
                                        <DocsBadge tone="cyan">402 Usage Limit Reached</DocsBadge>
                                        <DocsBadge tone="slate">401 Unauthorized</DocsBadge>
                                    </div>
                                </DocsCard>
                            </section>

                            <DocsCard variant="accent" size="lg">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow tone="accent">Production checklist</DocsEyebrow>}
                                    title="Go live with confidence."
                                />
                                <DocsChecklist items={productionChecklist} />
                            </DocsCard>
                        </>
                    }
                />
            </DocsLayout>
        </>
    );
}
