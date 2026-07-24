import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Head, Link } from '@inertiajs/react';

export default function BlogShow({ auth, post, relatedPosts }) {
    const publishedDate = new Date(post.published_at).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <PublicLayout auth={auth}>
            <Head>
                <title>{post.title} | Melkerven</title>
                <meta name="description" content={post.excerpt || post.title} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt || post.title} />
                {post.image_url && <meta property="og:image" content={post.image_url} />}
            </Head>

            <section className="relative min-h-screen overflow-hidden bg-cloud-50 py-16 sm:py-20">
                <div className="public-network absolute inset-0 opacity-55" />
                <div className="pointer-events-none absolute right-[-10rem] top-[-8rem] size-[32rem] rounded-full bg-signal-300/25 blur-[110px]" />
                <div className="section-shell relative z-10 max-w-5xl">
                    <Breadcrumbs items={[{ label: 'Blog', href: route('blog.index') }, { label: post.title }]} />

                    <article className="mx-auto mt-9 max-w-3xl">
                        <header>
                            <p className="public-eyebrow capitalize">{post.category}</p>
                            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.06em] text-ink-950 sm:text-6xl">{post.title}</h1>
                            <p className="mt-6 text-lg leading-8 text-ink-600">{post.excerpt}</p>
                            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-ink-500">
                                <span>{post.author?.name || 'Equipo Melkerven'}</span>
                                <span aria-hidden="true">•</span>
                                <time dateTime={post.published_at}>{publishedDate}</time>
                                <span className="ml-auto rounded-full border border-signal-200 bg-white/80 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-signal-700">Guía técnica original</span>
                            </div>
                        </header>

                        {post.image_url && <figure className="relative mt-10 overflow-hidden rounded-3xl border border-white/80 bg-white p-2 shadow-[0_24px_60px_rgba(31,62,82,.12)]"><img src={post.image_url} alt="Imagen referencial para el artículo" className="aspect-[16/8] w-full rounded-[1.25rem] object-cover" loading="eager" /><figcaption className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-ink-400">Imagen referencial</figcaption></figure>}

                        <div className="mt-10 rounded-3xl border border-ink-100 bg-white p-6 shadow-[0_16px_40px_rgba(31,62,82,.08)] sm:p-10">
                            <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>

                        {post.tags?.length > 0 && <div className="mt-7 flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-ink-500">{tag}</span>)}</div>}
                    </article>

                    {relatedPosts?.length > 0 && <section className="mx-auto mt-16 max-w-5xl border-t border-ink-200 pt-12"><div className="flex items-end justify-between gap-4"><div><p className="public-eyebrow">Centro de recursos</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink-950">Siga explorando</h2></div><Link href={route('blog.index')} className="text-[10px] font-bold uppercase tracking-widest text-signal-700 hover:text-signal-500">Ver todos</Link></div><div className="mt-8 grid gap-5 sm:grid-cols-3">{relatedPosts.map((related) => <Link key={related.id} href={route('blog.show', related.slug)} className="group overflow-hidden rounded-2xl border border-ink-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-signal-300"><div className="overflow-hidden rounded-xl bg-cloud-50">{related.image_url ? <img src={related.image_url} alt="" className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /> : <div className="aspect-[16/9]" />}</div><p className="mt-4 text-[9px] font-bold uppercase tracking-widest text-signal-700 capitalize">{related.category}</p><h3 className="mt-2 line-clamp-2 text-base font-semibold leading-tight text-ink-950 transition group-hover:text-signal-700">{related.title}</h3></Link>)}</div></section>}
                </div>
            </section>
        </PublicLayout>
    );
}
