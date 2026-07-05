const tones = {
    accent: 'bg-tint text-accent',
    solid: 'bg-accent text-white',
    green: 'bg-positive-tint text-positive',
    amber: 'bg-warning-tint text-warning',
    muted: 'bg-card text-muted border border-line',
    faded: 'bg-surface text-muted/70 border border-dashed border-line',
};

export default function Pill({ tone = 'muted', className = '', children }) {
    return (
        <span
            className={
                'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ' +
                tones[tone] +
                ' ' +
                className
            }
        >
            {children}
        </span>
    );
}
