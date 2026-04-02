import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ReturnsIndex({ returns }) {
    const statusColors = {
        pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        approved: 'bg-green-500/10 text-green-400 border-green-500/20',
        rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
        in_process: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        completed: 'bg-accent-500/10 text-accent-400 border-accent-500/20',
    };

    const statusLabels = {
        pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada',
        in_process: 'En Proceso', completed: 'Completada',
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-display font-bold text-white">Gestión de Devoluciones y Garantías</h2>}>
            <Head title="Devoluciones" />
            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {returns.data?.length === 0 ? (
                    <div className="text-center py-16 text-primary-500">No hay solicitudes de devolución.</div>
                ) : (
                    <div className="bg-primary-900/50 border border-white/10 rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-primary-500">ID</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-primary-500">Cliente</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-primary-500">Pedido</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-primary-500">Tipo</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-primary-500">Estado</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-primary-500">Fecha</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-primary-500">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {(returns.data || returns).map(ret => (
                                    <tr key={ret.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-sm text-white font-mono">#{ret.id}</td>
                                        <td className="px-6 py-4 text-sm text-primary-300">{ret.user?.name}</td>
                                        <td className="px-6 py-4 text-sm text-primary-300 font-mono">#{ret.order?.buy_order || ret.order_id}</td>
                                        <td className="px-6 py-4 text-sm text-primary-300">
                                            {ret.type === 'return' ? 'Devolución' : 'Garantía'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[ret.status]}`}>
                                                {statusLabels[ret.status]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-primary-500">
                                            {new Date(ret.created_at).toLocaleDateString('es-CL')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <select
                                                value={ret.status}
                                                onChange={(e) => router.patch(route('admin.returns.updateStatus', ret.id), { status: e.target.value })}
                                                className="bg-primary-800/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-accent-500/50 focus:outline-none"
                                            >
                                                <option value="pending">Pendiente</option>
                                                <option value="approved">Aprobada</option>
                                                <option value="rejected">Rechazada</option>
                                                <option value="in_process">En Proceso</option>
                                                <option value="completed">Completada</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
