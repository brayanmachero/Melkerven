export default function BrandLogo({ variant = 'dark', className = '' }) {
    const source = variant === 'light' ? '/images/logo-light.png' : '/images/logo.png';
    const optimizedSource = variant === 'light' ? '/images/logo-light-320' : '/images/logo-320';

    return (
        <span className={`relative block h-10 w-[9.75rem] shrink-0 overflow-hidden ${className}`}>
            <picture className="contents">
                <source type="image/avif" srcSet={`${optimizedSource}.avif`} />
                <source type="image/webp" srcSet={`${optimizedSource}.webp`} />
                <img
                    src={source}
                    alt="Melkerven — Servers, Networking & Storage Hardware"
                    width="320"
                    height="320"
                    decoding="async"
                    fetchPriority="high"
                    className="absolute left-0 top-1/2 h-auto w-full max-w-none -translate-y-[53%]"
                />
            </picture>
        </span>
    );
}
