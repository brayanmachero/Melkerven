export default function BrandLogo({ variant = 'dark', className = '' }) {
    const isLight = variant === 'light';

    return (
        <span className={`flex min-w-0 items-center gap-2.5 ${className}`}>
            <span
                aria-hidden="true"
                className={`block h-full aspect-square shrink-0 overflow-hidden rounded-xl border bg-white shadow-[0_10px_24px_rgba(65,117,141,0.14)] ${isLight ? 'border-white/30' : 'border-signal-200'}`}
            >
                <img
                    src="/favicon/android-icon-192x192.png"
                    alt=""
                    className="block h-full w-full object-contain"
                    decoding="async"
                />
            </span>
            <span className="min-w-0 leading-none">
                <span className={`block whitespace-nowrap text-[0.94rem] font-bold tracking-[-0.06em] sm:text-[1.05rem] ${isLight ? 'text-white' : 'text-ink-950'}`}>MELKERVEN<span className="text-signal-500">.</span></span>
                <span className={`mt-1 block whitespace-nowrap text-[6px] font-bold uppercase tracking-[0.12em] sm:text-[7px] sm:tracking-[0.16em] ${isLight ? 'text-cloud-400' : 'text-ink-500'}`}>Infraestructura TI</span>
            </span>
        </span>
    );
}
