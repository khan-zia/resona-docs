import type { ReactNode } from 'react';

type DocsEyebrowTone = 'primary' | 'accent' | 'muted';

type DocsEyebrowProps = {
    children: ReactNode;
    className?: string;
    tone?: DocsEyebrowTone;
};

const toneClasses: Record<DocsEyebrowTone, string> = {
    primary: 'text-emerald-200/80',
    accent: 'text-emerald-100/80',
    muted: 'text-slate-400',
};

function classes(...values: Array<string | undefined>): string {
    return values.filter(Boolean).join(' ');
}

export default function DocsEyebrow({ children, className, tone = 'primary' }: DocsEyebrowProps) {
    return (
        <p className={classes('text-sm uppercase tracking-[0.2em]', toneClasses[tone], className)}>
            {children}
        </p>
    );
}
