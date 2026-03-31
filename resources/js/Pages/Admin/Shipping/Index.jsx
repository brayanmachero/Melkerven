import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

const ShippingRateRow = ({ rate }) => {
    const { data, setData, put, processing } = useForm({
        base_cost: rate.base_cost,
        estimated_days: rate.estimated_days,
        allow_shipping: rate.allow_shipping,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.shipping.update', rate.id), {
            preserveScroll: true,
        });
    };

    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
            <td className="py-4">
                <span className="text-sm font-medium text-white">{rate.region_name}</span>
            </td>
            <td className="py-4">
                <input
                    type="number"
                    value={data.base_cost}
                    onChange={(e) => setData('base_cost', e.target.value)}
                    className="bg-primary-950 border-white/10 rounded-lg text-white text-sm focus:ring-accent-500 focus:border-accent-500 w-32"
                />
            </td>
            <td className="py-4">
                <input
                    type="number"
                    value={data.estimated_days}
                    onChange={(e) => setData('estimated_days', e.target.value)}
                    className="bg-primary-950 border-white/10 rounded-lg text-white text-sm focus:ring-accent-500 focus:border-accent-500 w-24"
                />
            </td>
            <td className="py-4">
                <button
                    onClick={() => setData('allow_shipping', !data.allow_shipping)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${data.allow_shipping
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                >
                    {data.allow_shipping ? 'Habilitado' : 'Suspendido'}
                </button>
            </td>
            <td className="py-4 text-right">
                <button
                    onClick={submit}
                    disabled={processing}
                    className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-accent-500/10 active:scale-95 disabled:opacity-50"
                >
                    {processing ? '...' : 'Actualizar'}
                </button>
            </td>
        </tr>
    );
};

export default function Index({ auth, shippingRates }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-display font-medium text-2xl text-white tracking-tight">Logística y <span className="text-accent-500">Fletes</span></h2>}
        >
            <Head title="Gestión de Envíos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="tech-card overflow-hidden">
                        <div className="p-8 border-b border-white/5 bg-white/5">
                            <h3 className="text-lg font-bold text-white mb-2">Configuración Regional (Chile)</h3>
                            <p className="text-sm text-primary-400 font-light">Establece costos base y disponibilidad por zona geográfica.</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-primary-900/50">
                                        <th className="py-4 px-8 text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500">Región</th>
                                        <th className="py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500">Costo Base (CLP)</th>
                                        <th className="py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500">Días Est.</th>
                                        <th className="py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500">Estado</th>
                                        <th className="py-4 px-8 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="px-8">
                                    {shippingRates.map((rate) => (
                                        <ShippingRateRow key={rate.id} rate={rate} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
