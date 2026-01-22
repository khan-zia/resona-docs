import DocsCard from './DocsCard';

type DocsStepCardProps = {
    index: number;
    title: string;
    body: string;
};

export default function DocsStepCard({ index, title, body }: DocsStepCardProps) {
    return (
        <DocsCard radius="lg" size="sm" variant="deep" className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
                Step {index}
            </span>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-300">{body}</p>
        </DocsCard>
    );
}
