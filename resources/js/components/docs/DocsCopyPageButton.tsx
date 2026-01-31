import { useMemo, useState } from 'react';

type DocsCopyPageButtonProps = {
    title: string;
    subtitle?: string;
    sections: Array<{ markdown: string }>;
    className?: string;
};

const normalize = (value: string) => value.replace(/\r\n/g, '\n').trim();

export default function DocsCopyPageButton({
    title,
    subtitle,
    sections,
    className,
}: DocsCopyPageButtonProps) {
    const [copied, setCopied] = useState(false);
    const payload = useMemo(() => {
        const blocks = [
            `# ${title}`,
            subtitle ? subtitle.trim() : '',
            '',
            ...sections.map((section) => normalize(section.markdown)),
        ].filter((block) => block !== '');

        return blocks.join('\n\n---\n\n');
    }, [sections, subtitle, title]);

    const handleCopy = async () => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(payload);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
                return;
            }
        } catch {
            // fall through to legacy copy
        }

        const textarea = document.createElement('textarea');
        textarea.value = payload;
        textarea.setAttribute('readonly', 'true');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={[
                'inline-flex items-center gap-2 rounded-xl border border-white/10',
                'bg-white/5 px-4 py-2 text-sm font-semibold text-white',
                'transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/40',
                className ?? '',
            ].join(' ')}
        >
            <span className="text-xs uppercase tracking-widest text-emerald-300/80">Copy Page</span>
            <span className="text-[11px] font-medium text-slate-300">
                {copied ? 'Copied' : 'Markdown'}
            </span>
        </button>
    );
}
