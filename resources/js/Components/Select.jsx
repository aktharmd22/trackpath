import { forwardRef } from 'react';

export default forwardRef(function Select(
    { className = '', children, ...props },
    ref,
) {
    return (
        <select
            {...props}
            ref={ref}
            className={
                'min-h-tap rounded-field border-line bg-surface text-sm text-ink focus:border-accent focus:ring-accent ' +
                className
            }
        >
            {children}
        </select>
    );
});
