import Button from '@/Components/Button';
import Card from '@/Components/Card';
import Drawer from '@/Components/Drawer';
import EmptyState from '@/Components/EmptyState';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PageHeader from '@/Components/PageHeader';
import Pill from '@/Components/Pill';
import TextInput from '@/Components/TextInput';
import AppShell from '@/Layouts/AppShell';
import { formatDate } from '@/lib/format';
import { playPop } from '@/lib/sound';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, BookOpenCheck, FileStack, Plus } from 'lucide-react';
import { useState } from 'react';

export function examPill(subject) {
    const days = subject.days_to_exam;

    if (days === null) {
        return null;
    }
    if (days < 0) {
        return <Pill tone="faded">Exam passed</Pill>;
    }
    if (days === 0) {
        return <Pill tone="amber">Exam today</Pill>;
    }
    if (days <= 7) {
        return <Pill tone="amber">Exam in {days}d</Pill>;
    }

    return <Pill tone="muted">Exam {formatDate(subject.exam_on)}</Pill>;
}

export function SubjectForm({ subject, onSaved }) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        title: subject?.title ?? '',
        exam_on: subject?.exam_on ?? '',
        notes: subject?.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                playPop();
                onSaved();
            },
        };

        if (subject) {
            patch(route('subjects.update', subject.id), options);
        } else {
            post(route('subjects.store'), options);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <InputLabel htmlFor="subject_title" value="Subject" />
                <TextInput
                    id="subject_title"
                    value={data.title}
                    required
                    placeholder="e.g. Incoterms & trade documentation"
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('title', e.target.value)}
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="exam_on" value="Exam date (optional)" />
                <TextInput
                    id="exam_on"
                    type="date"
                    value={data.exam_on}
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('exam_on', e.target.value)}
                />
                <InputError message={errors.exam_on} className="mt-2" />
            </div>

            <Button className="w-full" disabled={processing}>
                {processing
                    ? 'Saving…'
                    : subject
                      ? 'Save changes'
                      : 'Add subject'}
            </Button>
        </form>
    );
}

export default function Index({ subjects }) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <AppShell>
            <Head title="Exam prep" />

            <Link
                href={route('materials.index')}
                className="mb-4 inline-flex min-h-tap items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink"
            >
                <ArrowLeft size={16} />
                Materials
            </Link>

            <PageHeader
                title="Exam prep"
                description="One subject per exam — everything to review in one place."
                actions={
                    <Button onClick={() => setDrawerOpen(true)}>
                        <Plus size={16} />
                        Add subject
                    </Button>
                }
            />

            {subjects.length === 0 ? (
                <EmptyState
                    icon={BookOpenCheck}
                    title="No subjects yet"
                    message="Create a subject for each exam, then attach the materials you'll revise."
                    action={
                        <Button onClick={() => setDrawerOpen(true)}>
                            <Plus size={16} />
                            Add subject
                        </Button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {subjects.map((subject) => (
                        <Link
                            key={subject.id}
                            href={route('exam-prep.show', subject.id)}
                            className="block"
                        >
                            <Card className="h-full p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-ink/30 hover:shadow">
                                <div className="flex items-start justify-between gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-field bg-tint text-accent">
                                        <BookOpenCheck size={19} strokeWidth={1.75} />
                                    </span>
                                    {examPill(subject)}
                                </div>
                                <h3 className="mt-3 text-base font-semibold text-ink">
                                    {subject.title}
                                </h3>
                                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                                    <FileStack size={14} />
                                    {subject.materials_count} material
                                    {subject.materials_count === 1 ? '' : 's'}
                                </p>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            <Drawer
                show={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Add subject"
            >
                <SubjectForm onSaved={() => setDrawerOpen(false)} />
            </Drawer>
        </AppShell>
    );
}
