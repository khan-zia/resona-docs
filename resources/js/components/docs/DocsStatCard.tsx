import DocsCard from './DocsCard';

type DocsStatCardProps = {
    label: string;
    value: string;
    caption: string;
};

export default function DocsStatCard({ label, value, caption }: DocsStatCardProps) {
    return (
        <DocsCard radius="lg" size="sm" variant="deep">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
            <p className="mt-2 font-mono text-sm text-emerald-200">{value}</p>
            <p className="mt-3 text-xs text-slate-400">{caption}</p>
        </DocsCard>
    );
}
