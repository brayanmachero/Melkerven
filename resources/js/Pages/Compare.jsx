import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Head, Link, router } from '@inertiajs/react';

export default function Compare({ auth, products }) {
    const maxSpecs = new Set();
    products.forEach(p => {
        if (p.specifications) {
            Object.keys(p.specifications).forEach(k => maxSpecs.add(k));
        }
    });
    const specKeys = Array.from(maxSpecs);

    const removeFromCompare = (productId) => {
        const ids = products.filter(p => p.id !== productId).map(p => p.id);
        if (ids.length === 0) {
            router.get(route('catalog'));
        } else {
            router.get(route('compare', { ids: ids.join(',') }));
        }
    };

    return (
        <PublicLayout auth={auth}>
            <Head title="Comparador de Productos - Melkerven" />

            <section className="py-20 bg-primary-950 min-h-screen relative overflow-hidden">
                <div className="absolute top-0 right-0 size-96 bg-accent-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <Breadcrumbs items={[{ label: 'Catálogo', href: route('catalog') }, { label: 'Comparador' }]} />

                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-accent-500"></div>
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-500">Análisis Técnico</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-display font-medium text-white mb-4 tracking-tighter">
                            Comparador de <span className="text-accent-500 font-light">Hardware</span>
                        </h1>
                        <p className="text-lg text-primary-300 font-light">
                            Compare especificaciones lado a lado para tomar la mejor decisión de inversión TI.
                        </p>
                    </div>

                    {products.length === 0 ? (
                        <div className="tech-card text-center py-20">
                            <div className="text-6xl mb-6 opacity-30">⚖️</div>
                            <h3 className="text-2xl font-display text-white mb-4">Sin productos para comparar</h3>
                            <p className="text-primary-400 mb-8 font-light">Seleccione productos desde el catálogo para iniciar la comparación.</p>
                            <Link href={route('catalog')} className="btn-premium bg-accent-500 text-white hover:bg-accent-600 px-8">
                                Ir al Catálogo
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px]">
                                {/* Product Images & Names */}
                                <thead>
                                    <tr>
                                        <th className="w-48 p-4 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-primary-500 border-b border-white/5">
                                            Especificación
                                        </th>
                                        {products.map(product => (
                                            <th key={product.id} className="p-4 border-b border-white/5 min-w-[220px]">
                                                <div className="flex flex-col items-center text-center">
                                                    <button
                                                        onClick={() => removeFromCompare(product.id)}
                                                        className="self-end text-primary-600 hover:text-red-400 transition-colors mb-2"
                                                        title="Quitar del comparador"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                    <div className="size-24 bg-primary-900 rounded-xl border border-white/5 overflow-hidden mb-3">
                                                        {product.image_url ? (
                                                            <img src={product.image_url} alt={product.name} className="size-full object-cover" />
                                                        ) : (
                                                            <div className="size-full flex items-center justify-center text-3xl opacity-20">📦</div>
                                                        )}
                                                    </div>
                                                    <Link href={`/catalog/${product.slug}`} className="text-sm font-bold text-white hover:text-accent-400 transition-colors line-clamp-2">
                                                        {product.name}
                                                    </Link>
                                                    <span className="text-[10px] text-accent-400 mt-1">{product.category?.name}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Price Row */}
                                    <tr className="bg-primary-900/50">
                                        <td className="p-4 text-xs font-bold uppercase tracking-widest text-primary-400">Precio</td>
                                        {products.map(product => (
                                            <td key={product.id} className="p-4 text-center">
                                                <span className="text-xl font-display font-medium text-white">
                                                    {product.price > 0 ? `$${new Intl.NumberFormat('es-CL').format(product.price)}` : 'Consultar'}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Stock Row */}
                                    <tr>
                                        <td className="p-4 text-xs font-bold uppercase tracking-widest text-primary-400">Stock</td>
                                        {products.map(product => (
                                            <td key={product.id} className="p-4 text-center">
                                                <span className={`text-sm font-bold ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {product.stock > 0 ? `${product.stock} unidades` : 'Sin stock'}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Warranty Row */}
                                    <tr className="bg-primary-900/50">
                                        <td className="p-4 text-xs font-bold uppercase tracking-widest text-primary-400">Garantía</td>
                                        {products.map(product => (
                                            <td key={product.id} className="p-4 text-center text-sm text-primary-300">
                                                {product.warranty || 'Estándar'}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Category Row */}
                                    <tr>
                                        <td className="p-4 text-xs font-bold uppercase tracking-widest text-primary-400">Categoría</td>
                                        {products.map(product => (
                                            <td key={product.id} className="p-4 text-center text-sm text-primary-300">
                                                {product.category?.name || '—'}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Dynamic Specs */}
                                    {specKeys.map((key, i) => (
                                        <tr key={key} className={i % 2 === 0 ? 'bg-primary-900/50' : ''}>
                                            <td className="p-4 text-xs font-bold uppercase tracking-widest text-primary-400">{key}</td>
                                            {products.map(product => (
                                                <td key={product.id} className="p-4 text-center text-sm text-primary-300">
                                                    {product.specifications?.[key] || '—'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}

                                    {/* Actions Row */}
                                    <tr className="border-t border-white/10">
                                        <td className="p-4"></td>
                                        {products.map(product => (
                                            <td key={product.id} className="p-4 text-center">
                                                <div className="flex flex-col gap-2">
                                                    <Link
                                                        href={`/catalog/${product.slug}`}
                                                        className="px-4 py-2.5 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                                                    >
                                                        Ver Ficha Completa
                                                    </Link>
                                                    {product.is_quotable || product.price == 0 ? (
                                                        <Link
                                                            href={route('contact', { product: product.name })}
                                                            className="px-4 py-2.5 bg-white/5 border border-white/10 text-accent-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-accent-500/10 transition-all"
                                                        >
                                                            Cotizar
                                                        </Link>
                                                    ) : product.stock > 0 ? (
                                                        <button
                                                            onClick={() => router.post(route('cart.add', product.id), {}, { preserveScroll: true })}
                                                            className="px-4 py-2.5 bg-accent-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-accent-600 transition-all"
                                                        >
                                                            Añadir al Carrito
                                                        </button>
                                                    ) : null}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Add more products link */}
                    {products.length > 0 && products.length < 4 && (
                        <div className="mt-8 text-center">
                            <Link
                                href={route('catalog')}
                                className="text-xs font-bold uppercase tracking-widest text-primary-500 hover:text-accent-400 transition-colors"
                            >
                                + Agregar más productos al comparador
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
