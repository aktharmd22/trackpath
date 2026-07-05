export default function Card({ className = '', children, ...props }) {
    return (
        <div
            {...props}
            className={
                'rounded-card border border-line bg-surface ' + className
            }
        >
            {children}
        </div>
    );
}
