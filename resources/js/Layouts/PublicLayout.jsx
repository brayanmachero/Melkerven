import { Link, usePage, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useCurrency } from '../Contexts/CurrencyContext';
import { useLanguage } from '../Contexts/LanguageContext';
import BrandLogo from '../Components/BrandLogo';

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
        return <p className="text-emerald-700 text-sm font-medium">¡Gracias por suscribirte!</p>;
    }

    return (
        <form onSubmit={submit} className="flex gap-2 max-w-md mx-auto">
            <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="Tu correo electrónico"
                required
                className="flex-1 rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-white text-sm placeholder:text-cloud-300 focus:border-signal-300 focus:outline-none"
            />
            <button
                type="submit"
                disabled={processing}
                className="px-5 py-2.5 bg-signal-400 hover:bg-signal-300 text-ink-950 rounded-lg text-sm font-bold transition disabled:opacity-50"
            >
                Suscribir
            </button>
        </form>
    );
}

export default function PublicLayout({ children, auth }) {
    const { cart_count, flash } = usePage().props;
    const { currency, toggleCurrency } = useCurrency();
    const { language, toggleLanguage, t } = useLanguage();
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
            window.location.assign(`${route('catalog')}?search=${encodeURIComponent(searchQuery.trim())}`);
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
        <div className="min-h-screen bg-cloud-50 text-ink-950 selection:bg-signal-200 selection:text-ink-950 overflow-x-hidden">
            {/* Floating Toast Notification */}
            {showFlash && (flash.success || flash.error) && (
                <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-white border border-ink-100 shadow-[0_18px_40px_rgba(31,62,82,0.16)] pr-6 pl-4 py-4 rounded-2xl flex items-center gap-4 group hover:border-signal-300 transition-colors">
                        <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${flash.success ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {flash.success ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            )}
                        </div>
                        <div className="pr-4">
                            <h4 className="font-bold text-sm text-ink-950">{flash.success ? 'Notificación del Sistema' : 'Atención Requerida'}</h4>
                            <p className="text-ink-500 text-xs font-light mt-0.5">{flash.success || flash.error}</p>
                        </div>
                        <button onClick={() => setShowFlash(false)} className="text-ink-300 hover:text-ink-950 transition-colors p-2 -mr-2">
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Header / Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-ink-100 bg-white/85 shadow-[0_8px_28px_rgba(31,62,82,0.06)] backdrop-blur-2xl">
                <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-[4.5rem] items-center justify-between gap-4">
                        <div className="flex items-center">
                            <Link href="/" className="rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-500">
                                <BrandLogo className="h-11 w-[10.5rem] sm:w-[11.5rem]" />
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden xl:flex items-center gap-5">
                            <Link href="/" className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-950 transition-colors hover:text-signal-600">{t('nav.home')}</Link>
                            <Link href={route('catalog')} className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-600 transition-colors hover:text-signal-600">{t('nav.catalog')}</Link>
                            <Link href={route('about')} className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-600 transition-colors hover:text-signal-600">{t('nav.about')}</Link>
                            <Link href={route('contact')} className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-600 transition-colors hover:text-signal-600">{t('nav.contact')}</Link>
                            <Link href={route('blog.index')} className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-600 transition-colors hover:text-signal-600">{t('nav.blog')}</Link>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Language Toggle */}
                            <button
                                onClick={toggleLanguage}
                                className="hidden 2xl:flex items-center px-2.5 py-1.5 rounded-lg bg-cloud-50 border border-ink-100 text-[10px] font-bold uppercase tracking-widest text-ink-500 hover:text-ink-950 hover:bg-signal-50 transition-all"
                                title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
                            >
                                {language === 'es' ? 'EN' : 'ES'}
                            </button>

                            {/* Currency Toggle */}
                            <button
                                onClick={toggleCurrency}
                                className="hidden 2xl:flex items-center px-2.5 py-1.5 rounded-lg bg-cloud-50 border border-ink-100 text-[10px] font-bold uppercase tracking-widest text-ink-500 hover:text-ink-950 hover:bg-signal-50 transition-all"
                                title={currency === 'CLP' ? 'Switch to USD' : 'Cambiar a CLP'}
                            >
                                {currency}
                            </button>

                            {/* Search Button */}
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-cloud-50 border border-ink-100 text-ink-500 hover:text-ink-950 hover:bg-signal-50 transition-all text-xs"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Buscar</span>
                                <kbd className="ml-1 px-1.5 py-0.5 rounded bg-white text-[9px] font-mono text-ink-400">Ctrl+K</kbd>
                            </button>

                            <Link
                                href={route('cart.index')}
                                aria-label="Ver carrito"
                                className="relative size-10 flex items-center justify-center rounded-xl bg-cloud-50 border border-ink-100 text-ink-700 hover:bg-signal-500 hover:text-white transition-all active:scale-95 group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {cart_count > 0 && (
                                    <span className="absolute -top-1 -right-1 size-5 bg-signal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in duration-300">
                                        {cart_count}
                                    </span>
                                )}
                            </Link>

                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="hidden 2xl:inline-flex text-sm font-bold text-ink-800 px-5 py-2 hover:bg-signal-50 rounded-xl transition border border-ink-100"
                                >
                                    MI CUENTA
                                </Link>
                            ) : (
                                <div className="hidden 2xl:flex items-center space-x-4">
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-bold text-ink-600 hover:text-ink-950 transition-colors"
                                    >
                                        LOGIN
                                    </Link>
                                </div>
                            )}

                            <Link
                                href={route('contact')}
                                className="hidden xl:inline-flex items-center rounded-xl border border-ink-950 bg-ink-950 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.13em] text-white shadow-lg shadow-ink-950/15 transition hover:bg-ink-800 active:scale-95"
                            >
                                Cotizar
                            </Link>

                            {/* Mobile Hamburger */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                                aria-controls="public-mobile-menu"
                                aria-expanded={mobileMenuOpen}
                                className="xl:hidden inline-flex items-center justify-center size-10 rounded-xl bg-cloud-50 border border-ink-100 text-ink-600 hover:text-ink-950 hover:bg-signal-50 transition-all"
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
                <div id="public-mobile-menu" className={`${mobileMenuOpen ? 'block' : 'hidden'} xl:hidden border-t border-ink-100 bg-white/95 backdrop-blur-xl`}>
                    <div className="px-4 py-4 space-y-1">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-bold text-ink-950 hover:bg-signal-50 transition-all uppercase tracking-wide">{t('nav.home')}</Link>
                        <Link href={route('catalog')} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-bold text-ink-600 hover:text-ink-950 hover:bg-signal-50 transition-all uppercase tracking-wide">{t('nav.catalog')}</Link>
                        <Link href={route('about')} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-bold text-ink-600 hover:text-ink-950 hover:bg-signal-50 transition-all uppercase tracking-wide">{t('nav.about')}</Link>
                        <Link href={route('contact')} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-bold text-ink-600 hover:text-ink-950 hover:bg-signal-50 transition-all uppercase tracking-wide">{t('nav.contact')}</Link>
                        <Link href={route('blog.index')} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-bold text-ink-600 hover:text-ink-950 hover:bg-signal-50 transition-all uppercase tracking-wide">{t('nav.blog')}</Link>
                        <div className="flex items-center gap-2 px-4 py-3">
                            <button onClick={toggleLanguage} className="px-3 py-2 rounded-lg bg-cloud-50 border border-ink-100 text-xs font-bold text-ink-500">{language === 'es' ? 'EN' : 'ES'}</button>
                            <button onClick={toggleCurrency} className="px-3 py-2 rounded-lg bg-cloud-50 border border-ink-100 text-xs font-bold text-ink-500">{currency}</button>
                        </div>
                    </div>
                    <div className="border-t border-ink-100 px-4 py-4 space-y-1">
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="block px-4 py-3 rounded-xl text-sm font-bold text-signal-600 hover:bg-signal-50 transition-all uppercase tracking-wide">Mi Cuenta</Link>
                        ) : (
                            <>
                                <Link href={route('login')} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-bold text-ink-600 hover:text-ink-950 hover:bg-signal-50 transition-all uppercase tracking-wide">Iniciar Sesión</Link>
                                <Link href={route('register')} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-bold text-ink-600 hover:text-ink-950 hover:bg-signal-50 transition-all uppercase tracking-wide">Crear cuenta</Link>
                            </>
                        )}
                        <Link href={route('contact')} onClick={() => setMobileMenuOpen(false)} className="mt-2 block rounded-xl bg-ink-950 px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-white hover:bg-ink-800 transition-all">Solicitar cotización</Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-[4.5rem]">
                {children}
            </main>

            {/* Footer */}
            <footer id="site-footer" className="relative overflow-hidden border-t border-ink-800 bg-ink-950 py-10 text-cloud-300">
                <div className="pointer-events-none absolute inset-0 public-network opacity-25" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.15fr)_0.6fr_0.8fr]">
                        <div>
                            <Link href="/" className="mb-4 inline-block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-300">
                                <BrandLogo variant="light" className="h-9 w-40" />
                            </Link>
                            <p className="max-w-md text-sm leading-6 text-cloud-300 font-light">
                                Infraestructura tecnológica de alto nivel. Suministramos piezas críticas y equipos TI importados con estándares industriales.
                            </p>
                            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-cloud-500">Servers · Storage · Networking · Repuestos críticos</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">{t('footer.nav')}</h4>
                            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-medium md:grid-cols-1">
                                <li><Link href="/" className="hover:text-signal-300 transition">{t('nav.home')}</Link></li>
                                <li><Link href="/catalog" className="hover:text-signal-300 transition">{t('nav.catalog')}</Link></li>
                                <li><Link href="/about" className="hover:text-signal-300 transition">{t('nav.about')}</Link></li>
                                <li><Link href="/contact" className="hover:text-signal-300 transition">{t('nav.contact')}</Link></li>
                                <li><Link href="/blog" className="hover:text-signal-300 transition">{t('nav.blog')}</Link></li>
                                <li><Link href="/faq" className="hover:text-signal-300 transition">{t('nav.faq')}</Link></li>
                                <li><Link href="/tracking" className="hover:text-signal-300 transition">{t('nav.tracking')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">{t('footer.hq')}</h4>
                            <p className="text-sm mb-1 text-cloud-200">Badajoz 100, Las Condes</p>
                            <p className="text-sm mb-4 text-cloud-200">Santiago, Chile</p>
                            <a href="https://wa.me/56988198559" className="inline-flex items-center gap-2 text-signal-300 font-bold hover:text-signal-200 transition">
                                <span className="size-2 bg-signal-300 rounded-full animate-pulse"></span>
                                {t('footer.support')}
                            </a>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="relative mt-8 grid gap-4 border-t border-white/10 pt-6 md:grid-cols-[1fr_minmax(22rem,0.9fr)] md:items-center md:gap-8">
                        <div className="md:text-left">
                            <h4 className="text-white font-display font-medium text-base">{t('footer.newsletter')}</h4>
                            <p className="mt-1 text-cloud-300 text-sm">{t('footer.newsletterDesc')}</p>
                        </div>
                        <div>
                            <NewsletterForm />
                        </div>
                    </div>
                    <div className="relative mt-6 border-t border-white/10 pt-5 text-center text-[10px] font-bold uppercase tracking-widest text-cloud-500">
                        © {new Date().getFullYear()} Melkerven Chile. Todos los derechos reservados.
                    </div>
                </div>
            </footer>

            {/* Global Search Overlay */}
            {searchOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh]" role="dialog" aria-modal="true" aria-label="Buscar en el catálogo" onClick={() => setSearchOpen(false)}>
                    <div className="absolute inset-0 bg-ink-950/35 backdrop-blur-sm" />
                    <div className="relative w-full max-w-2xl mx-4 animate-in slide-in-from-top-4 fade-in duration-200" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleGlobalSearch}>
                            <div className="relative">
                                <svg className="absolute left-6 top-1/2 -translate-y-1/2 size-6 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    aria-label="Buscar en el catálogo"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Buscar servidores, repuestos, componentes..."
                                    className="w-full bg-white border border-ink-100 rounded-2xl pb-6 pl-16 pr-28 pt-6 text-xl text-ink-950 placeholder-ink-300 focus:border-signal-500 focus:ring-signal-500/20 focus:outline-none shadow-2xl"
                                    autoFocus
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-ink-950 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-ink-800">Buscar</button>
                            </div>
                        </form>
                        <p className="text-center text-[10px] text-white/80 mt-4 font-bold uppercase tracking-widest">
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
                className="fixed bottom-5 right-4 z-50 flex items-center gap-3 rounded-full bg-green-500 px-4 py-3.5 text-white shadow-2xl shadow-green-500/30 transition-all hover:scale-105 hover:bg-green-600 active:scale-95 sm:bottom-6 sm:left-6 sm:right-auto sm:px-5 group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span className="text-sm font-bold hidden sm:inline">Soporte Directo</span>
            </a>
        </div>
    );
}
