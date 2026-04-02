import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function ReturnsCreate({ orders }) {
    const { data, setData, post, processing, errors } = useForm({
        order_id: '', order_item_id: '', type: 'return', reason: '',
    });

    const selectedOrder = orders.find(o => o.id == data.order_id);

    const submit = (e) => {
        e.preventDefault();
        post(route('returns.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-display font-bold text-white">Nueva Solicitud de Devolución / Garantía</h2>}>
            <Head title="Nueva Solicitud" />
            <div className="py-8 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={submit} className="bg-primary-900/50 border border-white/10 rounded-2xl p-6 space-y-6">
                    {/* Order Selection */}
                    <div>
                        <label className="block text-xs text-primary-400 mb-2 uppercase tracking-widest font-bold">Pedido</label>
                        <select value={data.order_id} onChange={e => { setData('order_id', e.target.value); setData('order_item_id', ''); }}
                            className="w-full bg-primary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent-500/50 focus:outline-none" required>
                            <option value="">Seleccionar pedido...</option>
                            {orders.map(order => (
                                <option key={order.id} value={order.id}>
                                    Pedido #{order.buy_order} — {new Date(order.created_at).toLocaleDateString('es-CL')}
                                </option>
                            ))}
                        </select>
                        {errors.order_id && <p className="mt-1 text-red-400 text-xs">{errors.order_id}</p>}
                    </div>

                    {/* Product Selection (optional) */}
                    {selectedOrder && selectedOrder.items?.length > 0 && (
                        <div>
                            <label className="block text-xs text-primary-400 mb-2 uppercase tracking-widest font-bold">Producto (opcional)</label>
                            <select value={data.order_item_id} onChange={e => setData('order_item_id', e.target.value)}
                                className="w-full bg-primary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent-500/50 focus:outline-none">
                                <option value="">Todo el pedido</option>
                                {selectedOrder.items.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.product?.name} (x{item.quantity})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Type */}
                    <div>
                        <label className="block text-xs text-primary-400 mb-2 uppercase tracking-widest font-bold">Tipo de Solicitud</label>
                        <div className="flex gap-4">
                            {[
                                { value: 'return', label: 'Devolución', desc: 'Quiero devolver el producto' },
                                { value: 'warranty', label: 'Garantía', desc: 'El producto presenta fallas' },
                            ].map(opt => (
                                <label key={opt.value}
                                    className={`flex-1 cursor-pointer p-4 rounded-xl border transition ${data.type === opt.value ? 'border-accent-500/50 bg-accent-500/5' : 'border-white/10 bg-primary-800/30 hover:bg-white/5'}`}>
                                    <input type="radio" value={opt.value} checked={data.type === opt.value}
                                        onChange={e => setData('type', e.target.value)} className="sr-only" />
                                    <span className="text-white font-bold text-sm block">{opt.label}</span>
                                    <span className="text-primary-500 text-xs">{opt.desc}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-xs text-primary-400 mb-2 uppercase tracking-widest font-bold">Motivo</label>
                        <textarea value={data.reason} onChange={e => setData('reason', e.target.value)} rows={4}
                            placeholder="Describe detalladamente el motivo de tu solicitud..."
                            className="w-full bg-primary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent-500/50 focus:outline-none placeholder:text-primary-600 resize-none" required />
                        {errors.reason && <p className="mt-1 text-red-400 text-xs">{errors.reason}</p>}
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full py-3 bg-accent-500 text-white rounded-xl text-sm font-bold hover:bg-accent-600 transition disabled:opacity-50">
                        {processing ? 'Enviando...' : 'Enviar Solicitud'}
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
