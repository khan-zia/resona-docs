## Client scaffold

This is a minimal client surface: two start buttons, a log area, a transcript feed, and an `audio` element for WebRTC playback. Swap in your real UI later. The key is keeping a user gesture to unlock audio.

```html
<!-- public/index.html -->
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

    <section>
      <h2>Transcript</h2>
      <div id="transcript"></div>
    </section>

    <section>
      <h2>Tool Calls</h2>
      <div id="tools"></div>
    </section>

    <pre id="log"></pre>

    <script type="module" src="/webrtc-client.js"></script>
    <script type="module" src="/websocket-client.js"></script>
  </body>
</html>
```
