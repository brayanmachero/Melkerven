import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ messages }) {
    const getStatusColor = (status) => {
        const colors = {
            unread: 'text-yellow-400 bg-yellow-500/5 border-yellow-500/20',
            read: 'text-blue-400 bg-blue-500/5 border-blue-500/20',
            replied: 'text-green-400 bg-green-500/5 border-green-500/20',
        };
        return colors[status] || 'text-primary-400';
    };

    const getStatusLabel = (status) => {
        const labels = { unread: 'No Leído', read: 'Leído', replied: 'Respondido' };
        return labels[status] || status;
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px w-8 bg-accent-500"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-500">Bandeja de Entrada</span>
                    </div>
                    <h2 className="text-4xl font-display font-medium text-white tracking-tighter">
                        Mensajes de <span className="text-accent-500">Contacto</span>
                    </h2>
                </div>
            }
        >
            <Head title="Mensajes - Admin" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {messages.data.length > 0 ? (
                        <div className="space-y-4">
                            {messages.data.map(msg => (
                                <Link
                                    key={msg.id}
                                    href={route('admin.messages.show', msg.id)}
                                    className={`tech-card !p-6 flex items-center justify-between group hover:border-accent-500/30 transition-all ${msg.status === 'unread' ? 'border-l-4 border-l-yellow-500' : ''}`}
                                >
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-4 mb-2">
                                            <span className="text-white font-bold text-sm">{msg.name}</span>
                                            <span className="text-[10px] text-primary-500 font-mono">{msg.email}</span>
                                        </div>
                                        <h4 className="text-primary-300 text-sm font-medium">{msg.subject}</h4>
                                        <p className="text-primary-500 text-xs mt-1 line-clamp-1">{msg.message}</p>
                                    </div>
                                    <div className="flex items-center gap-4 ml-6 shrink-0">
                                        <span className={`px-2.5 py-1 text-[9px] font-bold border rounded-full tracking-widest ${getStatusColor(msg.status)}`}>
                                            {getStatusLabel(msg.status)}
                                        </span>
                                        <span className="text-[10px] text-primary-500">{new Date(msg.created_at).toLocaleDateString('es-CL')}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center text-primary-500">
                            <div className="text-4xl mb-4 opacity-40">📧</div>
                            <p className="text-sm">No hay mensajes de contacto registrados.</p>
                        </div>
                    )}

                    {messages.last_page > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {messages.links.map((link, i) => (
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
