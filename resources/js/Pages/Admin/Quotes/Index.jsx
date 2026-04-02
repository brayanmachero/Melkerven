import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ quotes }) {
    const getStatusColor = (status) => {
        const colors = {
            pending: 'text-yellow-400 bg-yellow-500/5 border-yellow-500/20',
            reviewing: 'text-blue-400 bg-blue-500/5 border-blue-500/20',
            quoted: 'text-green-400 bg-green-500/5 border-green-500/20',
            accepted: 'text-purple-400 bg-purple-500/5 border-purple-500/20',
            rejected: 'text-red-400 bg-red-500/5 border-red-500/20',
        };
        return colors[status] || 'text-primary-400 bg-primary-500/5 border-primary-500/20';
    };

    const getStatusLabel = (status) => {
        const labels = { pending: 'Pendiente', reviewing: 'En Revisión', quoted: 'Cotizado', accepted: 'Aceptado', rejected: 'Rechazado' };
        return labels[status] || status;
    };

    const updateStatus = (quoteId, newStatus) => {
        router.patch(route('admin.quotes.updateStatus', quoteId), { status: newStatus }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg font-display font-bold text-white">
                    Gestión de <span className="text-accent-500">Cotizaciones</span>
                </h2>
            }
        >
            <Head title="Cotizaciones - Admin" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="tech-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5">
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">ID / Fecha</th>
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Cliente</th>
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Items</th>
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400">Estado</th>
                                        <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-400 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {quotes.data.map(quote => (
                                        <tr key={quote.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-6">
                                                <div className="font-mono text-xs text-white">#COT-{String(quote.id).padStart(5, '0')}</div>
                                                <div className="text-[10px] text-primary-500 mt-1">{new Date(quote.created_at).toLocaleDateString('es-CL')}</div>
                                            </td>
                                            <td className="p-6">
                                                <div className="text-sm font-medium text-white">{quote.customer_name}</div>
                                                <div className="text-[10px] text-primary-500 mt-0.5">{quote.customer_email}</div>
                                            </td>
                                            <td className="p-6">
                                                <span className="text-sm text-primary-300">{quote.items?.length || 0} items</span>
                                            </td>
                                            <td className="p-6">
                                                <select
                                                    value={quote.status}
                                                    onChange={(e) => updateStatus(quote.id, e.target.value)}
                                                    className="bg-primary-950 border border-white/10 rounded-lg text-xs text-white px-3 py-1.5 focus:border-accent-500 focus:ring-accent-500/20"
                                                >
                                                    <option value="pending">Pendiente</option>
                                                    <option value="reviewing">En Revisión</option>
                                                    <option value="quoted">Cotizado</option>
                                                    <option value="accepted">Aceptado</option>
                                                    <option value="rejected">Rechazado</option>
                                                </select>
                                            </td>
                                            <td className="p-6 text-right">
                                                <Link href={route('admin.quotes.show', quote.id)} className="text-[10px] font-bold uppercase tracking-widest text-primary-400 group-hover:text-accent-500 transition-colors">
                                                    Ver Detalles →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {quotes.data.length === 0 && (
                        <div className="py-20 text-center text-primary-500">
                            <div className="text-4xl mb-4 opacity-40">📋</div>
                            <p className="text-sm">No hay cotizaciones registradas aún.</p>
                        </div>
                    )}

                    {quotes.last_page > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {quotes.links.map((link, i) => (
                                link.url ? (
                                    <Link key={i} href={link.url} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all rounded-lg ${link.active ? 'bg-accent-500 border-accent-500 text-white' : 'border-white/10 text-primary-400 hover:border-accent-500'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span key={i} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/5 text-primary-600 cursor-not-allowed opacity-50 rounded-lg" dangerouslySetInnerHTML={{ __html: link.label }} />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
