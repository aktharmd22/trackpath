import { forwardRef } from 'react';

export default forwardRef(function Textarea(
    { className = '', rows = 4, ...props },
    ref,
) {
    return (
        <textarea
            {...props}
            ref={ref}
            rows={rows}
            className={
                'rounded-field border-line bg-surface text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:ring-accent ' +
                className
            }
        />
    );
});
