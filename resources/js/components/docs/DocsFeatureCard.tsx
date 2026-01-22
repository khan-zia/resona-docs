import DocsCard from './DocsCard';

type DocsFeatureCardProps = {
    title: string;
    body: string;
};

export default function DocsFeatureCard({ title, body }: DocsFeatureCardProps) {
    return (
        <DocsCard variant="muted" size="md" radius="xl">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-3 text-sm text-slate-300">{body}</p>
        </DocsCard>
    );
}
