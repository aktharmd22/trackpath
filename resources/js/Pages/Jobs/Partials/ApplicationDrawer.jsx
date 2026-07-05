import Button from '@/Components/Button';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Drawer from '@/Components/Drawer';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Pill from '@/Components/Pill';
import Select from '@/Components/Select';
import Textarea from '@/Components/Textarea';
import TextInput from '@/Components/TextInput';
import { APPLICATION_STATUS, formatDateTime, today } from '@/lib/format';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const emptyForm = {
    company: '',
    role_title: '',
    status: 'saved',
    salary_min: '',
    salary_max: '',
    currency: 'AED',
    location: '',
    source: '',
    url: '',
    applied_at: '',
    follow_up_at: '',
    notes: '',
};

function Field({ label, htmlFor, error, children, className = '' }) {
    return (
        <div className={className}>
            <InputLabel htmlFor={htmlFor} value={label} />
            <div className="mt-1.5">{children}</div>
            <InputError message={error} className="mt-2" />
        </div>
    );
}

function ApplicationForm({ application, statuses, defaultStatus, onSaved }) {
    const isEdit = Boolean(application);

    const { data, setData, post, patch, processing, errors, reset } = useForm(
        isEdit
            ? {
                  ...emptyForm,
                  ...Object.fromEntries(
                      Object.entries(application).map(([key, value]) => [
                          key,
                          value ?? '',
                      ]),
                  ),
              }
            : { ...emptyForm, status: defaultStatus ?? 'saved' },
    );

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
            patch(route('applications.update', application.id), options);
        } else {
            post(route('applications.store'), options);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <Field label="Company" htmlFor="company" error={errors.company}>
                <TextInput
                    id="company"
                    value={data.company}
                    required
                    className="block w-full"
                    onChange={(e) => setData('company', e.target.value)}
                />
            </Field>

            <Field label="Role" htmlFor="role_title" error={errors.role_title}>
                <TextInput
                    id="role_title"
                    value={data.role_title}
                    required
                    className="block w-full"
                    onChange={(e) => setData('role_title', e.target.value)}
                />
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Status" htmlFor="status" error={errors.status}>
                    <Select
                        id="status"
                        value={data.status}
                        className="block w-full"
                        onChange={(e) => setData('status', e.target.value)}
                    >
                        {statuses.map((value) => (
                            <option key={value} value={value}>
                                {APPLICATION_STATUS[value].label}
                            </option>
                        ))}
                    </Select>
                </Field>

                <Field
                    label="Applied on"
                    htmlFor="applied_at"
                    error={errors.applied_at}
                >
                    <TextInput
                        id="applied_at"
                        type="date"
                        value={data.applied_at}
                        className="block w-full"
                        onChange={(e) => setData('applied_at', e.target.value)}
                    />
                </Field>

                <Field
                    label="Follow up on"
                    htmlFor="follow_up_at"
                    error={errors.follow_up_at}
                >
                    <TextInput
                        id="follow_up_at"
                        type="date"
                        value={data.follow_up_at}
                        className="block w-full"
                        onChange={(e) =>
                            setData('follow_up_at', e.target.value)
                        }
                    />
                </Field>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <Field
                    label="Salary min"
                    htmlFor="salary_min"
                    error={errors.salary_min}
                    className="col-span-1"
                >
                    <TextInput
                        id="salary_min"
                        type="number"
                        min="0"
                        value={data.salary_min}
                        className="block w-full"
                        onChange={(e) => setData('salary_min', e.target.value)}
                    />
                </Field>
                <Field
                    label="Salary max"
                    htmlFor="salary_max"
                    error={errors.salary_max}
                    className="col-span-1"
                >
                    <TextInput
                        id="salary_max"
                        type="number"
                        min="0"
                        value={data.salary_max}
                        className="block w-full"
                        onChange={(e) => setData('salary_max', e.target.value)}
                    />
                </Field>
                <Field
                    label="Currency"
                    htmlFor="currency"
                    error={errors.currency}
                    className="col-span-1"
                >
                    <TextInput
                        id="currency"
                        maxLength={3}
                        value={data.currency}
                        className="block w-full uppercase"
                        onChange={(e) =>
                            setData('currency', e.target.value.toUpperCase())
                        }
                    />
                </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Field
                    label="Location"
                    htmlFor="location"
                    error={errors.location}
                >
                    <TextInput
                        id="location"
                        value={data.location}
                        className="block w-full"
                        onChange={(e) => setData('location', e.target.value)}
                    />
                </Field>
                <Field label="Source" htmlFor="source" error={errors.source}>
                    <TextInput
                        id="source"
                        value={data.source}
                        placeholder="LinkedIn, referral…"
                        className="block w-full"
                        onChange={(e) => setData('source', e.target.value)}
                    />
                </Field>
            </div>

            <Field label="Job posting URL" htmlFor="url" error={errors.url}>
                <TextInput
                    id="url"
                    type="url"
                    value={data.url}
                    placeholder="https://…"
                    className="block w-full"
                    onChange={(e) => setData('url', e.target.value)}
                />
            </Field>

            <Field label="Notes" htmlFor="notes" error={errors.notes}>
                <Textarea
                    id="notes"
                    rows={4}
                    value={data.notes}
                    className="block w-full"
                    onChange={(e) => setData('notes', e.target.value)}
                />
            </Field>

            <Button className="w-full" disabled={processing}>
                {processing
                    ? 'Saving…'
                    : isEdit
                      ? 'Save changes'
                      : 'Add application'}
            </Button>
        </form>
    );
}

