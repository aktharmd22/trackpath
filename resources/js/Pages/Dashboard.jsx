import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import Pill from '@/Components/Pill';
import ProgressBar from '@/Components/ProgressBar';
import AppShell from '@/Layouts/AppShell';
import {
    APPLICATION_STATUS,
    formatDate,
    formatMinutes,
} from '@/lib/format';
import { playDueAlertOnce } from '@/lib/sound';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import {
    ArrowRight,
    BellRing,
    BriefcaseBusiness,
    CalendarClock,
    Clock3,
    GraduationCap,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

function StatTile({ icon: Icon, label, value, detail, href }) {
    return (
        <Link href={href} className="block">
            <Card className="h-full p-5 transition hover:border-ink/30">
                <div className="flex items-center gap-2 text-muted">
                    <Icon size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                        {label}
                    </span>
                </div>
                <p className="mt-2 text-3xl font-bold tracking-tight text-ink">
                    {value}
                </p>
                {detail && <p className="mt-1 text-sm text-muted">{detail}</p>}
            </Card>
        </Link>
    );
}

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="rounded-field border border-line bg-surface px-3 py-2 text-xs shadow-sm">
            <p className="font-semibold text-ink">{label}</p>
            <p className="mt-0.5 text-muted">
                {formatMinutes(payload[0].payload.minutes)} studied
            </p>
        </div>
    );
}

function StudyChart({ minutesByDay }) {
    const data = minutesByDay.map((day) => ({
        ...day,
        label: formatDate(day.date),
        hours: Math.round((day.minutes / 60) * 100) / 100,
    }));

    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart
                data={data}
                margin={{ top: 8, right: 0, left: -18, bottom: 0 }}
            >
                <CartesianGrid
                    vertical={false}
                    stroke="rgb(var(--color-line))"
                    strokeWidth={1}
                />
                <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                    tick={{
                        fontSize: 11,
                        fill: 'rgb(var(--color-muted))',
                    }}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    width={38}
                    tick={{
                        fontSize: 11,
                        fill: 'rgb(var(--color-muted))',
                    }}
                    tickFormatter={(value) => `${value}h`}
                />
                <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: 'rgb(var(--color-ink) / 0.05)' }}
                />
                <Bar
                    dataKey="hours"
                    fill="rgb(var(--color-accent))"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={22}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

function NextActions({ currentModule, followUps, dueTasks }) {
    const empty =
        !currentModule && followUps.length === 0 && dueTasks.length === 0;

    return (
        <Card className="p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
                Next actions
            </h2>

            {empty && (
                <p className="py-4 text-sm text-muted">
                    All caught up — nothing needs attention right now.
                </p>
            )}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {dueTasks.map((task) => (
                    <Link
                        key={`task-${task.id}`}
                        href={route('tasks.index')}
                        className="flex items-center justify-between gap-2 rounded-field border border-line p-3 transition hover:border-ink/30"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">
                                {task.title}
                            </p>
                            <p className="truncate text-xs text-muted">Task</p>
                        </div>
                        <Pill
                            tone={task.overdue ? 'amber' : 'accent'}
                            className="shrink-0"
                        >
                            <CalendarClock size={12} />
                            {task.overdue ? 'Overdue' : 'Due today'}
                        </Pill>
                    </Link>
                ))}

                {currentModule && (
                    <Link
                        href={route('learning.show', currentModule.slug)}
                        className="block rounded-field border border-line p-3 transition hover:border-ink/30"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-ink">
                                Continue: {currentModule.title}
                            </p>
                            <ArrowRight size={16} className="shrink-0 text-muted" />
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                            <ProgressBar
                                value={currentModule.progress}
                                className="flex-1"
                            />
                            <span className="text-xs font-semibold text-muted">
                                {currentModule.done_lessons_count}/
                                {currentModule.lessons_count}
                            </span>
                        </div>
                    </Link>
                )}

                {followUps.map((application) => (
                    <Link
                        key={application.id}
                        href={route('jobs.index')}
                        className="flex items-center justify-between gap-2 rounded-field border border-line p-3 transition hover:border-ink/30"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">
                                Follow up: {application.company}
                            </p>
                            <p className="truncate text-xs text-muted">
                                {application.role_title}
                            </p>
                        </div>
                        {application.follow_up_due ? (
                            <Pill tone="amber" className="shrink-0">
                                <BellRing size={12} />
                                Follow-up due
                            </Pill>
                        ) : (
                            <Pill tone="muted" className="shrink-0">
                                <CalendarClock size={12} />
                                {application.days_in_stage}d in{' '}
                                {APPLICATION_STATUS[application.status].label.toLowerCase()}
                            </Pill>
                        )}
                    </Link>
                ))}
            </div>
        </Card>
    );
}

function PipelineSummary({ byStatus, total }) {
    return (
        <Card className="p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
                Pipeline
            </h2>

            <ul className="space-y-1">
                {Object.entries(byStatus).map(([status, count]) => (
                    <li key={status}>
                        <Link
                            href={route('jobs.index')}
                            className="flex min-h-tap items-center justify-between rounded-field px-2 transition hover:bg-card"
                        >
                            <Pill tone={APPLICATION_STATUS[status].tone}>
                                {APPLICATION_STATUS[status].label}
                            </Pill>
                            <span className="text-sm font-bold text-ink">
                                {count}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>

            <p className="mt-3 border-t border-line pt-3 text-sm text-muted">
                {total} application{total === 1 ? '' : 's'} tracked
            </p>
        </Card>
    );
}

export default function Dashboard({
    stats,
    minutesByDay,
    currentModule,
    followUps,
    dueTasks,
}) {
    const user = usePage().props.auth.user;

    const hasDueItems =
        dueTasks.length > 0 || followUps.some((f) => f.follow_up_due);

    useEffect(() => {
        if (hasDueItems) {
            playDueAlertOnce();
        }
    }, [hasDueItems]);

    return (
        <AppShell>
            <Head title="Dashboard" />

            <PageHeader
                title={`Welcome back, ${user.name.split(' ')[0]}`}
                description="Your career transition, at a glance."
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatTile
                    icon={GraduationCap}
                    label="Learning progress"
                    value={`${stats.progress}%`}
                    detail={`${stats.done_lessons} of ${stats.total_lessons} lessons done`}
                    href={route('learning.index')}
                />
                <StatTile
                    icon={Clock3}
                    label="Hours this week"
                    value={formatMinutes(stats.minutes_this_week)}
                    detail="Across all modules"
                    href={route('learning.index')}
                />
                <StatTile
                    icon={BriefcaseBusiness}
                    label="Applications"
                    value={stats.applications_total}
                    detail={`${stats.applications_by_status.interview} in interview`}
                    href={route('jobs.index')}
                />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
                <Card className="p-5 xl:col-span-2">
                    <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">
                        Study hours — last 14 days
                    </h2>
                    <StudyChart minutesByDay={minutesByDay} />
                </Card>

                <PipelineSummary
                    byStatus={stats.applications_by_status}
                    total={stats.applications_total}
                />
            </div>

            <div className="mt-4">
                <NextActions
                    currentModule={currentModule}
                    followUps={followUps}
                    dueTasks={dueTasks}
                />
            </div>
        </AppShell>
    );
}
