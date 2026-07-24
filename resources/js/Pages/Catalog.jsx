import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import ProductGlyph from '@/Components/ProductGlyph';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

function specificationValue(specifications, labels) {
    const match = (specifications || []).find((spec) => labels.includes(spec.label));
    return match?.value;
}

export default function Catalog({ auth, products, categories, filters, wishlistIds = [] }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [addingToCart, setAddingToCart] = useState(null);
    const [compareIds, setCompareIds] = useState([]);
    const [localWishlist, setLocalWishlist] = useState(wishlistIds);

    const toggleCompare = (id) => setCompareIds((previous) => (
        previous.includes(id) ? previous.filter((item) => item !== id) : previous.length < 4 ? [...previous, id] : previous
    ));

    const handleSearch = (event) => {
        event.preventDefault();
        const params = new URLSearchParams(Object.fromEntries(
            Object.entries({ ...filters, search: searchTerm }).filter(([, value]) => value),
        ));
        router.visit(`${route('catalog')}?${params.toString()}`, { method: 'get', preserveState: true });
    };

    const applyFilter = (newFilters) => {
        router.get(route('catalog'), { ...filters, ...newFilters }, { preserveState: true, replace: true });
    };

    const addToCart = (productId) => {
        setAddingToCart(productId);
        router.post(route('cart.add', productId), {}, { preserveScroll: true, onFinish: () => setAddingToCart(null) });
    };

    const toggleWishlist = (productId) => {
        if (!auth?.user) {
            router.visit(route('login'));
            return;
        }
        setLocalWishlist((previous) => previous.includes(productId) ? previous.filter((id) => id !== productId) : [...previous, productId]);
        router.post(route('wishlist.toggle', productId), {}, { preserveScroll: true });
    };

    return (
        <PublicLayout auth={auth}>
            <Head>
                <title>Catálogo técnico de referencia | Melkerven</title>
                <meta name="description" content="Catálogo de referencia de servidores, redes y almacenamiento. Busque por modelo, serie o código de parte e inicie una cotización técnica con Melkerven." />
            </Head>

            <section className="relative overflow-hidden bg-cloud-50 py-16 sm:py-20">
                <div className="public-network absolute inset-0 opacity-65" />
                <div className="pointer-events-none absolute right-[-9rem] top-[-8rem] size-[31rem] rounded-full bg-signal-300/35 blur-[105px]" />
                <div className="section-shell relative z-10">
                    <Breadcrumbs items={[{ label: 'Catálogo' }]} />
                    <div className="mb-10 max-w-3xl">
                        <div className="public-eyebrow mb-6">Catálogo de referencia</div>
                        <h1 className="text-5xl font-semibold tracking-[-0.06em] text-ink-950 sm:text-7xl">
                            Encuentre por <span className="text-signal-600">modelo, serie o código.</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-ink-600">
                            Una base técnica para comenzar una conversación útil. Cada ficha se cotiza según configuración, compatibilidad, licencias y disponibilidad real.
                        </p>
                        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-signal-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-signal-700 shadow-sm">
                            <span className="size-1.5 rounded-full bg-signal-500 network-pulse" />
                            {products.total} referencias técnicas para cotizar
                        </p>
                    </div>

                    <div className="mb-8 rounded-2xl border border-signal-200 bg-white/80 p-4 text-sm leading-6 text-ink-600 shadow-[0_14px_32px_rgba(31,62,82,0.07)] backdrop-blur-sm sm:flex sm:items-center sm:gap-4">
                        <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-signal-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-signal-700 sm:mb-0"><span className="size-1.5 rounded-full bg-signal-500" />A cotizar</span>
                        Este catálogo orienta la búsqueda; no representa inventario local ni precio publicado.
                    </div>

                    <div className="flex flex-col gap-6 border-b border-ink-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex flex-wrap gap-2">
                            <Link href={route('catalog')} className={`rounded-xl border px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition ${!filters.category ? 'border-ink-950 bg-ink-950 text-white' : 'border-ink-200 bg-white text-ink-600 hover:border-signal-400 hover:text-ink-950'}`}>Ver todo</Link>
                            {categories.map((category) => (
                                <Link key={category.id} href={route('catalog', { category: category.slug })} className={`rounded-xl border px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition ${filters.category === category.slug ? 'border-ink-950 bg-ink-950 text-white' : 'border-ink-200 bg-white text-ink-600 hover:border-signal-400 hover:text-ink-950'}`}>
                                    {category.name}
                                </Link>
                            ))}
                        </div>

                        <form onSubmit={handleSearch} className="relative w-full lg:w-96">
                            <label className="sr-only" htmlFor="catalog-search">Buscar en el catálogo</label>
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" /></svg>
                            <input id="catalog-search" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Ej: R760, N9K, ST20000..." className="w-full rounded-xl border border-ink-200 bg-white py-3 pl-12 pr-20 text-sm text-ink-950 placeholder-ink-300 shadow-sm focus:border-signal-500 focus:ring-signal-500/20" />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-ink-950 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-ink-800">Buscar</button>
                        </form>
                    </div>

                    <div className="mt-7 flex flex-wrap items-center gap-4">
                        <select value={`${filters.sort || 'created_at'}_${filters.dir || 'desc'}`} onChange={(event) => { const [sort, dir] = event.target.value.split('_'); applyFilter({ sort, dir }); }} className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-ink-700 focus:border-signal-500 focus:ring-signal-500/20">
                            <option value="created_at_desc">Más recientes</option>
                            <option value="name_asc">Nombre: A–Z</option>
                            <option value="name_desc">Nombre: Z–A</option>
                            <option value="stock_desc">Disponibilidad informada</option>
                        </select>
                        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-ink-600">
                            <input type="checkbox" checked={!!filters.in_stock} onChange={(event) => applyFilter({ in_stock: event.target.checked ? '1' : '' })} className="rounded border-ink-300 text-signal-600 focus:ring-signal-500" />
                            Solo con disponibilidad informada
                        </label>
                        {(filters.search || filters.category || filters.sort || filters.in_stock) && <Link href={route('catalog')} className="ml-auto text-[10px] font-bold uppercase tracking-widest text-signal-700 hover:text-signal-500">Limpiar filtros ×</Link>}
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {products.data.map((product) => {
                            const brand = specificationValue(product.specifications, ['Marca']);
                            const model = specificationValue(product.specifications, ['Serie / modelo', 'Código de referencia', 'Código de parte']);
                            const part = specificationValue(product.specifications, ['Código de parte', 'Código de referencia']);
                            const availability = product.stock > 0 ? 'Disponibilidad informada' : 'Disponibilidad por confirmar';

                            return (
                                <article key={product.id} className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white p-5 shadow-[0_14px_36px_rgba(31,62,82,0.07)] transition duration-500 hover:-translate-y-1 hover:border-signal-300 hover:shadow-[0_24px_52px_rgba(31,62,82,0.12)]">
                                    <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl border border-signal-100 bg-[linear-gradient(135deg,#f7fafc,#eaf4f7)]">
                                        {product.image_url ? <img src={product.image_url} alt={product.name} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" /> : <ProductGlyph categoryName={product.category?.name || ''} className="h-[75%] w-[75%] transition duration-700 group-hover:scale-105" />}
                                        <span className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-signal-700 shadow-sm">{product.category?.name || 'OEM'}</span>
                                        {product.image_url && <span className="absolute bottom-3 left-3 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-ink-500 shadow-sm">Imagen referencial</span>}
                                        <button type="button" onClick={() => toggleCompare(product.id)} aria-label={`Añadir ${product.name} a comparación`} className={`absolute left-3 top-3 flex size-8 items-center justify-center rounded-lg border transition ${compareIds.includes(product.id) ? 'border-ink-950 bg-ink-950 text-white' : 'border-ink-200 bg-white/90 text-ink-500 hover:border-signal-400 hover:text-signal-700'}`}>
                                            <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2Zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z" /></svg>
                                        </button>
                                        <button type="button" onClick={() => toggleWishlist(product.id)} aria-label={`Guardar ${product.name} en favoritos`} className={`absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-lg border transition ${localWishlist.includes(product.id) ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-ink-200 bg-white/90 text-ink-400 hover:border-rose-200 hover:text-rose-500'}`}>
                                            <svg aria-hidden="true" className="size-4" fill={localWishlist.includes(product.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4.318 6.318 7.682 14.046 7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0Z" /></svg>
                                        </button>
                                    </div>

                                    <div className="flex flex-1 flex-col px-1 pt-5">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-signal-700">{brand || 'Referencia OEM'}</p>
                                        <h2 className="mt-2 text-xl font-semibold leading-tight tracking-[-0.03em] text-ink-950 transition group-hover:text-signal-700">{product.name}</h2>
                                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink-500">{product.description}</p>
                                        <div className="mt-5 grid gap-2 rounded-xl border border-ink-100 bg-cloud-50 p-3 text-xs">
                                            {model && <p className="flex justify-between gap-3"><span className="text-ink-400">Modelo</span><span className="text-right font-semibold text-ink-700">{model}</span></p>}
                                            {part && <p className="flex justify-between gap-3"><span className="text-ink-400">Código</span><span className="text-right font-mono text-[11px] font-semibold text-ink-700">{part}</span></p>}
                                        </div>
                                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink-100 pt-4">
                                            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-ink-500"><span className={`size-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-signal-400'}`} />{availability}</span>
                                            <Link href={route('product.show', product.slug)} className="text-[10px] font-bold uppercase tracking-widest text-signal-700 hover:text-signal-500">Ver ficha</Link>
                                        </div>
                                        {product.is_quotable || product.price == 0 ? (
                                            <Link href={route('contact', { product: product.name })} className="mt-4 flex w-full items-center justify-center rounded-xl bg-ink-950 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-ink-800">Solicitar cotización</Link>
                                        ) : (
                                            <button type="button" onClick={() => addToCart(product.id)} disabled={addingToCart === product.id || product.stock <= 0} className="mt-4 flex w-full items-center justify-center rounded-xl bg-ink-950 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40">{addingToCart === product.id ? 'Agregando…' : 'Agregar al carrito'}</button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {products.data.length === 0 && (
                        <div className="mt-10 rounded-3xl border border-ink-100 bg-white px-6 py-16 text-center shadow-sm">
                            <p className="text-lg font-semibold text-ink-950">No encontramos una coincidencia exacta.</p>
                            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ink-500">Envíenos el modelo, una etiqueta o la configuración requerida; también buscamos equipos y repuestos fuera de este catálogo.</p>
                            <Link href={route('contact')} className="public-button mt-6">Enviar requerimiento <span aria-hidden="true">→</span></Link>
                        </div>
                    )}

                    {compareIds.length > 0 && (
                        <div className="sticky bottom-5 z-20 mt-8 flex items-center justify-between gap-4 rounded-2xl border border-ink-200 bg-white/95 p-4 shadow-[0_16px_42px_rgba(31,62,82,.16)] backdrop-blur">
                            <p className="text-sm font-semibold text-ink-700">{compareIds.length} producto{compareIds.length > 1 ? 's' : ''} para comparar</p>
                            <Link href={route('compare', { ids: compareIds.join(',') })} className="rounded-xl bg-ink-950 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-ink-800">Comparar</Link>
                        </div>
                    )}

                    {products.links?.length > 3 && (
                        <nav className="mt-12 flex flex-wrap justify-center gap-2" aria-label="Paginación del catálogo">
                            {products.links.map((link, index) => link.url ? <Link key={index} href={link.url} className={`rounded-lg px-3 py-2 text-sm transition ${link.active ? 'bg-ink-950 text-white' : 'border border-ink-200 bg-white text-ink-600 hover:border-signal-400'}`} dangerouslySetInnerHTML={{ __html: link.label }} /> : <span key={index} className="rounded-lg border border-ink-100 bg-cloud-50 px-3 py-2 text-sm text-ink-300" dangerouslySetInnerHTML={{ __html: link.label }} />)}
                        </nav>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
