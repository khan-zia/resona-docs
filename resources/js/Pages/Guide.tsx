import { Head } from '@inertiajs/react';
import DocsLayout from '../Layouts/DocsLayout';
import { DocsCopyPageButton, DocsMarkdown, DocsPageShell } from '../components/docs';
import classes from '../utils/classes';
import { useState } from 'react';

import quickstartMarkdown from '../../markdown/guide/quickstart.md?raw';
import baseUrlsMarkdown from '../../markdown/guide/base-urls.md?raw';
import authMarkdown from '../../markdown/guide/auth.md?raw';
import agentProfilesMarkdown from '../../markdown/guide/agent-profiles.md?raw';
import toolsJsonMarkdown from '../../markdown/guide/tools-json.md?raw';
import sessionsMarkdown from '../../markdown/guide/sessions.md?raw';
import transportsMarkdown from '../../markdown/guide/transports.md?raw';
import eventsMarkdown from '../../markdown/guide/events.md?raw';
import errorsLimitsMarkdown from '../../markdown/guide/errors-limits.md?raw';

const guideNav = [
    { id: 'quickstart', label: 'Quickstart' },
    { id: 'base-urls', label: 'Base URLs' },
    { id: 'auth', label: 'Authentication' },
    { id: 'agent-profiles', label: 'Agent Profiles' },
    { id: 'tools-json', label: 'Tools JSON Rules' },
    { id: 'sessions', label: 'Create Session' },
    { id: 'transports', label: 'Transport Choice' },
    { id: 'events', label: 'Events Overview' },
    { id: 'errors-limits', label: 'Errors & Limits' },
];

const sections = [
    { id: 'quickstart', markdown: quickstartMarkdown },
    { id: 'base-urls', markdown: baseUrlsMarkdown },
    { id: 'auth', markdown: authMarkdown },
    { id: 'agent-profiles', markdown: agentProfilesMarkdown },
    { id: 'tools-json', markdown: toolsJsonMarkdown },
    { id: 'sessions', markdown: sessionsMarkdown },
    { id: 'transports', markdown: transportsMarkdown },
    { id: 'events', markdown: eventsMarkdown },
    { id: 'errors-limits', markdown: errorsLimitsMarkdown },
];

export default function Guide() {
    const [activeSection, setActiveSection] = useState('quickstart');
    const copySections = sections.map((section) => ({ markdown: section.markdown }));

    return (
        <>
            <Head title="Guide" />
            <DocsLayout
                title="Integration Guide"
                subtitle="Build professional voice experiences with Resona - from first request to production launch."
                active="guide"
                actions={
                    <DocsCopyPageButton
                        title="Integration Guide"
                        subtitle="Build professional voice experiences with Resona - from first request to production launch."
                        sections={copySections}
                    />
                }
            >
                <DocsPageShell
                    nav={
                        <div className="flex flex-col gap-1">
                            {guideNav.map((item) => (
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
