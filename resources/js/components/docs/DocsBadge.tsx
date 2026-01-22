import type { ReactNode } from 'react';

type DocsBadgeTone = 'emerald' | 'cyan' | 'slate' | 'neutral';

type DocsBadgeProps = {
    children: ReactNode;
    className?: string;
    tone?: DocsBadgeTone;
};

const toneClasses: Record<DocsBadgeTone, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-200',
    cyan: 'bg-cyan-500/10 text-cyan-200',
    slate: 'bg-slate-800 text-slate-200',
    neutral: 'bg-white/10 text-slate-100',
};

function classes(...values: Array<string | undefined>): string {
    return values.filter(Boolean).join(' ');
}

export default function DocsBadge({ children, className, tone = 'neutral' }: DocsBadgeProps) {
    return (
        <span className={classes('rounded-full px-3 py-1 text-xs', toneClasses[tone], className)}>
            {children}
        </span>
    );
}
