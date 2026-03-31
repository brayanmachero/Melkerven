import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Catalog({ auth, products, categories, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [addingToCart, setAddingToCart] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('catalog'), { category: filters.category, search: searchTerm }, { preserveState: true });
    };

    const addToCart = (productId) => {
        setAddingToCart(productId);
        router.post(route('cart.add', productId), {}, {
            preserveScroll: true,
            onFinish: () => setAddingToCart(null),
        });
    };
    return (
        <PublicLayout auth={auth}>
            <Head>
                <title>Catálogo de Hardware Industrial - Melkerven</title>
                <meta name="description" content="Explore nuestro catálogo de hardware de nivel industrial. Servidores, almacenamiento y componentes TI importados con disponibilidad para su empresa." />
            </Head>

            <section className="py-20 bg-primary-950 relative overflow-hidden">
                {/* Visual accents */}
                <div className="absolute top-0 right-0 size-96 bg-accent-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-accent-500"></div>
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-500">Suministro Crítico</span>
                        </div>
                        <h1 className="text-5xl sm:text-7xl font-display font-medium text-white mb-6 tracking-tighter">
                            Catálogo de <span className="text-accent-500 font-light">Hardware</span>
                        </h1>
                        <p className="text-xl text-primary-300 max-w-2xl font-light leading-relaxed">
                            Componentes, repuestos y equipos de TI con especificaciones industriales. Importaciones directas de alta fiabilidad.
                        </p>
                    </div>

                    {/* Categories Filter and Search - Tech Industrial Style */}
                    <div className="flex flex-col md:flex-row gap-6 mb-16 border-b border-white/5 pb-8 justify-between items-start md:items-end">
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href={route('catalog')}
                                className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all duration-500 ${!filters.category
                                    ? 'bg-accent-500 text-white border-accent-500 shadow-[0_0_20px_rgba(14,165,233,0.2)]'
                                    : 'bg-transparent text-primary-400 border-white/10 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                Ver Todo
                            </Link>
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={route('catalog', { category: category.slug })}
                                    className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all duration-500 ${filters.category === category.slug
                                        ? 'bg-accent-500 text-white border-accent-500 shadow-[0_0_20px_rgba(14,165,233,0.2)]'
                                        : 'bg-transparent text-primary-400 border-white/10 hover:border-white/20 hover:text-white'
                                        }`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="w-full md:w-80 relative group">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar componente..."
                                className="w-full bg-primary-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light group-hover:border-white/20"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 transition-colors group-hover:text-accent-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <button type="submit" className="hidden">Buscar</button>
                        </form>
                    </div>

                    {/* Products Grid - High contrast Tech Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.data.map((product) => (
                            <div key={product.id} className="tech-card group flex flex-col h-full bg-primary-900 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                                {/* Card Glow Effect */}
                                <div className="absolute top-0 right-0 size-32 bg-accent-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                <div className="aspect-square bg-primary-950 rounded-xl mb-6 flex items-center justify-center overflow-hidden border border-white/5 relative">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="size-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0"
                                        />
                                    ) : (
                                        <span className="text-5xl group-hover:scale-110 transition-transform duration-1000 opacity-20">📦</span>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <span className="text-[9px] font-bold uppercase tracking-tighter text-accent-400 bg-accent-500/10 border border-accent-500/20 px-2 py-0.5 rounded-md backdrop-blur-md">
                                            {product.category?.name || 'OEM'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-grow flex flex-col">
                                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-accent-400 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-primary-400 mb-8 line-clamp-3 font-light leading-relaxed">
                                        {product.description}
                                    </p>

                                    <div className="mt-auto flex flex-col pt-6 border-t border-white/5 space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-primary-500 font-bold uppercase tracking-widest mb-1">Inversión TI</span>
                                                <span className="text-2xl font-display font-medium text-white tracking-tight">
                                                    {product.price > 0
                                                        ? `$${new Intl.NumberFormat('es-CL').format(product.price)}`
                                                        : 'Consultar'}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/catalog/${product.slug}`}
                                                className="text-[10px] font-bold uppercase tracking-widest text-primary-400 hover:text-accent-400 transition-colors"
                                            >
                                                Ver Ficha
                                            </Link>
                                        </div>

                                        {product.is_quotable || product.price == 0 ? (
                                            <Link
                                                href={route('contact', { product: product.name })}
                                                className="w-full py-3 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Solicitar Cotización
                                            </Link>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => addToCart(product.id)}
                                                disabled={addingToCart === product.id || product.stock <= 0}
                                                className="w-full py-3 bg-accent-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 hover:bg-accent-600 transition-all shadow-lg shadow-accent-500/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed group/btn"
                                            >
                                                {addingToCart === product.id ? (
                                                    <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : product.stock <= 0 ? (
                                                    <>Sin Stock</>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4 group-hover/btn:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        Añadir al Carrito
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="mt-16 flex justify-center gap-2">
                            {products.links.map((link, i) => (
                                link.url ? (
                                    <Link key={i} href={link.url} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all rounded-lg ${link.active ? 'bg-accent-500 border-accent-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'border-white/10 text-primary-400 hover:border-accent-500 hover:text-white'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span key={i} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/5 text-primary-600 cursor-not-allowed opacity-50 rounded-lg" dangerouslySetInnerHTML={{ __html: link.label }} />
                                )
                            ))}
                        </div>
                    )}

                    {products.data.length === 0 && (
                        <div className="mt-20 py-32 tech-card border-dashed border-primary-800 bg-transparent text-center">
                            <div className="text-6xl mb-8 opacity-40">🔍</div>
                            <h3 className="text-3xl font-display font-medium text-white mb-4">Módulo de Suministro Vacío</h3>
                            <p className="text-primary-400 mb-12 max-w-md mx-auto font-light">
                                Estamos sincronizando el inventario global. Si requiere un componente específico, inicie una solicitud de importación.
                            </p>
                            <Link
                                href={route('catalog')}
                                className="btn-premium bg-accent-500 text-white hover:bg-accent-600 px-10"
                            >
                                Recargar Inventario
                            </Link>
                        </div>
                    )}

                    {/* Bottom Support CTA - High Impact */}
                    <div className="mt-20 p-10 sm:p-20 bg-primary-900 rounded-[3rem] relative overflow-hidden border border-white/5 group">
                        <div className="absolute top-0 right-0 size-[500px] bg-accent-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent-500/10 transition-colors duration-1000"></div>

                        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl sm:text-6xl font-display font-medium text-white mb-8 tracking-tighter">¿Hardware <br /><span className="text-accent-500">Específico?</span></h2>
                                <p className="text-xl text-primary-300 font-light leading-relaxed mb-10">
                                    Nuestra red de proveedores en Asia, USA y Europa nos permite localizar piezas críticas que otros no encuentran.
                                </p>
                                <Link
                                    href={route('contact')}
                                    className="btn-premium bg-white text-primary-950 hover:bg-primary-50 px-10"
                                >
                                    Abrir Ticket de Soporte
                                </Link>
                            </div>
                            <div className="relative hidden lg:block">
                                <div className="aspect-square bg-primary-950 rounded-[3rem] border border-white/10 p-10 flex items-center justify-center">
                                    <div className="size-full border border-accent-500/10 rounded-[2rem] flex items-center justify-center relative overflow-hidden group/img">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.1),transparent)] animate-pulse"></div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="size-32 text-accent-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
