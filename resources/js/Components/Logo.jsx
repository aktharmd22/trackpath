import { Waypoints } from 'lucide-react';

export default function Logo({ onDark = false, className = '' }) {
    return (
        <span className={'inline-flex items-center gap-2 ' + className}>
            <span
                className={
                    'flex h-8 w-8 items-center justify-center rounded-lg ' +
                    (onDark ? 'bg-white text-ink' : 'bg-accent text-white')
                }
            >
                <Waypoints size={18} strokeWidth={2.25} />
            </span>
            <span
                className={
                    'text-lg font-bold tracking-tight ' +
                    (onDark ? 'text-white' : 'text-ink')
                }
            >
                TrackPath
            </span>
        </span>
    );
}
