## WebRTC SDP negotiation

Post your SDP offer to the `webrtc_url` from session creation.

**Endpoint:** `POST /webrtc/sdp`

### Request

```json
{
  "session_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df",
  "token": "tkn_1f9b3a7c9d4e8b2a5c7d9e1f3a5b7c9d",
  "sdp_offer": "v=0\r\no=- 46117352 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111 0 8\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:w1vT\r\na=ice-pwd:7gq1lBf9pW3uV1cYhZb3Pq\r\na=ice-options:trickle\r\na=fingerprint:sha-256 2A:97:5B:3C:8D:AA:14:1F:6E:11:40:9B:6E:3F:10:5D:81:5D:33:24:6F:AF:05:FE:E2:43:CB:19:60:4B:65:2E\r\na=setup:actpass\r\na=mid:0\r\na=sendrecv\r\na=rtcp-mux\r\na=rtcp-rsize\r\na=rtpmap:111 opus/48000/2\r\na=fmtp:111 minptime=10;useinbandfec=1;stereo=0;sprop-stereo=0;maxplaybackrate=48000\r\na=rtpmap:0 PCMU/8000\r\na=rtpmap:8 PCMA/8000\r\na=ssrc:12345678 cname:audio",
  "ice_restart": false
}
```

### Response

```json
{
  "sdp_answer": "v=0\r\no=- 89123711 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=msid-semantic: WMS\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111 0 8\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:K8pB\r\na=ice-pwd:5PpH2q7GmS0dQeYc4Wn1Yb\r\na=ice-options:trickle\r\na=fingerprint:sha-256 6F:3A:21:7C:9D:22:66:8E:4A:33:9B:CE:AA:18:9D:04:2B:77:11:42:6A:9C:5E:17:FE:AC:3A:BC:01:9F:20:BE\r\na=setup:active\r\na=mid:0\r\na=sendrecv\r\na=rtcp-mux\r\na=rtpmap:111 opus/48000/2\r\na=fmtp:111 minptime=10;useinbandfec=1;stereo=0;sprop-stereo=0;maxplaybackrate=48000\r\na=rtpmap:0 PCMU/8000\r\na=rtpmap:8 PCMA/8000\r\na=ssrc:87654321 cname:audio",
  "ice_servers": [
    {
      "urls": ["turn:turn.cloudflare.com:3478?transport=udp"],
      "username": "1705937079:tenant-42",
      "credential": "9f4a2b0f2f4b4a7f8a3b1eaf9a6f1d2e"
    }
  ],
  "peer_connection_id": "session-8f8d9e2a-5b5a-4c6a-91f2-0f813ea5c3df"
}
```

### Notes

- `ice_restart` is required only when renegotiating an existing peer.
- If you call `/webrtc/sdp` while a peer is active and `ice_restart` is false, the server returns a conflict error.
- `sdp_offer` must be a non‑empty string and `session_id` / `token` must be valid.
- The server validates that the session is WebRTC‑capable before negotiating.
