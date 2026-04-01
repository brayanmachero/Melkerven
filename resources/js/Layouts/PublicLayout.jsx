import { Link, usePage, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function NewsletterForm() {
    const { data, setData, post, processing, reset } = useForm({ email: '' });
    const [subscribed, setSubscribed] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('newsletter.subscribe'), {
            onSuccess: () => { setSubscribed(true); reset(); },
            preserveScroll: true,
        });
    };

    if (subscribed) {
        return <p className="text-green-400 text-sm font-medium">¡Gracias por suscribirte!</p>;
    }

    return (
        <form onSubmit={submit} className="flex gap-2 max-w-md mx-auto">
            <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="Tu correo electrónico"
                required
                className="flex-1 bg-primary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-primary-500 focus:border-accent-500/50 focus:outline-none"
            />
            <button
                type="submit"
                disabled={processing}
                className="px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-bold transition disabled:opacity-50"
            >
                Suscribir
            </button>
        </form>
    );
}

export default function PublicLayout({ children, auth }) {
    const { cart_count, flash } = usePage().props;
    const [showFlash, setShowFlash] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (flash.success || flash.error) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleGlobalSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route('catalog'), { search: searchQuery.trim() });
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(prev => !prev);
            }
            if (e.key === 'Escape') setSearchOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-primary-950 selection:bg-accent-500 selection:text-white overflow-x-hidden">
            {/* Floating Toast Notification */}
            {showFlash && (flash.success || flash.error) && (
                <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-primary-900 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] pr-6 pl-4 py-4 rounded-2xl flex items-center gap-4 group hover:border-accent-500/30 transition-colors">
                        <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${flash.success ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {flash.success ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            )}
                        </div>
                        <div className="pr-4">
                            <h4 className="font-bold text-sm text-white">{flash.success ? 'Notificación del Sistema' : 'Atención Requerida'}</h4>
                            <p className="text-primary-400 text-xs font-light mt-0.5">{flash.success || flash.error}</p>
                        </div>
                        <button onClick={() => setShowFlash(false)} className="text-primary-600 hover:text-white transition-colors p-2 -mr-2">
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Header / Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-primary-950/50 backdrop-blur-xl border-b border-white/5">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-3">
                                <img src="/images/logo-light.png" alt="Melkerven" className="h-10 w-auto object-contain" />
                                <span className="text-2xl font-display font-medium tracking-tighter text-white">
                                    MELKERVEN<span className="text-accent-500">.</span>
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="text-sm font-bold text-white hover:text-accent-400 transition-colors tracking-wide uppercase">Inicio</Link>
                            <Link href={route('catalog')} className="text-sm font-bold text-primary-300 hover:text-accent-400 transition-colors tracking-wide uppercase">Catálogo</Link>
                            <Link href={route('about')} className="text-sm font-bold text-primary-300 hover:text-accent-400 transition-colors tracking-wide uppercase">Quiénes Somos</Link>
                            <Link href={route('contact')} className="text-sm font-bold text-primary-300 hover:text-accent-400 transition-colors tracking-wide uppercase">Contacto</Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Search Button */}
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-primary-400 hover:text-white hover:bg-white/10 transition-all text-xs"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Buscar</span>
                                <kbd className="ml-1 px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-primary-500">Ctrl+K</kbd>
                            </button>

                            <Link
                                href={route('cart.index')}
                                className="relative size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-accent-500 transition-all active:scale-95 group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {cart_count > 0 && (
                                    <span className="absolute -top-1 -right-1 size-5 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-primary-950 animate-in zoom-in duration-300">
                                        {cart_count}
                                    </span>
                                )}
                            </Link>

                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="hidden md:inline-flex text-sm font-bold text-white px-5 py-2 hover:bg-white/5 rounded-xl transition border border-white/10"
                                >
                                    MI CUENTA
                                </Link>
                            ) : (
                                <div className="hidden md:flex items-center space-x-4">
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-bold text-primary-300 hover:text-white transition-colors"
                                    >
                                        LOGIN
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-6 py-2.5 bg-accent-500 text-white text-xs font-bold rounded-xl hover:bg-accent-600 transition-all shadow-lg shadow-accent-500/10 active:scale-95 border border-accent-400/20 uppercase tracking-widest"
                                    >
                                        Registrarse
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Hamburger */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden inline-flex items-center justify-center size-10 rounded-xl bg-white/5 border border-white/10 text-primary-300 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    {!mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-white/5 bg-primary-950/95 backdrop-blur-xl`}>
                    <div className="px-4 py-4 space-y-1">
                        <Link href="/" className="block px-4 py-3 rounded-xl text-sm font-bold text-white hover:bg-white/5 transition-all uppercase tracking-wide">Inicio</Link>
                        <Link href={route('catalog')} className="block px-4 py-3 rounded-xl text-sm font-bold text-primary-300 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wide">Catálogo</Link>
                        <Link href={route('about')} className="block px-4 py-3 rounded-xl text-sm font-bold text-primary-300 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wide">Quiénes Somos</Link>
                        <Link href={route('contact')} className="block px-4 py-3 rounded-xl text-sm font-bold text-primary-300 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wide">Contacto</Link>
                    </div>
                    <div className="border-t border-white/5 px-4 py-4 space-y-1">
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="block px-4 py-3 rounded-xl text-sm font-bold text-accent-400 hover:bg-accent-500/10 transition-all uppercase tracking-wide">Mi Cuenta</Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="block px-4 py-3 rounded-xl text-sm font-bold text-primary-300 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wide">Iniciar Sesión</Link>
                                <Link href={route('register')} className="block px-4 py-3 rounded-xl text-sm font-bold bg-accent-500 text-white text-center hover:bg-accent-600 transition-all uppercase tracking-wide mt-2">Registrarse</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-primary-950 text-primary-400 py-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
                        <div className="col-span-1 md:col-span-2">
                            <Link href="/" className="flex items-center space-x-2 mb-8">
                                <img src="/images/logo-light.png" alt="Melkerven" className="h-8 w-auto object-contain" />
                                <span className="text-xl font-display font-medium tracking-tighter text-white">
                                    MELKERVEN
                                </span>
                            </Link>
                            <p className="max-w-xs text-sm leading-relaxed text-primary-400 font-light">
                                Infraestructura tecnológica de alto nivel. Suministramos piezas críticas y equipos TI importados con estándares industriales.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Navegación</h4>
                            <ul className="space-y-4 text-sm font-medium">
                                <li><Link href="/" className="hover:text-accent-400 transition">Inicio</Link></li>
                                <li><Link href="/catalog" className="hover:text-accent-400 transition">Catálogo</Link></li>
                                <li><Link href="/about" className="hover:text-accent-400 transition">Nosotros</Link></li>
                                <li><Link href="/contact" className="hover:text-accent-400 transition">Contacto</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Sede Central</h4>
                            <p className="text-sm mb-2 text-primary-300">Badajoz 100, Las Condes</p>
                            <p className="text-sm mb-6 text-primary-300">Santiago, Chile</p>
                            <a href="https://wa.me/56988198559" className="inline-flex items-center gap-2 text-accent-500 font-bold hover:text-accent-400 transition">
                                <span className="size-2 bg-accent-500 rounded-full animate-pulse"></span>
                                Soporte Directo
                            </a>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="mt-16 pt-8 border-t border-white/5">
                        <div className="max-w-xl mx-auto text-center">
                            <h4 className="text-white font-display font-medium text-lg mb-2">Mantente Informado</h4>
                            <p className="text-primary-400 text-sm mb-4">Recibe novedades sobre productos, ofertas y tecnología.</p>
                            <NewsletterForm />
                        </div>
                    </div>
                    <div className="mt-20 pt-8 border-t border-white/5 text-[10px] text-center uppercase tracking-widest font-bold text-primary-600">
                        © {new Date().getFullYear()} Melkerven Chile <span className="mx-2">•</span> High-Tech Infrastructure Division
                    </div>
                </div>
            </footer>

            {/* Global Search Overlay */}
            {searchOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh]" onClick={() => setSearchOpen(false)}>
                    <div className="absolute inset-0 bg-primary-950/80 backdrop-blur-sm" />
                    <div className="relative w-full max-w-2xl mx-4 animate-in slide-in-from-top-4 fade-in duration-200" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleGlobalSearch}>
                            <div className="relative">
                                <svg className="absolute left-6 top-1/2 -translate-y-1/2 size-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Buscar servidores, repuestos, componentes..."
                                    className="w-full bg-primary-900 border border-white/10 rounded-2xl pl-16 pr-6 py-6 text-xl text-white placeholder-primary-600 focus:border-accent-500 focus:ring-accent-500/20 focus:outline-none shadow-2xl"
                                    autoFocus
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                    <kbd className="px-2 py-1 rounded-lg bg-white/10 text-[10px] font-mono text-primary-500">ESC</kbd>
                                </div>
                            </div>
                        </form>
                        <p className="text-center text-[10px] text-primary-600 mt-4 font-bold uppercase tracking-widest">
                            Presione Enter para buscar en el catálogo
                        </p>
                    </div>
                </div>
            )}

            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/56988198559"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl shadow-green-500/30 transition-all hover:scale-105 active:scale-95 group px-5 py-3.5"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span className="text-sm font-bold hidden sm:inline">Soporte Directo</span>
            </a>
        </div>
    );
}
