import type { ReactNode } from 'react';

type DocsInlineCodeProps = {
    children: ReactNode;
    className?: string;
};

function classes(...values: Array<string | undefined>): string {
    return values.filter(Boolean).join(' ');
}

export default function DocsInlineCode({ children, className }: DocsInlineCodeProps) {
    return (
        <code
            className={classes(
                'inline align-baseline whitespace-nowrap rounded-md bg-white/5 px-0.5 py-[1px] font-mono text-[0.85em] leading-[1.1] text-emerald-200/90',
                className,
            )}
        >
            {children}
        </code>
    );
}
