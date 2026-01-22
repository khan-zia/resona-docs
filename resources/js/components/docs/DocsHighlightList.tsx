type DocsHighlightItem = {
    title: string;
    description: string;
};

type DocsHighlightListProps = {
    items: DocsHighlightItem[];
    className?: string;
};

function classes(...values: Array<string | undefined>): string {
    return values.filter(Boolean).join(' ');
}

export default function DocsHighlightList({ items, className }: DocsHighlightListProps) {
    return (
        <div className={classes('mt-4 flex flex-col gap-4 text-sm text-slate-300', className)}>
            {items.map((item) => (
                <div key={item.title} className="flex flex-col gap-1">
                    <span className="text-white">{item.title}</span>
                    <span className="text-xs text-slate-400">{item.description}</span>
                </div>
            ))}
        </div>
    );
}
