import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm } from '@inertiajs/react';

export default function OrderTracking({ auth, order }) {
    const { data, setData, post, processing } = useForm({
        buy_order: '',
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tracking.search'));
    };

    const getStatusSteps = (status) => {
        const steps = [
            { key: 'pending', label: 'Pedido Recibido', icon: '📋' },
            { key: 'paid', label: 'Pago Confirmado', icon: '✅' },
            { key: 'shipped', label: 'En Camino', icon: '🚚' },
            { key: 'delivered', label: 'Entregado', icon: '📦' },
        ];
        const statusOrder = ['pending', 'paid', 'shipped', 'delivered'];
        const currentIdx = statusOrder.indexOf(status);
        return steps.map((step, i) => ({
            ...step,
            completed: i <= currentIdx,
            current: i === currentIdx,
        }));
    };

    const getStatusLabel = (status) => {
        const labels = { pending: 'Pendiente', paid: 'Pagado', shipped: 'Enviado', delivered: 'Entregado', failed: 'Fallido' };
        return labels[status] || status;
    };

    return (
        <PublicLayout auth={auth}>
            <Head title="Seguimiento de Pedido - Melkerven" />

            <section className="py-20 bg-primary-950 min-h-[80vh] relative overflow-hidden">
                <div className="absolute top-0 right-0 size-96 bg-accent-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-accent-500"></div>
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-500">Rastreo en Tiempo Real</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-display font-medium text-white mb-6 tracking-tighter">
                            Seguimiento de <span className="text-accent-500 font-light">Pedido</span>
                        </h1>
                        <p className="text-lg text-primary-300 font-light">
                            Ingrese su número de orden y email para consultar el estado de su compra.
                        </p>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={submit} className="tech-card !p-8 mb-12 bg-primary-900/50 border-white/5">
                        <div className="grid sm:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Número de Orden</label>
                                <input
                                    type="text"
                                    value={data.buy_order}
                                    onChange={e => setData('buy_order', e.target.value)}
                                    className="tech-input w-full"
                                    placeholder="Ej: ORD-1234567890-123"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Email de Compra</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="tech-input w-full"
                                    placeholder="correo@ejemplo.cl"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 transition-all shadow-lg shadow-accent-500/20 active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-xs"
                        >
                            {processing ? 'Buscando...' : 'Consultar Estado'}
                        </button>
                    </form>

                    {/* Order Result */}
                    {order && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-300">
                            {/* Status Timeline */}
                            {order.status !== 'failed' ? (
                                <div className="tech-card !p-8">
                                    <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Estado del Pedido</h3>
                                    <div className="flex items-center justify-between relative">
                                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10"></div>
                                        {getStatusSteps(order.status).map((step, i) => (
                                            <div key={step.key} className="relative flex flex-col items-center z-10">
                                                <div className={`size-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                                                    step.completed
                                                        ? 'bg-accent-500 border-accent-500 shadow-lg shadow-accent-500/30'
                                                        : 'bg-primary-950 border-white/10'
                                                } ${step.current ? 'ring-4 ring-accent-500/20 scale-110' : ''}`}>
                                                    {step.icon}
                                                </div>
                                                <span className={`mt-3 text-[9px] font-bold uppercase tracking-widest ${
                                                    step.completed ? 'text-accent-400' : 'text-primary-600'
                                                }`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="tech-card !p-8 border-red-500/20">
                                    <div className="text-center">
                                        <div className="text-4xl mb-4">❌</div>
                                        <h3 className="text-red-400 font-bold uppercase tracking-widest text-xs">Pago Fallido</h3>
                                        <p className="text-primary-400 text-sm mt-2">El pago de esta orden no fue procesado correctamente.</p>
                                    </div>
                                </div>
                            )}

                            {/* Order Details */}
                            <div className="tech-card !p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{order.buy_order}</h3>
                                        <p className="text-primary-500 text-xs mt-1">{new Date(order.created_at).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    <span className={`px-3 py-1.5 text-[10px] font-bold border rounded-full tracking-widest ${
                                        order.status === 'paid' ? 'text-green-400 border-green-500/20 bg-green-500/5' :
                                        order.status === 'shipped' ? 'text-blue-400 border-blue-500/20 bg-blue-500/5' :
                                        order.status === 'delivered' ? 'text-purple-400 border-purple-500/20 bg-purple-500/5' :
                                        order.status === 'failed' ? 'text-red-400 border-red-500/20 bg-red-500/5' :
                                        'text-yellow-400 border-yellow-500/20 bg-yellow-500/5'
                                    }`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex justify-between p-3 rounded-xl bg-primary-950/50 border border-white/5">
                                            <div>
                                                <span className="text-white text-sm">{item.product_name}</span>
                                                <span className="text-primary-500 text-xs ml-2">×{item.quantity}</span>
                                            </div>
                                            <span className="text-white text-sm font-mono">${Number(item.price * item.quantity).toLocaleString('es-CL')}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-white/5 space-y-2 font-mono text-xs">
                                    <div className="flex justify-between text-primary-500">
                                        <span>Neto</span><span className="text-white">${Number(order.net_amount).toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="flex justify-between text-primary-500">
                                        <span>IVA (19%)</span><span className="text-white">${Number(order.tax_amount).toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="flex justify-between text-primary-500">
                                        <span>Envío</span><span className="text-white">${Number(order.shipping_amount).toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                                        <span className="text-accent-500 font-bold">Total</span>
                                        <span className="text-white font-bold">${Number(order.total_amount).toLocaleString('es-CL')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
