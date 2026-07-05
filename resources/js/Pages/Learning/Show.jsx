import Button from '@/Components/Button';
import Card from '@/Components/Card';
import ConfirmDialog from '@/Components/ConfirmDialog';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Pill from '@/Components/Pill';
import ProgressBar from '@/Components/ProgressBar';
import Select from '@/Components/Select';
import Textarea from '@/Components/Textarea';
import TextInput from '@/Components/TextInput';
import AppShell from '@/Layouts/AppShell';
import { formatDate, formatMinutes, MODULE_STATUS, today } from '@/lib/format';
import { playComplete } from '@/lib/sound';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, Clock3, Flag, Trash2 } from 'lucide-react';
import { useState } from 'react';

function LessonRow({ lesson }) {
    const done = lesson.status === 'done';

    const toggle = () => {
        router.patch(
            route('lessons.update', lesson.id),
            { status: done ? 'todo' : 'done' },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (!done) {
                        playComplete();
                    }
                },
            },
        );
    };

    return (
        <button
            type="button"
            onClick={toggle}
            className="flex min-h-tap w-full items-center gap-3 rounded-field px-2 py-2.5 text-left transition hover:bg-card"
        >
            <span
                className={
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ' +
                    (done
                        ? 'border-accent bg-accent text-white'
                        : 'border-line bg-surface')
                }
            >
                {done && <Check size={14} strokeWidth={3} />}
            </span>

            <span
                className={
                    'flex-1 text-sm ' +
                    (done ? 'text-muted line-through' : 'text-ink')
                }
            >
                {lesson.title}
            </span>

            {lesson.is_checkpoint && (
                <Pill tone={done ? 'solid' : 'muted'}>
                    <Flag size={12} />
                    Checkpoint
                </Pill>
            )}
        </button>
    );
}

function LogHoursForm({ module }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        hours: '',
        logged_on: today(),
        note: '',
    });

    const submit = (e) => {
        e.preventDefault();

        router.post(
            route('time-logs.store', module.id),
            {
                minutes: Math.round(parseFloat(data.hours || '0') * 60),
                logged_on: data.logged_on,
                note: data.note,
            },
            {
                preserveScroll: true,
                onSuccess: () => reset('hours', 'note'),
            },
        );
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <InputLabel htmlFor="hours" value="Hours" />
                    <TextInput
                        id="hours"
                        type="number"
                        step="0.25"
                        min="0.25"
                        max="24"
                        required
                        value={data.hours}
                        placeholder="1.5"
                        className="mt-1.5 block w-full"
                        onChange={(e) => setData('hours', e.target.value)}
                    />
                    <InputError message={errors.minutes} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="logged_on" value="Date" />
                    <TextInput
                        id="logged_on"
                        type="date"
                        required
                        value={data.logged_on}
                        max={today()}
                        className="mt-1.5 block w-full"
                        onChange={(e) => setData('logged_on', e.target.value)}
                    />
                    <InputError message={errors.logged_on} className="mt-2" />
                </div>
            </div>

            <div>
                <InputLabel htmlFor="note" value="Note (optional)" />
                <TextInput
                    id="note"
                    value={data.note}
                    placeholder="What did you cover?"
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('note', e.target.value)}
                />
                <InputError message={errors.note} className="mt-2" />
            </div>

            <Button className="w-full" disabled={processing}>
                Log time
            </Button>
        </form>
    );
}

function NotesForm({ module }) {
    const { data, setData, patch, processing, isDirty } = useForm({
        notes: module.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('modules.update', module.id), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="space-y-3">
            <Textarea
                rows={6}
                value={data.notes}
                placeholder="Key takeaways, links, reminders…"
                className="block w-full"
                onChange={(e) => setData('notes', e.target.value)}
            />
            <Button
                variant="secondary"
                className="w-full"
                disabled={processing || !isDirty}
            >
                {processing ? 'Saving…' : 'Save notes'}
            </Button>
        </form>
    );
}

export default function Show({ module, statuses }) {
    const [logToDelete, setLogToDelete] = useState(null);
    const [deletingLog, setDeletingLog] = useState(false);

    const changeStatus = (e) => {
        router.patch(
            route('modules.update', module.id),
            { status: e.target.value },
            { preserveScroll: true },
        );
    };

    const deleteLog = () => {
        setDeletingLog(true);

        router.delete(route('time-logs.destroy', logToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setLogToDelete(null),
            onFinish: () => setDeletingLog(false),
        });
    };

    return (
        <AppShell>
            <Head title={module.title} />

            <Link
                href={route('learning.index')}
                className="mb-4 inline-flex min-h-tap items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink"
            >
                <ArrowLeft size={16} />
                All modules
            </Link>

            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-field bg-tint text-sm font-bold text-accent">
                            {module.order}
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight text-ink">
                            {module.title}
                        </h1>
                    </div>
                    <p className="mt-2 text-sm text-muted">
                        {formatMinutes(module.minutes_logged)} logged
                        {module.target_hours > 0 &&
                            ` of ${module.target_hours}h target`}
                    </p>
                </div>

                <Select value={module.status} onChange={changeStatus}>
                    {statuses.map((value) => (
                        <option key={value} value={value}>
                            {MODULE_STATUS[value].label}
                        </option>
                    ))}
                </Select>
            </div>

            <Card className="mb-4 p-5">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">
                        {module.lessons.filter((l) => l.status === 'done').length}{' '}
                        of {module.lessons.length} lessons done
                    </span>
                    <span className="font-bold text-ink">
                        {module.progress}%
                    </span>
                </div>
                <ProgressBar value={module.progress} className="mt-2" />
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="p-5 md:col-span-2">
                    <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
                        Lessons
                    </h2>
                    <div className="-mx-2 divide-y divide-line/60">
                        {module.lessons.map((lesson) => (
                            <LessonRow key={lesson.id} lesson={lesson} />
                        ))}
                    </div>
                </Card>

                <div className="space-y-4">
                    <Card className="p-5">
                        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
                            Log hours
                        </h2>
                        <LogHoursForm module={module} />
                    </Card>

                    <Card className="p-5">
                        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
                            Notes
                        </h2>
                        <NotesForm module={module} />
                    </Card>
                </div>
            </div>

            {module.time_logs.length > 0 && (
                <Card className="mt-4 p-5">
                    <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
                        Recent time logs
                    </h2>
                    <ul className="divide-y divide-line/60">
                        {module.time_logs.map((log) => (
                            <li
                                key={log.id}
                                className="flex items-center gap-3 py-2.5"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-field bg-tint text-accent">
                                    <Clock3 size={16} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-ink">
                                        {formatMinutes(log.minutes)}
                                        <span className="ml-2 font-normal text-muted">
                                            {formatDate(log.logged_on)}
                                        </span>
                                    </p>
                                    {log.note && (
                                        <p className="truncate text-xs text-muted">
                                            {log.note}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setLogToDelete(log)}
                                    aria-label="Delete log"
                                    className="flex min-h-tap min-w-tap items-center justify-center rounded-field text-muted transition hover:bg-card hover:text-ink"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}

            <ConfirmDialog
                show={Boolean(logToDelete)}
                title="Delete this time log?"
                message={
                    logToDelete
                        ? `${formatMinutes(logToDelete.minutes)} on ${formatDate(logToDelete.logged_on)} will be removed.`
                        : ''
                }
                processing={deletingLog}
                onConfirm={deleteLog}
                onClose={() => setLogToDelete(null)}
            />
        </AppShell>
    );
}
