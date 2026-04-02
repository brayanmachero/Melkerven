import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ orders, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');

    const applyFilters = (newFilters) => {
        router.get(route('admin.orders.index'), {
            ...filters,
            ...newFilters,
        }, { preserveState: true, replace: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ search, status });
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'text-green-400 border-green-500/20 bg-green-500/5';
            case 'pending': return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5';
            case 'shipped': return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
            case 'delivered': return 'text-purple-400 border-purple-500/20 bg-purple-500/5';
            case 'failed': return 'text-red-400 border-red-500/20 bg-red-500/5';
            default: return 'text-primary-400 border-primary-500/20 bg-primary-500/5';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'paid': return 'PAGADO ✓';
            case 'pending': return 'PENDIENTE ⋯';
            case 'shipped': return 'ENVIADO 📦';
            case 'delivered': return 'ENTREGADO 👍';
            case 'failed': return 'FALLIDO ✖';
            default: return status.toUpperCase();
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-display font-bold text-white">
                        Gestión de <span className="text-accent-500">Pedidos</span>
                    </h2>
                    <a
                        href={route('admin.orders.export')}
                        className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-primary-300 hover:bg-white/10 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
                    >
                        ↓ CSV
                    </a>
                </div>
            }
        >
            <Head title="Gestión de Pedidos - Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Search & Filter Bar */}
                    <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por nombre, email o N° orden..."
                                className="tech-input w-full pl-12 pr-4 py-3 text-sm"
                            />
                        </div>
                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                applyFilters({ search, status: e.target.value });
                            }}
                            className="tech-input px-4 py-3 text-sm min-w-[180px]"
                        >
                            <option value="">Todos los estados</option>
                            <option value="pending">Pendiente</option>
                            <option value="paid">Pagado</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregado</option>
                            <option value="failed">Fallido</option>
                        </select>
                        <button
                            type="submit"
                            className="btn-premium bg-accent-500/10 text-accent-400 border border-accent-500/20 hover:bg-accent-500/20 text-[10px] font-bold uppercase tracking-widest px-6 py-3"
                        >
                            Buscar
                        </button>
                        {(filters?.search || filters?.status) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setStatus('');
                                    router.get(route('admin.orders.index'));
                                }}
                                className="btn-premium bg-white/5 text-primary-400 border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest px-6 py-3"
                            >
                                Limpiar
                            </button>
                        )}
                    </form>

                    <div className="tech-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5">
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">ID / Fecha</th>
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Cliente</th>
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Documento</th>
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Total</th>
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Estado</th>
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {orders.data.map((order) => (
                                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-6">
                                                <div className="font-mono text-xs text-white">#ORD-{String(order.id).padStart(5, '0')}</div>
                                                <div className="text-[10px] text-primary-500 mt-1 uppercase tracking-tighter">
                                                    {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="text-sm font-medium text-white">{order.customer_name}</div>
                                                <div className="text-[10px] text-primary-500 mt-0.5 font-mono">{order.customer_rut}</div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-2 py-1 text-[10px] font-bold border rounded-md uppercase tracking-widest ${order.document_type === 'factura' ? 'border-orange-500/20 text-orange-400 bg-orange-500/5' : 'border-blue-500/20 text-blue-400 bg-blue-500/5'}`}>
                                                    {order.document_type}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="text-sm font-bold text-accent-500 font-mono">
                                                    ${Number(order.total_amount).toLocaleString('es-CL')}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1.5 text-[10px] font-bold border rounded-full tracking-[0.1em] ${getStatusColor(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <Link
                                                    href={route('admin.orders.show', order.id)}
                                                    className="inline-flex items-center gap-2 group-hover:text-accent-500 transition-colors text-primary-400"
                                                >
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Ver Detalles</span>
                                                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Simple Pagination */}
                    <div className="mt-8 flex justify-between items-center px-2">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-500">
                            Mostrando {orders.from}-{orders.to} de {orders.total} registros transaccionales
                        </div>
                        <div className="flex gap-2">
                            {orders.links.map((link, i) => (
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${link.active ? 'bg-accent-500 border-accent-500 text-white' : 'border-white/10 text-primary-400 hover:border-accent-500'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/5 text-primary-600 cursor-not-allowed opacity-50"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
