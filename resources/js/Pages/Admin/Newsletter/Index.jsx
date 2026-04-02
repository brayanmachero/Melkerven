import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function NewsletterIndex({ subscribers, stats }) {
    const [showCompose, setShowCompose] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        subject: '',
        content: '',
    });

    const sendNewsletter = (e) => {
        e.preventDefault();
        if (!confirm(`¿Enviar newsletter a ${stats.active} suscriptores activos?`)) return;
        post(route('admin.newsletter.send'), {
            onSuccess: () => { reset(); setShowCompose(false); },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-display font-bold text-white">Newsletter</h2>}>
            <Head title="Newsletter - Admin" />
            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Total Suscriptores', value: stats.total, color: 'text-white' },
                        { label: 'Activos', value: stats.active, color: 'text-green-400' },
                        { label: 'Desuscriptos', value: stats.unsubscribed, color: 'text-red-400' },
                    ].map((s, i) => (
                        <div key={i} className="bg-primary-900/50 border border-white/10 rounded-xl p-5">
                            <p className="text-[10px] text-primary-500 uppercase tracking-widest font-bold">{s.label}</p>
                            <p className={`text-3xl font-display font-bold mt-1 ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg text-white font-bold">Suscriptores</h3>
                    <button onClick={() => setShowCompose(!showCompose)}
                        className="px-5 py-2.5 bg-accent-500 text-white rounded-xl text-sm font-bold hover:bg-accent-600 transition">
                        {showCompose ? 'Cancelar' : '📧 Enviar Newsletter'}
                    </button>
                </div>

                {/* Compose Form */}
                {showCompose && (
                    <form onSubmit={sendNewsletter} className="bg-primary-900/50 border border-white/10 rounded-2xl p-6 mb-8">
                        <h3 className="text-white font-bold mb-4">Componer Newsletter</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-primary-400 mb-1 uppercase tracking-widest font-bold">Asunto</label>
                                <input type="text" value={data.subject} onChange={e => setData('subject', e.target.value)}
                                    className="w-full bg-primary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent-500/50 focus:outline-none"
                                    placeholder="Ej: Nuevos servidores disponibles en Melkerven" required />
                            </div>
                            <div>
                                <label className="block text-xs text-primary-400 mb-1 uppercase tracking-widest font-bold">Contenido</label>
                                <textarea value={data.content} onChange={e => setData('content', e.target.value)}
                                    className="w-full bg-primary-800/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-accent-500/50 focus:outline-none min-h-[200px]"
                                    placeholder="Escribe el contenido del newsletter..." required />
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-primary-500">Se enviará a <span className="text-accent-400 font-bold">{stats.active}</span> suscriptores activos</p>
                                <button type="submit" disabled={processing}
                                    className="px-6 py-2.5 bg-accent-500 text-white rounded-xl text-sm font-bold hover:bg-accent-600 transition disabled:opacity-50">
                                    {processing ? 'Enviando...' : 'Enviar Ahora'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Subscribers Table */}
                <div className="bg-primary-900/50 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-primary-500">Email</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-primary-500">Nombre</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-primary-500">Estado</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-primary-500">Fecha</th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-primary-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {subscribers.data?.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-primary-500">No hay suscriptores aún.</td></tr>
                            ) : (subscribers.data || []).map(sub => (
                                <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-sm text-white font-mono">{sub.email}</td>
                                    <td className="px-6 py-4 text-sm text-primary-300">{sub.name || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${sub.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {sub.is_active ? 'Activo' : 'Desuscrito'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-primary-500">{new Date(sub.created_at).toLocaleDateString('es-CL')}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => { if (confirm('¿Eliminar suscriptor?')) router.delete(route('admin.newsletter.destroy', sub.id)); }}
                                            className="text-xs text-red-400 hover:text-red-300 font-bold">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {subscribers.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {subscribers.links.map((link, i) => (
                            link.url ? (
                                <a key={i} href={link.url} className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${link.active ? 'bg-accent-500/10 text-accent-400 border-accent-500/20' : 'text-primary-400 border-white/10 hover:border-accent-500/30'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <span key={i} className="px-4 py-2 text-xs text-primary-600 border border-white/5 rounded-lg" dangerouslySetInnerHTML={{ __html: link.label }} />
                            )
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
