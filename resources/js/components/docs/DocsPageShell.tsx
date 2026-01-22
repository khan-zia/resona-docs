import type { ReactNode } from 'react';

type DocsPageShellProps = {
    main: ReactNode;
    aside?: ReactNode;
    mainClassName?: string;
    asideClassName?: string;
};

function classes(...values: Array<string | undefined>): string {
    return values.filter(Boolean).join(' ');
}

export default function DocsPageShell({ main, aside, mainClassName, asideClassName }: DocsPageShellProps) {
    return (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section className={classes('flex flex-col gap-8', mainClassName)}>{main}</section>
            {aside ? <aside className={classes('flex flex-col gap-6', asideClassName)}>{aside}</aside> : null}
        </div>
    );
}
