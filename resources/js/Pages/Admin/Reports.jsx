import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Reports({ salesByDay, topProducts, topClients, stats, categoryStats, period }) {
    const formatCLP = (amount) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-display font-bold text-white">Reportes y Análisis</h2>}>
            <Head title="Reportes" />
            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Period selector */}
                <div className="flex gap-2 mb-8">
                    {[{ value: '7', label: '7 días' }, { value: '30', label: '30 días' }, { value: '90', label: '90 días' }, { value: '365', label: '1 año' }].map(p => (
                        <a key={p.value} href={route('admin.reports', { period: p.value })}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition ${period == p.value ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20' : 'text-primary-400 hover:text-white hover:bg-white/5 border border-white/10'}`}>
                            {p.label}
                        </a>
                    ))}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Ingresos Total', value: formatCLP(stats.total_revenue), icon: '💰' },
                        { label: 'Pedidos Pagados', value: stats.total_orders, icon: '📦' },
                        { label: 'Ticket Promedio', value: formatCLP(stats.avg_order_value), icon: '📊' },
                        { label: 'Nuevos Clientes', value: stats.new_customers, icon: '👤' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-primary-900/50 border border-white/10 rounded-xl p-5">
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <p className="text-[10px] text-primary-500 uppercase tracking-widest font-bold">{stat.label}</p>
                            <p className="text-2xl text-white font-display font-bold mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales Chart (simplified table) */}
                    <div className="bg-primary-900/50 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4">Ventas por Día</h3>
                        <div className="max-h-64 overflow-y-auto">
                            {salesByDay.length === 0 ? (
                                <p className="text-primary-500 text-sm">Sin datos para este período.</p>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left text-[10px] text-primary-500 uppercase tracking-widest font-bold pb-2">Fecha</th>
                                            <th className="text-right text-[10px] text-primary-500 uppercase tracking-widest font-bold pb-2">Pedidos</th>
                                            <th className="text-right text-[10px] text-primary-500 uppercase tracking-widest font-bold pb-2">Ingresos</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {salesByDay.map((day, i) => (
                                            <tr key={i}>
                                                <td className="py-2 text-sm text-primary-300">{day.date}</td>
                                                <td className="py-2 text-sm text-white text-right font-mono">{day.orders}</td>
                                                <td className="py-2 text-sm text-accent-400 text-right font-mono">{formatCLP(day.revenue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-primary-900/50 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4">Productos Más Vendidos</h3>
                        <div className="space-y-3">
                            {topProducts.length === 0 ? (
                                <p className="text-primary-500 text-sm">Sin datos para este período.</p>
                            ) : topProducts.map((product, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="size-6 bg-accent-500/10 text-accent-400 rounded-lg flex items-center justify-center text-xs font-bold border border-accent-500/20">
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{product.name}</p>
                                        <p className="text-xs text-primary-500">{product.total_sold} vendidos</p>
                                    </div>
                                    <span className="text-sm text-accent-400 font-mono">{formatCLP(product.total_revenue)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Clients */}
                    <div className="bg-primary-900/50 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4">Mejores Clientes</h3>
                        <div className="space-y-3">
                            {topClients.length === 0 ? (
                                <p className="text-primary-500 text-sm">Sin datos para este período.</p>
                            ) : topClients.map((client, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="size-8 bg-accent-500/10 text-accent-400 rounded-lg flex items-center justify-center text-xs font-bold border border-accent-500/20">
                                        {client.user?.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{client.user?.name}</p>
                                        <p className="text-xs text-primary-500">{client.orders_count} pedidos</p>
                                    </div>
                                    <span className="text-sm text-accent-400 font-mono">{formatCLP(client.total_spent)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Category Stats */}
                    <div className="bg-primary-900/50 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4">Ventas por Categoría</h3>
                        <div className="space-y-3">
                            {categoryStats.length === 0 ? (
                                <p className="text-primary-500 text-sm">Sin datos para este período.</p>
                            ) : categoryStats.map((cat, i) => {
                                const maxRevenue = categoryStats[0]?.revenue || 1;
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-primary-300">{cat.name}</span>
                                            <span className="text-sm text-accent-400 font-mono">{formatCLP(cat.revenue)}</span>
                                        </div>
                                        <div className="h-2 bg-primary-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-accent-500 rounded-full transition-all" style={{ width: `${(cat.revenue / maxRevenue) * 100}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
