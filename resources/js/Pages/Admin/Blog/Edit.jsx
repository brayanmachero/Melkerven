import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function BlogEdit({ auth, post: blogPost }) {
    const { data, setData, post, processing, errors } = useForm({
        title: blogPost.title,
        excerpt: blogPost.excerpt || '',
        content: blogPost.content,
        category: blogPost.category,
        tags: blogPost.tags || [],
        image: null,
        is_published: blogPost.is_published,
        _method: 'PUT',
    });

    const [tagInput, setTagInput] = useState('');

    const addTag = () => {
        if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
            setData('tags', [...data.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tag) => setData('tags', data.tags.filter(t => t !== tag));

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.blog.update', blogPost.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Editar: ${blogPost.title}`} />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Editar Artículo</h2>
                    <form onSubmit={handleSubmit} className="tech-card space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">Título</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full bg-primary-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-500" />
                            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">Categoría</label>
                                <select value={data.category} onChange={e => setData('category', e.target.value)} className="w-full bg-primary-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-500">
                                    <option value="noticias">Noticias</option>
                                    <option value="guias">Guías</option>
                                    <option value="tecnologia">Tecnología</option>
                                    <option value="industria">Industria</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">Imagen {blogPost.image_url && '(actual)'}</label>
                                {blogPost.image_url && <img src={blogPost.image_url} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />}
                                <input type="file" accept="image/*" onChange={e => setData('image', e.target.files[0])} className="w-full text-sm text-primary-400 file:bg-accent-500/20 file:border-accent-500/30 file:border file:rounded-lg file:px-3 file:py-2 file:text-accent-400 file:text-xs file:font-bold" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">Extracto</label>
                            <textarea value={data.excerpt} onChange={e => setData('excerpt', e.target.value)} rows={2} className="w-full bg-primary-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-500" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">Contenido (HTML)</label>
                            <textarea value={data.content} onChange={e => setData('content', e.target.value)} rows={12} className="w-full bg-primary-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-500 font-mono text-sm" />
                            {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">Tags</label>
                            <div className="flex gap-2">
                                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} className="flex-1 bg-primary-950 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-accent-500" placeholder="Agregar tag..." />
                                <button type="button" onClick={addTag} className="bg-accent-500/20 border border-accent-500/30 text-accent-400 px-4 rounded-xl text-sm font-bold hover:bg-accent-500/30">+</button>
                            </div>
                            {data.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {data.tags.map((tag, i) => (
                                        <span key={i} className="bg-white/5 border border-white/10 text-primary-300 px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                                            {tag}
                                            <button type="button" onClick={() => removeTag(tag)} className="text-red-400 hover:text-red-300">×</button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={data.is_published} onChange={e => setData('is_published', e.target.checked)} className="rounded bg-primary-950 border-white/10 text-accent-500 focus:ring-accent-500" />
                            <span className="text-sm text-white font-bold">Publicado</span>
                        </label>

                        <button type="submit" disabled={processing} className="w-full bg-accent-500 text-white py-3 rounded-xl font-bold hover:bg-accent-600 transition-colors disabled:opacity-50">
                            {processing ? 'Guardando...' : 'Actualizar Artículo'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
