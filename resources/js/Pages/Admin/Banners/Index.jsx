import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function BannersIndex({ banners }) {
    const [editing, setEditing] = useState(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '', subtitle: '', button_text: '', button_url: '',
        image: null, sort_order: 0, is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            router.post(route('admin.banners.update', editing), {
                ...data, _method: 'PATCH',
            }, { onSuccess: () => { reset(); setEditing(null); } });
        } else {
            post(route('admin.banners.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const startEdit = (banner) => {
        setEditing(banner.id);
        setData({
            title: banner.title, subtitle: banner.subtitle || '',
            button_text: banner.button_text || '', button_url: banner.button_url || '',
            image: null, sort_order: banner.sort_order, is_active: banner.is_active,
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-display font-bold text-white">Gestión de Banners</h2>}>
            <Head title="Banners" />
            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Form */}
                <form onSubmit={submit} className="bg-primary-900/50 border border-white/10 rounded-2xl p-6 mb-8">
                    <h3 className="text-white font-bold mb-4">{editing ? 'Editar Banner' : 'Nuevo Banner'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-primary-400 mb-1 uppercase tracking-widest font-bold">Título</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                                className="w-full bg-primary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent-500/50 focus:outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs text-primary-400 mb-1 uppercase tracking-widest font-bold">Subtítulo</label>
                            <input type="text" value={data.subtitle} onChange={e => setData('subtitle', e.target.value)}
                                className="w-full bg-primary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent-500/50 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs text-primary-400 mb-1 uppercase tracking-widest font-bold">Texto del Botón</label>
                            <input type="text" value={data.button_text} onChange={e => setData('button_text', e.target.value)}
                                className="w-full bg-primary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent-500/50 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs text-primary-400 mb-1 uppercase tracking-widest font-bold">URL del Botón</label>
                            <input type="text" value={data.button_url} onChange={e => setData('button_url', e.target.value)}
                                className="w-full bg-primary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent-500/50 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs text-primary-400 mb-1 uppercase tracking-widest font-bold">Imagen</label>
                            <input type="file" accept="image/*" onChange={e => setData('image', e.target.files[0])}
                                className="w-full text-primary-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent-500/10 file:text-accent-400 file:font-bold file:text-xs" />
                        </div>
                        <div className="flex items-center gap-6">
                            <div>
                                <label className="block text-xs text-primary-400 mb-1 uppercase tracking-widest font-bold">Orden</label>
                                <input type="number" value={data.sort_order} onChange={e => setData('sort_order', parseInt(e.target.value))}
                                    className="w-20 bg-primary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-accent-500/50 focus:outline-none" />
                            </div>
                            <label className="flex items-center gap-2 mt-4 cursor-pointer">
                                <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)}
                                    className="rounded bg-primary-800/50 border-white/20 text-accent-500 focus:ring-accent-500" />
                                <span className="text-sm text-primary-300">Activo</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button type="submit" disabled={processing}
                            className="px-6 py-2.5 bg-accent-500 text-white rounded-xl text-sm font-bold hover:bg-accent-600 transition disabled:opacity-50">
                            {editing ? 'Actualizar' : 'Crear Banner'}
                        </button>
                        {editing && (
                            <button type="button" onClick={() => { reset(); setEditing(null); }}
                                className="px-6 py-2.5 bg-white/5 text-primary-300 rounded-xl text-sm font-bold hover:bg-white/10 transition border border-white/10">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>

                {/* List */}
                <div className="space-y-3">
                    {banners.length === 0 ? (
                        <div className="text-center py-12 text-primary-500">No hay banners creados.</div>
                    ) : banners.map(banner => (
                        <div key={banner.id} className="bg-primary-900/50 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                            {banner.image_url && (
                                <img src={banner.image_url} alt={banner.title} className="w-24 h-16 object-cover rounded-lg" />
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-sm truncate">{banner.title}</h4>
                                <p className="text-primary-500 text-xs truncate">{banner.subtitle}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${banner.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {banner.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(banner)}
                                    className="px-3 py-1.5 bg-white/5 text-primary-300 rounded-lg text-xs font-bold hover:bg-white/10 border border-white/10 transition">
                                    Editar
                                </button>
                                <button onClick={() => { if(confirm('¿Eliminar banner?')) router.delete(route('admin.banners.destroy', banner.id)) }}
                                    className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/20 border border-red-500/20 transition">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
