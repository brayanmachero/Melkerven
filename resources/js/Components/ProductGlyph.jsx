const glyphByCategory = {
    server: (
        <>
            <rect x="25" y="19" width="150" height="122" rx="12" />
            <path d="M43 49h114M43 81h114M43 111h80" />
            <circle cx="149" cy="111" r="4" className="fill-current stroke-none" />
            <circle cx="161" cy="111" r="4" className="fill-current stroke-none opacity-50" />
        </>
    ),
    red: (
        <>
            <rect x="21" y="53" width="158" height="74" rx="12" />
            <path d="M42 79h96M42 102h70" />
            {[149, 159, 169].map((cx) => <circle key={cx} cx={cx} cy="80" r="4" className="fill-current stroke-none" />)}
            {[149, 159, 169].map((cx) => <circle key={cx} cx={cx} cy="103" r="4" className="fill-current stroke-none opacity-50" />)}
        </>
    ),
    almacenamiento: (
        <>
            <rect x="47" y="20" width="106" height="120" rx="15" />
            <circle cx="100" cy="75" r="27" />
            <circle cx="100" cy="75" r="5" className="fill-current stroke-none" />
            <path d="M69 118h62" />
        </>
    ),
};

export default function ProductGlyph({ categoryName = '', className = '' }) {
    const normalized = categoryName.toLowerCase();
    const glyph = normalized.includes('red') || normalized.includes('network') || normalized.includes('conect')
        ? glyphByCategory.red
        : normalized.includes('almacen') || normalized.includes('storage') || normalized.includes('disco')
            ? glyphByCategory.almacenamiento
            : glyphByCategory.server;

    return (
        <svg aria-hidden="true" viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="2.25" className={`text-signal-600 ${className}`}>
            {glyph}
        </svg>
    );
}
