import Button from '@/Components/Button';
import Card from '@/Components/Card';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Drawer from '@/Components/Drawer';
import EmptyState from '@/Components/EmptyState';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PageHeader from '@/Components/PageHeader';
import Pill from '@/Components/Pill';
import Select from '@/Components/Select';
import Textarea from '@/Components/Textarea';
import TextInput from '@/Components/TextInput';
import AppShell from '@/Layouts/AppShell';
import { formatDate, today } from '@/lib/format';
import { playComplete, playPop } from '@/lib/sound';
import { Head, router, useForm } from '@inertiajs/react';
import { CalendarClock, Check, Plus, SquareCheckBig } from 'lucide-react';
import { useState } from 'react';

const PRIORITY_META = {
    low: { label: 'Low', tone: 'faded' },
    normal: { label: 'Normal', tone: 'muted' },
    high: { label: 'High', tone: 'solid' },
};

function QuickAdd({ priorities }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        due_on: '',
        priority: 'normal',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('tasks.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                playPop();
            },
        });
    };

    return (
        <Card className="mb-5 p-4">
            <form
                onSubmit={submit}
                className="flex flex-col gap-3 sm:flex-row sm:items-start"
            >
                <div className="flex-1">
                    <TextInput
                        value={data.title}
                        required
                        placeholder="Add a task…"
                        aria-label="Task title"
                        className="block w-full"
                        onChange={(e) => setData('title', e.target.value)}
                    />
                    <InputError message={errors.title} className="mt-2" />
                </div>
                <div className="flex gap-3">
                    <TextInput
                        type="date"
                        value={data.due_on}
                        aria-label="Due date"
                        className="block"
                        onChange={(e) => setData('due_on', e.target.value)}
                    />
                    <Select
                        value={data.priority}
                        aria-label="Priority"
                        onChange={(e) => setData('priority', e.target.value)}
                    >
                        {priorities.map((priority) => (
                            <option key={priority} value={priority}>
                                {PRIORITY_META[priority].label}
                            </option>
                        ))}
                    </Select>
                </div>
                <Button disabled={processing}>
                    <Plus size={16} />
                    Add
                </Button>
            </form>
        </Card>
    );
}

function TaskRow({ task, onOpen }) {
    const toggle = (e) => {
        e.stopPropagation();

        router.patch(
            route('tasks.update', task.id),
            { completed: !task.completed },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (!task.completed) {
                        playComplete();
                    }
                },
            },
        );
    };

    return (
        <div
            onClick={onOpen}
            className="flex min-h-tap cursor-pointer items-center gap-3 rounded-field px-2 py-2.5 transition hover:bg-card"
        >
            <button
                type="button"
                onClick={toggle}
                aria-label={task.completed ? 'Mark as open' : 'Mark as done'}
                className={
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ' +
                    (task.completed
                        ? 'border-accent bg-accent text-white'
                        : 'border-line bg-surface hover:border-ink/40')
                }
            >
                {task.completed && <Check size={14} strokeWidth={3} />}
            </button>

            <div className="min-w-0 flex-1">
                <p
                    className={
                        'truncate text-sm ' +
                        (task.completed
                            ? 'text-muted line-through'
                            : 'text-ink')
                    }
                >
                    {task.title}
                </p>
                {task.notes && (
                    <p className="truncate text-xs text-muted">{task.notes}</p>
                )}
            </div>

            {task.priority !== 'normal' && !task.completed && (
                <Pill tone={PRIORITY_META[task.priority].tone}>
                    {PRIORITY_META[task.priority].label}
                </Pill>
            )}

            {task.due_on && !task.completed && (
                <Pill tone={task.overdue ? 'amber' : 'muted'}>
                    <CalendarClock size={12} />
                    {formatDate(task.due_on)}
                </Pill>
            )}
        </div>
    );
}

function TaskGroup({ title, tasks, onOpen }) {
    if (tasks.length === 0) {
        return null;
    }

    return (
        <Card className="p-4">
            <h2 className="mb-2 px-2 text-sm font-bold uppercase tracking-wide text-muted">
                {title}
                <span className="ml-2 font-semibold text-muted/70">
                    {tasks.length}
                </span>
            </h2>
            <div className="divide-y divide-line/60">
                {tasks.map((task) => (
                    <TaskRow
                        key={task.id}
                        task={task}
                        onOpen={() => onOpen(task.id)}
                    />
                ))}
            </div>
        </Card>
    );
}

