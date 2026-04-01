import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Index({ auth, coupons }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        type: 'percentage',
        value: '',
        min_amount: '',
        max_uses: '',
        expires_at: '',
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.coupons.store'), { onSuccess: () => reset() });
    };

    const toggleActive = (coupon) => {
        router.patch(route('admin.coupons.update', coupon.id), { is_active: !coupon.is_active }, { preserveScroll: true });
    };

    const deleteCoupon = (coupon) => {
        if (confirm('¿Eliminar este cupón?')) {
            router.delete(route('admin.coupons.destroy', coupon.id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-3xl font-display font-medium text-white tracking-tight">
                    Cupones de <span className="text-accent-500">Descuento</span>
                </h2>
            }
        >
            <Head title="Cupones - Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 relative z-10">
                    {/* Create Coupon */}
                    <div className="tech-card !p-8 mb-8">
                        <h3 className="text-lg font-bold text-white mb-6">Crear Nuevo Cupón</h3>
                        <form onSubmit={submit} className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-2">Código</label>
                                <input
                                    type="text"
                                    className="w-full bg-primary-950 border-white/10 rounded-xl px-4 py-3 text-white text-sm uppercase focus:border-accent-500 focus:ring-accent-500/20"
                                    placeholder="MELK2026"
                                    value={data.code}
                                    onChange={e => setData('code', e.target.value.toUpperCase())}
                                />
                                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-2">Tipo</label>
                                <select
                                    className="w-full bg-primary-950 border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-500 focus:ring-accent-500/20"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                >
                                    <option value="percentage">Porcentaje (%)</option>
                                    <option value="fixed">Monto Fijo ($)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-2">Valor</label>
                                <input
                                    type="number"
                                    className="w-full bg-primary-950 border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-500 focus:ring-accent-500/20"
                                    placeholder={data.type === 'percentage' ? '10' : '5000'}
                                    value={data.value}
                                    onChange={e => setData('value', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-2">Monto Mín.</label>
                                <input
                                    type="number"
                                    className="w-full bg-primary-950 border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-500 focus:ring-accent-500/20"
                                    placeholder="Opcional"
                                    value={data.min_amount}
                                    onChange={e => setData('min_amount', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-2">Vence</label>
                                <input
                                    type="date"
                                    className="w-full bg-primary-950 border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-500 focus:ring-accent-500/20"
                                    value={data.expires_at}
                                    onChange={e => setData('expires_at', e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="h-[46px] bg-accent-500 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-accent-600 transition-all disabled:opacity-50"
                            >
                                Crear Cupón
                            </button>
                        </form>
                    </div>

                    {/* Coupons List */}
                    <div className="tech-card !p-0 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-primary-900">
                                <tr>
                                    <th className="text-[9px] font-bold uppercase tracking-widest text-primary-500 py-4 px-6 text-left">Código</th>
                                    <th className="text-[9px] font-bold uppercase tracking-widest text-primary-500 py-4 px-6 text-left">Tipo</th>
                                    <th className="text-[9px] font-bold uppercase tracking-widest text-primary-500 py-4 px-6 text-right">Valor</th>
                                    <th className="text-[9px] font-bold uppercase tracking-widest text-primary-500 py-4 px-6 text-right">Mín.</th>
                                    <th className="text-[9px] font-bold uppercase tracking-widest text-primary-500 py-4 px-6 text-center">Usos</th>
                                    <th className="text-[9px] font-bold uppercase tracking-widest text-primary-500 py-4 px-6 text-center">Vence</th>
                                    <th className="text-[9px] font-bold uppercase tracking-widest text-primary-500 py-4 px-6 text-center">Estado</th>
                                    <th className="text-[9px] font-bold uppercase tracking-widest text-primary-500 py-4 px-6 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.length === 0 && (
                                    <tr><td colSpan="8" className="text-center py-12 text-primary-500 text-sm">Sin cupones creados</td></tr>
                                )}
                                {coupons.map(coupon => (
                                    <tr key={coupon.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6 text-sm text-white font-mono font-bold">{coupon.code}</td>
                                        <td className="py-4 px-6 text-xs text-primary-300">{coupon.type === 'percentage' ? 'Porcentaje' : 'Monto Fijo'}</td>
                                        <td className="py-4 px-6 text-sm text-white text-right font-mono">
                                            {coupon.type === 'percentage' ? `${coupon.value}%` : `$${new Intl.NumberFormat('es-CL').format(coupon.value)}`}
                                        </td>
                                        <td className="py-4 px-6 text-xs text-primary-400 text-right font-mono">
                                            {coupon.min_amount ? `$${new Intl.NumberFormat('es-CL').format(coupon.min_amount)}` : '-'}
                                        </td>
                                        <td className="py-4 px-6 text-xs text-primary-300 text-center">{coupon.used_count}{coupon.max_uses ? `/${coupon.max_uses}` : ''}</td>
                                        <td className="py-4 px-6 text-xs text-primary-400 text-center">{coupon.expires_at || 'Sin límite'}</td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => toggleActive(coupon)}
                                                className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-md transition-colors ${coupon.is_active ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}
                                            >
                                                {coupon.is_active ? 'Activo' : 'Inactivo'}
                                            </button>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => deleteCoupon(coupon)}
                                                className="text-[9px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
