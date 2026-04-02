import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Wishlist({ auth, wishlistItems }) {
    const removeFromWishlist = (productId) => {
        router.delete(route('wishlist.remove', productId), { preserveScroll: true });
    };

    const addToCart = (productId) => {
        router.post(route('cart.add', productId), { quantity: 1 }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Mis Favoritos" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Mis Favoritos</h2>

                    {wishlistItems.length === 0 ? (
                        <div className="tech-card text-center py-16">
                            <p className="text-primary-400 text-lg mb-4">No tienes productos en favoritos.</p>
                            <Link href={route('catalog')} className="btn-premium bg-accent-500 text-white px-6 py-3">
                                Explorar Catálogo
                            </Link>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlistItems.map(item => (
                                <div key={item.id} className="tech-card group relative overflow-hidden">
                                    <button
                                        onClick={() => removeFromWishlist(item.product.id)}
                                        className="absolute top-3 right-3 z-10 size-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/40 transition-all"
                                        title="Eliminar de favoritos"
                                    >
                                        ✕
                                    </button>
                                    <Link href={route('catalog.show', item.product.slug)}>
                                        {item.product.image_url ? (
                                            <img src={item.product.image_url} alt={item.product.name} className="w-full h-48 object-cover rounded-lg mb-4" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-48 bg-primary-800 rounded-lg mb-4 flex items-center justify-center text-primary-500">Sin imagen</div>
                                        )}
                                        <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 group-hover:text-accent-400 transition-colors">{item.product.name}</h3>
                                    </Link>
                                    {item.product.category && (
                                        <span className="text-[10px] text-accent-500 font-bold uppercase tracking-widest">{item.product.category.name}</span>
                                    )}
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-white font-bold">
                                            {item.product.price > 0 ? `$${new Intl.NumberFormat('es-CL').format(item.product.price)}` : 'Cotizar'}
                                        </span>
                                        <span className={`text-xs font-bold ${item.product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {item.product.stock > 0 ? `${item.product.stock} uds` : 'Sin stock'}
                                        </span>
                                    </div>
                                    {item.product.stock > 0 && item.product.price > 0 && (
                                        <button
                                            onClick={() => addToCart(item.product.id)}
                                            className="mt-3 w-full bg-accent-500/20 border border-accent-500/30 text-accent-400 hover:bg-accent-500/30 rounded-lg py-2 text-xs font-bold uppercase tracking-widest transition-all"
                                        >
                                            Agregar al Carrito
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
