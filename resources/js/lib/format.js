export const MODULE_STATUS = {
    not_started: { label: 'Not started', tone: 'muted' },
    in_progress: { label: 'In progress', tone: 'accent' },
    done: { label: 'Done', tone: 'solid' },
};

export const APPLICATION_STATUS = {
    saved: { label: 'Saved', tone: 'muted' },
    applied: { label: 'Applied', tone: 'accent' },
    interview: { label: 'Interview', tone: 'accent' },
    offer: { label: 'Offer', tone: 'solid' },
    rejected: { label: 'Rejected', tone: 'faded' },
};

export function formatMinutes(minutes) {
    if (!minutes) {
        return '0h';
    }

    const hours = minutes / 60;

    return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

export function formatDate(value) {
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
    });
}

export function formatDateTime(value) {
    return new Date(value.replace(' ', 'T')).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export function formatSalary(application) {
    const { salary_min: min, salary_max: max, currency } = application;

    if (!min && !max) {
        return null;
    }

    const fmt = (n) => new Intl.NumberFormat('en').format(n);

    if (min && max) {
        return `${currency} ${fmt(min)}–${fmt(max)}`;
    }

    return `${currency} ${fmt(min ?? max)}`;
}

export function today() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    return now.toISOString().slice(0, 10);
}
