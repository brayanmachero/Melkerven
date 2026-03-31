export default function ApplicationLogo(props) {
    return (
        <div {...props} className={`flex items-center space-x-2 ${props.className}`}>
            <div className="size-8 premium-gradient rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-display font-bold text-lg">M</span>
            </div>
            <span className="font-display font-bold tracking-tighter text-primary-900">
                MELKERVEN
            </span>
        </div>
    );
}
