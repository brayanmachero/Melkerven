import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Head, Link } from '@inertiajs/react';

export default function BlogShow({ auth, post, relatedPosts }) {
    return (
        <PublicLayout auth={auth}>
            <Head>
                <title>{post.title} - Melkerven Blog</title>
                <meta name="description" content={post.excerpt || post.title} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt || post.title} />
                {post.image_url && <meta property="og:image" content={post.image_url} />}
            </Head>

            <section className="py-20 bg-primary-950 relative overflow-hidden min-h-screen">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
                    <Breadcrumbs items={[{ label: 'Blog', href: route('blog.index') }, { label: post.title }]} />

                    <article>
                        <div className="mb-8">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-500 mb-4 block capitalize">{post.category}</span>
                            <h1 className="text-4xl sm:text-5xl font-display font-medium text-white mb-6 tracking-tighter leading-tight">{post.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-primary-400">
                                <span>{post.author?.name}</span>
                                <span>·</span>
                                <span>{new Date(post.published_at).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>

                        {post.image_url && (
                            <img src={post.image_url} alt={post.title} className="w-full h-80 object-cover rounded-2xl mb-10" />
                        )}

                        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-accent-400 prose-strong:text-white" dangerouslySetInnerHTML={{ __html: post.content }} />

                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/10">
                                {post.tags.map((tag, i) => (
                                    <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-primary-400 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">{tag}</span>
                                ))}
                            </div>
                        )}
                    </article>

                    {relatedPosts.length > 0 && (
                        <div className="mt-16 pt-12 border-t border-white/10">
                            <h3 className="text-2xl font-display font-medium text-white mb-8 tracking-tight">Artículos Relacionados</h3>
                            <div className="grid sm:grid-cols-3 gap-6">
                                {relatedPosts.map(rp => (
                                    <Link key={rp.id} href={route('blog.show', rp.slug)} className="tech-card group hover:border-accent-500/30 transition-all">
                                        {rp.image_url ? (
                                            <img src={rp.image_url} alt={rp.title} className="w-full h-32 object-cover rounded-lg mb-3" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-32 bg-primary-800 rounded-lg mb-3"></div>
                                        )}
                                        <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-accent-400 transition-colors">{rp.title}</h4>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
