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
import { Head, router, useForm } from '@inertiajs/react';
import { ExternalLink, FolderGit2, Plus, Rocket } from 'lucide-react';
import { useState } from 'react';

const PROJECT_STATUS = {
    idea: { label: 'Idea', tone: 'muted' },
    building: { label: 'Building', tone: 'accent' },
    shipped: { label: 'Shipped', tone: 'solid' },
};

function ProjectForm({ project, statuses, onSaved }) {
    const isEdit = Boolean(project);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        title: project?.title ?? '',
        description: project?.description ?? '',
        repo_url: project?.repo_url ?? '',
        live_url: project?.live_url ?? '',
        status: project?.status ?? 'idea',
    });

    const submit = (e) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onSaved();
            },
        };

        if (isEdit) {
            patch(route('projects.update', project.id), options);
        } else {
            post(route('projects.store'), options);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <InputLabel htmlFor="title" value="Title" />
                <TextInput
                    id="title"
                    value={data.title}
                    required
                    placeholder="What are you building?"
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('title', e.target.value)}
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="status" value="Status" />
                <Select
                    id="status"
                    value={data.status}
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('status', e.target.value)}
                >
                    {statuses.map((value) => (
                        <option key={value} value={value}>
                            {PROJECT_STATUS[value].label}
                        </option>
                    ))}
                </Select>
                <InputError message={errors.status} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="description" value="Description" />
                <Textarea
                    id="description"
                    rows={4}
                    value={data.description}
                    placeholder="What it does, what it proves…"
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="repo_url" value="Repository URL" />
                <TextInput
                    id="repo_url"
                    type="url"
                    value={data.repo_url}
                    placeholder="https://github.com/…"
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('repo_url', e.target.value)}
                />
                <InputError message={errors.repo_url} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="live_url" value="Live URL" />
                <TextInput
                    id="live_url"
                    type="url"
                    value={data.live_url}
                    placeholder="https://…"
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('live_url', e.target.value)}
                />
                <InputError message={errors.live_url} className="mt-2" />
            </div>

            <Button className="w-full" disabled={processing}>
                {processing
                    ? 'Saving…'
                    : isEdit
                      ? 'Save changes'
                      : 'Add project'}
            </Button>
        </form>
    );
}

function ProjectCard({ project, onOpen }) {
    const status = PROJECT_STATUS[project.status];

    const stop = (e) => e.stopPropagation();

    return (
        <Card
            onClick={onOpen}
            className="flex h-full cursor-pointer flex-col p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-ink/30 hover:shadow"
        >
            <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-field bg-tint text-accent">
                    <Rocket size={19} strokeWidth={1.75} />
                </span>
                <Pill tone={status.tone}>{status.label}</Pill>
            </div>

            <h3 className="mt-3 text-base font-bold text-ink">
                {project.title}
            </h3>

            {project.description && (
                <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted">
                    {project.description}
                </p>
            )}

            {(project.repo_url || project.live_url) && (
                <div className="mt-auto flex items-center gap-2 pt-4">
                    {project.repo_url && (
                        <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={stop}
                            className="flex min-h-[36px] items-center gap-1.5 rounded-field border border-line px-3 text-xs font-semibold text-muted transition hover:border-ink/30 hover:text-ink"
                        >
                            <FolderGit2 size={14} />
                            Repo
                        </a>
                    )}
                    {project.live_url && (
                        <a
                            href={project.live_url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={stop}
                            className="flex min-h-[36px] items-center gap-1.5 rounded-field border border-line px-3 text-xs font-semibold text-muted transition hover:border-ink/30 hover:text-ink"
                        >
                            <ExternalLink size={14} />
                            Live
                        </a>
                    )}
                </div>
            )}
        </Card>
    );
}

export default function Index({ projects, statuses }) {
    const [drawerTarget, setDrawerTarget] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const drawerProject =
        typeof drawerTarget === 'number'
            ? (projects.find((p) => p.id === drawerTarget) ?? null)
            : null;

    const destroy = () => {
        setDeleting(true);

        router.delete(route('projects.destroy', drawerProject.id), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmingDelete(false);
                setDrawerOpen(false);
            },
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <AppShell>
            <Head title="Projects" />

            <PageHeader
                title="Projects"
                description="Portfolio pieces that prove the skills."
                actions={
                    <Button
                        onClick={() => {
                            setDrawerTarget('new');
                            setDrawerOpen(true);
                        }}
                    >
                        <Plus size={16} />
                        Add project
                    </Button>
                }
            />

            {projects.length === 0 ? (
                <EmptyState
                    icon={Rocket}
                    title="No projects yet"
                    message="Add your first portfolio project — even an idea counts."
                    action={
                        <Button
                            onClick={() => {
                                setDrawerTarget('new');
                                setDrawerOpen(true);
                            }}
                        >
                            <Plus size={16} />
                            Add project
                        </Button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onOpen={() => {
                                setDrawerTarget(project.id);
                                setDrawerOpen(true);
                            }}
                        />
                    ))}
                </div>
            )}

            <Drawer
                show={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerProject ? 'Edit project' : 'Add project'}
            >
                <div className="space-y-6 pb-4">
                    <ProjectForm
                        key={drawerProject ? drawerProject.id : 'new'}
                        project={drawerProject}
                        statuses={statuses}
                        onSaved={() => setDrawerOpen(false)}
                    />

                    {drawerProject && (
                        <Button
                            variant="danger"
                            className="w-full"
                            onClick={() => setConfirmingDelete(true)}
                        >
                            Delete project
                        </Button>
                    )}
                </div>
            </Drawer>

            <ConfirmDialog
                show={confirmingDelete}
                title="Delete this project?"
                message={
                    drawerProject
                        ? `“${drawerProject.title}” will be permanently removed.`
                        : ''
                }
                processing={deleting}
                onConfirm={destroy}
                onClose={() => setConfirmingDelete(false)}
            />
        </AppShell>
    );
}
