export default function ApplicationLogo({ className = '', imgClass = 'h-8', showText = true, ...props }) {
    return (
        <div {...props} className={`flex items-center space-x-2 ${className}`}>
            <img src="/images/logo.png" alt="Melkerven" className={`${imgClass} w-auto object-contain`} />
            {showText && (
                <span className="font-display font-bold tracking-tighter text-primary-900">
                    MELKERVEN
                </span>
            )}
        </div>
    );
}
