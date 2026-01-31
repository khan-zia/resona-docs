import { Head } from '@inertiajs/react';
import DocsLayout from '../Layouts/DocsLayout';
import { DocsMarkdown, DocsPageShell } from '../components/docs';
import classes from '../utils/classes';
import { useState } from 'react';

import baseUrlsMarkdown from '../../markdown/api-reference/base-urls.md?raw';
import authMarkdown from '../../markdown/api-reference/auth.md?raw';
import voicesMarkdown from '../../markdown/api-reference/voices.md?raw';
import agentObjectMarkdown from '../../markdown/api-reference/agent-object.md?raw';
import domainContextMarkdown from '../../markdown/api-reference/domain-context.md?raw';
import systemInstructionsMarkdown from '../../markdown/api-reference/system-instructions.md?raw';
import toolsJsonMarkdown from '../../markdown/api-reference/tools-json.md?raw';
import agentEndpointsMarkdown from '../../markdown/api-reference/agent-endpoints.md?raw';
import sessionsMarkdown from '../../markdown/api-reference/sessions.md?raw';
import websocketMarkdown from '../../markdown/api-reference/websocket.md?raw';
import webrtcSdpMarkdown from '../../markdown/api-reference/webrtc-sdp.md?raw';
import webrtcIceMarkdown from '../../markdown/api-reference/webrtc-ice.md?raw';
import eventsMarkdown from '../../markdown/api-reference/events.md?raw';
import errorsMarkdown from '../../markdown/api-reference/errors.md?raw';
import limitsMarkdown from '../../markdown/api-reference/limits.md?raw';

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

const sections = [
    { id: 'base-urls', markdown: baseUrlsMarkdown },
    { id: 'auth', markdown: authMarkdown },
    { id: 'voices', markdown: voicesMarkdown },
    { id: 'agent-object', markdown: agentObjectMarkdown },
    { id: 'domain-context', markdown: domainContextMarkdown },
    { id: 'system-instructions', markdown: systemInstructionsMarkdown },
    { id: 'tools-json', markdown: toolsJsonMarkdown },
    { id: 'agent-endpoints', markdown: agentEndpointsMarkdown },
    { id: 'sessions', markdown: sessionsMarkdown },
    { id: 'websocket', markdown: websocketMarkdown },
    { id: 'webrtc-sdp', markdown: webrtcSdpMarkdown },
    { id: 'webrtc-ice', markdown: webrtcIceMarkdown },
    { id: 'events', markdown: eventsMarkdown },
    { id: 'errors', markdown: errorsMarkdown },
    { id: 'limits', markdown: limitsMarkdown },
];

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
                        <div className="max-w-4xl space-y-12">
                            {sections.map((section) => (
                                <section key={section.id} id={section.id} className="scroll-mt-32">
                                    <DocsMarkdown content={section.markdown} />
                                </section>
                            ))}
                        </div>
                    }
                />
            </DocsLayout>
        </>
    );
}
