import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Show({ order }) {
    const { data, setData, patch, processing } = useForm({
        status: order.status
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.orders.updateStatus', order.id));
    };

    const statusOptions = [
        { value: 'pending', label: 'Pendiente' },
        { value: 'paid', label: 'Pagado' },
        { value: 'failed', label: 'Fallido' },
        { value: 'shipped', label: 'Enviado' },
        { value: 'delivered', label: 'Entregado' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link href={route('admin.orders.index')} className="text-accent-500 hover:text-accent-400 transition-colors">
                                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <div className="h-px w-8 bg-accent-500"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-500">Detalle Transaccional</span>
                        </div>
                        <h2 className="text-4xl font-display font-medium text-white tracking-tighter">
                            Orden <span className="text-mono">#ORD-{String(order.id).padStart(5, '0')}</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <form onSubmit={submit} className="flex items-center gap-3">
                            <select
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                className="tech-input !py-2 !text-[10px]"
                            >
                                {statusOptions.map(opt => (
                                    <option key={opt.value} value={opt.value} className="bg-primary-900 border-none">{opt.label}</option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-accent-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-accent-600 transition-all disabled:opacity-50"
                            >
                                Actualizar Estado
                            </button>
                        </form>
                    </div>
                </div>
            }
        >
            <Head title={`Orden #ORD-${order.id} - Admin`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Summary side */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Products Section */}
                            <div className="tech-card overflow-hidden">
                                <div className="p-6 border-b border-white/5 bg-white/5">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white">Ítems de Suministro</h3>
                                </div>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-500">Producto</th>
                                            <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-500 text-center">Cantidad</th>
                                            <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-500 text-right">Precio Unitario</th>
                                            <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-primary-500 text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {order.items.map((item) => (
                                            <tr key={item.id} className="text-primary-300">
                                                <td className="p-6">
                                                    <div className="font-medium text-white">{item.product_name}</div>
                                                    <div className="text-[10px] text-primary-600 font-mono mt-0.5">REF: {item.product_id || 'N/A'}</div>
                                                </td>
                                                <td className="p-6 text-center font-mono">x{item.quantity}</td>
                                                <td className="p-6 text-right font-mono">${Number(item.price).toLocaleString('es-CL')}</td>
                                                <td className="p-6 text-right font-bold text-white font-mono">
                                                    ${(Number(item.price) * item.quantity).toLocaleString('es-CL')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Customer & Shipping Data */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="tech-card p-8">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-accent-500 mb-6 flex items-center gap-2">
                                        <div className="size-1.5 bg-accent-500 rounded-full animate-pulse"></div>
                                        Datos del Cliente
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600 block mb-1">Nombre</label>
                                            <div className="text-white font-medium">{order.customer_name}</div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600 block mb-1">RUT</label>
                                            <div className="text-white font-mono uppercase">{order.customer_rut}</div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600 block mb-1">Email de Contacto</label>
                                            <div className="text-white">{order.customer_email}</div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600 block mb-1">Teléfono</label>
                                            <div className="text-white font-mono">{order.customer_phone}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tech-card p-8">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-6 flex items-center gap-2">
                                        <div className="size-1.5 bg-blue-400 rounded-full"></div>
                                        Información de Despacho
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600 block mb-1">Comuna / Región</label>
                                            <div className="text-white">
                                                {order.shipping_commune} <span className="text-primary-500 ml-2">ID Región: {order.shipping_region_id}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600 block mb-1">Dirección de Entrega</label>
                                            <div className="text-white italic">"{order.shipping_address}"</div>
                                        </div>
                                        <div className="pt-4 mt-4 border-t border-white/5">
                                            <div className="flex justify-between items-center bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Costo de Envío</span>
                                                <span className="text-sm font-bold text-white font-mono">${Number(order.shipping_amount).toLocaleString('es-CL')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Totals & Document Side */}
                        <div className="space-y-8">
                            <div className="tech-card p-8 bg-primary-900 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                    <span className={`px-2 py-1 text-[8px] font-bold border rounded uppercase tracking-[0.3em] ${order.document_type === 'factura' ? 'border-orange-500/30 text-orange-500' : 'border-blue-500/30 text-blue-500'}`}>
                                        {order.document_type}
                                    </span>
                                </div>

                                <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-8">Desglose Fiscal</h3>

                                <div className="space-y-4 font-mono">
                                    <div className="flex justify-between text-xs text-primary-500">
                                        <span>MONTO NETO:</span>
                                        <span className="text-white">${Number(order.net_amount).toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-primary-500">
                                        <span>IVA (19%):</span>
                                        <span className="text-white">${Number(order.tax_amount).toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-primary-500">
                                        <span>ENVÍO:</span>
                                        <span className="text-white">${Number(order.shipping_amount).toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-end">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent-500">Total Transacción</span>
                                        <span className="text-2xl font-bold text-white">${Number(order.total_amount).toLocaleString('es-CL')}</span>
                                    </div>
                                </div>
                            </div>

                            {order.document_type === 'factura' && (
                                <div className="tech-card p-8 border-orange-500/10">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-6">Detalle de Facturación</h3>
                                    <div className="space-y-4 text-xs">
                                        <div>
                                            <span className="text-primary-600 block uppercase tracking-widest mb-1">Razón Social:</span>
                                            <span className="text-white font-medium">{order.business_name}</span>
                                        </div>
                                        <div>
                                            <span className="text-primary-600 block uppercase tracking-widest mb-1">RUT Empresa:</span>
                                            <span className="text-white font-mono uppercase">{order.business_rut}</span>
                                        </div>
                                        <div>
                                            <span className="text-primary-600 block uppercase tracking-widest mb-1">Giro:</span>
                                            <span className="text-white italic">{order.business_giro}</span>
                                        </div>
                                        <div>
                                            <span className="text-primary-600 block uppercase tracking-widest mb-1">Dirección Legal:</span>
                                            <span className="text-white">{order.business_address}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {order.webpay_token && (
                                <div className="tech-card p-6 bg-black/40">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary-600 mb-4">Webpay Logs</h3>
                                    <div className="space-y-2 font-mono text-[9px] break-all text-primary-500">
                                        <p><span className="text-accent-500">TOKEN:</span> {order.webpay_token}</p>
                                        <p><span className="text-accent-500">BUY_ORDER:</span> {order.buy_order}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
