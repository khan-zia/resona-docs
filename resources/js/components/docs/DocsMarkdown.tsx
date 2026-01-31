import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type DocsMarkdownProps = {
    content: string;
    className?: string;
};

function classes(...values: Array<string | undefined>): string {
    return values.filter(Boolean).join(' ');
}

type CodeBlockProps = {
    language: string;
    text: string;
};

function CodeBlock({ language, text }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (typeof navigator === 'undefined' || !navigator.clipboard) {
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div className="group relative mt-4 overflow-x-auto rounded-xl bg-[#0b1224] p-4 text-[13px] leading-relaxed text-slate-200">
            <button
                type="button"
                onClick={handleCopy}
                className="absolute right-3 top-3 rounded-md bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-300 opacity-0 transition group-hover:opacity-100 focus:opacity-100 hover:bg-white/10"
                aria-label="Copy code"
            >
                {copied ? 'Copied' : 'Copy'}
            </button>
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
                        fontFamily:
                            'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas)',
                    },
                }}
                wrapLongLines
            >
                {text}
            </SyntaxHighlighter>
        </div>
    );
}

export default function DocsMarkdown({ content, className }: DocsMarkdownProps) {
    return (
        <div className={classes('space-y-6', className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h2({ children }) {
                        return (
                            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                {children}
                            </h2>
                        );
                    },
                    h3({ children }) {
                        return (
                            <h3 className="text-lg font-semibold text-white">
                                {children}
                            </h3>
                        );
                    },
                    p({ children }) {
                        return <p className="text-[15px] leading-relaxed text-slate-400">{children}</p>;
                    },
                    ul({ children }) {
                        return <ul className="space-y-2 pl-6 text-[15px] leading-relaxed text-slate-400 list-disc">{children}</ul>;
                    },
                    ol({ children }) {
                        return <ol className="space-y-2 pl-6 text-[15px] leading-relaxed text-slate-400 list-decimal">{children}</ol>;
                    },
                    li({ children }) {
                        return <li className="leading-relaxed">{children}</li>;
                    },
                    table({ children }) {
                        return (
                            <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
                                <table className="w-full border-collapse text-left text-sm text-slate-300">
                                    {children}
                                </table>
                            </div>
                        );
                    },
                    thead({ children }) {
                        return <thead className="bg-white/5">{children}</thead>;
                    },
                    tbody({ children }) {
                        return <tbody className="divide-y divide-white/5">{children}</tbody>;
                    },
                    tr({ children }) {
                        return <tr>{children}</tr>;
                    },
                    th({ children }) {
                        return (
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {children}
                            </th>
                        );
                    },
                    td({ children }) {
                        return <td className="px-4 py-3 align-top text-sm text-slate-300">{children}</td>;
                    },
                    strong({ children }) {
                        return <strong className="font-semibold text-white">{children}</strong>;
                    },
                    a({ children, href }) {
                        return (
                            <a
                                href={href}
                                className="text-emerald-300 underline-offset-2 hover:text-emerald-200 hover:underline"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {children}
                            </a>
                        );
                    },
                    code({ inline, className: codeClassName, children }) {
                        const text = String(children ?? '').replace(/\n$/, '');
                        const isInline = inline ?? !codeClassName;
                        if (isInline) {
                            return (
                                <code className="rounded bg-white/5 px-1 py-[1px] font-mono text-[0.85em] text-emerald-200/90">
                                    {text}
                                </code>
                            );
                        }
                        const language = codeClassName?.replace('language-', '') ?? 'text';

                        return <CodeBlock language={language} text={text} />;
                    },
                    pre({ children }) {
                        return <>{children}</>;
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
