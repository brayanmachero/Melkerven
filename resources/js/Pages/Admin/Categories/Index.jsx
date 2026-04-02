import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, categories }) {
    const [isEditing, setIsEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.categories.update', isEditing), {
                onSuccess: () => {
                    setIsEditing(null);
                    reset();
                }
            });
        } else {
            post(route('admin.categories.store'), {
                onSuccess: () => reset()
            });
        }
    };

    const handleEdit = (category) => {
        setIsEditing(category.id);
        setData({
            name: category.name,
            description: category.description || '',
        });
    };

    const handleDelete = (category) => {
        setDeleteTarget(category);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        destroy(route('admin.categories.destroy', deleteTarget.id), {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-xl font-display font-bold text-white">
                    Gestión de <span className="text-accent-500">Categorías</span>
                </h2>
            }
        >
            <Head title="Categorías - Admin" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
                {/* Form Section */}
                <div className="bg-primary-900/50 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white mb-4">
                        {isEditing ? 'Editar Categoría' : 'Añadir Nueva Categoría'}
                    </h3>
                    <form onSubmit={submit} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-2">Nombre</label>
                            <input
                                type="text"
                                className="w-full bg-primary-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-500 focus:ring-accent-500/20 placeholder:text-primary-600 transition"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Ej: Servidores, Cables, Repuestos..."
                            />
                            {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-2">Descripción (Opcional)</label>
                            <input
                                type="text"
                                className="w-full bg-primary-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-500 focus:ring-accent-500/20 placeholder:text-primary-600 transition"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Breve descripción de la categoría"
                            />
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-accent-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-accent-600 transition disabled:opacity-50"
                            >
                                {isEditing ? 'Actualizar' : 'Guardar'}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => { setIsEditing(null); reset(); }}
                                    className="px-6 py-3 bg-white/5 text-primary-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 border border-white/10 transition"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table Section */}
                <div className="bg-primary-900/50 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-primary-500">Nombre</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-primary-500">Productos</th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-primary-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white text-sm">{category.name}</div>
                                        <div className="text-xs text-primary-500 mt-0.5">{category.description || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-accent-500/10 text-accent-400 border border-accent-500/20 rounded-full text-[10px] font-bold">
                                            {category.products_count} productos
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-3 justify-end">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="text-[10px] font-bold uppercase tracking-widest text-accent-400 hover:text-accent-300 transition"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category)}
                                                className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-primary-500 text-sm">
                                        No hay categorías registradas aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-primary-900 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center size-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
                                <svg className="size-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Eliminar Categoría</h3>
                            <p className="text-primary-400 text-sm mb-1">¿Estás seguro de eliminar</p>
                            <p className="text-accent-400 font-bold mb-6">"{deleteTarget.name}"?</p>
                            <p className="text-primary-600 text-xs mb-8">Se eliminarán los productos asociados. Esta acción no se puede deshacer.</p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="px-6 py-3 bg-white/5 text-primary-400 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
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
