export default function BrandLogo({ variant = 'dark', className = '' }) {
    const isLight = variant === 'light';

    return (
        <span className={`flex min-w-0 items-center gap-2.5 ${className}`}>
            <span
                aria-hidden="true"
                className={`flex h-full aspect-square shrink-0 items-center justify-center rounded-xl border shadow-[0_10px_24px_rgba(65,117,141,0.14)] ${isLight ? 'border-white/20 bg-white/10 text-signal-200' : 'border-signal-200 bg-signal-50 text-signal-700'}`}
            >
                <svg className="h-[58%] w-[58%]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <rect x="4" y="3" width="16" height="18" rx="2.5" />
                    <path d="M8 7h8M8 12h8M8 17h5" strokeLinecap="round" />
                    <circle cx="17" cy="17" r=".8" fill="currentColor" stroke="none" />
                </svg>
            </span>
            <span className="min-w-0 leading-none">
                <span className={`block whitespace-nowrap text-[0.94rem] font-bold tracking-[-0.06em] sm:text-[1.05rem] ${isLight ? 'text-white' : 'text-ink-950'}`}>MELKERVEN<span className="text-signal-500">.</span></span>
                <span className={`mt-1 hidden whitespace-nowrap text-[7px] font-bold uppercase tracking-[0.16em] sm:block ${isLight ? 'text-cloud-400' : 'text-ink-500'}`}>Infraestructura TI</span>
            </span>
        </span>
    );
}
