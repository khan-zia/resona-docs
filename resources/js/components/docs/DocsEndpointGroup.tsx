import DocsCard from './DocsCard';

type DocsEndpoint = {
    method: string;
    path: string;
};

type DocsEndpointGroupProps = {
    title: string;
    description: string;
    endpoints: DocsEndpoint[];
};

export default function DocsEndpointGroup({ title, description, endpoints }: DocsEndpointGroupProps) {
    return (
        <DocsCard variant="muted" size="md" radius="xl">
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="text-sm text-slate-300">{description}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-200">
                {endpoints.map((endpoint) => (
                    <div
                        key={endpoint.path}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"
                    >
                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-200">
                            {endpoint.method}
                        </span>
                        <span className="font-mono text-xs text-slate-200">{endpoint.path}</span>
                    </div>
                ))}
            </div>
        </DocsCard>
    );
}
