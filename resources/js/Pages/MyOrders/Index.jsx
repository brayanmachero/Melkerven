import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ orders }) {
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
        const labels = { paid: 'Pagado', pending: 'Pendiente', shipped: 'Enviado', delivered: 'Entregado', failed: 'Fallido' };
        return labels[status] || status;
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px w-8 bg-accent-500"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-500">Historial de Compras</span>
                    </div>
                    <h2 className="text-3xl font-display font-medium text-white tracking-tight">
                        Mis <span className="text-accent-500">Pedidos</span>
                    </h2>
                </div>
            }
        >
            <Head title="Mis Pedidos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {orders.data.length > 0 ? (
                        <>
                            <div className="tech-card overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/5">
                                                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Orden</th>
                                                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Fecha</th>
                                                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Total</th>
                                                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Estado</th>
                                                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400 text-right">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {orders.data.map(order => (
                                                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="p-6">
                                                        <span className="font-mono text-xs text-white">#ORD-{String(order.id).padStart(5, '0')}</span>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="text-sm text-primary-300">{new Date(order.created_at).toLocaleDateString('es-CL')}</span>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="text-sm font-bold text-accent-500 font-mono">${Number(order.total_amount).toLocaleString('es-CL')}</span>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className={`px-3 py-1.5 text-[10px] font-bold border rounded-full tracking-widest ${getStatusColor(order.status)}`}>
                                                            {getStatusLabel(order.status)}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <Link
                                                            href={route('my-orders.show', order.id)}
                                                            className="text-[10px] font-bold uppercase tracking-widest text-primary-400 group-hover:text-accent-500 transition-colors"
                                                        >
                                                            Ver Detalle →
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="mt-8 flex justify-between items-center px-2">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-primary-500">
                                    Mostrando {orders.from}-{orders.to} de {orders.total}
                                </div>
                                <div className="flex gap-2">
                                    {orders.links.map((link, i) => (
                                        link.url ? (
                                            <Link key={i} href={link.url} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all rounded-lg ${link.active ? 'bg-accent-500 border-accent-500 text-white' : 'border-white/10 text-primary-400 hover:border-accent-500'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ) : (
                                            <span key={i} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/5 text-primary-600 cursor-not-allowed opacity-50 rounded-lg" dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="py-32 tech-card border-dashed border-primary-800 bg-transparent text-center">
                            <div className="text-6xl mb-8 opacity-40">📦</div>
                            <h3 className="text-3xl font-display font-medium text-white mb-4">Sin pedidos aún</h3>
                            <p className="text-primary-400 mb-12 max-w-md mx-auto font-light">
                                Aún no has realizado ninguna compra. Explora nuestro catálogo para encontrar el hardware que necesitas.
                            </p>
                            <Link href={route('catalog')} className="btn-premium bg-accent-500 text-white hover:bg-accent-600 px-10 inline-flex">
                                Explorar Catálogo
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
