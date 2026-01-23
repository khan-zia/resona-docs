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
        <div className={classes('flex flex-col gap-5', className)}>
            {eyebrow}
            <h2
                className={classes(
                    'font-display text-2xl font-bold tracking-tight text-white sm:text-3xl',
                    titleClassName,
                )}
            >
                {title}
            </h2>
            {description ? (
                <p className={classes('max-w-3xl text-[15px] leading-relaxed text-slate-400', descriptionClassName)}>{description}</p>
            ) : null}
        </div>
    );
}
