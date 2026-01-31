## WebSocket client

WebSocket is ideal for custom clients or server-to-server audio. The rule that matters most: send exactly one `20 ms` PCM frame per message.

### Sample rate selection

- **Browser clients:** try `MediaStreamTrack.getSettings().sampleRate` first. If it is missing, use `audioContext.sampleRate` (the rate you will actually stream).
- **Non-browser clients:** use the sample rate of your capture pipeline and size frames from that rate.
- Only send `sample_rate` when it is a multiple of `50` (so `20 ms` frames are whole numbers of samples).
- If the rate is not aligned, resample to `16 kHz` or `48 kHz` before streaming.

### Worklet files (keep them tiny)

AudioWorklets must be loaded as modules. For readability, we keep them as separate files in `public/` so the main client stays short.

Create `public/recorder-processor.js`:

```javascript
class RecorderProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        // Keep a rolling buffer until we hit 20ms of samples.
        this.buffer = [];
        this.frameSize = Math.round(sampleRate * 0.02);
    }

    process(inputs) {
        const input = inputs[0][0];
        if (!input) return true;

        for (let i = 0; i < input.length; i += 1) {
            this.buffer.push(input[i]);
            if (this.buffer.length >= this.frameSize) {
                const frame = this.buffer.splice(0, this.frameSize);
                const int16 = new Int16Array(frame.length);
                for (let j = 0; j < frame.length; j += 1) {
                    // Convert float samples to PCM16.
                    const sample = Math.max(-1, Math.min(1, frame[j]));
                    int16[j] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
                }
                // Send the PCM16 frame to the main thread.
                this.port.postMessage(int16);
            }
        }
        return true;
    }
}

registerProcessor('recorder-processor', RecorderProcessor);
```

Create `public/player-processor.js`:

```javascript
class PlayerProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.queue = [];
        this.port.onmessage = (event) => {
            const data = event.data;
            if (!data) return;
            for (let i = 0; i < data.length; i += 1) {
                // Convert PCM16 back to floats for playback.
                this.queue.push(data[i] / 32768);
            }
        };
    }

    process(inputs, outputs) {
        const output = outputs[0][0];
        for (let i = 0; i < output.length; i += 1) {
            // Pop from the queue, or output silence if empty.
            output[i] = this.queue.length > 0 ? this.queue.shift() : 0;
        }
        return true;
    }
}

registerProcessor('player-processor', PlayerProcessor);
```

### What it demonstrates

- Creates a WebSocket session and supplies `sample_rate`
- Uses AudioWorklets to emit fixed `20 ms` `pcm16` frames
- Sends a JSON `handshake` before streaming audio
- Plays incoming PCM16 frames with a simple AudioWorklet player
- Routes JSON events through `handleSessionEvent` from the transcript/tool sections

```javascript
// public/websocket-client.js
const API_BASE = 'http://localhost:3000';
const AGENT_ID = 'agent-CHANGE_ME';

const logEl = document.getElementById('log');
const log = (message) => {
    if (logEl) logEl.textContent += message + '\n';
};

const postJson = async (url, payload) => {
    // Basic JSON POST helper.
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
    // Load the worklet module once, then create the node.
    await audioContext.audioWorklet.addModule('/recorder-processor.js');
    return new AudioWorkletNode(audioContext, 'recorder-processor');
};

const createPlayerNode = async (audioContext) => {
    // Load the player module and create the node.
    await audioContext.audioWorklet.addModule('/player-processor.js');
    return new AudioWorkletNode(audioContext, 'player-processor');
};

const startWebSocket = async () => {
    // Capture mic audio.
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const track = stream.getAudioTracks()[0];
    const trackRate = track?.getSettings?.().sampleRate;

    // Try to align AudioContext with the capture rate if possible.
    const audioContext = trackRate && trackRate % 50 === 0
        ? new AudioContext({ sampleRate: trackRate })
        : new AudioContext();

    await audioContext.resume();
    const sampleRate = audioContext.sampleRate;

    // Enforce 20ms framing (sampleRate must be divisible by 50).
    if (sampleRate % 50 !== 0) {
        throw new Error('Sample rate must align to 20ms frames. Resample to 16 kHz or 48 kHz.');
    }

    // Ask the backend to create a WebSocket session.
    const session = await postJson(API_BASE + '/session', {
        agent_id: AGENT_ID,
        transport: 'websocket',
        codec: 'pcm16',
        sample_rate: sampleRate,
    });

    const ws = new WebSocket(session.websocket_url);
    ws.binaryType = 'arraybuffer';

    // Playback path (server -> client).
    const playerNode = await createPlayerNode(audioContext);
    playerNode.connect(audioContext.destination);

    // Capture path (client -> server).
    const recorderNode = await createRecorderNode(audioContext);
    const sink = audioContext.createGain();
    sink.gain.value = 0;
    recorderNode.connect(sink).connect(audioContext.destination);

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(recorderNode);

    recorderNode.port.onmessage = (event) => {
        if (ws.readyState === WebSocket.OPEN) {
            // Send one 20ms PCM frame per message.
            const frame = event.data;
            ws.send(frame.buffer);
        }
    };

    ws.onopen = () => {
        // Identify the session before streaming audio.
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
                // Route transcript + tool events through shared handlers.
                handleSessionEvent(payload, (msg) => ws.send(JSON.stringify(msg)));
            } catch {
                log('event: unknown');
            }
            return;
        }

        // PCM output from the agent.
        const pcm = new Int16Array(event.data);
        playerNode.port.postMessage(pcm);
    };
};

const websocketButton = document.getElementById('start-websocket');
if (websocketButton) {
    websocketButton.addEventListener('click', () => {
        startWebSocket().catch((error) => log('error: ' + error.message));
    });
}
```
