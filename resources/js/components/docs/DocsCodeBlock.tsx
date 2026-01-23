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

import { useState } from 'react';

export default function DocsCodeBlock({
    code,
    lines,
    language = 'text',
    showLineNumbers = false,
    className,
}: DocsCodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const content = code ?? (lines ? lines.join('\n') : '');

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={classes(
                'group relative overflow-hidden rounded-xl bg-[#0b1224]',
                className,
            )}
        >
            <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {language === 'typescript' ? 'TS' : language}
                </span>
                <button
                    onClick={handleCopy}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <div className="p-4 overflow-x-auto text-[13px] leading-relaxed selection:bg-emerald-500/30">
                <SyntaxHighlighter
                    language={language}
                    style={dark}
                    customStyle={{
                        margin: 0,
                        padding: 0,
                        background: 'transparent',
                        border: 'none',
                        boxShadow: 'none',
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
        </div>
    );
}