function StageHistory({ application }) {
    const { data, setData, processing, reset } = useForm({
        status: application.status,
        note: '',
        occurred_at: today(),
    });

    const submit = (e) => {
        e.preventDefault();

        router.post(
            route('application-events.store', application.id),
            data,
            {
                preserveScroll: true,
                onSuccess: () => reset('note'),
            },
        );
    };

    return (
        <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
                Stage history
            </h3>

            <ol className="relative ml-2 space-y-4 border-l border-line pl-5">
                {application.events.map((event) => (
                    <li key={event.id} className="relative">
                        <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent" />
                        <div className="flex flex-wrap items-center gap-2">
                            <Pill tone={APPLICATION_STATUS[event.status].tone}>
                                {APPLICATION_STATUS[event.status].label}
                            </Pill>
                            <span className="text-xs text-muted">
                                {formatDateTime(event.occurred_at)}
                            </span>
                        </div>
                        {event.note && (
                            <p className="mt-1 text-sm text-muted">
                                {event.note}
                            </p>
                        )}
                    </li>
                ))}
            </ol>

            <form
                onSubmit={submit}
                className="mt-5 space-y-3 rounded-field border border-line bg-card p-3"
            >
                <div className="grid grid-cols-2 gap-3">
                    <Select
                        aria-label="Event status"
                        value={data.status}
                        className="block w-full"
                        onChange={(e) => setData('status', e.target.value)}
                    >
                        {Object.entries(APPLICATION_STATUS).map(
                            ([value, { label }]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ),
                        )}
                    </Select>
                    <TextInput
                        type="date"
                        aria-label="Event date"
                        value={data.occurred_at}
                        max={today()}
                        className="block w-full"
                        onChange={(e) => setData('occurred_at', e.target.value)}
                    />
                </div>
                <TextInput
                    value={data.note}
                    placeholder="Add a note…"
                    className="block w-full"
                    onChange={(e) => setData('note', e.target.value)}
                />
                <Button
                    variant="secondary"
                    className="w-full"
                    disabled={processing}
                >
                    Add event
                </Button>
            </form>
        </div>
    );
}

export default function ApplicationDrawer({
    show,
    application,
    statuses,
    defaultStatus,
    onClose,
}) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const destroy = () => {
        setDeleting(true);

        router.delete(route('applications.destroy', application.id), {
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
            title={application ? application.company : 'New application'}
        >
            <div className="space-y-8 pb-4">
                <ApplicationForm
                    key={application ? application.id : `new-${defaultStatus}`}
                    application={application}
                    statuses={statuses}
                    defaultStatus={defaultStatus}
                    onSaved={application ? () => {} : onClose}
                />

                {application && (
                    <>
                        <StageHistory application={application} />

                        <Button
                            variant="danger"
                            className="w-full"
                            onClick={() => setConfirmingDelete(true)}
                        >
                            Delete application
                        </Button>

                        <ConfirmDialog
                            show={confirmingDelete}
                            title="Delete this application?"
                            message={`${application.company} — ${application.role_title} and its stage history will be removed.`}
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
