export default function BrandLogo({ variant = 'dark', className = '' }) {
    const source = variant === 'light' ? '/images/logo-light.png' : '/images/logo.png';

    return (
        <span className={`relative block h-10 w-[9.75rem] shrink-0 overflow-hidden ${className}`}>
            <img
                src={source}
                alt="Melkerven — Servers, Networking & Storage Hardware"
                className="absolute left-0 top-1/2 h-auto w-full max-w-none -translate-y-[53%]"
            />
        </span>
    );
}
