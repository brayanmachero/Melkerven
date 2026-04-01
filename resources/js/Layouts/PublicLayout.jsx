import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function PublicLayout({ children, auth }) {
    const { cart_count, flash } = usePage().props;
    const [showFlash, setShowFlash] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (flash.success || flash.error) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

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
                                <img src="/images/logo.png" alt="Melkerven" className="h-10 w-auto object-contain" />
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
                                <img src="/images/logo.png" alt="Melkerven" className="h-8 w-auto object-contain" />
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
                    <div className="mt-20 pt-8 border-t border-white/5 text-[10px] text-center uppercase tracking-widest font-bold text-primary-600">
                        © {new Date().getFullYear()} Melkerven Chile <span className="mx-2">•</span> High-Tech Infrastructure Division
                    </div>
                </div>
            </footer>
        </div>
    );
}
