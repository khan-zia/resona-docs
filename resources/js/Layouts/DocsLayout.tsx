import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

type NavKey = 'guide' | 'api' | 'examples';

type DocsLayoutProps = {
    title: string;
    subtitle: string;
    active: NavKey;
    children: ReactNode;
};

const navItems: Array<{ key: NavKey; label: string; href: string }> = [
    { key: 'guide', label: 'Guide', href: '/guide' },
    { key: 'api', label: 'API Reference', href: '/api-reference' },
    { key: 'examples', label: 'Examples', href: '/examples' },
];

export default function DocsLayout({ title, subtitle, active, children }: DocsLayoutProps) {
    return (
        <div className="relative min-h-screen bg-slate-950 font-sans selection:bg-emerald-500/30">
            {/* Subtle background effects */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-full max-w-[1400px] opacity-20 [mask-image:radial-gradient(closest-side,white,transparent)]">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_70%)]" />
                </div>
            </div>

            <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-3">
                    <Link href="/guide" className="group flex items-center gap-3 transition-opacity hover:opacity-90">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-[1px]">
                            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white font-display">
                            Resona <span className="text-slate-500">Docs</span>
                        </span>
                    </Link>
                    
                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = item.key === active;

                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className={`relative rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? 'text-white'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                    }`}
                                >
                                    {item.label}
                                    {isActive && (
                                        <div className="absolute inset-x-2 -bottom-3.5 h-[2px] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            <main className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-24 pt-16">
                <div className="mb-16 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-emerald-500/50" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-400/80">Documentation</p>
                    </div>
                    <div className="space-y-4">
                        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            {title}
                        </h1>
                        <p className="max-w-3xl text-xl leading-relaxed text-slate-400">
                            {subtitle}
                        </p>
                    </div>
                </div>

                <div className="relative">{children}</div>
            </main>
        </div>
    );
}
