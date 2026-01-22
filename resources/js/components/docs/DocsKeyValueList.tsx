import type { ReactNode } from 'react';

type DocsKeyValueItem = {
    label: ReactNode;
    value: ReactNode;
};

type DocsKeyValueListProps = {
    items: DocsKeyValueItem[];
    className?: string;
};

function classes(...values: Array<string | undefined>): string {
    return values.filter(Boolean).join(' ');
}

export default function DocsKeyValueList({ items, className }: DocsKeyValueListProps) {
    return (
        <div className={classes('mt-4 flex flex-col gap-4 text-sm text-slate-200', className)}>
            {items.map((item, index) => (
                <div key={`${index}-${String(item.label)}`} className="flex items-center justify-between gap-4">
                    <span>{item.label}</span>
                    {item.value}
                </div>
            ))}
        </div>
    );
}
