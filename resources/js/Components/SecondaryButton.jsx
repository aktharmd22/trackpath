export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex min-h-tap items-center justify-center rounded-field border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:bg-card focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                    disabled && 'cursor-not-allowed opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
