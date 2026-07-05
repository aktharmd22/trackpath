import Logo from '@/Components/Logo';
import Dropdown from '@/Components/Dropdown';
import { configureSound, playPop } from '@/lib/sound';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Briefcase,
    GraduationCap,
    LayoutDashboard,
    Library,
    LogOut,
    Rocket,
    SquareCheckBig,
    Volume2,
    VolumeX,
} from 'lucide-react';
import { useEffect } from 'react';

const nav = [
    { label: 'Dashboard', route: 'dashboard', match: 'dashboard', icon: LayoutDashboard },
    { label: 'Tasks', route: 'tasks.index', match: 'tasks.*', icon: SquareCheckBig },
    { label: 'Learning', route: 'learning.index', match: 'learning.*', icon: GraduationCap },
    { label: 'Materials', route: 'materials.index', match: 'materials.*', icon: Library },
    { label: 'Jobs', route: 'jobs.index', match: 'jobs.*', icon: Briefcase },
    { label: 'Projects', route: 'projects.index', match: 'projects.*', icon: Rocket },
];

function SidebarLink({ item }) {
    const active = route().current(item.match);
    const Icon = item.icon;

    return (
        <Link
            href={route(item.route)}
            className={
                'flex min-h-tap items-center gap-3 rounded-field px-3 py-2 text-sm font-medium transition ' +
                (active
                    ? 'bg-tint font-semibold text-accent'
                    : 'text-muted hover:bg-card hover:text-ink')
            }
        >
            <Icon size={20} strokeWidth={active ? 2.25 : 2} />
            {item.label}
        </Link>
    );
}

function TabLink({ item }) {
    const active = route().current(item.match);
    const Icon = item.icon;

    return (
        <Link
            href={route(item.route)}
            className={
                'flex min-h-tap flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition ' +
                (active ? 'text-accent' : 'text-muted')
            }
        >
            <Icon size={22} strokeWidth={active ? 2.25 : 2} />
            {item.label}
        </Link>
    );
}

export default function AppShell({ children }) {
    const user = usePage().props.auth.user;
    const initial = (user?.name?.trim()?.[0] ?? '?').toUpperCase();
    const soundOn = Boolean(user.sound_enabled);

    useEffect(() => {
        configureSound(soundOn);
    }, [soundOn]);

    const toggleSound = () => {
        router.patch(
            route('preferences.sound'),
            { enabled: !soundOn },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (!soundOn) {
                        configureSound(true);
                        playPop();
                    }
                },
            },
        );
    };

    return (
        <div className="min-h-screen bg-card">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-line bg-surface md:flex lg:w-64">
                <div className="flex h-16 items-center border-b border-line px-5">
                    <Link href={route('dashboard')}>
                        <Logo />
                    </Link>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                    {nav.map((item) => (
                        <SidebarLink key={item.route} item={item} />
                    ))}
                </nav>

                <div className="border-t border-line p-3">
                    <div className="flex items-center gap-3 rounded-field p-2">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tint text-sm font-bold text-accent">
                            {initial}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-ink">
                                {user.name}
                            </p>
                            <p className="truncate text-xs text-muted">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                        <Link
                            href={route('profile.edit')}
                            className="flex-1 rounded-field px-3 py-2 text-center text-sm font-medium text-muted transition hover:bg-card hover:text-ink"
                        >
                            Profile
                        </Link>
                        <button
                            type="button"
                            onClick={toggleSound}
                            className="flex min-h-tap min-w-tap items-center justify-center rounded-field text-muted transition hover:bg-card hover:text-ink"
                            aria-label={soundOn ? 'Mute sounds' : 'Enable sounds'}
                            title={soundOn ? 'Sounds on' : 'Sounds off'}
                        >
                            {soundOn ? (
                                <Volume2 size={18} />
                            ) : (
                                <VolumeX size={18} />
                            )}
                        </button>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex min-h-tap min-w-tap items-center justify-center rounded-field text-muted transition hover:bg-card hover:text-ink"
                            aria-label="Log out"
                        >
                            <LogOut size={18} />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile top bar */}
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-surface/95 px-4 backdrop-blur md:hidden">
                <Link href={route('dashboard')}>
                    <Logo />
                </Link>

                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            className="flex h-11 w-11 items-center justify-center"
                            aria-label="Account menu"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tint text-sm font-bold text-accent">
                                {initial}
                            </span>
                        </button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <Dropdown.Link href={route('profile.edit')}>
                            Profile
                        </Dropdown.Link>
                        <button
                            type="button"
                            onClick={toggleSound}
                            className="block min-h-tap w-full px-4 py-2.5 text-start text-sm leading-5 text-ink transition duration-150 ease-in-out hover:bg-card focus:bg-card focus:outline-none"
                        >
                            {soundOn ? 'Mute sounds' : 'Enable sounds'}
                        </button>
                        <Dropdown.Link
                            href={route('logout')}
                            method="post"
                            as="button"
                        >
                            Log out
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </header>

            {/* Page content */}
            <div className="md:pl-60 lg:pl-64">
                <main className="animate-page-in w-full px-4 pb-24 pt-6 sm:px-6 md:pb-10 lg:px-8">
                    {children}
                </main>
            </div>

            {/* Mobile bottom tab bar */}
            <nav
                className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
                aria-label="Primary"
            >
                <div className="grid grid-cols-5">
                    {nav.map((item) => (
                        <TabLink key={item.route} item={item} />
                    ))}
                </div>
            </nav>
        </div>
    );
}
