import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ auth, product, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: product.name || '',
        category_id: product.category_id || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        image: null,
        _method: 'put',
        is_active: product.is_active ?? true,
        is_quotable: product.is_quotable ?? false,
        warranty: product.warranty || '12 Meses',
        specifications: product.specifications || [],
    });

    const addSpec = () => {
        setData('specifications', [...data.specifications, { label: '', value: '' }]);
    };

    const removeSpec = (index) => {
        setData('specifications', data.specifications.filter((_, i) => i !== index));
    };

    const updateSpec = (index, field, value) => {
        const updated = [...data.specifications];
        updated[index][field] = value;
        setData('specifications', updated);
    };

    const submit = (e) => {
        e.preventDefault();
        // Use post with _method: 'put' due to Laravel/Inertia file upload limitations with PUT
        post(route('admin.products.update', product.id));
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('admin.products.index')} className="size-8 flex items-center justify-center bg-white/5 text-primary-400 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                    <h2 className="text-lg font-display font-bold text-white">
                        Editar <span className="text-accent-500">Producto</span>
                    </h2>
                </div>
            }
        >
            <Head title={`Editar ${product.name} - Admin`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 relative z-10">
                    <div className="tech-card !p-12 relative overflow-hidden bg-primary-900 shadow-3xl">
                        {/* Status tag */}
                        <div className="absolute top-12 right-12">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${data.is_active ? 'bg-accent-500/10 text-accent-400 border-accent-500/30' : 'bg-white/5 text-primary-500 border-white/10'}`}>
                                {data.is_active ? 'Activo en Catálogo' : 'Oculto / Borrador'}
                            </span>
                        </div>

                        <form onSubmit={submit} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-3">Identificación del Producto</label>
                                    <input
                                        type="text"
                                        className="w-full bg-primary-950 border-white/10 rounded-xl px-5 py-4 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light"
                                        placeholder="Nombre del componente"
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
                                        value={data.stock}
                                        onChange={e => setData('stock', e.target.value)}
                                        required
                                    />
                                    {errors.stock && <div className="text-red-500 text-xs mt-2">{errors.stock}</div>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-3">Garantía</label>
                                    <input
                                        type="text"
                                        className="w-full bg-primary-950 border-white/10 rounded-xl px-5 py-4 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light"
                                        placeholder="Ej: 12 Meses"
                                        value={data.warranty}
                                        onChange={e => setData('warranty', e.target.value)}
                                    />
                                </div>
                            </div>

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

                            {/* Dynamic Specifications */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500">Especificaciones Técnicas</label>
                                    <button
                                        type="button"
                                        onClick={addSpec}
                                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent-400 hover:text-accent-300 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        Agregar Spec
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {data.specifications.map((spec, index) => (
                                        <div key={index} className="flex gap-3 items-start">
                                            <input
                                                type="text"
                                                className="flex-1 bg-primary-950 border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light"
                                                placeholder="Ej: Procesador, RAM, Almacenamiento..."
                                                value={spec.label}
                                                onChange={e => updateSpec(index, 'label', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="flex-1 bg-primary-950 border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light"
                                                placeholder="Ej: Intel Xeon E5-2690 v4"
                                                value={spec.value}
                                                onChange={e => updateSpec(index, 'value', e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSpec(index)}
                                                className="size-11 shrink-0 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                    {data.specifications.length === 0 && (
                                        <p className="text-xs text-primary-600 italic py-4 text-center border border-dashed border-white/5 rounded-xl">Sin especificaciones. Haz clic en "Agregar Spec" para añadir.</p>
                                    )}
                                </div>
                                {errors.specifications && <div className="text-red-500 text-xs mt-2">{errors.specifications}</div>}
                            </div>

                            <div className="grid md:grid-cols-2 gap-10 items-center border-y border-white/5 py-10">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-3">Visual del Producto</label>
                                    <input
                                        type="file"
                                        className="w-full text-xs text-primary-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-accent-500 file:text-white hover:file:bg-accent-600 transition-all cursor-pointer"
                                        onChange={e => setData('image', e.target.files[0])}
                                        accept="image/*"
                                    />
                                    {errors.image && <div className="text-red-500 text-xs mt-2">{errors.image}</div>}
                                </div>
                                <div className="flex items-center justify-end gap-6">
                                    {product.image_url && (
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-bold uppercase text-primary-500">Actual:</span>
                                            <img src={product.image_url} alt={product.name} className="size-20 object-cover rounded-xl border border-white/10 ring-1 ring-white/5 shadow-2xl" />
                                        </div>
                                    )}
                                </div>
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
                                    <label htmlFor="is_active" className="text-sm font-bold text-white cursor-pointer select-none">Visibilidad Pública</label>
                                    <p className="text-xs text-primary-400 font-light">Activar para que el producto sea visible en el catálogo de Melkerven.</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-6 pt-6">
                                <Link
                                    href={route('admin.products.index')}
                                    className="px-8 py-5 text-primary-400 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors"
                                >
                                    Descartar Cambios
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-12 py-5 bg-accent-500 text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-accent-600 transition-all shadow-2xl shadow-accent-500/20 active:scale-[0.98] disabled:opacity-50"
                                >
                                    Actualizar Infraestructura
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
