import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ recentOrders, recentQuotes, stats }) {
    const { auth } = usePage().props;

    const getStatusColor = (status) => {
        const colors = {
            paid: 'text-green-400 bg-green-500/5 border-green-500/20',
            pending: 'text-yellow-400 bg-yellow-500/5 border-yellow-500/20',
            shipped: 'text-blue-400 bg-blue-500/5 border-blue-500/20',
            delivered: 'text-purple-400 bg-purple-500/5 border-purple-500/20',
            failed: 'text-red-400 bg-red-500/5 border-red-500/20',
        };
        return colors[status] || 'text-primary-400 bg-primary-500/5 border-primary-500/20';
    };

    const getStatusLabel = (status) => {
        const labels = {
            paid: 'Pagado', pending: 'Pendiente', shipped: 'Enviado',
            delivered: 'Entregado', failed: 'Fallido',
            reviewing: 'En Revisión', quoted: 'Cotizado',
            accepted: 'Aceptado', rejected: 'Rechazado',
        };
        return labels[status] || status;
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px w-8 bg-accent-500"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-500">Panel de Cliente</span>
                    </div>
                    <h2 className="text-3xl font-display font-medium text-white tracking-tight">
                        Bienvenido, <span className="text-accent-500">{auth.user.name}</span>
                    </h2>
                </div>
            }
        >
            <Head title="Mi Panel" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 relative z-10">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="tech-card !p-8 border-t-2 border-accent-500/30">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-2">Mis Pedidos</div>
                            <div className="text-4xl font-display font-medium text-white">{stats.orders_count}</div>
                        </div>
                        <div className="tech-card !p-8 border-t-2 border-primary-400/20">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-2">Mis Cotizaciones</div>
                            <div className="text-4xl font-display font-medium text-white">{stats.quotes_count}</div>
                        </div>
                        <div className="tech-card !p-8 border-t-2 border-green-500/20">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-2">Total Invertido</div>
                            <div className="text-4xl font-display font-medium text-white">
                                ${new Intl.NumberFormat('es-CL').format(stats.total_spent || 0)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Orders */}
                        <div className="tech-card !p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                    <svg className="size-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    Pedidos Recientes
                                </h3>
                                <Link href={route('my-orders.index')} className="text-[10px] font-bold uppercase tracking-widest text-accent-500 hover:text-accent-400 transition-colors">Ver Todos →</Link>
                            </div>

                            {recentOrders.length > 0 ? (
                                <div className="space-y-3">
                                    {recentOrders.map(order => (
                                        <Link
                                            key={order.id}
                                            href={route('my-orders.show', order.id)}
                                            className="flex items-center justify-between p-4 rounded-xl bg-primary-950/50 border border-white/5 hover:border-accent-500/30 transition-all group"
                                        >
                                            <div>
                                                <div className="font-mono text-xs text-white group-hover:text-accent-400 transition-colors">
                                                    #ORD-{String(order.id).padStart(5, '0')}
                                                </div>
                                                <div className="text-[10px] text-primary-500 mt-1">
                                                    {new Date(order.created_at).toLocaleDateString('es-CL')}
                                                </div>
                                            </div>
                                            <div className="text-right flex items-center gap-4">
                                                <span className="text-sm font-bold text-white font-mono">
                                                    ${Number(order.total_amount).toLocaleString('es-CL')}
                                                </span>
                                                <span className={`px-2.5 py-1 text-[9px] font-bold border rounded-full tracking-widest ${getStatusColor(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-primary-500">
                                    <div className="text-4xl mb-4 opacity-40">📦</div>
                                    <p className="text-sm font-light">Aún no tienes pedidos realizados</p>
                                    <Link href={route('catalog')} className="text-accent-500 text-xs font-bold uppercase tracking-widest mt-4 inline-block hover:text-accent-400">
                                        Explorar Catálogo →
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Recent Quotes */}
                        <div className="tech-card !p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                    <svg className="size-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    Cotizaciones Recientes
                                </h3>
                                <Link href={route('my-quotes.index')} className="text-[10px] font-bold uppercase tracking-widest text-accent-500 hover:text-accent-400 transition-colors">Ver Todas →</Link>
                            </div>

                            {recentQuotes.length > 0 ? (
                                <div className="space-y-3">
                                    {recentQuotes.map(quote => (
                                        <div
                                            key={quote.id}
                                            className="flex items-center justify-between p-4 rounded-xl bg-primary-950/50 border border-white/5"
                                        >
                                            <div>
                                                <div className="font-mono text-xs text-white">
                                                    #COT-{String(quote.id).padStart(5, '0')}
                                                </div>
                                                <div className="text-[10px] text-primary-500 mt-1">
                                                    {new Date(quote.created_at).toLocaleDateString('es-CL')}
                                                </div>
                                            </div>
                                            <span className={`px-2.5 py-1 text-[9px] font-bold border rounded-full tracking-widest ${getStatusColor(quote.status)}`}>
                                                {getStatusLabel(quote.status)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-primary-500">
                                    <div className="text-4xl mb-4 opacity-40">📋</div>
                                    <p className="text-sm font-light">Aún no tienes cotizaciones</p>
                                    <Link href={route('my-quotes.index')} className="text-accent-500 text-xs font-bold uppercase tracking-widest mt-4 inline-block hover:text-accent-400">
                                        Solicitar Cotización →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href={route('catalog')} className="tech-card !p-6 text-center hover:border-accent-500/50 transition-all group">
                            <div className="size-12 mx-auto bg-accent-500/10 rounded-xl flex items-center justify-center text-accent-500 mb-4 group-hover:bg-accent-500/20 transition-colors">
                                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <h4 className="text-white font-bold text-sm mb-1">Explorar Catálogo</h4>
                            <p className="text-[10px] text-primary-500">Ver productos disponibles</p>
                        </Link>
                        <Link href={route('my-quotes.index')} className="tech-card !p-6 text-center hover:border-accent-500/50 transition-all group">
                            <div className="size-12 mx-auto bg-accent-500/10 rounded-xl flex items-center justify-center text-accent-500 mb-4 group-hover:bg-accent-500/20 transition-colors">
                                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <h4 className="text-white font-bold text-sm mb-1">Nueva Cotización</h4>
                            <p className="text-[10px] text-primary-500">Solicitar precios especiales</p>
                        </Link>
                        <Link href={route('contact')} className="tech-card !p-6 text-center hover:border-accent-500/50 transition-all group">
                            <div className="size-12 mx-auto bg-accent-500/10 rounded-xl flex items-center justify-center text-accent-500 mb-4 group-hover:bg-accent-500/20 transition-colors">
                                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            </div>
                            <h4 className="text-white font-bold text-sm mb-1">Contactar Soporte</h4>
                            <p className="text-[10px] text-primary-500">Abrir ticket de soporte</p>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
