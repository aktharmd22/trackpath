export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex min-h-tap items-center justify-center rounded-field bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dk focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                    disabled && 'cursor-not-allowed opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
