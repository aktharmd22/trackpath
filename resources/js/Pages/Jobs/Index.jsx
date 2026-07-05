import Button from '@/Components/Button';
import Card from '@/Components/Card';
import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
import Pill from '@/Components/Pill';
import Select from '@/Components/Select';
import AppShell from '@/Layouts/AppShell';
import { APPLICATION_STATUS, formatSalary } from '@/lib/format';
import { playPop } from '@/lib/sound';
import ApplicationDrawer from '@/Pages/Jobs/Partials/ApplicationDrawer';
import { Head, router } from '@inertiajs/react';
import {
    BellRing,
    Briefcase,
    CalendarClock,
    Download,
    MapPin,
    Plus,
} from 'lucide-react';
import { useMemo, useState } from 'react';

function StatusSelect({ application, statuses, className = '' }) {
    const change = (e) => {
        router.patch(
            route('applications.move', application.id),
            { status: e.target.value, position: 9999 },
            { preserveScroll: true, onSuccess: () => playPop() },
        );
    };

    return (
        <Select
            value={application.status}
            aria-label={`Status of ${application.company}`}
            onClick={(e) => e.stopPropagation()}
            onChange={change}
            className={'text-sm font-medium ' + className}
        >
            {statuses.map((status) => (
                <option key={status} value={status}>
                    {APPLICATION_STATUS[status].label}
                </option>
            ))}
        </Select>
    );
}

function ApplicationRow({ application, statuses, onOpen }) {
    const salary = formatSalary(application);

    return (
        <div
            onClick={onOpen}
            className="flex cursor-pointer flex-col gap-3 px-4 py-3.5 transition hover:bg-card sm:flex-row sm:items-center"
        >
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-field bg-tint text-sm font-bold text-accent">
                    {application.company[0].toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-bold text-ink">
                            {application.company}
                        </p>
                        {application.follow_up_due && (
                            <Pill tone="amber" className="shrink-0">
                                <BellRing size={12} />
                                Follow up
                            </Pill>
                        )}
                    </div>
                    <p className="truncate text-xs text-muted">
                        {application.role_title}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4 pl-[52px] text-xs text-muted sm:w-64 sm:shrink-0 sm:pl-0 lg:w-80">
                <span className="truncate font-semibold text-ink">
                    {salary ?? '—'}
                </span>
                {application.location && (
                    <span className="hidden min-w-0 items-center gap-1 lg:flex">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">
                            {application.location}
                        </span>
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3 sm:shrink-0">
                <Pill tone="muted" className="shrink-0">
                    <CalendarClock size={12} />
                    {application.days_in_stage}d
                </Pill>
                <StatusSelect
                    application={application}
                    statuses={statuses}
                    className="w-full sm:w-36"
                />
            </div>
        </div>
    );
}

export default function Index({ applications, statuses }) {
    const [filter, setFilter] = useState('all');
    const [drawerTarget, setDrawerTarget] = useState(null); // 'new' | app id
    const [drawerOpen, setDrawerOpen] = useState(false);

    const drawerApplication =
        typeof drawerTarget === 'number'
            ? (applications.find((a) => a.id === drawerTarget) ?? null)
            : null;

    const counts = useMemo(
        () =>
            Object.fromEntries(
                statuses.map((status) => [
                    status,
                    applications.filter((a) => a.status === status).length,
                ]),
            ),
        [applications, statuses],
    );

    const visible = useMemo(() => {
        const order = Object.fromEntries(statuses.map((s, i) => [s, i]));

        return applications
            .filter((a) => filter === 'all' || a.status === filter)
            .sort(
                (a, b) =>
                    order[a.status] - order[b.status] || a.order - b.order,
            );
    }, [applications, statuses, filter]);

    const openNew = () => {
        setDrawerTarget('new');
        setDrawerOpen(true);
    };

    return (
        <AppShell>
            <Head title="Jobs" />

            <PageHeader
                title="Jobs"
                description="Every application in one list — change status right from the row."
                actions={
                    <>
                        <a
                            href={route('applications.export')}
                            className="inline-flex min-h-tap items-center justify-center gap-2 rounded-field border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:bg-card"
                        >
                            <Download size={16} />
                            <span className="hidden sm:inline">Export CSV</span>
                            <span className="sm:hidden">CSV</span>
                        </a>
                        <Button onClick={openNew}>
                            <Plus size={16} />
                            Add application
                        </Button>
                    </>
                }
            />

            <div className="mb-5 flex flex-wrap items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className={
                        'min-h-[36px] rounded-full border px-3.5 text-sm font-semibold transition ' +
                        (filter === 'all'
                            ? 'border-accent bg-accent text-white'
                            : 'border-line bg-surface text-muted hover:text-ink')
                    }
                >
                    All {applications.length}
                </button>
                {statuses.map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => setFilter(status)}
                        className={
                            'min-h-[36px] rounded-full border px-3.5 text-sm font-semibold transition ' +
                            (filter === status
                                ? 'border-accent bg-accent text-white'
                                : 'border-line bg-surface text-muted hover:text-ink')
                        }
                    >
                        {APPLICATION_STATUS[status].label} {counts[status]}
                    </button>
                ))}
            </div>

            {visible.length === 0 ? (
                <EmptyState
                    icon={Briefcase}
                    title={
                        filter === 'all'
                            ? 'No applications yet'
                            : `Nothing in ${APPLICATION_STATUS[filter].label.toLowerCase()}`
                    }
                    message={
                        filter === 'all'
                            ? 'Add your first application to start tracking the pipeline.'
                            : 'Change a status below or add a new application.'
                    }
                    action={
                        <Button onClick={openNew}>
                            <Plus size={16} />
                            Add application
                        </Button>
                    }
                />
            ) : (
                <Card className="divide-y divide-line/60 overflow-hidden">
                    {visible.map((application) => (
                        <ApplicationRow
                            key={application.id}
                            application={application}
                            statuses={statuses}
                            onOpen={() => {
                                setDrawerTarget(application.id);
                                setDrawerOpen(true);
                            }}
                        />
                    ))}
                </Card>
            )}

            <ApplicationDrawer
                show={drawerOpen}
                application={drawerApplication}
                statuses={statuses}
                defaultStatus="saved"
                onClose={() => setDrawerOpen(false)}
            />
        </AppShell>
    );
}
