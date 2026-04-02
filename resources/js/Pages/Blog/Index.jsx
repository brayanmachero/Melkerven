import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function BlogIndex({ auth, posts, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const categories = ['noticias', 'guias', 'tecnologia', 'industria'];

    return (
        <PublicLayout auth={auth}>
            <Head>
                <title>Blog - Melkerven</title>
                <meta name="description" content="Noticias, guías técnicas y tendencias en hardware de servidores, networking y almacenamiento empresarial." />
            </Head>

            <section className="py-20 bg-primary-950 relative overflow-hidden min-h-screen">
                <div className="absolute top-0 left-0 size-96 bg-accent-500/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <Breadcrumbs items={[{ label: 'Blog' }]} />
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-accent-500"></div>
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-500">Conocimiento Técnico</span>
                        </div>
                        <h1 className="text-5xl sm:text-7xl font-display font-medium text-white mb-6 tracking-tighter">
                            Blog & <span className="text-accent-500 font-light">Noticias</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-12">
                        <Link href={route('blog.index')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${!filters.category ? 'bg-accent-500 text-white border-accent-500' : 'bg-transparent text-primary-400 border-white/10 hover:border-white/20 hover:text-white'}`}>
                            Todos
                        </Link>
                        {categories.map(cat => (
                            <Link key={cat} href={route('blog.index', { category: cat })} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all capitalize ${filters.category === cat ? 'bg-accent-500 text-white border-accent-500' : 'bg-transparent text-primary-400 border-white/10 hover:border-white/20 hover:text-white'}`}>
                                {cat}
                            </Link>
                        ))}
                        <form onSubmit={e => { e.preventDefault(); router.get(route('blog.index'), { ...filters, search }, { preserveState: true }); }} className="ml-auto w-full sm:w-64 relative">
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar artículo..." className="w-full bg-primary-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-accent-500" />
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </form>
                    </div>

                    {posts.data.length === 0 ? (
                        <div className="tech-card text-center py-20">
                            <p className="text-primary-400 text-lg">No hay artículos publicados aún.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.data.map(post => (
                                <Link key={post.id} href={route('blog.show', post.slug)} className="tech-card group overflow-hidden hover:border-accent-500/30 transition-all duration-500">
                                    {post.image_url ? (
                                        <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                                    ) : (
                                        <div className="w-full h-48 bg-primary-800 rounded-lg mb-4 flex items-center justify-center text-4xl opacity-20">📝</div>
                                    )}
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent-500 mb-2 block capitalize">{post.category}</span>
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-accent-400 transition-colors">{post.title}</h3>
                                    <p className="text-sm text-primary-400 line-clamp-3 font-light leading-relaxed mb-4">{post.excerpt}</p>
                                    <div className="flex items-center justify-between text-[10px] text-primary-500 uppercase tracking-widest">
                                        <span>{post.author?.name}</span>
                                        <span>{new Date(post.published_at).toLocaleDateString('es-CL')}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {posts.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-12">
                            {posts.links.map((link, i) => (
                                <Link key={i} href={link.url || '#'} className={`px-4 py-2 rounded-lg text-sm border transition-all ${link.active ? 'bg-accent-500 border-accent-500 text-white' : 'border-white/10 text-primary-400 hover:border-white/20'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
