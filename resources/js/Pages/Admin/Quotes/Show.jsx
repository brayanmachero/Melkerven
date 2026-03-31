import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ quote }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-px w-8 bg-accent-500"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-500">Detalle de Cotización</span>
                        </div>
                        <h2 className="text-3xl font-display font-medium text-white tracking-tight">
                            Cotización <span className="text-accent-500 font-mono">#{String(quote.id).padStart(5, '0')}</span>
                        </h2>
                    </div>
                    <Link href={route('admin.quotes.index')} className="text-[10px] font-bold uppercase tracking-widest text-primary-400 hover:text-accent-500 transition-colors">← Volver</Link>
                </div>
            }
        >
            <Head title={`Cotización #${quote.id}`} />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-8">
                    <div className="tech-card !p-8">
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Datos del Cliente</h3>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div><span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 block mb-1">Nombre</span><span className="text-white text-sm">{quote.customer_name}</span></div>
                            <div><span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 block mb-1">Email</span><span className="text-white text-sm">{quote.customer_email}</span></div>
                            <div><span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 block mb-1">Teléfono</span><span className="text-white text-sm">{quote.customer_phone}</span></div>
                            <div><span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 block mb-1">Estado</span><span className="text-white text-sm uppercase font-bold">{quote.status}</span></div>
                        </div>
                        {quote.message && (
                            <div className="mt-6 pt-6 border-t border-white/5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 block mb-2">Mensaje</span>
                                <p className="text-primary-300 text-sm italic font-light">"{quote.message}"</p>
                            </div>
                        )}
                    </div>

                    <div className="tech-card !p-8">
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Items Solicitados</h3>
                        <div className="space-y-3">
                            {quote.items.map((item, i) => (
                                <div key={i} className="flex justify-between p-4 rounded-xl bg-primary-950/50 border border-white/5">
                                    <span className="text-white text-sm">{item.description}</span>
                                    <span className="text-accent-500 font-bold text-sm">×{item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
