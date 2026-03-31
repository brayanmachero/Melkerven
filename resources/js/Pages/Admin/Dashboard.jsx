import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px w-8 bg-accent-500"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-500">Centro de Control</span>
                    </div>
                    <h2 className="text-4xl font-display font-medium text-white tracking-tighter">
                        Panel de <span className="text-accent-500">Administración</span>
                    </h2>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 relative z-10">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                        {[
                            { label: 'Productos', value: stats.products_count, border: 'border-accent-500/30', icon: '📦' },
                            { label: 'Categorías', value: stats.categories_count, border: 'border-primary-400/20', icon: '📁' },
                            { label: 'Pedidos', value: stats.orders_count, border: 'border-green-500/20', icon: '🛒' },
                            { label: 'Cotizaciones', value: stats.quotes_count, border: 'border-yellow-500/20', icon: '📋' },
                            { label: 'Mensajes', value: stats.messages_count || 0, border: 'border-purple-500/20', icon: '📧' },
                            { label: 'Usuarios', value: stats.users_count || 0, border: 'border-blue-500/20', icon: '👥' },
                        ].map((stat, i) => (
                            <div key={i} className={`tech-card !p-6 border-t-2 ${stat.border} text-center`}>
                                <div className="text-2xl mb-2 opacity-60">{stat.icon}</div>
                                <div className="text-3xl font-display font-medium text-white">{stat.value}</div>
                                <div className="text-[9px] font-bold uppercase tracking-widest text-primary-500 mt-2">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Inventory */}
                        <div className="tech-card !p-8 group relative overflow-hidden hover:border-accent-500/30 transition-all">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                <span className="text-accent-500">📦</span> Inventario
                            </h3>
                            <p className="text-primary-400 mb-6 text-sm font-light leading-relaxed">Gestione productos, precios y stock del catálogo.</p>
                            <div className="flex flex-wrap gap-3">
                                <Link href={route('admin.products.index')} className="btn-premium bg-accent-500 text-white hover:bg-accent-600 text-[10px]">Ver Productos</Link>
                                <Link href={route('admin.products.create')} className="btn-premium bg-white/5 text-white border border-white/10 hover:bg-white/10 text-[10px]">+ Nuevo</Link>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="tech-card !p-8 group relative overflow-hidden hover:border-primary-400/30 transition-all">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                <span className="text-primary-400">📁</span> Categorías
                            </h3>
                            <p className="text-primary-400 mb-6 text-sm font-light leading-relaxed">Organice productos en categorías para el catálogo.</p>
                            <Link href={route('admin.categories.index')} className="btn-premium bg-primary-800 text-white hover:bg-primary-700 border border-white/5 text-[10px]">Gestionar Categorías</Link>
                        </div>

                        {/* Orders */}
                        <div className="tech-card !p-8 group relative overflow-hidden hover:border-green-500/30 transition-all">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                <span className="text-green-400">🛒</span> Pedidos
                            </h3>
                            <p className="text-primary-400 mb-6 text-sm font-light leading-relaxed">Revise y administre los pedidos de clientes.</p>
                            <Link href={route('admin.orders.index')} className="btn-premium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 text-[10px]">Ver Pedidos</Link>
                        </div>

                        {/* Quotes */}
                        <div className="tech-card !p-8 group relative overflow-hidden hover:border-yellow-500/30 transition-all">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                <span className="text-yellow-400">📋</span> Cotizaciones
                            </h3>
                            <p className="text-primary-400 mb-6 text-sm font-light leading-relaxed">Gestione solicitudes de cotización de clientes.</p>
                            <Link href={route('admin.quotes.index')} className="btn-premium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 text-[10px]">Ver Cotizaciones</Link>
                        </div>

                        {/* Messages */}
                        <div className="tech-card !p-8 group relative overflow-hidden hover:border-purple-500/30 transition-all">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                <span className="text-purple-400">📧</span> Mensajes
                            </h3>
                            <p className="text-primary-400 mb-6 text-sm font-light leading-relaxed">Revise y responda mensajes del formulario de contacto.</p>
                            <Link href={route('admin.messages.index')} className="btn-premium bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 text-[10px]">Ver Mensajes</Link>
                        </div>

                        {/* Users */}
                        <div className="tech-card !p-8 group relative overflow-hidden hover:border-blue-500/30 transition-all">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                <span className="text-blue-400">👥</span> Usuarios
                            </h3>
                            <p className="text-primary-400 mb-6 text-sm font-light leading-relaxed">Gestione usuarios registrados y asigne roles.</p>
                            <Link href={route('admin.users.index')} className="btn-premium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 text-[10px]">Ver Usuarios</Link>
                        </div>

                        {/* Shipping */}
                        <div className="tech-card !p-8 group relative overflow-hidden hover:border-primary-500/30 transition-all">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                <span className="text-primary-300">🚛</span> Logística
                            </h3>
                            <p className="text-primary-400 mb-6 text-sm font-light leading-relaxed">Configure tarifas de envío por región.</p>
                            <Link href={route('admin.shipping.index')} className="btn-premium bg-primary-800/50 text-primary-300 border border-primary-700/30 hover:bg-primary-800 text-[10px]">Ver Tarifas</Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
