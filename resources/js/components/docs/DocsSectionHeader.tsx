import type { ReactNode } from 'react';

type DocsSectionHeaderProps = {
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
};

function classes(...values: Array<string | undefined>): string {
    return values.filter(Boolean).join(' ');
}

export default function DocsSectionHeader({
    eyebrow,
    title,
    description,
    className,
    titleClassName,
    descriptionClassName,
}: DocsSectionHeaderProps) {
    return (
        <div className={classes('flex flex-col gap-4', className)}>
            {eyebrow}
            <h2
                className={classes(
                    'font-[family:var(--font-display)] text-2xl font-semibold text-white',
                    titleClassName,
                )}
            >
                {title}
            </h2>
            {description ? (
                <p className={classes('text-sm text-slate-300', descriptionClassName)}>{description}</p>
            ) : null}
        </div>
    );
}
