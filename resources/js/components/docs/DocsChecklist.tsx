type DocsChecklistProps = {
    items: string[];
    className?: string;
    dotClassName?: string;
};

function classes(...values: Array<string | undefined>): string {
    return values.filter(Boolean).join(' ');
}

export default function DocsChecklist({ items, className, dotClassName }: DocsChecklistProps) {
    return (
        <ul className={classes('mt-6 grid gap-4 text-sm text-slate-200', className)}>
            {items.map((item) => (
                <li key={item} className="flex items-center gap-3">
                    <span className={classes('inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400', dotClassName)} />
                    {item}
                </li>
            ))}
        </ul>
    );
}
