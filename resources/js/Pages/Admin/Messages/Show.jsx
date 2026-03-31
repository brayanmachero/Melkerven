import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Show({ message }) {
    const { data, setData, post, processing } = useForm({
        admin_reply: message.admin_reply || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.messages.reply', message.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-px w-8 bg-accent-500"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-500">Mensaje de Contacto</span>
                        </div>
                        <h2 className="text-3xl font-display font-medium text-white tracking-tight">{message.subject}</h2>
                    </div>
                    <Link href={route('admin.messages.index')} className="text-[10px] font-bold uppercase tracking-widest text-primary-400 hover:text-accent-500 transition-colors">← Volver</Link>
                </div>
            }
        >
            <Head title={`Mensaje: ${message.subject}`} />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-8">
                    <div className="tech-card !p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h4 className="text-white font-bold">{message.name}</h4>
                                <p className="text-primary-500 text-xs font-mono">{message.email}</p>
                            </div>
                            <span className="text-[10px] text-primary-500">{new Date(message.created_at).toLocaleDateString('es-CL')} {new Date(message.created_at).toLocaleTimeString('es-CL')}</span>
                        </div>
                        <div className="bg-primary-950/50 rounded-xl p-6 border border-white/5">
                            <p className="text-primary-300 text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                        </div>
                    </div>

                    <div className="tech-card !p-8">
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Respuesta del Administrador</h3>
                        <form onSubmit={submit} className="space-y-6">
                            <textarea
                                value={data.admin_reply}
                                onChange={e => setData('admin_reply', e.target.value)}
                                rows="6"
                                className="w-full bg-primary-950 border border-primary-800 rounded-xl px-5 py-4 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all text-sm resize-none"
                                placeholder="Escriba su respuesta aquí..."
                                required
                            />
                            <button type="submit" disabled={processing} className="btn-premium bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/20 disabled:opacity-50 text-xs uppercase tracking-widest">
                                {message.admin_reply ? 'Actualizar Respuesta' : 'Enviar Respuesta'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
