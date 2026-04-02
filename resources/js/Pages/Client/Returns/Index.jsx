import { Head, Link } from '@inertiajs/react';
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
        <AuthenticatedLayout header={<h2 className="text-xl font-display font-bold text-white">Mis Devoluciones y Garantías</h2>}>
            <Head title="Mis Devoluciones" />
            <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-end mb-6">
                    <Link href={route('returns.create')}
                        className="px-5 py-2.5 bg-accent-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent-600 transition">
                        Nueva Solicitud
                    </Link>
                </div>

                {returns.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="size-16 bg-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-primary-500">No tienes solicitudes de devolución.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {returns.map(ret => (
                            <div key={ret.id} className="bg-primary-900/50 border border-white/10 rounded-xl p-5 flex items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-white font-bold text-sm">Solicitud #{ret.id}</span>
                                        <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[ret.status]}`}>
                                            {statusLabels[ret.status]}
                                        </span>
                                    </div>
                                    <p className="text-primary-500 text-xs">
                                        Pedido #{ret.order?.buy_order || ret.order_id} •
                                        {ret.type === 'return' ? ' Devolución' : ' Garantía'} •
                                        {' '}{new Date(ret.created_at).toLocaleDateString('es-CL')}
                                    </p>
                                    <p className="text-primary-400 text-sm mt-1 line-clamp-1">{ret.reason}</p>
                                </div>
                                {ret.admin_notes && (
                                    <div className="text-right">
                                        <p className="text-[10px] text-primary-500 uppercase tracking-widest font-bold">Respuesta</p>
                                        <p className="text-primary-300 text-xs max-w-xs truncate">{ret.admin_notes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
