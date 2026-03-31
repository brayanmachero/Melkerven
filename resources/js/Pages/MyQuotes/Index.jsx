import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ quotes }) {
    const { auth } = usePage().props;
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: auth.user?.name || '',
        customer_email: auth.user?.email || '',
        customer_phone: '',
        message: '',
        items: [{ description: '', quantity: 1 }],
    });

    const addItem = () => {
        setData('items', [...data.items, { description: '', quantity: 1 }]);
    };

    const removeItem = (index) => {
        if (data.items.length > 1) {
            setData('items', data.items.filter((_, i) => i !== index));
        }
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData('items', newItems);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('my-quotes.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-px w-8 bg-accent-500"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-500">Solicitudes de Precios</span>
                        </div>
                        <h2 className="text-3xl font-display font-medium text-white tracking-tight">
                            Mis <span className="text-accent-500">Cotizaciones</span>
                        </h2>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-premium bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/20 text-xs uppercase tracking-widest"
                    >
                        {showForm ? '✕ Cerrar' : '+ Nueva Cotización'}
                    </button>
                </div>
            }
        >
            <Head title="Mis Cotizaciones" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* New Quote Form */}
                    {showForm && (
                        <div className="tech-card !p-8 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                            <h3 className="text-lg font-bold text-white mb-6">Nueva Solicitud de Cotización</h3>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid sm:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Nombre</label>
                                        <input type="text" value={data.customer_name} onChange={e => setData('customer_name', e.target.value)} className="w-full bg-primary-950 border border-primary-800 rounded-xl px-5 py-3 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all text-sm" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Email</label>
                                        <input type="email" value={data.customer_email} onChange={e => setData('customer_email', e.target.value)} className="w-full bg-primary-950 border border-primary-800 rounded-xl px-5 py-3 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all text-sm" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Teléfono</label>
                                        <input type="tel" value={data.customer_phone} onChange={e => setData('customer_phone', e.target.value)} className="w-full bg-primary-950 border border-primary-800 rounded-xl px-5 py-3 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all text-sm" required placeholder="+56 9..." />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Productos / Componentes Solicitados</label>
                                        <button type="button" onClick={addItem} className="text-[10px] font-bold uppercase tracking-widest text-accent-500 hover:text-accent-400 transition-colors">+ Agregar Item</button>
                                    </div>
                                    {data.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 items-start">
                                            <input type="text" value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} placeholder="Ej: Servidor Dell PowerEdge R740, SSD NVMe 2TB..." className="flex-grow bg-primary-950 border border-primary-800 rounded-xl px-5 py-3 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all text-sm" required />
                                            <input type="number" value={item.quantity} onChange={e => updateItem(index, 'quantity', parseInt(e.target.value))} min="1" className="w-24 bg-primary-950 border border-primary-800 rounded-xl px-4 py-3 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all text-sm text-center" required />
                                            {data.items.length > 1 && (
                                                <button type="button" onClick={() => removeItem(index)} className="text-red-400 hover:text-red-300 p-3">
                                                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Notas Adicionales (Opcional)</label>
                                    <textarea value={data.message} onChange={e => setData('message', e.target.value)} rows="3" className="w-full bg-primary-950 border border-primary-800 rounded-xl px-5 py-3 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all text-sm resize-none" placeholder="Urgencia, especificaciones técnicas, etc." />
                                </div>

                                <button type="submit" disabled={processing} className="btn-premium bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/20 disabled:opacity-50 text-xs uppercase tracking-widest">
                                    {processing ? 'Enviando...' : 'Enviar Solicitud de Cotización'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Quotes List */}
                    {quotes.data.length > 0 ? (
                        <div className="space-y-4">
                            {quotes.data.map(quote => (
                                <div key={quote.id} className="tech-card !p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-xs text-white">#COT-{String(quote.id).padStart(5, '0')}</span>
                                            <span className="text-[10px] text-primary-500">{new Date(quote.created_at).toLocaleDateString('es-CL')}</span>
                                        </div>
                                        <span className={`px-3 py-1.5 text-[10px] font-bold border rounded-full tracking-widest ${getStatusColor(quote.status)}`}>
                                            {getStatusLabel(quote.status)}
                                        </span>
                                    </div>
                                    {quote.items && quote.items.length > 0 && (
                                        <div className="space-y-2">
                                            {quote.items.map((item, i) => (
                                                <div key={i} className="flex justify-between text-sm p-3 rounded-lg bg-primary-950/50 border border-white/5">
                                                    <span className="text-primary-300">{item.description}</span>
                                                    <span className="text-white font-bold">×{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {quote.message && (
                                        <p className="text-primary-400 text-sm mt-4 italic font-light">"{quote.message}"</p>
                                    )}
                                </div>
                            ))}

                            {/* Pagination */}
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
                    ) : !showForm ? (
                        <div className="py-32 tech-card border-dashed border-primary-800 bg-transparent text-center">
                            <div className="text-6xl mb-8 opacity-40">📋</div>
                            <h3 className="text-3xl font-display font-medium text-white mb-4">Sin cotizaciones</h3>
                            <p className="text-primary-400 mb-12 max-w-md mx-auto font-light">
                                ¿Necesitas precios especiales para un proyecto o compra en volumen? Crea una solicitud de cotización.
                            </p>
                            <button onClick={() => setShowForm(true)} className="btn-premium bg-accent-500 text-white hover:bg-accent-600 px-10 inline-flex">
                                Crear Primera Cotización
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
