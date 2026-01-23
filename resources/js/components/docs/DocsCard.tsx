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
    glass: 'bg-slate-900/40 backdrop-blur-sm border-white/10 hover:border-white/20',
    muted: 'bg-slate-950/20 border-white/5 hover:border-white/10',
    deep: 'bg-slate-950 border-white/10 shadow-xl',
    gradient: 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border-white/10',
    accent: 'bg-slate-900/50 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]',
};

const radiusClasses: Record<DocsCardRadius, string> = {
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
};

const sizeClasses: Record<DocsCardSize, string> = {
    sm: 'p-5',
    md: 'p-8',
    lg: 'p-12',
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
                'group relative border transition-all duration-300',
                variantClasses[variant],
                radiusClasses[radius],
                sizeClasses[size],
                className,
            )}
        >
            {variant === 'accent' && (
                <div className="absolute -inset-px rounded-[inherit] bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
            )}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
