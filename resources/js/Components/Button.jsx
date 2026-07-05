const variants = {
    primary:
        'bg-accent text-white hover:bg-accent-dk focus-visible:outline-accent',
    secondary:
        'border border-line bg-surface text-ink hover:bg-card focus-visible:outline-accent',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
    ghost: 'text-muted hover:bg-card hover:text-ink focus-visible:outline-accent',
};

export default function Button({
    variant = 'primary',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                'inline-flex min-h-tap items-center justify-center gap-2 rounded-field px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
                variants[variant] +
                (disabled ? ' cursor-not-allowed opacity-50' : '') +
                ' ' +
                className
            }
        >
            {children}
        </button>
    );
}