function TaskDrawer({ show, task, priorities, onClose }) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const destroy = () => {
        setDeleting(true);

        router.delete(route('tasks.destroy', task.id), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmingDelete(false);
                onClose();
            },
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <Drawer show={show} onClose={onClose} title="Edit task">
            {task && (
                <div className="space-y-6 pb-4">
                    <TaskForm
                        key={task.id}
                        task={task}
                        priorities={priorities}
                        onSaved={onClose}
                    />

                    <Button
                        variant="danger"
                        className="w-full"
                        onClick={() => setConfirmingDelete(true)}
                    >
                        Delete task
                    </Button>

                    <ConfirmDialog
                        show={confirmingDelete}
                        title="Delete this task?"
                        message={`“${task.title}” will be permanently removed.`}
                        processing={deleting}
                        onConfirm={destroy}
                        onClose={() => setConfirmingDelete(false)}
                    />
                </div>
            )}
        </Drawer>
    );
}

function TaskForm({ task, priorities, onSaved }) {
    const { data, setData, patch, processing, errors } = useForm({
        title: task.title,
        notes: task.notes ?? '',
        due_on: task.due_on ?? '',
        priority: task.priority,
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('tasks.update', task.id), {
            preserveScroll: true,
            onSuccess: onSaved,
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
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('title', e.target.value)}
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <InputLabel htmlFor="due_on" value="Due date" />
                    <TextInput
                        id="due_on"
                        type="date"
                        value={data.due_on}
                        className="mt-1.5 block w-full"
                        onChange={(e) => setData('due_on', e.target.value)}
                    />
                    <InputError message={errors.due_on} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="priority" value="Priority" />
                    <Select
                        id="priority"
                        value={data.priority}
                        className="mt-1.5 block w-full"
                        onChange={(e) => setData('priority', e.target.value)}
                    >
                        {priorities.map((priority) => (
                            <option key={priority} value={priority}>
                                {PRIORITY_META[priority].label}
                            </option>
                        ))}
                    </Select>
                    <InputError message={errors.priority} className="mt-2" />
                </div>
            </div>

            <div>
                <InputLabel htmlFor="notes" value="Notes" />
                <Textarea
                    id="notes"
                    rows={4}
                    value={data.notes}
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('notes', e.target.value)}
                />
                <InputError message={errors.notes} className="mt-2" />
            </div>

            <Button className="w-full" disabled={processing}>
                {processing ? 'Saving…' : 'Save changes'}
            </Button>
        </form>
    );
}

export default function Index({ tasks, priorities }) {
    const [drawerTarget, setDrawerTarget] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const drawerTask =
        typeof drawerTarget === 'number'
            ? (tasks.find((t) => t.id === drawerTarget) ?? null)
            : null;

    const open = tasks.filter((t) => !t.completed);
    const todayStr = today();

    const groups = [
        { title: 'Overdue', items: open.filter((t) => t.overdue) },
        {
            title: 'Today',
            items: open.filter((t) => t.due_on === todayStr && !t.overdue),
        },
        {
            title: 'Upcoming',
            items: open.filter((t) => t.due_on && t.due_on > todayStr),
        },
        { title: 'Someday', items: open.filter((t) => !t.due_on) },
        { title: 'Done', items: tasks.filter((t) => t.completed) },
    ];

    const openDrawer = (id) => {
        setDrawerTarget(id);
        setDrawerOpen(true);
    };

    return (
        <AppShell>
            <Head title="Tasks" />

            <PageHeader
                title="Tasks"
                description="Everything that needs doing, in one list."
            />

            <QuickAdd priorities={priorities} />

            {tasks.length === 0 ? (
                <EmptyState
                    icon={SquareCheckBig}
                    title="No tasks yet"
                    message="Add your first task above — follow-ups, lessons to finish, anything."
                />
            ) : (
                <div className="space-y-4">
                    {groups.map((group) => (
                        <TaskGroup
                            key={group.title}
                            title={group.title}
                            tasks={group.items}
                            onOpen={openDrawer}
                        />
                    ))}
                </div>
            )}

            <TaskDrawer
                show={drawerOpen}
                task={drawerTask}
                priorities={priorities}
                onClose={() => setDrawerOpen(false)}
            />
        </AppShell>
    );
}
