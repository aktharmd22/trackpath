import Button from '@/Components/Button';
import Card from '@/Components/Card';
import Drawer from '@/Components/Drawer';
import EmptyState from '@/Components/EmptyState';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PageHeader from '@/Components/PageHeader';
import Pill from '@/Components/Pill';
import ProgressBar from '@/Components/ProgressBar';
import Textarea from '@/Components/Textarea';
import TextInput from '@/Components/TextInput';
import AppShell from '@/Layouts/AppShell';
import { formatMinutes, MODULE_STATUS } from '@/lib/format';
import { playPop } from '@/lib/sound';
import { Head, Link, useForm } from '@inertiajs/react';
import { Clock3, GraduationCap, ListChecks, Plus } from 'lucide-react';
import { useState } from 'react';

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

function AddModuleForm({ onSaved }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        target_hours: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('modules.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                playPop();
                onSaved();
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <InputLabel htmlFor="title" value="Title" />
                <TextInput
                    id="title"
                    value={data.title}
                    required
                    placeholder="What are you learning?"
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('title', e.target.value)}
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="target_hours" value="Target hours (optional)" />
                <TextInput
                    id="target_hours"
                    type="number"
                    min="0"
                    max="1000"
                    value={data.target_hours}
                    placeholder="20"
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('target_hours', e.target.value)}
                />
                <InputError message={errors.target_hours} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="notes" value="Notes (optional)" />
                <Textarea
                    id="notes"
                    rows={4}
                    value={data.notes}
                    placeholder="Goals, resources, reminders…"
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('notes', e.target.value)}
                />
                <InputError message={errors.notes} className="mt-2" />
            </div>

            <Button className="w-full" disabled={processing}>
                {processing ? 'Adding…' : 'Add module'}
            </Button>

            <p className="text-xs text-muted">
                Add lessons from the module page after creating it.
            </p>
        </form>
    );
}

export default function Index({ modules }) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <AppShell>
            <Head title="Learning" />

            <PageHeader
                title="Learning"
                description="Modules, lessons, and study hours."
                actions={
                    <Button onClick={() => setDrawerOpen(true)}>
                        <Plus size={16} />
                        Add module
                    </Button>
                }
            />

            {modules.length === 0 ? (
                <EmptyState
                    icon={GraduationCap}
                    title="No modules yet"
                    message="Create your first learning module to start the roadmap."
                    action={
                        <Button onClick={() => setDrawerOpen(true)}>
                            <Plus size={16} />
                            Add module
                        </Button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {modules.map((module) => (
                        <ModuleCard key={module.id} module={module} />
                    ))}
                </div>
            )}

            <Drawer
                show={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Add module"
            >
                <AddModuleForm onSaved={() => setDrawerOpen(false)} />
            </Drawer>
        </AppShell>
    );
}
