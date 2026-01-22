import type { ReactNode } from 'react';

type DocsPageShellProps = {
    main: ReactNode;
    nav?: ReactNode;
    aside?: ReactNode;
    mainClassName?: string;
    navClassName?: string;
    asideClassName?: string;
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
}: DocsPageShellProps) {
    const hasNav = Boolean(nav);
    const hasAside = Boolean(aside);

    return (
        <div className={classes('grid gap-10', gridTemplate(hasNav, hasAside))}>
            {nav ? (
                <nav className={classes('hidden flex-col gap-6 lg:flex', navClassName)}>{nav}</nav>
            ) : null}
            <section className={classes('flex flex-col gap-8', mainClassName)}>{main}</section>
            {aside ? <aside className={classes('flex flex-col gap-6', asideClassName)}>{aside}</aside> : null}
        </div>
    );
}
