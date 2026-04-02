import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const SidebarIcon = ({ d }) => (
    <svg className="size-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

export default function AuthenticatedLayout({ header, children }) {
    const { auth, unread_messages } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [notifications, setNotifications] = useState(null);

    useEffect(() => {
        if (user.role !== 'admin') return;
        const fetchNotifications = () => {
            fetch(route('admin.notifications'))
                .then(res => res.json())
                .then(data => setNotifications(data))
                .catch(() => {});
        };
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [user.role]);

    const totalAlerts = notifications
        ? notifications.new_orders + notifications.new_quotes + notifications.new_messages + notifications.low_stock
        : 0;

    const adminSections = [
        { heading: 'Principal', items: [
            { href: route('admin.dashboard'), label: 'Resumen', active: route().current('admin.dashboard') || route().current('dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
        ]},
        { heading: 'Catálogo', items: [
            { href: route('admin.categories.index'), label: 'Categorías', active: route().current('admin.categories.*'), icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
            { href: route('admin.products.index'), label: 'Productos', active: route().current('admin.products.*'), icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
            { href: route('admin.banners.index'), label: 'Banners', active: route().current('admin.banners.*'), icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        ]},
        { heading: 'Ventas', items: [
            { href: route('admin.orders.index'), label: 'Pedidos', active: route().current('admin.orders.*'), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', badge: notifications?.new_orders },
            { href: route('admin.quotes.index'), label: 'Cotizaciones', active: route().current('admin.quotes.*'), icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', badge: notifications?.new_quotes },
            { href: route('admin.coupons.index'), label: 'Cupones', active: route().current('admin.coupons.*'), icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z' },
        ]},
        { heading: 'Comunicación', items: [
            { href: route('admin.messages.index'), label: 'Mensajes', active: route().current('admin.messages.*'), icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', badge: notifications?.new_messages || (unread_messages > 0 ? unread_messages : 0) },
            { href: route('admin.blog.index'), label: 'Blog', active: route().current('admin.blog.*'), icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
        ]},
        { heading: 'Soporte', items: [
            { href: route('admin.returns.index'), label: 'Devoluciones', active: route().current('admin.returns.*'), icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
        ]},
        { heading: 'Configuración', items: [
            { href: route('admin.users.index'), label: 'Usuarios', active: route().current('admin.users.*'), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
            { href: route('admin.shipping.index'), label: 'Logística', active: route().current('admin.shipping.*'), icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' },
            { href: route('admin.reports.index'), label: 'Reportes', active: route().current('admin.reports.*'), icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { href: route('admin.dte.index'), label: 'Facturación', active: route().current('admin.dte.*'), icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
        ]},
    ];

    const clientLinks = [
        { href: route('dashboard'), label: 'Mi Panel', active: route().current('dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
        { href: route('my-orders.index'), label: 'Mis Pedidos', active: route().current('my-orders.*'), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
        { href: route('my-quotes.index'), label: 'Mis Cotizaciones', active: route().current('my-quotes.*'), icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { href: route('wishlist.index'), label: 'Favoritos', active: route().current('wishlist.*'), icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
        { href: route('returns.index'), label: 'Devoluciones', active: route().current('returns.*'), icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`flex items-center gap-3 px-5 pt-6 pb-5 ${collapsed ? 'justify-center' : ''}`}>
                <img src="/images/logo-light.png" alt="Melkerven" className="h-7 w-auto object-contain shrink-0" />
                {!collapsed && (
                    <span className="text-white font-display font-medium tracking-tight text-sm whitespace-nowrap">
                        MELKERVEN<span className="text-accent-500">.</span>
                        {user.role === 'admin' && <span className="text-accent-500 ml-1 text-[9px]">ADMIN</span>}
                    </span>
                )}
            </div>

            <div className="h-px bg-white/5 mx-4" />

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
                {user.role === 'admin' ? (
                    adminSections.map((section, si) => (
                        <div key={si} className={si > 0 ? 'pt-4' : ''}>
                            {!collapsed && (
                                <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.25em] text-primary-600">
                                    {section.heading}
                                </p>
                            )}
                            {collapsed && si > 0 && <div className="h-px bg-white/5 mx-2 mb-2" />}
                            {section.items.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold transition-all duration-200 group relative ${
                                        link.active
                                            ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20 shadow-sm shadow-accent-500/5'
                                            : 'text-primary-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    } ${collapsed ? 'justify-center' : ''}`}
                                    title={collapsed ? link.label : undefined}
                                >
                                    <SidebarIcon d={link.icon} />
                                    {!collapsed && <span className="truncate">{link.label}</span>}
                                    {link.badge > 0 && (
                                        <span className={`${collapsed ? 'absolute -top-1 -right-1' : 'ml-auto'} size-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center`}>
                                            {link.badge > 9 ? '9+' : link.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    ))
                ) : (
                    clientLinks.map((link, i) => (
                        <Link
                            key={i}
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold transition-all duration-200 ${
                                link.active
                                    ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                                    : 'text-primary-400 hover:text-white hover:bg-white/5 border border-transparent'
                            } ${collapsed ? 'justify-center' : ''}`}
                            title={collapsed ? link.label : undefined}
                        >
                            <SidebarIcon d={link.icon} />
                            {!collapsed && <span>{link.label}</span>}
                        </Link>
                    ))
                )}
            </nav>

            {/* Bottom Actions */}
            <div className="border-t border-white/5 p-3 space-y-1">
                <Link
                    href={route('home')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold text-primary-500 hover:text-accent-400 hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? 'Ver Tienda' : undefined}
                >
                    <SidebarIcon d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    {!collapsed && <span>Ver Tienda</span>}
                </Link>
                <Link
                    href={route('profile.edit')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold text-primary-500 hover:text-white hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? 'Mi Perfil' : undefined}
                >
                    <SidebarIcon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    {!collapsed && <span>Mi Perfil</span>}
                </Link>

                <div className="h-px bg-white/5 my-1" />

                {/* User info */}
                <div className={`flex items-center gap-3 px-3 py-2 ${collapsed ? 'justify-center' : ''}`}>
                    <div className="size-8 rounded-lg bg-accent-500/20 flex items-center justify-center text-accent-400 text-xs font-bold shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-white font-semibold truncate">{user.name}</p>
                            <p className="text-[10px] text-primary-600 truncate">{user.email}</p>
                        </div>
                    )}
                </div>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? 'Cerrar Sesión' : undefined}
                >
                    <SidebarIcon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    {!collapsed && <span>Cerrar Sesión</span>}
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-primary-950 font-light selection:bg-accent-500/30">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar - Mobile */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary-900/95 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent />
            </aside>

            {/* Sidebar - Desktop */}
            <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 bg-primary-900/80 backdrop-blur-xl border-r border-white/5 transition-all duration-300 ${collapsed ? 'lg:w-[68px]' : 'lg:w-60'}`}>
                <SidebarContent />
            </aside>

            {/* Main content area */}
            <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-[68px]' : 'lg:pl-60'}`}>
                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-primary-950/80 backdrop-blur-xl border-b border-white/5">
                    <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden size-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-primary-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            {/* Collapse toggle - Desktop */}
                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className="hidden lg:flex size-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-primary-400 hover:text-white hover:bg-white/10 transition-all"
                                title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
                            >
                                <svg className={`size-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                </svg>
                            </button>

                            {header && <div className="ml-2">{header}</div>}
                        </div>

                        {/* Right side: notifications */}
                        <div className="flex items-center gap-3">
                            {user.role === 'admin' && totalAlerts > 0 && (
                                <div className="relative group">
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="relative size-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-primary-400 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                                            {totalAlerts > 9 ? '9+' : totalAlerts}
                                        </span>
                                    </Link>
                                    <div className="absolute right-0 mt-2 w-60 bg-primary-900/95 border border-white/10 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 p-3 space-y-1.5">
                                        {notifications?.new_orders > 0 && <p className="text-xs text-primary-300">📦 {notifications.new_orders} pedido(s) nuevo(s)</p>}
                                        {notifications?.new_quotes > 0 && <p className="text-xs text-primary-300">📋 {notifications.new_quotes} cotización(es)</p>}
                                        {notifications?.new_messages > 0 && <p className="text-xs text-primary-300">📧 {notifications.new_messages} mensaje(s)</p>}
                                        {notifications?.low_stock > 0 && <p className="text-xs text-yellow-400">⚠️ {notifications.low_stock} stock bajo</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="relative z-10 min-h-[calc(100vh-3.5rem)]">{children}</main>
            </div>

            {/* Background accents */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-0 size-[600px] bg-accent-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 size-[600px] bg-primary-400/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
            </div>
        </div>
    );
}
