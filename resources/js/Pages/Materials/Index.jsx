import Button from '@/Components/Button';
import Card from '@/Components/Card';
import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
import Pill from '@/Components/Pill';
import Select from '@/Components/Select';
import AppShell from '@/Layouts/AppShell';
import { formatDate } from '@/lib/format';
import MaterialDrawer from '@/Pages/Materials/Partials/MaterialDrawer';
import { Head, Link, router } from '@inertiajs/react';
import {
    BookOpenCheck,
    Download,
    ExternalLink,
    FileText,
    Library,
    Link2,
    Plus,
    StickyNote,
    Tag,
    X,
} from 'lucide-react';
import { useState } from 'react';

const TYPE_META = {
    file: { label: 'Files', icon: FileText },
    link: { label: 'Links', icon: Link2 },
    note: { label: 'Notes', icon: StickyNote },
};

function applyFilters(next) {
    router.get(route('materials.index'), next, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}

function FilterBar({ filters, modules, tags, types }) {
    const current = {
        type: filters.type ?? '',
        module: filters.module ?? '',
        tag: filters.tag ?? '',
    };

    const set = (key, value) => {
        const next = { ...current, [key]: value };

        applyFilters(
            Object.fromEntries(
                Object.entries(next).filter(([, v]) => v !== ''),
            ),
        );
    };

    const hasFilters = Object.values(current).some(Boolean);

    return (
        <div className="mb-5 flex flex-wrap items-center gap-2">
            <div className="flex rounded-field border border-line bg-card p-1">
                <button
                    type="button"
                    onClick={() => set('type', '')}
                    className={
                        'min-h-[36px] rounded-[6px] px-3 text-sm font-semibold transition ' +
                        (current.type === ''
                            ? 'bg-surface text-ink shadow-sm'
                            : 'text-muted hover:text-ink')
                    }
                >
                    All
                </button>
                {types.map((type) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => set('type', type)}
                        className={
                            'min-h-[36px] rounded-[6px] px-3 text-sm font-semibold transition ' +
                            (current.type === type
                                ? 'bg-surface text-ink shadow-sm'
                                : 'text-muted hover:text-ink')
                        }
                    >
                        {TYPE_META[type].label}
                    </button>
                ))}
            </div>

            <Select
                aria-label="Filter by module"
                value={current.module}
                onChange={(e) => set('module', e.target.value)}
                className="min-w-36"
            >
                <option value="">All modules</option>
                {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                        {module.title}
                    </option>
                ))}
            </Select>

            <Select
                aria-label="Filter by tag"
                value={current.tag}
                onChange={(e) => set('tag', e.target.value)}
                className="min-w-32"
            >
                <option value="">All tags</option>
                {tags.map((tag) => (
                    <option key={tag} value={tag}>
                        {tag}
                    </option>
                ))}
            </Select>

            {hasFilters && (
                <button
                    type="button"
                    onClick={() => applyFilters({})}
                    className="flex min-h-tap items-center gap-1 rounded-field px-2 text-sm font-medium text-muted transition hover:text-ink"
                >
                    <X size={14} />
                    Clear
                </button>
            )}
        </div>
    );
}

