## WebRTC client

WebRTC is the most natural browser transport. Audio goes over the media channel, events over a data channel named `events`. This example uses HTTP ICE polling to stay minimal.

### What it demonstrates

- Creates a session and uses `ice_servers` from the response
- Posts the SDP offer to `webrtc_url` and applies the SDP answer
- Exchanges ICE candidates via `/webrtc/candidates`
- Reads JSON events from the `events` data channel

### Notes for real apps

- WebRTC manages audio sample rates for you. You do not send `sample_rate` in WebRTC sessions.
- Keep the data channel for events only; let media flow on the audio track.
- The `handleSessionEvent` helper comes from the transcript/tool sections below.

```javascript
// public/webrtc-client.js
const API_BASE = 'http://localhost:3000';
const AGENT_ID = 'agent-CHANGE_ME';

const logEl = document.getElementById('log');
const log = (message) => {
    if (logEl) logEl.textContent += message + '\n';
};

const postJson = async (url, payload) => {
    // Simple helper for JSON POSTs.
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
    // Ask your backend to create a session.
    return postJson(API_BASE + '/session', {
        agent_id: AGENT_ID,
        transport: 'webrtc',
        codec: 'pcm16',
    });
};

const startIcePolling = async (pc, session) => {
    // Minimal HTTP polling for ICE candidates.
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
    // Create a peer connection using the ICE servers provided.
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
            // Route transcript + tool events through shared handlers.
            handleSessionEvent(payload, (msg) => events.send(JSON.stringify(msg)));
        } catch {
            log('event: unknown');
        }
    };

    // Capture mic audio and send to the peer connection.
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Exchange SDP with the WebRTC gateway.
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
}
```
