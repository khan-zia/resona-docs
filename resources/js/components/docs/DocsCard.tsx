import type { ReactNode } from 'react';

type DocsCardVariant = 'glass' | 'muted' | 'deep' | 'gradient' | 'accent';
type DocsCardRadius = 'lg' | 'xl';
type DocsCardSize = 'sm' | 'md' | 'lg';

type DocsCardProps = {
    children: ReactNode;
    className?: string;
    variant?: DocsCardVariant;
    radius?: DocsCardRadius;
    size?: DocsCardSize;
};

const variantClasses: Record<DocsCardVariant, string> = {
    glass: 'bg-white/5',
    muted: 'bg-slate-900/40',
    deep: 'bg-slate-950/60',
    gradient: 'bg-gradient-to-br from-slate-900/60 to-slate-950/90',
    accent: 'bg-gradient-to-br from-emerald-500/15 to-cyan-500/10',
};

const radiusClasses: Record<DocsCardRadius, string> = {
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
};

const sizeClasses: Record<DocsCardSize, string> = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

function classes(...values: Array<string | undefined>): string {
    return values.filter(Boolean).join(' ');
}

export default function DocsCard({
    children,
    className,
    variant = 'glass',
    radius = 'xl',
    size = 'md',
}: DocsCardProps) {
    return (
        <div
            className={classes(
                'border border-white/10',
                variantClasses[variant],
                radiusClasses[radius],
                sizeClasses[size],
                className,
            )}
        >
            {children}
        </div>
    );
}
