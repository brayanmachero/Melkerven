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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Categorías</h2>}
        >
            <Head title="Categorías - Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Form Section */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">
                            {isEditing ? 'Editar Categoría' : 'Añadir Nueva Categoría'}
                        </h3>
                        <form onSubmit={submit} className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Ej: Servidores, Cables, Repuestos..."
                                />
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción (Opcional)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3 bg-primary-900 text-white font-bold rounded-xl hover:bg-primary-800 transition disabled:opacity-50"
                                >
                                    {isEditing ? 'Actualizar' : 'Guardar'}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => { setIsEditing(null); reset(); }}
                                        className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-[2rem] border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Productos</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-gray-900">{category.name}</div>
                                            <div className="text-sm text-gray-500">{category.description || '-'}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold">
                                                {category.products_count} productos
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 flex gap-4">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="text-primary-600 font-bold hover:text-primary-900 transition"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category)}
                                                className="text-red-500 font-bold hover:text-red-700 transition"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-10 text-center text-gray-500">
                                            No hay categorías registradas aún.
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
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center size-16 rounded-full bg-red-50 border border-red-200 mb-6">
                                <svg className="size-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Eliminar Categoría</h3>
                            <p className="text-gray-500 text-sm mb-1">¿Estás seguro de eliminar</p>
                            <p className="text-primary-700 font-bold mb-6">"{deleteTarget.name}"?</p>
                            <p className="text-gray-400 text-xs mb-8">Se eliminarán los productos asociados. Esta acción no se puede deshacer.</p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={processing}
                                    className="px-6 py-3 bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50"
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
