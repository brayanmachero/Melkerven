import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import ProductGlyph from '@/Components/ProductGlyph';
import ProductImage from '@/Components/ProductImage';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function ProductShow({ auth, product, relatedProducts }) {
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [activeImage, setActiveImage] = useState(product.image_url);
    const galleryImages = [product.image_url, ...(product.images || []).map((image) => `/storage/${image}`)].filter(Boolean);

    const addToCart = () => {
        setAdding(true);
        router.post(route('cart.add', product.id), { quantity }, { preserveScroll: true, onFinish: () => setAdding(false) });
    };

    const specifications = product.specifications?.length ? product.specifications : [
        { label: 'Categoría', value: product.category?.name || 'OEM' },
        { label: 'Garantía', value: product.warranty || 'A definir en cotización' },
        { label: 'Estado comercial', value: 'Disponibilidad por confirmar' },
    ];

    return (
        <PublicLayout auth={auth}>
            <Head>
                <title>{`${product.name} | Catálogo técnico Melkerven`}</title>
                <meta name="description" content={product.description ? `${product.description.substring(0, 150)}…` : 'Ficha técnica de hardware empresarial para cotización.'} />
                <meta property="og:title" content={`${product.name} | Melkerven`} />
                <meta property="og:description" content={product.description || 'Ficha técnica de hardware empresarial para cotización.'} />
                {product.image_url && <meta property="og:image" content={product.image_url} />}
                <meta property="og:type" content="product" />
            </Head>

            <section className="relative min-h-screen overflow-hidden bg-cloud-50 py-16 sm:py-20">
                <div className="public-network absolute inset-0 opacity-60" />
                <div className="pointer-events-none absolute right-[-10rem] top-[-8rem] size-[32rem] rounded-full bg-signal-300/30 blur-[105px]" />
                <div className="section-shell relative z-10">
                    <Breadcrumbs items={[
                        { label: 'Catálogo', href: route('catalog') },
                        { label: product.category?.name || 'OEM', href: route('catalog', { category: product.category?.slug }) },
                        { label: product.name },
                    ]} />

                    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-16">
                        <div className="space-y-4">
                            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] border border-white/80 bg-white p-10 shadow-[0_22px_60px_rgba(31,62,82,0.10)]">
                                <div className="public-network absolute inset-0 opacity-45" />
                                {activeImage ? <ProductImage src={activeImage} alt={product.name} priority sizes="(max-width: 1023px) calc(100vw - 3rem), 45vw" className="relative size-full object-contain transition duration-700 hover:scale-105" /> : <ProductGlyph categoryName={product.category?.name || ''} className="relative h-[68%] w-[68%]" />}
                            </div>
                            {galleryImages.length > 1 && <div className="flex gap-3 overflow-x-auto pb-2">{galleryImages.map((image, index) => <button key={image} type="button" onClick={() => setActiveImage(image)} className={`size-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 transition ${activeImage === image ? 'border-signal-500' : 'border-ink-100 hover:border-signal-300'}`}><ProductImage src={image} alt={`Vista ${index + 1} de ${product.name}`} sizes="80px" className="size-full object-cover" /></button>)}</div>}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-sm"><p className="text-[9px] font-bold uppercase tracking-widest text-ink-400">Estado</p><p className="mt-2 text-xs font-bold text-ink-800"><span className={`mr-1.5 inline-block size-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-signal-400'}`} />{product.stock > 0 ? 'Informado' : 'A confirmar'}</p></div>
                                <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-sm"><p className="text-[9px] font-bold uppercase tracking-widest text-ink-400">Garantía</p><p className="mt-2 line-clamp-2 text-xs font-bold text-ink-800">{product.warranty || 'Cotización'}</p></div>
                                <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-sm"><p className="text-[9px] font-bold uppercase tracking-widest text-ink-400">Soporte</p><p className="mt-2 text-xs font-bold text-ink-800">Técnico</p></div>
                            </div>
                        </div>

                        <div>
                            <div className="public-eyebrow">Ficha técnica de referencia</div>
                            <h1 className="mt-6 text-4xl font-semibold leading-[.98] tracking-[-0.06em] text-ink-950 sm:text-6xl">{product.name}</h1>
                            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-600">{product.description}</p>

                            <div className="mt-8 rounded-3xl border border-signal-200 bg-white/90 p-6 shadow-[0_18px_48px_rgba(31,62,82,0.09)] backdrop-blur sm:p-8">
                                <div className="flex flex-col gap-5 border-b border-ink-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
                                    <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-signal-700">Condición comercial</p><p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink-950">{product.price > 0 ? `$${new Intl.NumberFormat('es-CL').format(product.price)}` : 'Sujeto a cotización'}</p>{product.price > 0 && <p className="mt-1 text-xs text-ink-400">CLP + IVA</p>}</div>
                                    <p className="rounded-full bg-signal-50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-signal-700">Disponibilidad por confirmar</p>
                                </div>
                                <p className="mt-5 text-sm leading-6 text-ink-500">La propuesta valida variante, configuración, licencias, accesorios y compatibilidad antes de confirmar precio o plazo.</p>
                                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                                    {product.is_quotable || product.price == 0 ? <Link href={route('contact', { product: product.name })} className="public-button">Solicitar cotización técnica <span aria-hidden="true">→</span></Link> : <div className="flex items-center gap-3"><div className="flex rounded-xl border border-ink-200 bg-cloud-50"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-3 text-ink-600 hover:text-ink-950">−</button><span className="flex w-10 items-center justify-center text-sm font-bold text-ink-950">{quantity}</span><button type="button" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-3 text-ink-600 hover:text-ink-950">+</button></div><button type="button" onClick={addToCart} disabled={adding || product.stock <= 0} className="public-button flex-1 disabled:cursor-not-allowed disabled:opacity-40">{adding ? 'Agregando…' : 'Agregar al carrito'}</button></div>}
                                    <Link href={route('contact')} className="public-button-secondary">Consultar alternativa</Link>
                                </div>
                            </div>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                {[['Validación previa', 'Revisamos modelo, revisión, firmware y plataforma antes de proponer una alternativa.'], ['Suministro trazable', 'La solicitud centraliza cotización, coordinación e información de seguimiento.']].map(([title, description]) => <div key={title} className="rounded-2xl border border-ink-100 bg-white/75 p-5"><p className="text-sm font-bold text-ink-950">{title}</p><p className="mt-2 text-sm leading-6 text-ink-500">{description}</p></div>)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 border-t border-ink-200 pt-14">
                        <div className="max-w-4xl"><div className="public-eyebrow">Detalle técnico</div><h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-ink-950">Especificaciones para iniciar la evaluación.</h2><div className="mt-8 overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm">{specifications.map((specification, index) => <div key={`${specification.label}-${index}`} className="grid gap-2 border-b border-ink-100 px-6 py-5 last:border-0 sm:grid-cols-[.7fr_1.3fr]"><span className="text-[10px] font-bold uppercase tracking-widest text-ink-400">{specification.label}</span><span className="text-sm font-medium leading-6 text-ink-800">{specification.value}</span></div>)}</div></div>
                    </div>

                    {relatedProducts?.length > 0 && <div className="mt-20 border-t border-ink-200 pt-14"><div className="flex items-end justify-between gap-4"><div><div className="public-eyebrow">Más referencias</div><h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink-950">También puede interesarle</h2></div><Link href={route('catalog')} className="text-[10px] font-bold uppercase tracking-widest text-signal-700 hover:text-signal-500">Ver catálogo</Link></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{relatedProducts.map((related) => <Link key={related.id} href={route('product.show', related.slug)} className="group rounded-2xl border border-ink-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-signal-300"><div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl bg-cloud-50">{related.image_url ? <ProductImage src={related.image_url} alt={related.name} sizes="(max-width: 639px) calc(100vw - 3rem), (max-width: 1023px) calc(50vw - 3rem), 23vw" className="size-full object-cover transition duration-500 group-hover:scale-105" /> : <ProductGlyph categoryName={related.category?.name || ''} className="h-3/4 w-3/4 transition group-hover:scale-105" />}</div><p className="mt-4 text-[9px] font-bold uppercase tracking-widest text-signal-700">{related.category?.name || 'OEM'}</p><p className="mt-2 line-clamp-2 text-sm font-bold text-ink-950">{related.name}</p><p className="mt-2 text-xs text-ink-500">Cotizar según configuración</p></Link>)}</div></div>}
                </div>
            </section>
        </PublicLayout>
    );
}
