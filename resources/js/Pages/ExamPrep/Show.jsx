import Button from '@/Components/Button';
import Card from '@/Components/Card';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Drawer from '@/Components/Drawer';
import EmptyState from '@/Components/EmptyState';
import Pill from '@/Components/Pill';
import AppShell from '@/Layouts/AppShell';
import MaterialDrawer from '@/Pages/Materials/Partials/MaterialDrawer';
import { examPill, SubjectForm } from '@/Pages/ExamPrep/Index';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpenCheck,
    Download,
    ExternalLink,
    FileText,
    Link2,
    Pencil,
    Plus,
    StickyNote,
} from 'lucide-react';
import { useState } from 'react';

function Section({ title, icon: Icon, children }) {
    return (
        <Card className="p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted">
                <Icon size={15} />
                {title}
            </h2>
            {children}
        </Card>
    );
}

export default function Show({ subject, materials, modules, subjects }) {
    const [materialTarget, setMaterialTarget] = useState(null); // 'new' | material id
    const [materialOpen, setMaterialOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const notes = materials.filter((m) => m.type === 'note');
    const files = materials.filter((m) => m.type === 'file');
    const links = materials.filter((m) => m.type === 'link');

    const drawerMaterial =
        typeof materialTarget === 'number'
            ? (materials.find((m) => m.id === materialTarget) ?? null)
            : null;

    const openMaterial = (id) => {
        setMaterialTarget(id);
        setMaterialOpen(true);
    };

    const destroySubject = () => {
        setDeleting(true);

        router.delete(route('subjects.destroy', subject.id), {
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <AppShell>
            <Head title={subject.title} />

            <Link
                href={route('exam-prep.index')}
                className="mb-4 inline-flex min-h-tap items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink"
            >
                <ArrowLeft size={16} />
                All subjects
            </Link>

            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-ink">
                            {subject.title}
                        </h1>
                        {examPill(subject)}
                    </div>
                    <p className="mt-1 text-sm text-muted">
                        {materials.length} material
                        {materials.length === 1 ? '' : 's'} to review
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => setEditOpen(true)}>
                        <Pencil size={15} />
                        Edit
                    </Button>
                    <Button
                        onClick={() => {
                            setMaterialTarget('new');
                            setMaterialOpen(true);
                        }}
                    >
                        <Plus size={16} />
                        Add material
                    </Button>
                </div>
            </div>

            {materials.length === 0 ? (
                <EmptyState
                    icon={BookOpenCheck}
                    title="Nothing to review yet"
                    message="Upload files, save links, or write notes for this subject."
                    action={
                        <Button
                            onClick={() => {
                                setMaterialTarget('new');
                                setMaterialOpen(true);
                            }}
                        >
                            <Plus size={16} />
                            Add material
                        </Button>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {notes.length > 0 && (
                        <Section title="Quick notes" icon={StickyNote}>
                            <div className="space-y-3">
                                {notes.map((note) => (
                                    <button
                                        key={note.id}
                                        type="button"
                                        onClick={() => openMaterial(note.id)}
                                        className="block w-full rounded-field border border-line bg-card p-4 text-left transition hover:border-ink/30"
                                    >
                                        <p className="text-sm font-bold text-ink">
                                            {note.title}
                                        </p>
                                        <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
                                            {note.body}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </Section>
                    )}

                    {files.length > 0 && (
                        <Section title="Files" icon={FileText}>
                            <div className="divide-y divide-line/60">
                                {files.map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex min-h-tap cursor-pointer items-center gap-3 py-2.5"
                                        onClick={() => openMaterial(file.id)}
                                    >
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-field bg-tint text-accent">
                                            <FileText size={17} />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-ink">
                                                {file.title}
                                            </p>
                                            {file.file && (
                                                <p className="truncate text-xs text-muted">
                                                    {file.file.name} · {file.file.size}
                                                </p>
                                            )}
                                        </div>
                                        <a
                                            href={route('materials.download', file.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex min-h-tap items-center gap-1.5 rounded-field border border-line px-3 text-xs font-semibold text-ink transition hover:bg-card"
                                        >
                                            <Download size={14} />
                                            Download
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {links.length > 0 && (
                        <Section title="Links" icon={Link2}>
                            <div className="divide-y divide-line/60">
                                {links.map((link) => (
                                    <div
                                        key={link.id}
                                        className="flex min-h-tap cursor-pointer items-center gap-3 py-2.5"
                                        onClick={() => openMaterial(link.id)}
                                    >
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-field bg-tint text-accent">
                                            <Link2 size={17} />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-ink">
                                                {link.title}
                                            </p>
                                            <p className="truncate text-xs text-muted">
                                                {link.url?.replace(/^https?:\/\/(www\.)?/, '')}
                                            </p>
                                        </div>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex min-h-tap items-center gap-1.5 rounded-field border border-line px-3 text-xs font-semibold text-ink transition hover:bg-card"
                                        >
                                            <ExternalLink size={14} />
                                            Open
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}
                </div>
            )}

            <MaterialDrawer
                show={materialOpen}
                material={drawerMaterial}
                modules={modules}
                subjects={subjects}
                defaultSubjectId={subject.id}
                onClose={() => setMaterialOpen(false)}
            />

            <Drawer
                show={editOpen}
                onClose={() => setEditOpen(false)}
                title="Edit subject"
            >
                <div className="space-y-6">
                    <SubjectForm
                        subject={subject}
                        onSaved={() => setEditOpen(false)}
                    />
                    <Button
                        variant="danger"
                        className="w-full"
                        onClick={() => setConfirmingDelete(true)}
                    >
                        Delete subject
                    </Button>
                </div>
            </Drawer>

            <ConfirmDialog
                show={confirmingDelete}
                title="Delete this subject?"
                message={`“${subject.title}” will be removed. Its materials stay in your library.`}
                processing={deleting}
                onConfirm={destroySubject}
                onClose={() => setConfirmingDelete(false)}
            />
        </AppShell>
    );
}
