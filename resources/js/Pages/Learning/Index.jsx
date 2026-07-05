import Card from '@/Components/Card';
import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
import Pill from '@/Components/Pill';
import ProgressBar from '@/Components/ProgressBar';
import AppShell from '@/Layouts/AppShell';
import { formatMinutes, MODULE_STATUS } from '@/lib/format';
import { Head, Link } from '@inertiajs/react';
import { Clock3, GraduationCap, ListChecks } from 'lucide-react';

function ModuleCard({ module }) {
    const status = MODULE_STATUS[module.status];

    return (
        <Link href={route('learning.show', module.slug)} className="block">
            <Card className="h-full p-5 transition hover:border-ink/30">
                <div className="flex items-start justify-between gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-field bg-tint text-sm font-bold text-accent">
                        {module.order}
                    </span>
                    <Pill tone={status.tone}>{status.label}</Pill>
                </div>

                <h3 className="mt-3 text-base font-semibold text-ink">
                    {module.title}
                </h3>

                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted">
                        <span className="flex items-center gap-1">
                            <ListChecks size={14} />
                            {module.done_lessons_count}/{module.lessons_count}{' '}
                            lessons
                        </span>
                        <span className="font-semibold text-ink">
                            {module.progress}%
                        </span>
                    </div>
                    <ProgressBar value={module.progress} className="mt-1.5" />
                </div>

                <p className="mt-3 flex items-center gap-1 text-xs text-muted">
                    <Clock3 size={14} />
                    {formatMinutes(module.minutes_logged)} logged
                    {module.target_hours > 0 &&
                        ` of ${module.target_hours}h target`}
                </p>
            </Card>
        </Link>
    );
}

export default function Index({ modules }) {
    return (
        <AppShell>
            <Head title="Learning" />

            <PageHeader
                title="Learning"
                description="Modules, lessons, and study hours."
            />

            {modules.length === 0 ? (
                <EmptyState
                    icon={GraduationCap}
                    title="No modules yet"
                    message="Seed the database to load the learning roadmap."
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {modules.map((module) => (
                        <ModuleCard key={module.id} module={module} />
                    ))}
                </div>
            )}
        </AppShell>
    );
}