function MaterialCard({ material, onOpen }) {
    const Icon = TYPE_META[material.type].icon;

    const action = (e) => {
        e.stopPropagation();
    };

    return (
        <Card
            onClick={onOpen}
            className="flex h-full cursor-pointer flex-col p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-ink/30 hover:shadow"
        >
            <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-field bg-tint text-accent">
                    <Icon size={19} strokeWidth={1.75} />
                </span>

                {material.type === 'file' && material.file && (
                    <a
                        href={route('materials.download', material.id)}
                        onClick={action}
                        className="flex min-h-tap items-center gap-1.5 rounded-field px-2 text-xs font-semibold text-muted transition hover:bg-card hover:text-ink"
                    >
                        <Download size={14} />
                        {material.file.size}
                    </a>
                )}
                {material.type === 'link' && (
                    <a
                        href={material.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={action}
                        className="flex min-h-tap items-center gap-1.5 rounded-field px-2 text-xs font-semibold text-muted transition hover:bg-card hover:text-ink"
                    >
                        <ExternalLink size={14} />
                        Open
                    </a>
                )}
            </div>

            <h3 className="mt-3 text-sm font-bold text-ink">
                {material.title}
            </h3>

            {material.type === 'note' && material.body && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                    {material.body}
                </p>
            )}
            {material.type === 'link' && material.url && (
                <p className="mt-1 truncate text-xs text-muted">
                    {material.url.replace(/^https?:\/\/(www\.)?/, '')}
                </p>
            )}
            {material.type === 'file' && material.file && (
                <p className="mt-1 truncate text-xs text-muted">
                    {material.file.name}
                </p>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
                {material.module && (
                    <Link
                        href={route('learning.show', material.module.slug)}
                        onClick={action}
                    >
                        <Pill tone="accent">{material.module.title}</Pill>
                    </Link>
                )}
                {material.subject && (
                    <Link
                        href={route('exam-prep.show', material.subject.id)}
                        onClick={action}
                    >
                        <Pill tone="solid">{material.subject.title}</Pill>
                    </Link>
                )}
                {material.tags.map((tag) => (
                    <Pill key={tag} tone="muted">
                        <Tag size={10} />
                        {tag}
                    </Pill>
                ))}
                <span className="ml-auto text-xs text-muted">
                    {formatDate(material.created_at)}
                </span>
            </div>
        </Card>
    );
}

export default function Index({
    materials,
    filters,
    modules,
    subjects,
    tags,
    types,
}) {
    const [drawerTarget, setDrawerTarget] = useState(null); // 'new' | material id
    const [drawerOpen, setDrawerOpen] = useState(false);

    const drawerMaterial =
        typeof drawerTarget === 'number'
            ? (materials.find((m) => m.id === drawerTarget) ?? null)
            : null;

    const hasFilters = Boolean(filters.type || filters.module || filters.tag);

    return (
        <AppShell>
            <Head title="Materials" />

            <PageHeader
                title="Materials"
                description="Files, links, and notes — tagged and tied to modules."
                actions={
                    <>
                        <Link
                            href={route('exam-prep.index')}
                            className="inline-flex min-h-tap items-center justify-center gap-2 rounded-field border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:bg-card"
                        >
                            <BookOpenCheck size={16} />
                            Exam prep
                        </Link>
                        <Button
                            onClick={() => {
                                setDrawerTarget('new');
                                setDrawerOpen(true);
                            }}
                        >
                            <Plus size={16} />
                            Add material
                        </Button>
                    </>
                }
            />

            <FilterBar
                filters={filters}
                modules={modules}
                tags={tags}
                types={types}
            />

            {materials.length === 0 ? (
                <EmptyState
                    icon={Library}
                    title={hasFilters ? 'Nothing matches' : 'No materials yet'}
                    message={
                        hasFilters
                            ? 'Try clearing the filters.'
                            : 'Add your first file, link, or note to start the library.'
                    }
                    action={
                        hasFilters ? (
                            <Button
                                variant="secondary"
                                onClick={() => applyFilters({})}
                            >
                                Clear filters
                            </Button>
                        ) : (
                            <Button
                                onClick={() => {
                                    setDrawerTarget('new');
                                    setDrawerOpen(true);
                                }}
                            >
                                <Plus size={16} />
                                Add material
                            </Button>
                        )
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {materials.map((material) => (
                        <MaterialCard
                            key={material.id}
                            material={material}
                            onOpen={() => {
                                setDrawerTarget(material.id);
                                setDrawerOpen(true);
                            }}
                        />
                    ))}
                </div>
            )}

            <MaterialDrawer
                show={drawerOpen}
                material={drawerMaterial}
                modules={modules}
                subjects={subjects}
                onClose={() => setDrawerOpen(false)}
            />
        </AppShell>
    );
}
