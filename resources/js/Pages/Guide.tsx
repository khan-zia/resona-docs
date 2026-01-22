import { Head } from '@inertiajs/react';
import DocsLayout from '../Layouts/DocsLayout';
import {
    DocsActionButton,
    DocsBadge,
    DocsCard,
    DocsChecklist,
    DocsEyebrow,
    DocsFeatureCard,
    DocsHighlightList,
    DocsKeyValueList,
    DocsPageShell,
    DocsSectionHeader,
    DocsStepCard,
} from '../components/docs';

const quickstartSteps = [
    {
        title: 'Create your project',
        body: 'Spin up a Resona workspace and claim your workspace slug.',
    },
    {
        title: 'Connect your stack',
        body: 'Install the SDK and register your first integration key.',
    },
    {
        title: 'Go live',
        body: 'Promote to production when your validation checks are green.',
    },
];

const focusAreas = [
    {
        title: 'Architecture',
        body: 'Understand the event pipeline, data shaping, and retry model that keeps Resona reliable.',
    },
    {
        title: 'Security',
        body: 'Follow token rotation, scoped permissions, and audit strategies built for enterprise teams.',
    },
    {
        title: 'Observability',
        body: 'Track delivery latency, error rates, and webhook health from day one.',
    },
];

const checklist = [
    'Define environments and base URLs.',
    'Confirm webhook signing and validation.',
    'Model core objects in your domain.',
    'Set up alerting for delivery failures.',
];

const guideMap = [
    { label: 'Foundations', badge: { tone: 'emerald', text: '8 chapters' } },
    { label: 'Integrations', badge: { tone: 'cyan', text: '5 chapters' } },
    { label: 'Launch', badge: { tone: 'slate', text: '3 chapters' } },
];

const updates = [
    {
        title: 'Webhook health monitoring',
        description: 'Guided alerts and response playbooks.',
    },
    {
        title: 'Rate-limit tiers',
        description: 'Tune throughput by environment.',
    },
];

export default function Guide() {
    return (
        <>
            <Head title="Guide" />
            <DocsLayout
                title="Guide"
                subtitle="Everything you need to ship Resona integrations with confidence, from the first request to production-ready launches."
                active="guide"
            >
                <DocsPageShell
                    main={
                        <>
                            <DocsCard
                                variant="glass"
                                size="lg"
                                className="shadow-[0_20px_80px_rgba(15,23,42,0.45)]"
                            >
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>Quickstart</DocsEyebrow>}
                                    title="Launch a Resona integration in under an hour."
                                />
                                <div className="mt-8 grid gap-6 md:grid-cols-3">
                                    {quickstartSteps.map((step, index) => (
                                        <DocsStepCard
                                            key={step.title}
                                            index={index + 1}
                                            title={step.title}
                                            body={step.body}
                                        />
                                    ))}
                                </div>
                            </DocsCard>

                            <div className="grid gap-6 md:grid-cols-3">
                                {focusAreas.map((area) => (
                                    <DocsFeatureCard key={area.title} title={area.title} body={area.body} />
                                ))}
                            </div>

                            <DocsCard variant="gradient" size="lg">
                                <DocsSectionHeader
                                    eyebrow={<DocsEyebrow>Implementation</DocsEyebrow>}
                                    title="Production readiness checklist"
                                />
                                <DocsChecklist items={checklist} />
                            </DocsCard>
                        </>
                    }
                    aside={
                        <>
                            <DocsCard variant="glass" size="md">
                                <DocsEyebrow>Guide map</DocsEyebrow>
                                <DocsKeyValueList
                                    items={guideMap.map((item) => ({
                                        label: item.label,
                                        value: <DocsBadge tone={item.badge.tone}>{item.badge.text}</DocsBadge>,
                                    }))}
                                />
                            </DocsCard>

                            <DocsCard variant="muted" size="md">
                                <DocsEyebrow>Latest updates</DocsEyebrow>
                                <DocsHighlightList items={updates} />
                            </DocsCard>

                            <DocsCard variant="accent" size="md">
                                <DocsEyebrow tone="accent">Need support?</DocsEyebrow>
                                <p className="mt-4 text-sm text-slate-100">
                                    Contact the Resona team for launch reviews, migration planning, and compliance
                                    checklists.
                                </p>
                                <DocsActionButton className="mt-6">Request a walkthrough</DocsActionButton>
                            </DocsCard>
                        </>
                    }
                />
            </DocsLayout>
        </>
    );
}
