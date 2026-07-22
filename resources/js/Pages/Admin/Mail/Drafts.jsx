import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const formatDate = (value) => new Date(value).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });

export default function Drafts({ drafts }) {
    const { flash = {} } = usePage().props;

    const discard = (draft) => {
        if (window.confirm(`¿Eliminar el borrador “${draft.subject || 'Sin asunto'}”?`)) {
            router.delete(route('admin.mail.drafts.destroy', draft.id));
        }
    };

    return (
        <AuthenticatedLayout header={<div><Link href={route('admin.mail.index')} className="mb-1 inline-flex text-[10px] font-bold uppercase tracking-widest text-primary-500 transition hover:text-accent-400">← Volver al correo</Link><h2 className="text-lg font-display font-bold text-white">Borradores</h2></div>}>
            <Head title="Borradores - Admin" />
            <div className="py-6 sm:py-8"><div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="max-w-2xl text-xs leading-relaxed text-primary-500">Los borradores y sus adjuntos se conservan en almacenamiento privado hasta enviarlos o descartarlos.</p><Link href={route('admin.mail.index', { compose: 1 })} className="rounded-xl bg-accent-500 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-accent-600">+ Nuevo borrador</Link></div>
                {flash.success && <p className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-3 text-xs text-emerald-200">{flash.success}</p>}
                {drafts.data.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 bg-primary-900/40 p-12 text-center"><div className="text-3xl">✎</div><h3 className="mt-4 text-sm font-bold text-white">No hay borradores</h3><p className="mt-2 text-xs text-primary-500">Puedes guardar un correo incompleto y retomarlo cuando quieras.</p></div> : <div className="space-y-3">{drafts.data.map(draft => <article key={draft.id} className="rounded-2xl border border-white/10 bg-primary-900/70 p-5 shadow-xl shadow-black/10"><div className="flex flex-wrap items-start justify-between gap-4"><Link href={route('admin.mail.index', { draft: draft.id })} className="min-w-0 flex-1"><div className="flex flex-wrap gap-x-2 gap-y-1"><h3 className="truncate text-sm font-bold text-white">{draft.subject || '(Sin asunto)'}</h3>{draft.mail_account && <span className="text-[10px] text-sky-300">desde {draft.mail_account.display_name || draft.mail_account.address}</span>}</div><p className="mt-1 truncate text-xs text-primary-400">Para: {draft.to_address || 'sin destinatario'}</p><p className="mt-2 line-clamp-2 text-xs leading-relaxed text-primary-500">{draft.body || 'Borrador vacío'}</p></Link><button onClick={() => discard(draft)} className="rounded-lg border border-red-500/25 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-red-300 transition hover:bg-red-500/10">Descartar</button></div><div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/5 pt-3 text-[10px] text-primary-500"><span>Actualizado {formatDate(draft.updated_at)}</span>{draft.files.length > 0 && <span>📎 {draft.files.length} adjunto{draft.files.length === 1 ? '' : 's'}</span>}</div></article>)}</div>}
            </div></div>
        </AuthenticatedLayout>
    );
}
