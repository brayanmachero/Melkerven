import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const labels = {
    'message.received': 'Correo recibido',
    'message.sent': 'Correo enviado',
    'draft.saved': 'Borrador guardado',
    'draft.discarded': 'Borrador descartado',
    'thread.archived': 'Conversación archivada',
    'thread.unarchived': 'Conversación desarchivada',
    'thread.trashed': 'Conversación enviada a papelera',
    'thread.restored': 'Conversación restaurada',
    'thread.purged': 'Conversación eliminada definitivamente',
};

const formatDate = (value) => new Date(value).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });

export default function History({ activities }) {
    return (
        <AuthenticatedLayout header={<div><Link href={route('admin.mail.index')} className="mb-1 inline-flex text-[10px] font-bold uppercase tracking-widest text-primary-500 transition hover:text-accent-400">← Volver al correo</Link><h2 className="text-lg font-display font-bold text-white">Historial de correo</h2></div>}>
            <Head title="Historial de correo - Admin" />
            <div className="py-6 sm:py-8"><div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"><p className="mb-5 max-w-2xl text-xs leading-relaxed text-primary-500">Registro de envíos, recepción, borradores y movimientos de conversaciones. No modifica ni reemplaza el contenido de los correos.</p>
                {activities.data.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 bg-primary-900/40 p-12 text-center"><div className="text-3xl">◷</div><h3 className="mt-4 text-sm font-bold text-white">Aún no hay actividad registrada</h3></div> : <div className="space-y-3">{activities.data.map(activity => <article key={activity.id} className="rounded-2xl border border-white/10 bg-primary-900/70 px-5 py-4 shadow-xl shadow-black/10"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-sm font-semibold text-white">{labels[activity.action] || activity.action}</p><p className="mt-1 text-xs text-primary-500">{activity.metadata?.subject || activity.thread?.subject || 'Sin asunto'}{activity.mail_account && ` · ${activity.mail_account.display_name || activity.mail_account.address}`}</p></div><span className="text-[10px] text-primary-500">{formatDate(activity.created_at)}</span></div><p className="mt-2 text-[10px] text-primary-600">{activity.actor ? `Por ${activity.actor.name}` : 'Procesado automáticamente'}</p></article>)}</div>}
            </div></div>
        </AuthenticatedLayout>
    );
}
