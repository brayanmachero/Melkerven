import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ order }) {
    const getStatusColor = (status) => {
        const colors = {
            paid: 'text-green-400 bg-green-500/5 border-green-500/20',
            pending: 'text-yellow-400 bg-yellow-500/5 border-yellow-500/20',
            shipped: 'text-blue-400 bg-blue-500/5 border-blue-500/20',
            delivered: 'text-purple-400 bg-purple-500/5 border-purple-500/20',
            failed: 'text-red-400 bg-red-500/5 border-red-500/20',
        };
        return colors[status] || 'text-primary-400 bg-primary-500/5 border-primary-500/20';
    };

    const getStatusLabel = (status) => {
        const labels = { paid: 'Pagado', pending: 'Pendiente', shipped: 'Enviado', delivered: 'Entregado', failed: 'Fallido' };
        return labels[status] || status;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-px w-8 bg-accent-500"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-500">Detalle de Pedido</span>
                        </div>
                        <h2 className="text-3xl font-display font-medium text-white tracking-tight">
                            Orden <span className="text-accent-500 font-mono">#{String(order.id).padStart(5, '0')}</span>
                        </h2>
                    </div>
                    <Link href={route('my-orders.index')} className="text-[10px] font-bold uppercase tracking-widest text-primary-400 hover:text-accent-500 transition-colors">
                        ← Volver a Mis Pedidos
                    </Link>
                </div>
            }
        >
            <Head title={`Pedido #${String(order.id).padStart(5, '0')}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Order Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Order Status Timeline */}
                            <div className="tech-card !p-8">
                                <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                    <span className="size-5 bg-accent-500 rounded flex items-center justify-center text-[10px]">⚡</span>
                                    Estado del Pedido
                                </h3>
                                <div className="flex items-center justify-between relative">
                                    {/* Progress Line */}
                                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-primary-800"></div>
                                    <div className="absolute top-5 left-0 h-0.5 bg-accent-500 transition-all duration-700" style={{
                                        width: order.status === 'pending' ? '0%' :
                                               order.status === 'paid' ? '33%' :
                                               order.status === 'shipped' ? '66%' :
                                               order.status === 'delivered' ? '100%' :
                                               order.status === 'failed' ? '0%' : '0%'
                                    }}></div>
                                    {[
                                        { key: 'pending', label: 'Pendiente', icon: '⏳' },
                                        { key: 'paid', label: 'Pagado', icon: '✓' },
                                        { key: 'shipped', label: 'Enviado', icon: '🚚' },
                                        { key: 'delivered', label: 'Entregado', icon: '📦' },
                                    ].map((step, i) => {
                                        const statusOrder = ['pending', 'paid', 'shipped', 'delivered'];
                                        const currentIndex = statusOrder.indexOf(order.status);
                                        const stepIndex = statusOrder.indexOf(step.key);
                                        const isActive = stepIndex <= currentIndex && order.status !== 'failed';
                                        const isCurrent = step.key === order.status;
                                        return (
                                            <div key={step.key} className="flex flex-col items-center relative z-10">
                                                <div className={`size-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 ${
                                                    isCurrent ? 'bg-accent-500 border-accent-500 text-white shadow-lg shadow-accent-500/30 scale-110' :
                                                    isActive ? 'bg-accent-500/20 border-accent-500 text-accent-400' :
                                                    'bg-primary-900 border-primary-700 text-primary-600'
                                                }`}>
                                                    {step.icon}
                                                </div>
                                                <span className={`mt-3 text-[9px] font-bold uppercase tracking-widest ${isCurrent ? 'text-accent-400' : isActive ? 'text-primary-300' : 'text-primary-600'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                {order.status === 'failed' && (
                                    <div className="mt-6 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-center">
                                        <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Pago Rechazado / Fallido</span>
                                    </div>
                                )}
                            </div>

                            {/* Items */}
                            <div className="tech-card !p-8">
                                <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                    <span className="size-5 bg-accent-500 rounded flex items-center justify-center text-[10px]">1</span>
                                    Productos del Pedido
                                </h3>
                                <div className="space-y-4">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-primary-950/50 border border-white/5">
                                            <div>
                                                <h4 className="text-white font-bold text-sm">{item.product?.name || item.product_name || 'Producto'}</h4>
                                                <p className="text-[10px] text-primary-500 uppercase tracking-widest mt-1">
                                                    Cant: {item.quantity} x ${new Intl.NumberFormat('es-CL').format(item.unit_price || item.price)}
                                                </p>
                                            </div>
                                            <span className="text-white font-display font-medium text-sm">
                                                ${new Intl.NumberFormat('es-CL').format((item.unit_price || item.price) * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="tech-card !p-8">
                                <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                    <span className="size-5 bg-accent-500 rounded flex items-center justify-center text-[10px]">2</span>
                                    Información de Despacho
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 block mb-1">Destinatario</span>
                                        <span className="text-white text-sm">{order.customer_name}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 block mb-1">RUT</span>
                                        <span className="text-white text-sm font-mono">{order.customer_rut}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 block mb-1">Email</span>
                                        <span className="text-white text-sm">{order.customer_email}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 block mb-1">Teléfono</span>
                                        <span className="text-white text-sm">{order.customer_phone}</span>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 block mb-1">Dirección</span>
                                        <span className="text-white text-sm">{order.shipping_address}, {order.shipping_commune}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="space-y-6">
                            <div className="tech-card !p-8 bg-primary-900/80 border-accent-500/10">
                                <h3 className="text-xl font-display font-medium text-white mb-6 tracking-tight">Resumen</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-primary-400">Subtotal Neto</span>
                                        <span className="text-white font-bold">${new Intl.NumberFormat('es-CL').format(order.net_amount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-primary-400 italic">IVA (19%)</span>
                                        <span className="text-white font-bold">${new Intl.NumberFormat('es-CL').format(order.tax_amount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-4">
                                        <span className="text-primary-400">Envío</span>
                                        <span className="text-accent-500 font-bold">${new Intl.NumberFormat('es-CL').format(order.shipping_amount)}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-2">
                                        <span className="text-sm text-white font-bold uppercase tracking-widest">Total</span>
                                        <span className="text-2xl font-display font-medium text-white">${new Intl.NumberFormat('es-CL').format(order.total_amount)}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Estado</span>
                                        <span className={`px-3 py-1.5 text-[10px] font-bold border rounded-full tracking-widest ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 mt-4 border-t border-white/5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Documento</span>
                                        <span className="text-xs text-white font-bold uppercase">{order.document_type}</span>
                                    </div>
                                </div>

                                <div className="pt-4 mt-4 border-t border-white/5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Fecha</span>
                                        <span className="text-xs text-white">{new Date(order.created_at).toLocaleDateString('es-CL')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
