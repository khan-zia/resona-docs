import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type DocsCodeBlockProps = {
    code?: string;
    lines?: string[];
    language?: string;
    showLineNumbers?: boolean;
    className?: string;
};

function classes(...values: Array<string | undefined>): string {
    return values.filter(Boolean).join(' ');
}

export default function DocsCodeBlock({
    code,
    lines,
    language = 'text',
    showLineNumbers = false,
    className,
}: DocsCodeBlockProps) {
    const content = code ?? (lines ? lines.join('\n') : '');

    return (
        <div
            className={classes(
                'overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-200',
                className,
            )}
        >
            <SyntaxHighlighter
                language={language}
                style={dark}
                customStyle={{
                    margin: 0,
                    padding: 0,
                    background: 'transparent',
                    fontSize: '0.75rem',
                    lineHeight: '1.6',
                }}
                codeTagProps={{
                    style: {
                        fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas)',
                    },
                }}
                showLineNumbers={showLineNumbers}
                wrapLongLines
            >
                {content}
            </SyntaxHighlighter>
        </div>
    );
}
