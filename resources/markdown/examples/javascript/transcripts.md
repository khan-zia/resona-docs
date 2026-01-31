## Transcripts (speaker + agent)

Realtime transcripts arrive as `token` events. Each token has `text`, `isFinal`, and (optionally) a `speaker` id. You can render partial text live and then swap in final text when it arrives.

### Token event shape

```json
{
  "type": "token",
  "tokens": [
    {
      "text": "Hello ",
      "isFinal": false,
      "speaker": "assistant"
    },
    {
      "text": "world",
      "isFinal": true,
      "speaker": "assistant"
    }
  ]
}
```

### Minimal transcript handler

This keeps a list of finalized messages and a map of partial text per speaker. It also labels speakers in a way that mirrors the playground (`assistant` -> Agent, numeric speakers -> Speaker N).

```javascript
const transcriptEl = document.getElementById('transcript');
const messages = [];
const partialBySpeaker = new Map();

// Map raw speaker ids to user-friendly labels.
const labelForSpeaker = (speakerId) => {
    if (speakerId === 'assistant') return 'Agent';
    if (/^\d+$/.test(speakerId)) return `Speaker ${speakerId}`;
    return speakerId ? speakerId : 'User';
};

const handleTokenEvent = (event) => {
    // Group tokens so each speaker updates independently.
    const tokensBySpeaker = new Map();

    for (const token of event.tokens ?? []) {
        const speakerId = token.speaker || '1';
        if (!tokensBySpeaker.has(speakerId)) {
            tokensBySpeaker.set(speakerId, []);
        }
        tokensBySpeaker.get(speakerId).push(token);
    }

    for (const [speakerId, tokens] of tokensBySpeaker.entries()) {
        // Final tokens become permanent transcript lines.
        const finalText = tokens
            .filter((t) => t.isFinal && t.text && t.text !== '<end>')
            .map((t) => t.text)
            .join('');

        // Non-final tokens are partials you can render in italics.
        const partialText = tokens
            .filter((t) => !t.isFinal && t.text)
            .map((t) => t.text)
            .join('');

        if (finalText) {
            messages.push({
                speaker: speakerId,
                text: finalText,
                timestamp: new Date(),
            });
            partialBySpeaker.delete(speakerId);
        }

        if (partialText) {
            partialBySpeaker.set(speakerId, partialText);
        }
    }

    // Re-render after every token batch.
    renderTranscript();
};

const renderTranscript = () => {
    if (!transcriptEl) return;
    const lines = [];

    for (const message of messages) {
        // Finalized lines first.
        lines.push(
            `<div><strong>${labelForSpeaker(message.speaker)}:</strong> ${message.text}</div>`
        );
    }

    for (const [speakerId, partialText] of partialBySpeaker.entries()) {
        // Partial lines after (so they update in place).
        lines.push(
            `<div><strong>${labelForSpeaker(speakerId)}:</strong> <em>${partialText}</em></div>`
        );
    }

    transcriptEl.innerHTML = lines.join('');
};
```

If you do not want partials, skip the `partialBySpeaker` map and render only `isFinal` tokens.
