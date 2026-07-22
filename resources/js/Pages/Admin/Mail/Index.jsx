import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MailPwaInstall from '@/Components/MailPwaInstall';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const folders = [
    { key: 'inbox', label: 'Recibidos', icon: '↓' },
    { key: 'sent', label: 'Enviados', icon: '↑' },
    { key: 'archived', label: 'Archivados', icon: '⌁' },
    { key: 'trash', label: 'Papelera', icon: '⌫' },
];

const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    const today = new Date();

    return date.toDateString() === today.toDateString()
        ? date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' });
};

const formatDateTime = (value) => value
    ? new Date(value).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' })
    : '';

function SignaturePreview({ html }) {
    if (!html) return null;

    return (
        <div className="rounded-lg border border-white/10 bg-primary-950/50 px-3 py-2">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-primary-600">Firma adjunta</p>
            <iframe title="Vista previa de firma" sandbox="" srcDoc={html} className="h-20 w-full border-0 bg-white" />
        </div>
    );
}

function ReadingPane({ thread, folder }) {
    const toggleArchive = () => {
        router.patch(
            route('admin.mail.archive', thread.id),
            { archived: !thread.archived_at },
            { preserveScroll: true },
        );
    };

    const moveToTrash = () => {
        router.delete(route('admin.mail.trash', thread.id));
    };

    const restore = () => {
        router.patch(route('admin.mail.restore', thread.id));
    };

    const purge = () => {
        if (window.confirm('Esta conversación y sus adjuntos se eliminarán definitivamente. ¿Deseas continuar?')) {
            router.delete(route('admin.mail.purge', thread.id));
        }
    };

    return (
        <section className="flex min-h-[640px] min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-primary-900/70 shadow-xl shadow-black/10">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/5 px-5 py-4">
                <div className="min-w-0">
                    <Link href={route('admin.mail.index', { folder })} className="mb-3 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-accent-400 transition hover:text-white xl:hidden">
                        ← Volver a la bandeja
                    </Link>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest ${thread.status === 'open' ? 'border-green-500/20 bg-green-500/10 text-green-400' : 'border-primary-700 bg-primary-800 text-primary-400'}`}>
                            {thread.status === 'open' ? 'Conversación abierta' : 'Cerrada'}
                        </span>
                        {thread.mailbox && <span className="text-[10px] text-primary-500">Para: {thread.mailbox}</span>}
                    </div>
                    <h3 className="truncate text-base font-bold text-white">{thread.subject}</h3>
                    <p className="mt-1 text-[10px] text-primary-500">{thread.messages.length} mensaje{thread.messages.length === 1 ? '' : 's'} en esta conversación</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {folder === 'trash' ? <>
                        <button type="button" onClick={restore} className="rounded-lg border border-emerald-500/30 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-emerald-300 transition hover:bg-emerald-500/10">Restaurar</button>
                        <button type="button" onClick={purge} className="rounded-lg border border-red-500/30 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-red-300 transition hover:bg-red-500/10">Eliminar definitivo</button>
                    </> : <>
                        <button type="button" onClick={toggleArchive} className="rounded-lg border border-white/10 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-primary-400 transition hover:border-accent-500 hover:text-white">
                            {thread.archived_at ? 'Restaurar archivo' : 'Archivar'}
                        </button>
                        <button type="button" onClick={moveToTrash} className="rounded-lg border border-red-500/20 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-red-300 transition hover:border-red-500/60 hover:text-white">Papelera</button>
                    </>}
                </div>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
                {thread.messages.map((message) => {
                    const inbound = message.direction === 'inbound';
                    const messageDate = message.received_at || message.sent_at || message.created_at;

                    return (
                        <article key={message.id} className={`overflow-hidden rounded-xl border ${inbound ? 'border-white/10 bg-white/[0.02]' : 'border-accent-500/20 bg-accent-500/[0.035]'}`}>
                            <div className="flex items-start gap-3 border-b border-white/5 px-4 py-3">
                                <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${inbound ? 'bg-white/5 text-primary-300' : 'bg-accent-500/15 text-accent-400'}`}>
                                    {(inbound ? (message.from_name || message.from_address) : (message.sent_by?.name || 'M')).charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <p className="text-xs font-bold text-white">{inbound ? (message.from_name || message.from_address) : (message.sent_by?.name || 'Melkerven')}</p>
                                        <span className="truncate text-[10px] text-primary-500">{inbound ? message.from_address : `para ${message.to_addresses?.join(', ')}`}</span>
                                    </div>
                                    <p className="mt-0.5 text-[9px] text-primary-600">{formatDateTime(messageDate)}</p>
                                </div>
                                <span className={`rounded-full px-2 py-1 text-[8px] font-bold uppercase tracking-widest ${inbound ? 'bg-white/5 text-primary-500' : 'bg-accent-500/10 text-accent-400'}`}>{inbound ? 'Recibido' : 'Enviado'}</span>
                            </div>
                            <div className="px-4 py-4">
                                <p className="whitespace-pre-wrap text-sm leading-7 text-primary-200">{message.text_body || 'Este correo no contiene una versión de texto para previsualizar.'}</p>
                                {(message.files?.length > 0 || message.attachments?.length > 0) && (
                                    <div className="mt-4 border-t border-white/5 pt-3">
                                        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-primary-500">Adjuntos</p>
                                        <div className="flex flex-wrap gap-2">
                                            {message.files?.map((attachment) => attachment.is_previewable ? (
                                                <a key={attachment.id} href={attachment.download_url} className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition hover:border-accent-500/60" title={`Descargar ${attachment.filename}`}>
                                                    <img src={attachment.preview_url} alt={attachment.filename} className="h-24 w-32 object-cover transition group-hover:scale-[1.03]" />
                                                    <span className="block max-w-32 truncate px-2 py-1.5 text-[9px] text-primary-300">🖼 {attachment.filename}</span>
                                                </a>
                                            ) : (
                                                <a key={attachment.id} href={attachment.download_url} className="flex max-w-52 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] text-primary-300 transition hover:border-accent-500/60 hover:text-white" title={`Descargar ${attachment.filename}`}>
                                                    <span className="text-sm">📎</span><span className="truncate">{attachment.filename}</span>
                                                </a>
                                            ))}
                                            {message.attachments?.filter(metadata => !message.files?.some(file => file.provider_attachment_id === metadata.id)).map((attachment, index) => (
                                                <span key={attachment.id || index} className="max-w-52 truncate rounded-lg border border-amber-500/20 bg-amber-500/[0.04] px-3 py-2 text-[10px] text-amber-200" title="El archivo llegó, pero aún no se pudo guardar localmente.">📎 {attachment.filename || 'Archivo pendiente'}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>

            <div className="border-t border-white/5 bg-primary-950/25 px-5 py-3 text-[10px] text-primary-500">
                Responder abre el redactor. La firma del usuario se incorporará automáticamente al envío.
            </div>
        </section>
    );
}

export default function Index({ folder, threads, counts, selectedThread, selectedDraft, mailAccounts = [], preferences }) {
    const [composeOpen, setComposeOpen] = useState(false);
    const defaultMailAccountId = selectedThread
        ? (selectedThread.mail_account_id ?? '')
        : (selectedDraft?.mail_account_id ?? mailAccounts[0]?.id ?? '');
    const { data, setData, post, processing, errors, reset } = useForm({
        to: selectedDraft?.to_address || selectedThread?.participant_email || '',
        subject: selectedDraft?.subject ?? (selectedThread ? `Re: ${selectedThread.subject}` : ''),
        body: selectedDraft?.body || '',
        thread_id: selectedThread?.id || null,
        draft_id: selectedDraft?.id || null,
        mail_account_id: defaultMailAccountId,
        attachments: [],
    });

    const openComposer = () => {
        setData({
            to: selectedDraft?.to_address || selectedThread?.participant_email || '',
            subject: selectedDraft?.subject ?? (selectedThread ? `Re: ${selectedThread.subject}` : ''),
            body: selectedDraft?.body || '',
            thread_id: selectedThread?.id || null,
            draft_id: selectedDraft?.id || null,
            mail_account_id: defaultMailAccountId,
            attachments: [],
        });
        setComposeOpen(true);
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.get('compose') === '1' || selectedDraft) {
            openComposer();
        }
    }, []);

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.mail.send'), {
            onSuccess: () => {
                reset();
                setComposeOpen(false);
            },
        });
    };

    const saveDraft = () => {
        post(route('admin.mail.drafts.save'), {
            onSuccess: () => setComposeOpen(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <div className="mb-1 flex items-center gap-3">
                        <div className="h-px w-7 bg-accent-500" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-accent-500">Central de comunicaciones</span>
                    </div>
                    <h2 className="text-lg font-display font-bold text-white">Correo</h2>
                </div>
            }
        >
            <Head title="Correo - Admin" />

            <div className="py-5 sm:py-6">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-4 xl:grid-cols-[205px_minmax(300px,380px)_minmax(430px,1fr)]">
                        <aside className={`${selectedThread ? 'hidden xl:block' : ''} h-fit rounded-2xl border border-white/10 bg-primary-900/70 p-3 shadow-xl shadow-black/10`}>
                            <button type="button" onClick={openComposer} className="w-full rounded-xl bg-accent-500 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-accent-500/20 transition hover:bg-accent-600">
                                + Redactar
                            </button>

                            <nav className="mt-4 space-y-1">
                                {folders.map((item) => (
                                    <Link key={item.key} href={route('admin.mail.index', { folder: item.key })} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${folder === item.key ? 'bg-accent-500/10 text-accent-400' : 'text-primary-400 hover:bg-white/5 hover:text-white'}`}>
                                        <span className="text-base leading-none">{item.icon}</span>
                                        <span>{item.label}</span>
                                        {counts[item.key] > 0 && <span className="ml-auto text-[10px] text-primary-500">{counts[item.key]}</span>}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mx-3 my-4 h-px bg-white/5" />
                            <Link href={route('admin.mail.settings')} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-primary-400 transition hover:bg-white/5 hover:text-white">
                                <span className="text-base leading-none">⚙</span>
                                Preferencias
                            </Link>
                            <p className="px-3 pt-4 text-[10px] leading-relaxed text-primary-500">Notificaciones, firma y alertas se configuran por usuario.</p>
                            <div className="mx-3 my-4 h-px bg-white/5" />
                            <Link href={route('admin.mail.drafts')} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-primary-400 transition hover:bg-white/5 hover:text-white"><span className="text-base leading-none">✎</span><span>Borradores</span>{counts.drafts > 0 && <span className="ml-auto text-[10px] text-primary-500">{counts.drafts}</span>}</Link>
                            <Link href={route('admin.mail.files')} className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-primary-400 transition hover:bg-white/5 hover:text-white"><span className="text-base leading-none">📎</span><span>Archivos</span></Link>
                            <Link href={route('admin.mail.history')} className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-primary-400 transition hover:bg-white/5 hover:text-white"><span className="text-base leading-none">◷</span><span>Historial</span></Link>
                            <MailPwaInstall />
                        </aside>

                        <section className={`${selectedThread ? 'hidden xl:block' : ''} min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-primary-900/70 shadow-xl shadow-black/10`}>
                            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
                                <div>
                                <h3 className="text-sm font-bold text-white">{folders.find(item => item.key === folder)?.label}</h3>
                                    <p className="mt-0.5 text-[10px] text-primary-500">{threads.total} {threads.total === 1 ? 'conversación' : 'conversaciones'}</p>
                                </div>
                                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest text-primary-400">Equipo</span>
                            </div>

                            {threads.data.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {threads.data.map((thread) => {
                                        const isSelected = selectedThread?.id === thread.id;

                                        return (
                                            <Link key={thread.id} href={route('admin.mail.index', { folder, selected: thread.id })} className={`group block border-l-2 px-4 py-4 transition ${isSelected ? 'border-accent-500 bg-accent-500/[0.08]' : thread.unread_count > 0 ? 'border-transparent bg-accent-500/[0.035] hover:bg-white/[0.04]' : 'border-transparent hover:bg-white/[0.04]'}`}>
                                                <div className="flex gap-3">
                                                    <div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${thread.unread_count > 0 ? 'bg-accent-500/15 text-accent-400' : 'bg-white/5 text-primary-500'}`}>
                                                        {(thread.participant_name || thread.participant_email || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className={`truncate text-xs ${thread.unread_count > 0 ? 'font-bold text-white' : 'font-semibold text-primary-300'}`}>{thread.participant_name || thread.participant_email || 'Remitente desconocido'}</p>
                                                            {thread.unread_count > 0 && <span className="size-1.5 shrink-0 rounded-full bg-accent-500" />}
                                                            {thread.message_count > 1 && <span className="text-[10px] text-primary-600">({thread.message_count})</span>}
                                                        </div>
                                                        <p className={`mt-1 truncate text-xs ${thread.unread_count > 0 ? 'font-semibold text-primary-200' : 'text-primary-400'}`}>{thread.subject}</p>
                                                        <p className="mt-1 truncate text-[11px] text-primary-600">{thread.last_preview || 'Sin vista previa disponible.'}</p>
                                                    </div>
                                                    <div className="flex shrink-0 flex-col items-end gap-2">
                                                        <span className="text-[9px] text-primary-500">{formatDate(thread.last_message_at)}</span>
                                                        {thread.last_direction === 'outbound' && <span className="text-[8px] font-bold uppercase tracking-wider text-blue-400">Enviado</span>}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="px-6 py-24 text-center">
                                    <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-accent-500/20 bg-accent-500/10 text-2xl">✉</div>
                                    <h4 className="text-sm font-bold text-white">Tu bandeja está lista</h4>
                                    <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-primary-500">Cuando conectemos el dominio a Resend, los correos llegarán a este panel.</p>
                                </div>
                            )}
                        </section>

                        {selectedThread ? (
                            <ReadingPane thread={selectedThread} folder={folder} />
                        ) : (
                            <section className="flex min-h-[640px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-primary-900/40 p-8 text-center">
                                <div className="max-w-xs">
                                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/[0.03] text-2xl">↗</div>
                                    <h3 className="text-sm font-bold text-white">Selecciona una conversación</h3>
                                    <p className="mt-2 text-xs leading-relaxed text-primary-500">La lectura se abre aquí sin abandonar la lista, como una bandeja profesional.</p>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {composeOpen && (
                <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6">
                    <form onSubmit={submit} className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/10 bg-primary-900 shadow-2xl sm:rounded-2xl">
                        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                            <div>
                                <h3 className="text-sm font-bold text-white">{selectedDraft ? 'Editar borrador' : selectedThread ? 'Responder correo' : 'Nuevo correo'}</h3>
                                <p className="mt-1 text-[10px] text-primary-500">La firma configurada se agregará al enviarlo.</p>
                            </div>
                            <button type="button" onClick={() => setComposeOpen(false)} className="text-lg text-primary-500 transition hover:text-white">×</button>
                        </div>
                        <div className="space-y-4 p-5">
                            {errors.mailbox && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">{errors.mailbox}</p>}
                            {mailAccounts.length > 0 && <label className="block text-[9px] font-bold uppercase tracking-widest text-primary-500">Enviar desde
                                <select value={data.mail_account_id} disabled={Boolean(selectedThread)} onChange={event => setData('mail_account_id', event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-primary-950/60 px-3 py-2.5 text-xs normal-case tracking-normal text-primary-100 outline-none focus:border-accent-500 disabled:cursor-not-allowed disabled:opacity-70">
                                    {!selectedThread && <option value="">Dirección predeterminada de Melkerven</option>}
                                    {mailAccounts.map(account => <option key={account.id} value={account.id}>{account.display_name || account.address} · {account.address}</option>)}
                                </select>
                                {selectedThread && <span className="mt-1 block normal-case tracking-normal text-[10px] font-normal text-primary-600">Las respuestas mantienen el buzón que recibió la conversación.</span>}
                            </label>}
                            <input value={data.to} onChange={event => setData('to', event.target.value)} type="email" placeholder="Para: cliente@ejemplo.com" className="w-full border-b border-white/10 bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-primary-600 focus:border-accent-500" required />
                            <input value={data.subject} onChange={event => setData('subject', event.target.value)} placeholder="Asunto" className="w-full border-b border-white/10 bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-primary-600 focus:border-accent-500" required />
                            <textarea value={data.body} onChange={event => setData('body', event.target.value)} rows="10" placeholder="Escribe tu mensaje..." className="w-full resize-none rounded-xl border border-white/10 bg-primary-950/60 p-4 text-sm text-white outline-none placeholder:text-primary-600 focus:border-accent-500" required />
                            <div className="rounded-xl border border-dashed border-white/15 bg-primary-950/30 p-3">
                                <label className="flex cursor-pointer items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-300 transition hover:text-accent-400">
                                    <span className="text-base">📎</span> Adjuntar documentos o imágenes
                                    <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png,.webp" onChange={event => setData('attachments', Array.from(event.target.files || []))} className="sr-only" />
                                </label>
                                <p className="mt-2 text-[9px] leading-relaxed text-primary-600">PDF, Office, CSV, texto e imágenes. Máximo 8 archivos, 10 MB por archivo y 25 MB en total.</p>
                                {data.attachments.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{data.attachments.map((file, index) => <span key={`${file.name}-${index}`} className="max-w-52 truncate rounded-md border border-white/10 px-2 py-1 text-[9px] text-primary-300">📄 {file.name}</span>)}</div>}
                                {selectedDraft?.files?.length > 0 && <div className="mt-3 border-t border-white/10 pt-3"><p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-primary-500">Adjuntos guardados en el borrador</p><div className="flex flex-wrap gap-2">{selectedDraft.files.map(file => <a key={file.id} href={file.download_url} className="max-w-52 truncate rounded-md border border-sky-500/20 bg-sky-500/[0.05] px-2 py-1 text-[9px] text-sky-200">📎 {file.filename}</a>)}</div></div>}
                                {errors.attachments && <p className="mt-2 text-[10px] text-red-400">{errors.attachments}</p>}
                            </div>
                            <SignaturePreview html={preferences.mail_signature_html} />
                        </div>
                        <div className="flex justify-end gap-3 border-t border-white/10 px-5 py-4">
                            <button type="button" onClick={saveDraft} disabled={processing} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-sky-300 hover:text-white disabled:opacity-50">Guardar borrador</button>
                            <button type="button" onClick={() => setComposeOpen(false)} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary-400 hover:text-white">Cancelar</button>
                            <button disabled={processing} className="rounded-lg bg-accent-500 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-accent-600 disabled:opacity-50">{processing ? 'Enviando...' : 'Enviar correo'}</button>
                        </div>
                    </form>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
