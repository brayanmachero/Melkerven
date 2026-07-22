import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

const formatDateTime = (value) => value
    ? new Date(value).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' })
    : '';

export default function Show({ thread }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        thread_id: thread.id,
        to: thread.participant_email || '',
        subject: `Re: ${thread.subject}`,
        body: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.mail.send'), { onSuccess: () => reset('body') });
    };

    const toggleArchive = () => {
        router.patch(route('admin.mail.archive', thread.id), { archived: !thread.archived_at }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="min-w-0">
                    <Link href={route('admin.mail.index')} className="mb-1 inline-flex text-[10px] font-bold uppercase tracking-widest text-primary-500 transition hover:text-accent-400">← Volver al correo</Link>
                    <h2 className="truncate text-lg font-display font-bold text-white">{thread.subject}</h2>
                </div>
            }
        >
            <Head title={`${thread.subject} - Correo`} />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className={`rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${thread.status === 'open' ? 'border-green-500/20 bg-green-500/10 text-green-400' : 'border-primary-700 bg-primary-800 text-primary-400'}`}>
                                {thread.status === 'open' ? 'Conversación abierta' : 'Cerrada'}
                            </span>
                            {thread.mailbox && <span className="text-[10px] text-primary-500">Para: {thread.mailbox}</span>}
                        </div>
                        <button onClick={toggleArchive} className="rounded-lg border border-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-primary-400 transition hover:border-accent-500 hover:text-white">
                            {thread.archived_at ? 'Restaurar' : 'Archivar'}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {thread.messages.map((message) => {
                            const inbound = message.direction === 'inbound';
                            const messageDate = message.received_at || message.sent_at || message.created_at;

                            return (
                                <article key={message.id} className={`tech-card !p-0 overflow-hidden ${inbound ? 'border-white/10' : 'border-accent-500/20'}`}>
                                    <div className={`flex items-start gap-3 px-5 py-4 ${inbound ? 'bg-white/[0.02]' : 'bg-accent-500/[0.04]'}`}>
                                        <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${inbound ? 'bg-white/5 text-primary-400' : 'bg-accent-500/15 text-accent-400'}`}>
                                            {(inbound ? (message.from_name || message.from_address) : 'M').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                <p className="text-xs font-bold text-white">{inbound ? (message.from_name || message.from_address) : (message.sent_by?.name || 'Melkerven')}</p>
                                                <span className="text-[10px] text-primary-500">{inbound ? message.from_address : `para ${message.to_addresses?.join(', ')}`}</span>
                                            </div>
                                            <p className="mt-0.5 text-[10px] text-primary-600">{formatDateTime(messageDate)}</p>
                                        </div>
                                        <span className={`rounded-full px-2 py-1 text-[8px] font-bold uppercase tracking-widest ${inbound ? 'bg-white/5 text-primary-500' : 'bg-accent-500/10 text-accent-400'}`}>{inbound ? 'Recibido' : 'Enviado'}</span>
                                    </div>
                                    <div className="px-5 py-5">
                                        <p className="whitespace-pre-wrap text-sm leading-7 text-primary-200">{message.text_body || 'Este correo no contiene una versión de texto para previsualizar.'}</p>
                                        {message.attachments?.length > 0 && (
                                            <div className="mt-5 border-t border-white/5 pt-4">
                                                <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-primary-500">Adjuntos</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {message.attachments.map((attachment, index) => <span key={attachment.id || index} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] text-primary-300">📎 {attachment.filename || 'Archivo adjunto'}</span>)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <form onSubmit={submit} className="tech-card mt-5 !p-0 overflow-hidden">
                        <div className="border-b border-white/5 px-5 py-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Responder</h3>
                            <p className="mt-1 text-[10px] text-primary-500">La respuesta se enviará con la dirección verificada configurada en Resend.</p>
                        </div>
                        <div className="space-y-3 p-5">
                            {errors.mailbox && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">{errors.mailbox}</p>}
                            <input value={data.to} onChange={event => setData('to', event.target.value)} type="email" className="w-full border-b border-white/10 bg-transparent px-1 py-2 text-xs text-primary-300 outline-none focus:border-accent-500" required />
                            <input value={data.subject} onChange={event => setData('subject', event.target.value)} className="w-full border-b border-white/10 bg-transparent px-1 py-2 text-xs text-primary-300 outline-none focus:border-accent-500" required />
                            <textarea value={data.body} onChange={event => setData('body', event.target.value)} rows="7" className="w-full resize-none rounded-xl border border-white/10 bg-primary-950/60 p-4 text-sm text-white outline-none placeholder:text-primary-600 focus:border-accent-500" placeholder="Escribe tu respuesta..." required />
                            {errors.body && <p className="text-[10px] text-red-400">{errors.body}</p>}
                            <div className="flex justify-end">
                                <button disabled={processing} className="rounded-lg bg-accent-500 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-accent-600 disabled:opacity-50">{processing ? 'Enviando...' : 'Enviar respuesta'}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
