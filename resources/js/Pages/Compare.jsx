import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import ProductGlyph from '@/Components/ProductGlyph';
import { Head, Link, router } from '@inertiajs/react';

export default function Compare({ auth, products }) {
    const labels = [...new Set(products.flatMap((product) => (product.specifications || []).map((specification) => specification.label)))];
    const remove = (productId) => {
        const ids = products.filter((product) => product.id !== productId).map((product) => product.id);
        router.get(ids.length ? route('compare', { ids: ids.join(',') }) : route('catalog'));
    };
    const getValue = (product, label) => (product.specifications || []).find((specification) => specification.label === label)?.value || '—';
    return (
        <PublicLayout auth={auth}><Head><title>Comparador técnico | Melkerven</title></Head>
            <section className="relative min-h-screen overflow-hidden bg-cloud-50 py-16 sm:py-20"><div className="public-network absolute inset-0 opacity-55" /><div className="section-shell relative z-10"><Breadcrumbs items={[{ label: 'Catálogo', href: route('catalog') }, { label: 'Comparador' }]} /><div className="mt-8 max-w-3xl"><div className="public-eyebrow">Análisis técnico</div><h1 className="mt-5 text-5xl font-semibold tracking-[-.06em] text-ink-950 sm:text-6xl">Compare con <span className="text-signal-600">contexto.</span></h1><p className="mt-5 text-lg leading-8 text-ink-600">Revise modelos y especificaciones de referencia antes de iniciar una cotización.</p></div>
                {products.length === 0 ? <div className="mt-12 rounded-3xl border border-ink-100 bg-white px-6 py-16 text-center shadow-sm"><h2 className="text-2xl font-semibold text-ink-950">Sin productos para comparar</h2><p className="mt-3 text-sm text-ink-500">Seleccione hasta cuatro referencias desde el catálogo.</p><Link href={route('catalog')} className="public-button mt-6">Ir al catálogo</Link></div> : <div className="mt-12 overflow-x-auto rounded-3xl border border-ink-100 bg-white shadow-[0_18px_48px_rgba(31,62,82,.08)]"><table className="w-full min-w-[700px] border-collapse"><thead><tr className="border-b border-ink-100"><th className="w-52 px-6 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-ink-400">Especificación</th>{products.map((product) => <th key={product.id} className="min-w-[220px] px-5 py-5 text-left"><div className="relative"><button type="button" onClick={() => remove(product.id)} aria-label={`Quitar ${product.name} del comparador`} className="absolute right-0 top-0 text-ink-300 hover:text-rose-600">×</button><div className="flex h-24 items-center justify-center rounded-xl bg-cloud-50"><ProductGlyph categoryName={product.category?.name || ''} className="h-20 w-28" /></div><p className="mt-4 text-[9px] font-bold uppercase tracking-widest text-signal-700">{product.category?.name || 'OEM'}</p><p className="mt-2 text-base font-semibold leading-5 text-ink-950">{product.name}</p></div></th>)}</tr></thead><tbody>{labels.map((label) => <tr key={label} className="border-b border-ink-100 last:border-0"><th className="bg-cloud-50/50 px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-ink-500">{label}</th>{products.map((product) => <td key={product.id} className="px-5 py-4 text-sm leading-6 text-ink-700">{getValue(product, label)}</td>)}</tr>)}</tbody></table></div>}
            </div></section>
        </PublicLayout>
    );
}
