import { Head } from '@inertiajs/react';
import DocsLayout from '../Layouts/DocsLayout';
import { DocsMarkdown, DocsPageShell } from '../components/docs';
import classes from '../utils/classes';
import { useState } from 'react';

import overviewMarkdown from '../../markdown/examples/javascript/overview.md?raw';
import backendMarkdown from '../../markdown/examples/javascript/backend.md?raw';
import frontendMarkdown from '../../markdown/examples/javascript/frontend.md?raw';
import transcriptsMarkdown from '../../markdown/examples/javascript/transcripts.md?raw';
import toolsMarkdown from '../../markdown/examples/javascript/tools.md?raw';
import webrtcMarkdown from '../../markdown/examples/javascript/webrtc.md?raw';
import websocketMarkdown from '../../markdown/examples/javascript/websocket.md?raw';

const examplesNav = [
    { id: 'overview', label: 'Overview' },
    { id: 'backend', label: 'Session Broker' },
    { id: 'frontend', label: 'Client Scaffold' },
    { id: 'transcripts', label: 'Transcripts' },
    { id: 'tools', label: 'Tool Calls' },
    { id: 'webrtc', label: 'WebRTC Client' },
    { id: 'websocket', label: 'WebSocket Client' },
];

const sections = [
    { id: 'overview', markdown: overviewMarkdown },
    { id: 'backend', markdown: backendMarkdown },
    { id: 'frontend', markdown: frontendMarkdown },
    { id: 'transcripts', markdown: transcriptsMarkdown },
    { id: 'tools', markdown: toolsMarkdown },
    { id: 'webrtc', markdown: webrtcMarkdown },
    { id: 'websocket', markdown: websocketMarkdown },
];

export default function Examples() {
    const [activeSection, setActiveSection] = useState('overview');

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
                        <div className="max-w-4xl space-y-12">
                            <section id="overview" className="scroll-mt-32">
                                <DocsMarkdown content={sections.find((section) => section.id === 'overview')?.markdown ?? ''} />
                            </section>
                            {sections
                                .filter((section) => section.id !== 'overview')
                                .map((section) => (
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
