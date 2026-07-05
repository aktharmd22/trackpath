export default function PageHeader({ title, description, actions }) {
    return (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-ink">
                    {title}
                </h1>
                {description && (
                    <p className="mt-1 text-sm text-muted">{description}</p>
                )}
            </div>
            {actions && (
                <div className="flex shrink-0 items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}
