import { Head } from '@inertiajs/react';
import DocsLayout from '../Layouts/DocsLayout';
import {
    DocsBadge,
    DocsCard,
    DocsChecklist,
    DocsCodeBlock,
    DocsEyebrow,
    DocsInlineCode,
    DocsPageShell,
    DocsSectionHeader,
} from '../components/docs';
import classes from '../utils/classes';
import { useState } from 'react';

const examplesNav = [
    { id: 'overview', label: 'Overview' },
    { id: 'backend', label: 'Backend Broker' },
    { id: 'frontend-shell', label: 'Client Scaffold' },
    { id: 'webrtc', label: 'WebRTC Client' },
    { id: 'websocket', label: 'WebSocket Client' },
];

const languageOptions = [{ key: 'javascript', label: 'JavaScript' }];

const codeSamples = {
    javascript: {
        server: String.raw`// server.js
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.static('public'));

const RESONA_API_KEY = process.env.RESONA_API_KEY;
const RESONA_API_BASE_URL = process.env.RESONA_API_BASE_URL ?? 'https://resona.dev/api';

app.post('/session', async (req, res) => {
    if (!RESONA_API_KEY) {
        return res.status(500).json({ error: 'Missing RESONA_API_KEY' });
    }

    const { agent_id, transport, codec = 'pcm16', sample_rate } = req.body;
    const payload = { agent_id, transport, codec };

    const numericSampleRate = Number(sample_rate);
    if (transport === 'websocket' && Number.isFinite(numericSampleRate)) {
        payload.sample_rate = numericSampleRate;
    }

    const response = await fetch(RESONA_API_BASE_URL + '/api/v1/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + RESONA_API_KEY,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.status(response.status).json(data);
});

app.listen(3000, () => {
    console.log('Resona examples running on http://localhost:3000');
});`,
        html: String.raw`<!-- public/index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Resona Examples</title>
  </head>
  <body>
    <button id="start-webrtc">Start WebRTC</button>
    <button id="start-websocket">Start WebSocket</button>
    <audio id="remote-audio" autoplay></audio>
    <pre id="log"></pre>

    <script type="module" src="/webrtc-client.js"></script>
    <script type="module" src="/websocket-client.js"></script>
  </body>
</html>`,
        webrtcClient: String.raw`// public/webrtc-client.js
const API_BASE = 'http://localhost:3000';
const AGENT_ID = 'agent-CHANGE_ME';

const logEl = document.getElementById('log');
const log = (message) => {
    if (logEl) logEl.textContent += message + '\n';
};

const postJson = async (url, payload) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.message ?? 'Request failed');
    }
    return data;
};

const createSession = async () => {
    return postJson(API_BASE + '/session', {
        agent_id: AGENT_ID,
        transport: 'webrtc',
        codec: 'pcm16',
    });
};

const startIcePolling = async (pc, session) => {
    const localCandidates = [];
    let localComplete = false;

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            localCandidates.push(event.candidate);
        } else {
            localComplete = true;
        }
    };

    while (true) {
        const payload = {
            session_id: session.session_id,
            token: session.token,
            candidates: localCandidates.splice(0),
            complete: localComplete,
            wait: true,
            timeout_ms: 5000,
        };

        const data = await postJson(session.cluster_base_url + '/webrtc/candidates', payload);
        (data.candidates ?? []).forEach((candidate) => pc.addIceCandidate(candidate));

        if (data.complete && localComplete) {
            break;
        }
    }
};

const startWebRTC = async () => {
    const session = await createSession();
    const pc = new RTCPeerConnection({ iceServers: session.ice_servers });

    const remoteAudio = document.getElementById('remote-audio');
    pc.ontrack = (event) => {
        if (remoteAudio) {
            remoteAudio.srcObject = event.streams[0];
        }
    };

    const events = pc.createDataChannel('events');
    events.onmessage = (event) => {
        try {
            const payload = JSON.parse(event.data);
            log('event: ' + payload.type);
        } catch {
            log('event: unknown');
        }
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const sdpResponse = await postJson(session.webrtc_url, {
        session_id: session.session_id,
        token: session.token,
        sdp_offer: offer.sdp,
        ice_restart: false,
    });

    await pc.setRemoteDescription({ type: 'answer', sdp: sdpResponse.sdp_answer });
    await startIcePolling(pc, session);
};

const webrtcButton = document.getElementById('start-webrtc');
if (webrtcButton) {
    webrtcButton.addEventListener('click', () => {
        startWebRTC().catch((error) => log('error: ' + error.message));
    });
}`,
        websocketClient: String.raw`// public/websocket-client.js
const API_BASE = 'http://localhost:3000';
const AGENT_ID = 'agent-CHANGE_ME';

const logEl = document.getElementById('log');
const log = (message) => {
    if (logEl) logEl.textContent += message + '\n';
};

const postJson = async (url, payload) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.message ?? 'Request failed');
    }
    return data;
};

const createRecorderNode = async (audioContext) => {
    const recorderWorklet = [
        "class RecorderProcessor extends AudioWorkletProcessor {",
        "    constructor() {",
        "        super();",
        "        this.buffer = [];",
        "        this.frameSize = Math.round(sampleRate * 0.02);",
        "    }",
        "",
        "    process(inputs) {",
        "        const input = inputs[0][0];",
        "        if (!input) return true;",
        "",
        "        for (let i = 0; i < input.length; i += 1) {",
        "            this.buffer.push(input[i]);",
        "            if (this.buffer.length >= this.frameSize) {",
        "                const frame = this.buffer.splice(0, this.frameSize);",
        "                const int16 = new Int16Array(frame.length);",
        "                for (let j = 0; j < frame.length; j += 1) {",
        "                    const sample = Math.max(-1, Math.min(1, frame[j]));",
        "                    int16[j] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;",
        "                }",
        "                this.port.postMessage(int16);",
        "            }",
        "        }",
        "        return true;",
        "    }",
        "}",
        "",
        "registerProcessor('recorder-processor', RecorderProcessor);",
    ].join('\n');

    const url = URL.createObjectURL(new Blob([recorderWorklet], { type: 'application/javascript' }));
    await audioContext.audioWorklet.addModule(url);
    URL.revokeObjectURL(url);

    return new AudioWorkletNode(audioContext, 'recorder-processor');
};

const createPlayerNode = async (audioContext) => {
    const playerWorklet = [
        "class PlayerProcessor extends AudioWorkletProcessor {",
        "    constructor() {",
        "        super();",
        "        this.queue = [];",
        "        this.port.onmessage = (event) => {",
        "            const data = event.data;",
        "            if (!data) return;",
        "            for (let i = 0; i < data.length; i += 1) {",
        "                this.queue.push(data[i] / 32768);",
        "            }",
        "        };",
        "    }",
        "",
        "    process(inputs, outputs) {",
        "        const output = outputs[0][0];",
        "        for (let i = 0; i < output.length; i += 1) {",
        "            output[i] = this.queue.length > 0 ? this.queue.shift() : 0;",
        "        }",
        "        return true;",
        "    }",
        "}",
        "",
        "registerProcessor('player-processor', PlayerProcessor);",
    ].join('\n');

    const url = URL.createObjectURL(new Blob([playerWorklet], { type: 'application/javascript' }));
    await audioContext.audioWorklet.addModule(url);
    URL.revokeObjectURL(url);

    return new AudioWorkletNode(audioContext, 'player-processor');
};

const startWebSocket = async () => {
    const audioContext = new AudioContext();
    await audioContext.resume();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const sampleRate = audioContext.sampleRate;

    if (sampleRate % 50 !== 0) {
        throw new Error('Sample rate must align to 20ms frames. Try AudioContext({ sampleRate: 48000 }).');
    }

    const session = await postJson(API_BASE + '/session', {
        agent_id: AGENT_ID,
        transport: 'websocket',
        codec: 'pcm16',
        sample_rate: sampleRate,
    });

    const ws = new WebSocket(session.websocket_url);
    ws.binaryType = 'arraybuffer';

    const playerNode = await createPlayerNode(audioContext);
    playerNode.connect(audioContext.destination);

    const recorderNode = await createRecorderNode(audioContext);
    const sink = audioContext.createGain();
    sink.gain.value = 0;
    recorderNode.connect(sink).connect(audioContext.destination);

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(recorderNode);

    recorderNode.port.onmessage = (event) => {
        if (ws.readyState === WebSocket.OPEN) {
            const frame = event.data;
            ws.send(frame.buffer);
        }
    };

    ws.onopen = () => {
        ws.send(
            JSON.stringify({
                type: 'handshake',
                session_id: session.session_id,
                token: session.token,
                codec: 'pcm16',
            })
        );
    };

    ws.onmessage = (event) => {
        if (typeof event.data === 'string') {
            try {
                const payload = JSON.parse(event.data);
                log('event: ' + payload.type);
            } catch {
                log('event: unknown');
            }
            return;
        }

        const pcm = new Int16Array(event.data);
        playerNode.port.postMessage(pcm);
    };
};

const websocketButton = document.getElementById('start-websocket');
if (websocketButton) {
    websocketButton.addEventListener('click', () => {
        startWebSocket().catch((error) => log('error: ' + error.message));
    });
}`,
    },
};

