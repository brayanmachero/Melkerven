export default function BrandMark({ className = '' }) {
    return (
        <span
            aria-hidden="true"
            className={`relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-signal-200 bg-signal-50 text-signal-700 shadow-[0_10px_24px_rgba(65,117,141,0.14)] ${className}`}
        >
            <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(120,173,191,0.28),transparent_55%)]" />
            <svg className="relative size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="4" y="3" width="16" height="18" rx="2.5" />
                <path d="M8 7h8M8 12h8M8 17h5" strokeLinecap="round" />
                <circle cx="17" cy="17" r=".8" fill="currentColor" stroke="none" />
            </svg>
        </span>
    );
}
