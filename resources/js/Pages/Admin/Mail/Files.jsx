import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatSize = (bytes) => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
const formatDate = (value) => new Date(value).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });

export default function Files({ files }) {
    return (
        <AuthenticatedLayout header={<div><Link href={route('admin.mail.index')} className="mb-1 inline-flex text-[10px] font-bold uppercase tracking-widest text-primary-500 transition hover:text-accent-400">← Volver al correo</Link><h2 className="text-lg font-display font-bold text-white">Archivos de correo</h2></div>}>
            <Head title="Archivos de correo - Admin" />
            <div className="py-6 sm:py-8"><div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"><p className="mb-5 max-w-2xl text-xs leading-relaxed text-primary-500">Adjuntos entrantes y salientes disponibles para los buzones a los que tienes acceso. Los archivos siguen siendo privados.</p>
                {files.data.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 bg-primary-900/40 p-12 text-center"><div className="text-3xl">📎</div><h3 className="mt-4 text-sm font-bold text-white">No hay archivos aún</h3></div> : <div className="overflow-hidden rounded-2xl border border-white/10 bg-primary-900/70 shadow-xl shadow-black/10">{files.data.map(file => <div key={file.id} className="flex flex-wrap items-center gap-4 border-b border-white/5 px-5 py-4 last:border-0"><div className="flex size-10 items-center justify-center rounded-xl bg-white/[0.04] text-lg">📄</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{file.filename}</p><p className="mt-1 text-[10px] text-primary-500">{file.message?.thread?.subject || 'Conversación'} · {formatSize(file.size)} · {formatDate(file.created_at)}{file.message?.thread?.deleted_at && ' · En papelera'}</p></div><a href={file.download_url} className="rounded-lg border border-sky-500/30 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-sky-300 transition hover:bg-sky-500/10">Descargar</a></div>)}</div>}
            </div></div>
        </AuthenticatedLayout>
    );
}
