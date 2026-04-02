import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function Index({ auth, products, categories, filters }) {
    const { delete: destroy, processing } = useForm();
    const { post: importCsv, processing: importing } = useForm({});
    const csvInputRef = useRef(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [categoryId, setCategoryId] = useState(filters?.category_id || '');
    const [isActive, setIsActive] = useState(filters?.is_active ?? '');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const applyFilters = (newFilters) => {
        router.get(route('admin.products.index'), {
            ...filters,
            ...newFilters,
        }, { preserveState: true, replace: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ search, category_id: categoryId, is_active: isActive });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        destroy(route('admin.products.destroy', deleteTarget.id), {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-display font-bold text-white">
                        Gestión de <span className="text-accent-500">Productos</span>
                    </h2>
                    <div className="flex items-center gap-3">
                        <a
                            href={route('admin.products.export-csv')}
                            className="px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-primary-300 hover:bg-white/10 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
                        >
                            ↓ Exportar CSV
                        </a>
                        <button
                            onClick={() => csvInputRef.current?.click()}
                            disabled={importing}
                            className="px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-primary-300 hover:bg-white/10 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                        >
                            {importing ? 'Importando...' : '↑ Importar CSV'}
                        </button>
                        <input
                            ref={csvInputRef}
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    const formData = new FormData();
                                    formData.append('csv_file', e.target.files[0]);
                                    router.post(route('admin.products.import-csv'), formData);
                                }
                            }}
                        />
                        <Link
                            href={route('admin.products.create')}
                            className="btn-premium bg-accent-500 text-white hover:bg-accent-600 px-6 py-2.5 shadow-2xl shadow-accent-500/20"
                        >
                            + Nuevo Producto
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Productos - Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 relative z-10">
                    {/* Search & Filter Bar */}
                    <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar producto por nombre..."
                                className="tech-input w-full pl-12 pr-4 py-3 text-sm"
                            />
                        </div>
                        <select
                            value={categoryId}
                            onChange={(e) => {
                                setCategoryId(e.target.value);
                                applyFilters({ search, category_id: e.target.value, is_active: isActive });
                            }}
                            className="tech-input px-4 py-3 text-sm min-w-[180px]"
                        >
                            <option value="">Todas las categorías</option>
                            {(categories || []).map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <select
                            value={isActive}
                            onChange={(e) => {
                                setIsActive(e.target.value);
                                applyFilters({ search, category_id: categoryId, is_active: e.target.value });
                            }}
                            className="tech-input px-4 py-3 text-sm min-w-[140px]"
                        >
                            <option value="">Todo estado</option>
                            <option value="1">En Línea</option>
                            <option value="0">Inactivo</option>
                        </select>
                        <button
                            type="submit"
                            className="btn-premium bg-accent-500/10 text-accent-400 border border-accent-500/20 hover:bg-accent-500/20 text-[10px] font-bold uppercase tracking-widest px-6 py-3"
                        >
                            Buscar
                        </button>
                        {(filters?.search || filters?.category_id || filters?.is_active !== undefined && filters?.is_active !== '') && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setCategoryId('');
                                    setIsActive('');
                                    router.get(route('admin.products.index'));
                                }}
                                className="btn-premium bg-white/5 text-primary-400 border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest px-6 py-3"
                            >
                                Limpiar
                            </button>
                        )}
                    </form>

                    <div className="tech-card !p-0 overflow-hidden ring-1 ring-white/5 bg-primary-900 shadow-3xl">
                        <table className="min-w-full divide-y divide-white/5">
                            <thead className="bg-primary-950/50">
                                <tr>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em]">Producto</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em]">Categoría</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em]">Precio</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em]">Stock</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em]">Estado</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="size-14 bg-primary-950 rounded-xl flex items-center justify-center text-xl shrink-0 overflow-hidden border border-white/5 ring-1 ring-white/10">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt={product.name} className="size-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" />
                                                    ) : (
                                                        <span className="opacity-20 text-2xl">📦</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white group-hover:text-accent-400 transition-colors leading-tight mb-1">{product.name}</div>
                                                    <div className="text-[10px] text-primary-500 font-mono tracking-wider">{product.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-medium text-primary-300 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                                                {product.category?.name || 'OEM'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-display font-medium text-white">
                                                    {product.price > 0 ? `$${new Intl.NumberFormat('es-CL').format(product.price)}` : 'Cotizar'}
                                                </span>
                                                {product.is_quotable && (
                                                    <span className="text-[9px] text-accent-500 font-bold uppercase tracking-widest mt-0.5">Permite Cotización</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`size-1.5 rounded-full ${product.stock > 10 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-orange-500 animate-pulse'}`}></div>
                                                <span className={`text-xs font-bold ${product.stock > 10 ? 'text-primary-200' : 'text-orange-400'}`}>
                                                    {product.stock} un.
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {product.is_active ? (
                                                <span className="px-3 py-1 bg-accent-500/10 text-accent-400 border border-accent-500/20 rounded-lg text-[9px] font-bold uppercase tracking-widest">En Línea</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-white/5 text-primary-600 border border-white/5 rounded-lg text-[9px] font-bold uppercase tracking-widest">Inactivo</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-3">
                                                <Link
                                                    href={route('admin.products.edit', product.id)}
                                                    className="size-10 flex items-center justify-center bg-white/5 text-primary-300 rounded-xl hover:bg-accent-500 hover:text-white transition-all border border-white/10"
                                                    title="Editar"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteTarget(product)}
                                                    className="size-10 flex items-center justify-center bg-white/5 text-red-400/50 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-white/10"
                                                    title="Eliminar"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center">
                                            <div className="text-4xl mb-4 opacity-20">📂</div>
                                            <div className="text-primary-500 text-sm font-light uppercase tracking-widest">Base de Datos de Inventario Vacía</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-primary-900 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center size-16 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                                <svg className="size-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-display font-medium text-white mb-2">Eliminar Producto</h3>
                            <p className="text-primary-400 text-sm mb-1">¿Estás seguro de eliminar</p>
                            <p className="text-accent-400 font-bold mb-6">"{deleteTarget.name}"?</p>
                            <p className="text-primary-500 text-xs mb-8">Esta acción no se puede deshacer.</p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="px-6 py-3 bg-white/5 text-primary-300 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={processing}
                                    className="px-6 py-3 bg-red-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Eliminando...' : 'Sí, Eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
