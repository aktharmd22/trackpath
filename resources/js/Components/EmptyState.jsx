export default function EmptyState({ icon: Icon, title, message, action }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-surface px-6 py-14 text-center">
            {Icon && (
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-tint text-accent">
                    <Icon size={24} strokeWidth={1.75} />
                </div>
            )}
            <h3 className="text-base font-semibold text-ink">{title}</h3>
            {message && (
                <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>
            )}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
