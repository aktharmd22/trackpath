import Button from '@/Components/Button';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Drawer from '@/Components/Drawer';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import ProgressBar from '@/Components/ProgressBar';
import Select from '@/Components/Select';
import Textarea from '@/Components/Textarea';
import TextInput from '@/Components/TextInput';
import { router, useForm } from '@inertiajs/react';
import { FileUp, Link2, StickyNote } from 'lucide-react';
import { useState } from 'react';

const TYPES = [
    { value: 'file', label: 'File', icon: FileUp },
    { value: 'link', label: 'Link', icon: Link2 },
    { value: 'note', label: 'Note', icon: StickyNote },
];

function TypeSwitch({ value, onChange, disabled }) {
    return (
        <div className="grid grid-cols-3 gap-1 rounded-field border border-line bg-card p-1">
            {TYPES.map(({ value: type, label, icon: Icon }) => (
                <button
                    key={type}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(type)}
                    className={
                        'flex min-h-tap items-center justify-center gap-2 rounded-[6px] text-sm font-semibold transition ' +
                        (value === type
                            ? 'bg-surface text-ink shadow-sm'
                            : 'text-muted hover:text-ink') +
                        (disabled ? ' cursor-not-allowed opacity-60' : '')
                    }
                >
                    <Icon size={16} />
                    {label}
                </button>
            ))}
        </div>
    );
}

function MaterialForm({ material, modules, onSaved }) {
    const isEdit = Boolean(material);

    const { data, setData, processing, progress, errors, reset } = useForm({
        title: material?.title ?? '',
        type: material?.type ?? 'file',
        file: null,
        url: material?.url ?? '',
        body: material?.body ?? '',
        module_id: material?.module_id ?? '',
        tags: material?.tags?.join(', ') ?? '',
    });

    const submit = (e) => {
        e.preventDefault();

        const payload = {
            title: data.title,
            type: data.type,
            file: data.file,
            url: data.type === 'link' ? data.url : '',
            body: data.type === 'note' ? data.body : '',
            module_id: data.module_id || null,
            tags: data.tags
                .split(',')
                .map((tag) => tag.trim().toLowerCase())
                .filter(Boolean),
        };

        const options = {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset();
                onSaved();
            },
        };

        if (isEdit) {
            router.post(
                route('materials.update', material.id),
                { ...payload, _method: 'patch' },
                options,
            );
        } else {
            router.post(route('materials.store'), payload, options);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <TypeSwitch
                value={data.type}
                onChange={(type) => setData('type', type)}
                disabled={isEdit}
            />
            <InputError message={errors.type} />

            <div>
                <InputLabel htmlFor="title" value="Title" />
                <TextInput
                    id="title"
                    value={data.title}
                    required
                    placeholder="What is this?"
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('title', e.target.value)}
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            {data.type === 'file' && (
                <div>
                    <InputLabel htmlFor="file" value={isEdit ? 'Replace file (optional)' : 'File'} />
                    <input
                        id="file"
                        type="file"
                        onChange={(e) => setData('file', e.target.files[0])}
                        className="mt-1.5 block w-full cursor-pointer rounded-field border border-dashed border-line bg-card px-3 py-3 text-sm text-muted transition file:mr-3 file:cursor-pointer file:rounded-field file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:border-ink/30"
                    />
                    {material?.file && !data.file && (
                        <p className="mt-1.5 text-xs text-muted">
                            Current: {material.file.name} ({material.file.size})
                        </p>
                    )}
                    <InputError message={errors.file} className="mt-2" />
                    {progress && (
                        <div className="mt-2">
                            <ProgressBar value={progress.percentage} />
                            <p className="mt-1 text-xs text-muted">
                                Uploading… {progress.percentage}%
                            </p>
                        </div>
                    )}
                </div>
            )}

            {data.type === 'link' && (
                <div>
                    <InputLabel htmlFor="url" value="URL" />
                    <TextInput
                        id="url"
                        type="url"
                        value={data.url}
                        required
                        placeholder="https://…"
                        className="mt-1.5 block w-full"
                        onChange={(e) => setData('url', e.target.value)}
                    />
                    <InputError message={errors.url} className="mt-2" />
                </div>
            )}

            {data.type === 'note' && (
                <div>
                    <InputLabel htmlFor="body" value="Note" />
                    <Textarea
                        id="body"
                        rows={8}
                        value={data.body}
                        required
                        placeholder="Write it down…"
                        className="mt-1.5 block w-full"
                        onChange={(e) => setData('body', e.target.value)}
                    />
                    <InputError message={errors.body} className="mt-2" />
                </div>
            )}

            <div>
                <InputLabel htmlFor="module_id" value="Module (optional)" />
                <Select
                    id="module_id"
                    value={data.module_id}
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('module_id', e.target.value)}
                >
                    <option value="">No module</option>
                    {modules.map((module) => (
                        <option key={module.id} value={module.id}>
                            {module.title}
                        </option>
                    ))}
                </Select>
                <InputError message={errors.module_id} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="tags" value="Tags (comma-separated)" />
                <TextInput
                    id="tags"
                    value={data.tags}
                    placeholder="sql, reference"
                    className="mt-1.5 block w-full"
                    onChange={(e) => setData('tags', e.target.value)}
                />
                <InputError message={errors.tags} className="mt-2" />
            </div>

            <Button className="w-full" disabled={processing}>
                {processing
                    ? 'Saving…'
                    : isEdit
                      ? 'Save changes'
                      : 'Add material'}
            </Button>
        </form>
    );
}

export default function MaterialDrawer({
    show,
    material,
    modules,
    onClose,
}) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const destroy = () => {
        setDeleting(true);

        router.delete(route('materials.destroy', material.id), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmingDelete(false);
                onClose();
            },
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <Drawer
            show={show}
            onClose={onClose}
            title={material ? 'Edit material' : 'Add material'}
        >
            <div className="space-y-6 pb-4">
                <MaterialForm
                    key={material ? material.id : 'new'}
                    material={material}
                    modules={modules}
                    onSaved={onClose}
                />

                {material && (
                    <>
                        <Button
                            variant="danger"
                            className="w-full"
                            onClick={() => setConfirmingDelete(true)}
                        >
                            Delete material
                        </Button>

                        <ConfirmDialog
                            show={confirmingDelete}
                            title="Delete this material?"
                            message={`“${material.title}” will be permanently removed.`}
                            processing={deleting}
                            onConfirm={destroy}
                            onClose={() => setConfirmingDelete(false)}
                        />
                    </>
                )}
            </div>
        </Drawer>
    );
}
