import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function BlogIndex({ auth, posts }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Blog - Admin" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Artículos del Blog</h2>
                        <Link href={route('admin.blog.create')} className="bg-accent-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-accent-600 transition-colors">
                            Nuevo Artículo
                        </Link>
                    </div>

                    <div className="tech-card overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary-500">Título</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary-500">Categoría</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary-500">Estado</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary-500">Fecha</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary-500">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map(post => (
                                    <tr key={post.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-4 py-3 text-sm text-white font-medium">{post.title}</td>
                                        <td className="px-4 py-3 text-xs text-accent-500 uppercase font-bold">{post.category}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${post.is_published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                {post.is_published ? 'Publicado' : 'Borrador'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-primary-400">
                                            {post.published_at ? new Date(post.published_at).toLocaleDateString('es-CL') : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Link href={route('admin.blog.edit', post.id)} className="text-xs text-accent-400 hover:text-accent-300">Editar</Link>
                                                <button onClick={() => { if (confirm('¿Eliminar?')) router.delete(route('admin.blog.destroy', post.id)); }} className="text-xs text-red-400 hover:text-red-300">Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {posts.length === 0 && (
                                    <tr><td colSpan="5" className="px-4 py-8 text-center text-primary-400">No hay artículos.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
