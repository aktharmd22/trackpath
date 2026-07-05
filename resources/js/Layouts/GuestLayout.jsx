import Logo from '@/Components/Logo';
import { Link } from '@inertiajs/react';
import { BarChart3, Briefcase, GraduationCap } from 'lucide-react';

const highlights = [
    {
        icon: GraduationCap,
        title: 'Learning roadmap',
        detail: 'Modules, lessons, and logged study hours.',
    },
    {
        icon: Briefcase,
        title: 'Job pipeline',
        detail: 'A kanban from saved postings to signed offer.',
    },
    {
        icon: BarChart3,
        title: 'Progress at a glance',
        detail: 'One dashboard for the whole transition.',
    },
];

export default function GuestLayout({ title, subtitle, children }) {
    return (
        <div className="flex min-h-screen bg-surface">
            {/* Brand panel — desktop only */}
            <div className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:w-1/2 lg:flex-col lg:justify-between">
                {/* Decorative concentric rings */}
                <div
                    aria-hidden="true"
                    className="absolute -bottom-48 -right-48 h-[32rem] w-[32rem] rounded-full border border-white/10"
                />
                <div
                    aria-hidden="true"
                    className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full border border-white/10"
                />
                <div
                    aria-hidden="true"
                    className="absolute -bottom-8 -right-8 h-48 w-48 rounded-full border border-white/10"
                />

                <Link href="/" className="relative">
                    <Logo onDark />
                </Link>

                <div className="relative max-w-md">
                    <h1 className="text-4xl font-bold leading-tight tracking-tight">
                        Track the work.
                        <br />
                        Land the role.
                    </h1>
                    <p className="mt-4 text-base leading-relaxed text-white/60">
                        Your learning, study materials, and job applications —
                        organised in one place while you move into supply chain
                        analytics.
                    </p>

                    <ul className="mt-10 space-y-5">
                        {highlights.map(({ icon: Icon, title: t, detail }) => (
                            <li key={t} className="flex items-start gap-4">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-field bg-white/10">
                                    <Icon size={20} strokeWidth={1.75} />
                                </span>
                                <span>
                                    <span className="block text-sm font-semibold">
                                        {t}
                                    </span>
                                    <span className="block text-sm text-white/50">
                                        {detail}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative text-xs text-white/40">
                    A personal build — one user, one goal.
                </p>
            </div>

            {/* Form panel */}
            <div className="flex w-full flex-col items-center justify-center px-4 py-10 sm:px-6 lg:w-1/2">
                <div className="w-full max-w-sm">
                    <Link href="/" className="mb-10 flex justify-center lg:hidden">
                        <Logo />
                    </Link>

                    {title && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="mt-2 text-sm text-muted">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    )}

                    {children}
                </div>
            </div>
        </div>
    );
}
