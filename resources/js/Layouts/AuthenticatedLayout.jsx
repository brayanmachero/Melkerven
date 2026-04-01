import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, unread_messages } = usePage().props;
    const user = auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const navLinks = user.role === 'admin' ? [
        { href: route('admin.dashboard'), label: 'Resumen', active: route().current('admin.dashboard') || route().current('dashboard') },
        { href: route('admin.categories.index'), label: 'Categorías', active: route().current('admin.categories.*') },
        { href: route('admin.products.index'), label: 'Productos', active: route().current('admin.products.*') },
        { href: route('admin.orders.index'), label: 'Pedidos', active: route().current('admin.orders.*') },
        { href: route('admin.quotes.index'), label: 'Cotizaciones', active: route().current('admin.quotes.*') },
        { href: route('admin.messages.index'), label: unread_messages > 0 ? `Mensajes (${unread_messages})` : 'Mensajes', active: route().current('admin.messages.*') },
        { href: route('admin.users.index'), label: 'Usuarios', active: route().current('admin.users.*') },
        { href: route('admin.shipping.index'), label: 'Logística', active: route().current('admin.shipping.*') },
    ] : [
        { href: route('dashboard'), label: 'Mi Panel', active: route().current('dashboard') },
        { href: route('my-orders.index'), label: 'Mis Pedidos', active: route().current('my-orders.*') },
        { href: route('my-quotes.index'), label: 'Mis Cotizaciones', active: route().current('my-quotes.*') },
    ];

    return (
        <div className="min-h-screen bg-primary-950 font-light selection:bg-accent-500/30">
            {/* Navigation */}
            <nav className="border-b border-white/5 bg-primary-950/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* Logo + Nav */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-3 mr-10">
                                <img src="/images/logo-light.png" alt="Melkerven" className="h-8 w-auto object-contain" />
                                <span className="text-white font-display font-medium tracking-tight text-lg">
                                    MELKERVEN<span className="text-accent-500">.</span>
                                    {user.role === 'admin' && <span className="text-accent-500 ml-1 text-xs">ADMIN</span>}
                                </span>
                            </Link>

                            {/* Desktop Nav Links */}
                            <div className="hidden md:flex items-center space-x-1">
                                {navLinks.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.href}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${link.active
                                                ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                                                : 'text-primary-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right side: user menu */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link
                                href={route('home')}
                                className="text-[10px] font-bold uppercase tracking-widest text-primary-500 hover:text-accent-400 transition-colors px-3 py-2"
                            >
                                Ver Tienda
                            </Link>

                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-300 transition duration-150 ease-in-out hover:text-white hover:bg-white/10 focus:outline-none"
                                >
                                    <div className="size-6 rounded-lg bg-accent-500/20 flex items-center justify-center text-accent-400 text-[10px] font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    {user.name}
                                    <svg className="h-4 w-4 text-accent-500 transition-transform duration-200" style={{ transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {showUserMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                                        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-primary-900/95 backdrop-blur-xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <Link
                                                href={route('profile.edit')}
                                                className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary-300 hover:text-white hover:bg-white/5 transition-colors"
                                            >
                                                <svg className="size-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                Mi Perfil
                                            </Link>
                                            <div className="border-t border-white/5 my-1"></div>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                                            >
                                                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                Cerrar Sesión
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile hamburger */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center size-10 rounded-xl border border-white/10 bg-white/5 text-primary-300 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    {!showingNavigationDropdown ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Nav Dropdown */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} md:hidden border-t border-white/5 bg-primary-900/95 backdrop-blur-xl`}>
                    <div className="px-4 py-4 space-y-1">
                        {navLinks.map((link, i) => (
                            <Link
                                key={i}
                                href={link.href}
                                className={`block px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${link.active
                                        ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                                        : 'text-primary-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="border-t border-white/5 px-4 py-4">
                        <div className="flex items-center gap-3 mb-4 px-4">
                            <div className="size-8 rounded-lg bg-accent-500/20 flex items-center justify-center text-accent-400 text-xs font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">{user.name}</div>
                                <div className="text-[10px] text-primary-500 font-mono">{user.email}</div>
                            </div>
                        </div>
                        <Link
                            href={route('profile.edit')}
                            className="block px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-primary-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Mi Perfil
                        </Link>
                        <Link
                            href={route('home')}
                            className="block px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-primary-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Ver Tienda
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="block w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                        >
                            Cerrar Sesión
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Header */}
            {header && (
                <header className="bg-primary-900/50 border-b border-white/5 py-10">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="relative z-10">{children}</main>

            {/* Background accents */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-0 size-[600px] bg-accent-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 size-[600px] bg-primary-400/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
            </div>
        </div>
    );
}
