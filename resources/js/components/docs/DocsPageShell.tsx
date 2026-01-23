import { ReactNode, useEffect, useState } from 'react';

type DocsPageShellProps = {
    main: ReactNode;
    nav?: ReactNode;
    aside?: ReactNode;
    mainClassName?: string;
    navClassName?: string;
    asideClassName?: string;
    onSectionChange?: (id: string) => void;
};

function classes(...values: Array<string | undefined>): string {
    return values.filter(Boolean).join(' ');
}

function gridTemplate(hasNav: boolean, hasAside: boolean): string {
    if (hasNav && hasAside) {
        return 'lg:grid-cols-[220px_minmax(0,1fr)_320px]';
    }

    if (hasNav) {
        return 'lg:grid-cols-[220px_minmax(0,1fr)]';
    }

    if (hasAside) {
        return 'lg:grid-cols-[minmax(0,1fr)_320px]';
    }

    return 'lg:grid-cols-[minmax(0,1fr)]';
}

export default function DocsPageShell({
    main,
    nav,
    aside,
    mainClassName,
    navClassName,
    asideClassName,
    onSectionChange,
}: DocsPageShellProps) {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Use isIntersecting to handle tall sections that can't reach 50% ratio
                    if (entry.isIntersecting) {
                        onSectionChange?.(entry.target.id);
                    }
                });
            },
            { threshold: 0, rootMargin: '-15% 0px -80% 0px' }
        );

        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [onSectionChange]);

    const hasNav = Boolean(nav);
    const hasAside = Boolean(aside);

    return (
        <div 
            className={classes(
                'grid grid-cols-1 gap-x-12 gap-y-16 lg:items-start', 
                gridTemplate(hasNav, hasAside)
            )}
        >
            {nav ? (
                <nav className={classes(
                    'hidden lg:flex lg:flex-col lg:gap-8 lg:sticky lg:top-[calc(theme(spacing.12)+var(--header-height,64px))] overflow-y-auto max-h-[calc(100vh-theme(spacing.24))] pr-4', 
                    navClassName
                )}>
                    {nav}
                </nav>
            ) : null}
            
            <section className={classes('flex flex-col gap-20 min-w-0', mainClassName)}>
                {main}
            </section>
            
            {aside ? (
                <aside className={classes(
                    'hidden xl:flex xl:flex-col xl:gap-8 xl:sticky xl:top-[calc(theme(spacing.12)+var(--header-height,64px))] overflow-y-auto max-h-[calc(100vh-theme(spacing.24))] pl-4 border-l border-white/5', 
                    asideClassName
                )}>
                    {aside}
                </aside>
            ) : null}
        </div>
    );
}
