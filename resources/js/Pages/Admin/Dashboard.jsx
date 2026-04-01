import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const monthNames = { '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Ago', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic' };

export default function Dashboard({ auth, stats, monthlySales, topProducts, recentOrders, recentActivity }) {
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
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
                        {[
                            { label: 'Productos', value: stats.products_count, border: 'border-accent-500/30', icon: '📦' },
                            { label: 'Categorías', value: stats.categories_count, border: 'border-primary-400/20', icon: '📁' },
                            { label: 'Pedidos', value: stats.orders_count, border: 'border-green-500/20', icon: '🛒' },
                            { label: 'Pendientes', value: stats.pending_orders || 0, border: 'border-orange-500/20', icon: '⏳' },
                            { label: 'Cotizaciones', value: stats.quotes_count, border: 'border-yellow-500/20', icon: '📋' },
                            { label: 'Mensajes', value: stats.messages_count || 0, border: 'border-purple-500/20', icon: '📧' },
                            { label: 'Usuarios', value: stats.users_count || 0, border: 'border-blue-500/20', icon: '👥' },
                            { label: 'Ingresos', value: `$${new Intl.NumberFormat('es-CL').format(stats.revenue || 0)}`, border: 'border-green-500/30', icon: '💰' },
                        ].map((stat, i) => (
                            <div key={i} className={`tech-card !p-5 border-t-2 ${stat.border} text-center`}>
                                <div className="text-xl mb-1 opacity-60">{stat.icon}</div>
                                <div className="text-2xl font-display font-medium text-white truncate">{stat.value}</div>
                                <div className="text-[9px] font-bold uppercase tracking-widest text-primary-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid lg:grid-cols-3 gap-6 mb-12">
                        {/* Monthly Sales Chart */}
                        <div className="lg:col-span-2 tech-card !p-8">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <span className="text-accent-500">📊</span> Ventas Mensuales
                            </h3>
                            {monthlySales && monthlySales.length > 0 ? (
                                <Bar
                                    data={{
                                        labels: monthlySales.map(s => monthNames[s.month.split('-')[1]] || s.month),
                                        datasets: [
                                            {
                                                label: 'Ingresos (CLP)',
                                                data: monthlySales.map(s => s.revenue),
                                                backgroundColor: 'rgba(14, 165, 233, 0.3)',
                                                borderColor: 'rgba(14, 165, 233, 0.8)',
                                                borderWidth: 2,
                                                borderRadius: 8,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: { ticks: { color: '#64748b', callback: v => '$' + new Intl.NumberFormat('es-CL').format(v) }, grid: { color: 'rgba(255,255,255,0.03)' } },
                                            x: { ticks: { color: '#64748b' }, grid: { display: false } },
                                        },
                                    }}
                                />
                            ) : (
                                <div className="h-48 flex items-center justify-center text-primary-500 text-sm">Sin datos de ventas aún</div>
                            )}
                        </div>

                        {/* Top Products */}
                        <div className="tech-card !p-8">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <span className="text-accent-500">🏆</span> Top Productos
                            </h3>
                            {topProducts && topProducts.length > 0 ? (
                                <Doughnut
                                    data={{
                                        labels: topProducts.map(p => p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name),
                                        datasets: [{
                                            data: topProducts.map(p => p.total_sold),
                                            backgroundColor: ['rgba(14,165,233,0.6)', 'rgba(168,85,247,0.6)', 'rgba(34,197,94,0.6)', 'rgba(249,115,22,0.6)', 'rgba(236,72,153,0.6)'],
                                            borderColor: 'rgba(11,17,32,0.8)',
                                            borderWidth: 3,
                                        }],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 10 }, padding: 12 } },
                                        },
                                    }}
                                />
                            ) : (
                                <div className="h-48 flex items-center justify-center text-primary-500 text-sm">Sin ventas registradas</div>
                            )}
                        </div>
                    </div>

                    {/* Recent Orders Table */}
                    {recentOrders && recentOrders.length > 0 && (
                        <div className="tech-card !p-8 mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="text-accent-500">🕐</span> Pedidos Recientes
                                </h3>
                                <Link href={route('admin.orders.index')} className="text-[10px] font-bold uppercase tracking-widest text-accent-400 hover:text-accent-300 transition-colors">
                                    Ver todos →
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="text-[9px] font-bold uppercase tracking-widest text-primary-500 py-3 text-left">Orden</th>
                                            <th className="text-[9px] font-bold uppercase tracking-widest text-primary-500 py-3 text-left">Cliente</th>
                                            <th className="text-[9px] font-bold uppercase tracking-widest text-primary-500 py-3 text-right">Total</th>
                                            <th className="text-[9px] font-bold uppercase tracking-widest text-primary-500 py-3 text-center">Estado</th>
                                            <th className="text-[9px] font-bold uppercase tracking-widest text-primary-500 py-3 text-center">Pago</th>
                                            <th className="text-[9px] font-bold uppercase tracking-widest text-primary-500 py-3 text-right">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map(order => (
                                            <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-3 text-xs text-white font-mono">{order.order_number}</td>
                                                <td className="py-3 text-xs text-primary-300">{order.customer}</td>
                                                <td className="py-3 text-xs text-white text-right font-mono">${new Intl.NumberFormat('es-CL').format(order.total)}</td>
                                                <td className="py-3 text-center">
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${order.status === 'completed' ? 'bg-green-500/10 text-green-400' : order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-accent-500/10 text-accent-400'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${order.payment_status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                        {order.payment_status}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-xs text-primary-500 text-right">{order.created_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Activity Log */}
                    {recentActivity && recentActivity.length > 0 && (
                        <div className="tech-card !p-8 mb-12">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                                <span className="text-accent-500">📋</span> Actividad Reciente
                            </h3>
                            <div className="space-y-3">
                                {recentActivity.map(activity => (
                                    <div key={activity.id} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                                        <div className="size-2 bg-accent-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white">{activity.description}</p>
                                            <p className="text-[10px] text-primary-500 mt-0.5">
                                                {activity.user} · {activity.created_at}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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
