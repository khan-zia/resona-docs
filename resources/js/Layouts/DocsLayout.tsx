import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

type NavKey = 'guide' | 'api';

type DocsLayoutProps = {
    title: string;
    subtitle: string;
    active: NavKey;
    children: ReactNode;
};

const navItems: Array<{ key: NavKey; label: string; href: string }> = [
    { key: 'guide', label: 'Guide', href: '/guide' },
    { key: 'api', label: 'API Reference', href: '/api-reference' },
];

export default function DocsLayout({ title, subtitle, active, children }: DocsLayoutProps) {
    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-emerald-400/20 blur-[140px]" />
                <div className="absolute right-[-10rem] top-24 h-[28rem] w-[28rem] rounded-full bg-cyan-400/15 blur-[160px]" />
                <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.18),transparent_60%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.82)_0%,rgba(2,6,23,0.92)_55%,rgba(2,6,23,1)_100%)]" />
            </div>

            <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/70 backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                    <Link href="/guide" className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                />
                            </svg>
                        </span>
                        <span className="text-lg font-bold text-neutral-900 dark:text-white font-[family:var(--font-brand)]">
                            Resona Docs
                        </span>
                    </Link>
                    <nav className="flex items-center gap-2 text-sm">
                        {navItems.map((item) => {
                            const isActive = item.key === active;

                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className={`rounded-full px-4 py-2 transition ${
                                        isActive
                                            ? 'bg-white/10 text-white shadow-[0_0_0_1px_rgba(148,163,184,0.35)]'
                                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-12">
                <div className="flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-[0.34em] text-emerald-300/80">Resona Platform</p>
                    <h1 className="font-[family:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl">
                        {title}
                    </h1>
                    <p className="max-w-2xl text-lg text-slate-300">{subtitle}</p>
                </div>

                <div className="mt-12">{children}</div>
            </main>
        </div>
    );
}
