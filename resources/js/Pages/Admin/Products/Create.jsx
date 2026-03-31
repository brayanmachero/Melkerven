import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_id: '',
        description: '',
        price: '',
        stock: '',
        image: null,
        is_active: true,
        is_quotable: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'));
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('admin.products.index')} className="size-10 flex items-center justify-center bg-white/5 text-primary-400 rounded-xl hover:bg-white/10 transition-colors border border-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                    <h2 className="text-3xl font-display font-medium text-white tracking-tight leading-tight">
                        Nuevo <span className="text-accent-500">Hardware</span>
                    </h2>
                </div>
            }
        >
            <Head title="Añadir Producto - Admin" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 relative z-10">
                    <div className="tech-card !p-12 relative overflow-hidden bg-primary-900 shadow-3xl">
                        <form onSubmit={submit} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-3">Identificación del Producto</label>
                                    <input
                                        type="text"
                                        className="w-full bg-primary-950 border-white/10 rounded-xl px-5 py-4 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light"
                                        placeholder="Ej: Servidor Dell PowerEdge R750"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <div className="text-red-500 text-xs mt-2">{errors.name}</div>}
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-3">Especificación de Categoría</label>
                                    <select
                                        className="w-full bg-primary-950 border-white/10 rounded-xl px-5 py-4 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light appearance-none"
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                        required
                                    >
                                        <option value="" className="bg-primary-950">Seleccione Categoría</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id} className="bg-primary-950">{c.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <div className="text-red-500 text-xs mt-2">{errors.category_id}</div>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-3">Ficha Técnica / Descripción</label>
                                <textarea
                                    className="w-full bg-primary-950 border-white/10 rounded-xl px-5 py-4 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light resize-none"
                                    rows="6"
                                    placeholder="Detalles de hardware, arquitectura, compatibilidad..."
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    required
                                ></textarea>
                                {errors.description && <div className="text-red-500 text-xs mt-2">{errors.description}</div>}
                            </div>

                            <div className="grid md:grid-cols-3 gap-10">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-3">Precio Base (CLP)</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-4.5 text-primary-500 font-mono italic">$</span>
                                        <input
                                            type="number"
                                            className="w-full bg-primary-950 border-white/10 rounded-xl pl-10 pr-5 py-4 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-mono"
                                            placeholder="0"
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {errors.price && <div className="text-red-500 text-xs mt-2">{errors.price}</div>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-3">Unidades en Existencia</label>
                                    <input
                                        type="number"
                                        className="w-full bg-primary-950 border-white/10 rounded-xl px-5 py-4 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-mono"
                                        placeholder="0"
                                        value={data.stock}
                                        onChange={e => setData('stock', e.target.value)}
                                        required
                                    />
                                    {errors.stock && <div className="text-red-500 text-xs mt-2">{errors.stock}</div>}
                                </div>
                                <div className="flex flex-col justify-end">
                                    <div className="flex items-center gap-4 p-4 bg-primary-950 rounded-xl border border-accent-500/20">
                                        <input
                                            type="checkbox"
                                            id="is_quotable"
                                            className="size-5 rounded bg-primary-900 border-white/10 text-accent-500 focus:ring-accent-500 ring-offset-primary-950"
                                            checked={data.is_quotable}
                                            onChange={e => setData('is_quotable', e.target.checked)}
                                        />
                                        <label htmlFor="is_quotable" className="text-[10px] font-bold uppercase tracking-widest text-white cursor-pointer select-none">
                                            Habilitar Cotización
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="py-10 border-y border-white/5">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-6">Fotografía Industrial</label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/5 border-dashed rounded-2xl cursor-pointer bg-primary-950 hover:bg-white/5 hover:border-accent-500/30 transition-all group">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-4 text-primary-500 group-hover:text-accent-500 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                            </svg>
                                            <p className="mb-2 text-xs text-primary-400 font-bold uppercase tracking-widest">Subir Imagen</p>
                                            <p className="text-[9px] text-primary-600 uppercase tracking-widest">PNG, JPG (MAX. 2MB)</p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={e => setData('image', e.target.files[0])}
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                                {errors.image && <div className="text-red-500 text-xs mt-2">{errors.image}</div>}
                            </div>

                            <div className="flex items-center gap-6 p-6 bg-accent-500/5 rounded-2xl border border-accent-500/10">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    className="size-6 rounded bg-primary-950 border-white/10 text-accent-500 focus:ring-accent-500 ring-offset-primary-950"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                />
                                <div className="flex flex-col">
                                    <label htmlFor="is_active" className="text-sm font-bold text-white cursor-pointer select-none">Publicar Inmediatamente</label>
                                    <p className="text-xs text-primary-400 font-light">Hacer visible este componente en el catálogo público después de guardar.</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-6 pt-6">
                                <Link
                                    href={route('admin.products.index')}
                                    className="px-8 py-5 text-primary-400 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors"
                                >
                                    Cancelar Operación
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-12 py-5 bg-accent-500 text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-accent-600 transition-all shadow-2xl shadow-accent-500/20 active:scale-[0.98] disabled:opacity-50"
                                >
                                    Ingresar al Inventario
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
