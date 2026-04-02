import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function ProductShow({ auth, product, relatedProducts }) {
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [activeImage, setActiveImage] = useState(product.image_url);
    const [notifyEmail, setNotifyEmail] = useState(auth?.user?.email || '');
    const [notifySubmitted, setNotifySubmitted] = useState(false);

    // Build gallery: main image + additional images
    const galleryImages = [
        product.image_url,
        ...(product.images || []).map(img => `/storage/${img}`)
    ].filter(Boolean);

    const addToCart = () => {
        setAdding(true);
        router.post(route('cart.add', product.id), { quantity }, {
            preserveScroll: true,
            onFinish: () => setAdding(false),
        });
    };
    return (
        <PublicLayout auth={auth}>
            <Head>
                <title>{`${product.name} - Melkerven Hardware`}</title>
                <meta name="description" content={product.description ? product.description.substring(0, 150) + '...' : 'Componente de hardware TI de grado industrial.'} />
                <meta property="og:title" content={`${product.name} - Melkerven`} />
                <meta property="og:description" content={product.description ? product.description.substring(0, 150) : 'Hardware TI de grado industrial.'} />
                {product.image_url && <meta property="og:image" content={product.image_url} />}
                <meta property="og:type" content="product" />
            </Head>

            <section className="py-20 bg-primary-950 min-h-screen relative overflow-hidden">
                {/* Visual Background Accents */}
                <div className="absolute top-0 right-0 size-[800px] bg-accent-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 size-[600px] bg-primary-400/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <Breadcrumbs items={[
                        { label: 'Catálogo', href: route('catalog') },
                        { label: product.category?.name || 'OEM', href: route('catalog', { category: product.category?.id }) },
                        { label: product.name },
                    ]} />

                    <div className="grid lg:grid-cols-2 gap-20 items-start">
                        {/* Image Gallery Section */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-primary-900 rounded-[3rem] border border-white/5 ring-1 ring-white/10 p-10 flex items-center justify-center relative overflow-hidden group shadow-3xl">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                                {activeImage ? (
                                    <img
                                        src={activeImage}
                                        alt={product.name}
                                        className="size-full object-contain grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                        loading="lazy"
                                    />
                                ) : (
                                    <span className="text-9xl opacity-10">📦</span>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {galleryImages.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {galleryImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(img)}
                                            className={`flex-shrink-0 size-20 rounded-xl border-2 overflow-hidden transition-all ${activeImage === img ? 'border-accent-500 ring-2 ring-accent-500/30' : 'border-white/10 hover:border-white/30'}`}
                                        >
                                            <img src={img} alt="" className="size-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Specs Quick Look */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="tech-card !p-6 border-white/5 bg-primary-900/50">
                                    <div className="text-[9px] font-bold text-primary-500 uppercase tracking-widest mb-2">Stock</div>
                                    <div className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                        <div className={`size-1.5 rounded-full shadow-lg ${product.stock > 0 ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'}`}></div>
                                        {product.stock > 0 ? `${product.stock} uds` : 'Agotado'}
                                    </div>
                                </div>
                                <div className="tech-card !p-6 border-white/5 bg-primary-900/50">
                                    <div className="text-[9px] font-bold text-primary-500 uppercase tracking-widest mb-2">Garantía</div>
                                    <div className="text-white text-xs font-bold uppercase tracking-widest">{product.warranty || '12 Meses'}</div>
                                </div>
                                <div className="tech-card !p-6 border-white/5 bg-primary-900/50">
                                    <div className="text-[9px] font-bold text-primary-500 uppercase tracking-widest mb-2">Soporte</div>
                                    <div className="text-white text-xs font-bold uppercase tracking-widest">24/7 L1</div>
                                </div>
                            </div>
                        </div>

                        {/* Product Info Section */}
                        <div className="flex flex-col">
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-px w-8 bg-accent-500"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-500">Hardware Profesional</span>
                                </div>
                                <h1 className="text-5xl sm:text-6xl font-display font-medium text-white mb-6 tracking-tighter leading-tight italic">
                                    {product.name}
                                </h1>
                                <p className="text-xl text-primary-300 font-light leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Main CTA Section */}
                            <div className="tech-card !p-12 mb-12 border-accent-500/20 bg-primary-900/80 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-primary-500 font-bold uppercase tracking-widest mb-3">Precio</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-display font-medium text-white tracking-tighter">
                                                {product.price > 0 ? `$${new Intl.NumberFormat('es-CL').format(product.price)}` : 'Sujeto a Cotización'}
                                            </span>
                                            {product.price > 0 && <span className="text-xs text-primary-500 font-bold uppercase">CLP + IVA</span>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-primary-500 font-bold uppercase tracking-widest mb-3">Disponibilidad Actual</span>
                                        <span className={`text-xl font-bold ${product.stock > 5 ? 'text-white' : 'text-orange-400'}`}>
                                            {product.stock} Unidades
                                        </span>
                                    </div>
                                </div>

                                {product.volume_prices && product.volume_prices.length > 0 && (
                                    <div className="mt-6 border-t border-white/5 pt-6">
                                        <span className="text-[10px] text-primary-500 font-bold uppercase tracking-widest mb-3 block">Precios por Volumen</span>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                                            {product.volume_prices.map((tier, i) => (
                                                <div key={i} className={`rounded-lg border px-3 py-2 text-center ${quantity >= tier.min_quantity && (!tier.max_quantity || quantity <= tier.max_quantity) ? 'border-accent-500/50 bg-accent-500/10' : 'border-white/10 bg-white/5'}`}>
                                                    <div className="text-[10px] text-primary-400">{tier.min_quantity}{tier.max_quantity ? `-${tier.max_quantity}` : '+'} uds</div>
                                                    <div className="text-sm font-bold text-white">${new Intl.NumberFormat('es-CL').format(tier.price)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-12 grid sm:grid-cols-2 gap-4">
                                    {product.is_quotable || product.price == 0 ? (
                                        <Link
                                            href={route('contact', { product: product.name })}
                                            className="btn-premium bg-white/5 border border-white/10 text-white hover:bg-white/10 py-5 text-[10px] font-bold uppercase tracking-[0.3em]"
                                        >
                                            Solicitar Cotización Técnica
                                        </Link>
                                    ) : (
                                        <div className="w-full flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Cantidad:</span>
                                                <div className="flex items-center gap-1">
                                                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="size-10 rounded-lg bg-primary-950 border border-white/10 text-primary-400 hover:text-white hover:border-accent-500/30 flex items-center justify-center transition-all font-bold">−</button>
                                                    <span className="w-12 text-center text-white font-bold">{quantity}</span>
                                                    <button type="button" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="size-10 rounded-lg bg-primary-950 border border-white/10 text-primary-400 hover:text-white hover:border-accent-500/30 flex items-center justify-center transition-all font-bold">+</button>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addToCart}
                                                disabled={adding || product.stock <= 0}
                                                className="w-full btn-premium bg-accent-500 text-white hover:bg-accent-600 py-5 text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl shadow-accent-500/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                {adding ? 'Agregando...' : product.stock <= 0 ? 'Sin Stock' : 'Añadir al Carrito'}
                                            </button>
                                            {product.stock <= 0 && (
                                                <div className="mt-3">
                                                    {notifySubmitted ? (
                                                        <p className="text-green-400 text-xs text-center">Te notificaremos cuando haya stock.</p>
                                                    ) : (
                                                        <form onSubmit={(e) => {
                                                            e.preventDefault();
                                                            router.post(route('stock.notify'), { product_id: product.id, email: notifyEmail }, {
                                                                preserveScroll: true,
                                                                onSuccess: () => setNotifySubmitted(true),
                                                            });
                                                        }} className="flex gap-2">
                                                            <input
                                                                type="email"
                                                                value={notifyEmail}
                                                                onChange={e => setNotifyEmail(e.target.value)}
                                                                placeholder="Tu email"
                                                                required
                                                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/40"
                                                            />
                                                            <button type="submit" className="bg-accent-500/20 border border-accent-500/30 text-accent-400 hover:bg-accent-500/30 rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap">
                                                                Avisarme
                                                            </button>
                                                        </form>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <Link
                                        href={route('contact')}
                                        className="btn-premium bg-transparent border border-white/5 text-primary-400 hover:text-white hover:border-white/20 py-5 text-[10px] font-bold uppercase tracking-[0.3em]"
                                    >
                                        Consultar Stock Global
                                    </Link>
                                </div>
                            </div>

                            {/* Features / Details Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex gap-4">
                                    <div className="size-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-500 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1">Localización Crítica</h4>
                                        <p className="text-xs text-primary-400 font-light leading-relaxed">Suministro de componentes descatalogados o de difícil acceso.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="size-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-500 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1">Despacho Inmediato</h4>
                                        <p className="text-xs text-primary-400 font-light leading-relaxed">Logística optimizada para reducir tiempos de inactividad técnica.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Specs Detailed Section */}
                    <div className="mt-32 pt-20 border-t border-white/5">
                        <div className="max-w-3xl">
                            <h2 className="text-4xl font-display font-medium text-white mb-12 tracking-tight">Especificaciones <span className="text-primary-500 italic">de Ingeniería</span></h2>
                            <div className="space-y-4">
                                {product.specifications && product.specifications.length > 0 ? (
                                    product.specifications.map((spec, i) => (
                                        <div key={i} className="flex justify-between items-center py-5 border-b border-white/5 group hover:bg-white/5 px-6 rounded-xl transition-colors">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">{spec.label}</span>
                                            <span className="text-sm text-white font-light">{spec.value}</span>
                                        </div>
                                    ))
                                ) : (
                                    [
                                        { label: 'Categoría', value: product.category?.name || 'OEM' },
                                        { label: 'Garantía', value: product.warranty || '12 Meses' },
                                        { label: 'Procedencia', value: 'Importación Directa (Tier 1 Global)' },
                                        { label: 'Certificaciones', value: 'CE, FCC, RoHS' },
                                    ].map((spec, i) => (
                                        <div key={i} className="flex justify-between items-center py-5 border-b border-white/5 group hover:bg-white/5 px-6 rounded-xl transition-colors">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">{spec.label}</span>
                                            <span className="text-sm text-white font-light">{spec.value}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts && relatedProducts.length > 0 && (
                        <div className="mt-32 pt-20 border-t border-white/5">
                            <h2 className="text-4xl font-display font-medium text-white mb-12 tracking-tight">
                                También te puede <span className="text-accent-500 italic">interesar</span>
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map(rp => (
                                    <Link
                                        key={rp.id}
                                        href={route('catalog.show', rp.slug)}
                                        className="group tech-card !p-6 hover:border-accent-500/30 transition-all duration-500"
                                    >
                                        <div className="aspect-square bg-primary-950 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-white/5">
                                            {rp.image_url ? (
                                                <img src={rp.image_url} alt={rp.name} loading="lazy" className="size-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <span className="text-4xl opacity-10">📦</span>
                                            )}
                                        </div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-accent-400 mb-2">{rp.category?.name || 'OEM'}</p>
                                        <h3 className="text-sm font-bold text-white group-hover:text-accent-400 transition-colors line-clamp-2">{rp.name}</h3>
                                        <p className="text-xs text-primary-400 mt-2 font-mono">
                                            {rp.price > 0 ? `$${new Intl.NumberFormat('es-CL').format(rp.price)} CLP` : 'Cotizar'}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
