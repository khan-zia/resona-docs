import { Head } from '@inertiajs/react';
import DocsLayout from '../Layouts/DocsLayout';
import {
    DocsActionButton,
    DocsBadge,
    DocsCard,
    DocsCodeBlock,
    DocsEndpointGroup,
    DocsEyebrow,
    DocsKeyValueList,
    DocsPageShell,
    DocsSectionHeader,
    DocsStatCard,
} from '../components/docs';

const endpointGroups = [
    {
        title: 'Accounts',
        description: 'Manage workspaces, keys, and permissions.',
        endpoints: [
            { method: 'GET', path: '/v1/workspaces' },
            { method: 'POST', path: '/v1/keys' },
            { method: 'DELETE', path: '/v1/keys/{id}' },
        ],
    },
    {
        title: 'Events',
        description: 'Stream, filter, and replay Resona events.',
        endpoints: [
            { method: 'POST', path: '/v1/events' },
            { method: 'GET', path: '/v1/events/{id}' },
            { method: 'POST', path: '/v1/events/replay' },
        ],
    },
    {
        title: 'Webhooks',
        description: 'Subscribe to product changes and delivery updates.',
        endpoints: [
            { method: 'POST', path: '/v1/webhooks' },
            { method: 'GET', path: '/v1/webhooks/{id}' },
            { method: 'POST', path: '/v1/webhooks/{id}/test' },
        ],
    },
];

const statusCards = [
    {
        label: 'Base URL',
        value: 'https://api.resona.com',
        caption: 'Production environment',
    },
    {
        label: 'Auth',
        value: 'Bearer token',
        caption: 'Scoped per workspace',
    },
    {
        label: 'Formats',
        value: 'JSON + Webhooks',
        caption: 'UTF-8, gzip supported',
    },
];

export default function ApiReference() {
    return (
        <>
            <Head title="API Reference" />
            <DocsLayout
                title="API Reference"
                subtitle="A concise overview of endpoints, authentication, and response formats to build against Resona."
                active="api"
            >
                <DocsPageShell
                    main={
                        <>
                            <DocsCard variant="glass" size="lg">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>Core details</DocsEyebrow>}
                                    title="Build once, ship everywhere."
                                />
                                <div className="mt-8 grid gap-4 md:grid-cols-3">
                                    {statusCards.map((card) => (
                                        <DocsStatCard
                                            key={card.label}
                                            label={card.label}
                                            value={card.value}
                                            caption={card.caption}
                                        />
                                    ))}
                                </div>
                            </DocsCard>

                            <div className="grid gap-6">
                                {endpointGroups.map((group) => (
                                    <DocsEndpointGroup
                                        key={group.title}
                                        title={group.title}
                                        description={group.description}
                                        endpoints={group.endpoints}
                                    />
                                ))}
                            </div>

                            <DocsCard variant="gradient" size="lg">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>Response model</DocsEyebrow>}
                                    title="Consistent payloads across every endpoint."
                                />
                                <DocsCodeBlock
                                    className="mt-6"
                                    lines={[
                                        '{',
                                        '  "id": "evt_9a4f9f",',
                                        '  "status": "processed",',
                                        '  "received_at": "2026-01-21T08:45:12Z"',
                                        '}',
                                    ]}
                                />
                            </DocsCard>
                        </>
                    }
                    aside={
                        <>
                            <DocsCard variant="glass" size="md">
                                <DocsEyebrow>Authentication</DocsEyebrow>
                                <p className="mt-4 text-sm text-slate-300">
                                    Pass your Resona API key as a Bearer token. Rotate keys per environment to keep
                                    access isolated.
                                </p>
                                <DocsCodeBlock
                                    className="mt-4 bg-slate-950/70 text-emerald-200"
                                    lines={['Authorization: Bearer resona_live_••••••••']}
                                />
                            </DocsCard>

                            <DocsCard variant="muted" size="md">
                                <DocsEyebrow>Rate limits</DocsEyebrow>
                                <DocsKeyValueList
                                    items={[
                                        {
                                            label: 'Sandbox',
                                            value: <DocsBadge tone="slate">120 rpm</DocsBadge>,
                                        },
                                        {
                                            label: 'Production',
                                            value: <DocsBadge tone="emerald">600 rpm</DocsBadge>,
                                        },
                                    ]}
                                />
                            </DocsCard>

                            <DocsCard variant="accent" size="md">
                                <DocsEyebrow tone="accent">Need a spec?</DocsEyebrow>
                                <p className="mt-4 text-sm text-slate-100">
                                    Download the OpenAPI collection to generate clients or test with Postman.
                                </p>
                                <DocsActionButton className="mt-6">Download OpenAPI</DocsActionButton>
                            </DocsCard>
                        </>
                    }
                />
            </DocsLayout>
        </>
    );
}