export default function Examples() {
    const [activeSection, setActiveSection] = useState('overview');
    const [activeLanguage, setActiveLanguage] = useState('javascript');
    const samples = codeSamples[activeLanguage];

    return (
        <>
            <Head title="Examples" />
            <DocsLayout
                title="Code Examples"
                subtitle="Copy-paste starters for WebRTC and WebSocket. Keep them simple, then layer on production features."
                active="examples"
            >
                <DocsPageShell
                    nav={
                        <div className="flex flex-col gap-1">
                            {examplesNav.map((item) => (
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
                        <div className="max-w-4xl space-y-16">
                            <section id="overview" className="scroll-mt-32">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>Examples</DocsEyebrow>}
                                    title="Start simple, then grow."
                                    description="These examples mirror our own playground logic without framework-specific code. Use them to validate a full end-to-end flow, then replace pieces with your production stack."
                                />
                                <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-400">
                                    <p>
                                        The goal is not to teach HTML or React. The goal is to show a clean separation of responsibilities:
                                        keep secrets on the server, keep audio realtime in the client, and keep the audio framing predictable.
                                    </p>
                                    <p>
                                        If you already have your own capture or playback pipeline, swap that in. The backend flow stays the same:
                                        create a session, return short-lived credentials, and let the client connect directly to realtime.
                                    </p>
                                </div>
                                <DocsCard variant="muted" size="md" className="mt-10">
                                    <DocsSectionHeader
                                        title="What this page covers"
                                        titleClassName="!text-lg"
                                        description="Keep the backend responsible for security, and keep the client responsible for realtime audio. The guidance below explains the split and the reasons behind it."
                                        descriptionClassName="text-sm"
                                    />
                                    <DocsChecklist
                                        items={[
                                            <>
                                                Backend: create sessions, keep <DocsInlineCode>RESONA_API_KEY</DocsInlineCode> private,
                                                and return short-lived <DocsInlineCode>token</DocsInlineCode> and{' '}
                                                <DocsInlineCode>cluster_base_url</DocsInlineCode> to the client.
                                            </>,
                                            <>
                                                Frontend: capture microphone audio, send fixed <DocsInlineCode>20 ms</DocsInlineCode>{' '}
                                                frames, and render assistant audio from the realtime connection.
                                            </>,
                                            <>
                                                Quality: match <DocsInlineCode>sample_rate</DocsInlineCode> to your capture pipeline
                                                and avoid extra resampling.
                                            </>,
                                            <>
                                                Security: never expose <DocsInlineCode>RESONA_API_KEY</DocsInlineCode> in the browser,
                                                even for a quick demo.
                                            </>,
                                            <>
                                                Performance: use fixed-size frames and keep audio work off the UI thread whenever possible.
                                            </>,
                                        ]}
                                        className="mt-6"
                                    />
                                </DocsCard>
                                <DocsCard variant="muted" size="md" className="mt-6">
                                    <DocsSectionHeader
                                        title="Language"
                                        titleClassName="!text-lg"
                                        description="More languages will be added. For now, the examples below are plain JavaScript."
                                        descriptionClassName="text-sm"
                                    />
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {languageOptions.map((option) => (
                                            <button
                                                key={option.key}
                                                type="button"
                                                onClick={() => setActiveLanguage(option.key)}
                                                className={classes(
                                                    'rounded-lg px-4 py-1.5 text-sm font-medium transition',
                                                    activeLanguage === option.key
                                                        ? 'bg-emerald-500/20 text-emerald-100'
                                                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                                )}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </DocsCard>
                            </section>

                            <section id="backend" className="scroll-mt-32">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>Backend</DocsEyebrow>}
                                    title="Session broker"
                                    description="A minimal JavaScript backend that creates sessions and serves the client files. This is where secrets live and where sessions are created."
                                />
                                <div className="mt-6 space-y-3 text-[15px] leading-relaxed text-slate-400">
                                    <p>
                                        In production, this endpoint should sit behind your own auth. Validate who can start a session, then
                                        call the Resona <DocsInlineCode>/api/v1/sessions</DocsInlineCode> endpoint on their behalf.
                                    </p>
                                    <p>
                                        The response returns <DocsInlineCode>session_id</DocsInlineCode>,{' '}
                                        <DocsInlineCode>token</DocsInlineCode>, and realtime URLs. Your client connects directly to
                                        those URLs for low latency.
                                    </p>
                                </div>
                                <DocsChecklist
                                    items={[
                                        <>
                                            Requires <DocsInlineCode>Node 18+</DocsInlineCode> for built-in fetch.
                                        </>,
                                        <>
                                            Install Express: <DocsInlineCode>npm install express</DocsInlineCode>.
                                        </>,
                                        <>
                                            Set <DocsInlineCode>RESONA_API_KEY</DocsInlineCode> in your environment.
                                        </>,
                                        <>
                                            Place client files in <DocsInlineCode>public/</DocsInlineCode> and update
                                            {' '}
                                            <DocsInlineCode>AGENT_ID</DocsInlineCode> in the client scripts.
                                        </>,
                                    ]}
                                    className="mt-8"
                                />
                                <div className="mt-8 space-y-4">
                                    <DocsBadge tone="emerald">server.js</DocsBadge>
                                    <DocsCodeBlock language="javascript" code={samples.server} />
                                </div>
                            </section>

                            <section id="frontend-shell" className="scroll-mt-32">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>Frontend</DocsEyebrow>}
                                    title="Client scaffold"
                                    description="A tiny UI scaffold for starting sessions and attaching audio output. Replace this with your own UI when you move beyond a demo."
                                />
                                <div className="mt-6 space-y-3 text-[15px] leading-relaxed text-slate-400">
                                    <p>
                                        The client is responsible for microphone capture and playback. This minimal page just wires up buttons,
                                        a log pane, and an <DocsInlineCode>audio</DocsInlineCode> element for WebRTC playback.
                                    </p>
                                </div>
                                <div className="mt-8 space-y-4">
                                    <DocsBadge tone="emerald">public/index.html</DocsBadge>
                                    <DocsCodeBlock language="html" code={samples.html} />
                                </div>
                            </section>

                            <section id="webrtc" className="scroll-mt-32">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>WebRTC</DocsEyebrow>}
                                    title="WebRTC client"
                                    description="Shows SDP exchange, ICE candidate handling, and event delivery over the data channel. Keep the flow small while you integrate, then swap HTTP polling for WebSocket signaling in production."
                                />
                                <div className="mt-6 space-y-3 text-[15px] leading-relaxed text-slate-400">
                                    <p>
                                        WebRTC is the lowest-latency option in the browser. It carries audio over the media channel and events
                                        over a data channel named <DocsInlineCode>events</DocsInlineCode>.
                                    </p>
                                </div>
                                <DocsChecklist
                                    items={[
                                        <>
                                            Creates a WebRTC session on your server and uses the returned
                                            {' '}
                                            <DocsInlineCode>ice_servers</DocsInlineCode>.
                                        </>,
                                        <>
                                            Sends the SDP offer to <DocsInlineCode>webrtc_url</DocsInlineCode> and applies the answer.
                                        </>,
                                        <>
                                            Long-polls <DocsInlineCode>/webrtc/candidates</DocsInlineCode> to exchange ICE candidates.
                                        </>,
                                        <>
                                            Listens to events over a data channel named <DocsInlineCode>events</DocsInlineCode>.
                                        </>,
                                    ]}
                                    className="mt-8"
                                />
                                <div className="mt-8 space-y-4">
                                    <DocsBadge tone="emerald">public/webrtc-client.js</DocsBadge>
                                    <DocsCodeBlock language="javascript" code={samples.webrtcClient} />
                                </div>
                            </section>

                            <section id="websocket" className="scroll-mt-32">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>WebSocket</DocsEyebrow>}
                                    title="WebSocket client"
                                    description="Streams 20 ms PCM16 frames, plays back PCM16 from the server, and handles JSON events on the same socket."
                                />
                                <div className="mt-6 space-y-3 text-[15px] leading-relaxed text-slate-400">
                                    <p>
                                        WebSocket is great for custom clients or non-browser stacks. The key is predictable framing: send exactly
                                        one <DocsInlineCode>20 ms</DocsInlineCode> frame per message and use the negotiated
                                        {' '}
                                        <DocsInlineCode>sample_rate</DocsInlineCode>.
                                    </p>
                                </div>
                                <DocsChecklist
                                    items={[
                                        <>
                                            Creates a WebSocket session with <DocsInlineCode>sample_rate</DocsInlineCode> set to
                                            {' '}
                                            <DocsInlineCode>AudioContext.sampleRate</DocsInlineCode>.
                                        </>,
                                        <>
                                            Uses AudioWorklet to record and emit fixed <DocsInlineCode>20 ms</DocsInlineCode>{' '}
                                            <DocsInlineCode>pcm16</DocsInlineCode> frames.
                                        </>,
                                        <>
                                            Sends a JSON <DocsInlineCode>handshake</DocsInlineCode> before streaming audio.
                                        </>,
                                        <>
                                            Plays incoming PCM16 frames through a lightweight AudioWorklet player.
                                        </>,
                                        <>
                                            Handles JSON events and binary audio on the same socket.
                                        </>,
                                    ]}
                                    className="mt-8"
                                />
                                <div className="mt-8 space-y-4">
                                    <DocsBadge tone="emerald">public/websocket-client.js</DocsBadge>
                                    <DocsCodeBlock language="javascript" code={samples.websocketClient} />
                                </div>
                            </section>
                        </div>
                    }
                />
            </DocsLayout>
        </>
    );
}
