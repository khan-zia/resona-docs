type DocsCodeBlockProps = {
    lines: string[];
    className?: string;
};

function classes(...values: Array<string | undefined>): string {
    return values.filter(Boolean).join(' ');
}

export default function DocsCodeBlock({ lines, className }: DocsCodeBlockProps) {
    return (
        <div
            className={classes(
                'rounded-2xl border border-white/10 bg-slate-950/80 p-4 font-mono text-xs text-slate-200',
                className,
            )}
        >
            {lines.map((line, index) => (
                <div key={`${index}-${line}`} className="whitespace-pre">
                    {line}
                </div>
            ))}
        </div>
    );
}
