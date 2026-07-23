import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const initialData = (users) => ({
    address: '',
    display_name: '',
    incoming_source: 'resend',
    incoming_host: '',
    incoming_port: 993,
    incoming_encryption: 'ssl',
    incoming_validate_certificate: true,
    incoming_username: '',
    incoming_password: '',
    is_shared: false,
    is_active: true,
    member_ids: users.length === 1 ? [users[0].id] : [],
    manager_ids: users.length === 1 ? [users[0].id] : [],
});

function status(account) {
    if (!account.is_active) return ['Desactivado', 'bg-primary-700 text-primary-300'];
    if (account.provider === 'resend') return ['Recepción web', 'bg-sky-500/15 text-sky-300'];
    if (!account.incoming_host) return ['Sin configurar', 'bg-amber-500/15 text-amber-300'];
    if (account.last_sync_error) return ['Requiere revisión', 'bg-red-500/15 text-red-300'];
    return ['Listo para IMAP', 'bg-emerald-500/15 text-emerald-300'];
}

export default function Accounts({ accounts, users }) {
    const { flash = {} } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm(initialData(users));
    const [editingAccountId, setEditingAccountId] = useState(null);
    const [imapData, setImapData] = useState(null);

    const toggleMember = (userId) => {
        const selected = data.member_ids.includes(userId);
        const members = selected ? data.member_ids.filter(id => id !== userId) : [...data.member_ids, userId];
        setData({
            ...data,
            member_ids: members,
            manager_ids: data.manager_ids.filter(id => members.includes(id)),
        });
    };

    const toggleManager = (userId) => {
        setData('manager_ids', data.manager_ids.includes(userId)
            ? data.manager_ids.filter(id => id !== userId)
            : [...data.manager_ids, userId]);
    };

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.mail.accounts.store'), {
            preserveScroll: true,
            onSuccess: () => reset(initialData(users)),
        });
    };

    const testAccount = (account) => {
        router.post(route('admin.mail.accounts.test', account.id), {}, { preserveScroll: true });
    };

    const startHistoryImport = (account) => {
        router.post(route('admin.mail.accounts.history-import', account.id), {}, { preserveScroll: true });
    };

    const configureImap = (account) => {
        setEditingAccountId(account.id);
        setImapData({
            address: account.address,
            display_name: account.display_name || '',
            incoming_source: 'imap',
            incoming_host: account.incoming_host || 'imap.secureserver.net',
            incoming_port: account.incoming_port || 993,
            incoming_encryption: account.incoming_encryption || 'ssl',
            incoming_validate_certificate: account.incoming_validate_certificate ?? true,
            incoming_username: account.incoming_username || account.address,
            incoming_password: '',
            is_shared: account.is_shared,
            is_active: account.is_active,
            member_ids: account.users.map(user => user.id),
            manager_ids: account.users.filter(user => user.pivot?.can_manage).map(user => user.id),
        });
    };

    const updateImap = (account) => {
        router.put(route('admin.mail.accounts.update', account.id), imapData, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingAccountId(null);
                setImapData(null);
            },
        });
    };

    const switchToResend = (account) => {
        router.put(route('admin.mail.accounts.update', account.id), {
            address: account.address,
            display_name: account.display_name || '',
            incoming_source: 'resend',
            incoming_validate_certificate: true,
            is_shared: account.is_shared,
            is_active: account.is_active,
            member_ids: account.users.map(user => user.id),
            manager_ids: account.users.filter(user => user.pivot?.can_manage).map(user => user.id),
        }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <Link href={route('admin.mail.index')} className="mb-1 inline-flex text-[10px] font-bold uppercase tracking-widest text-primary-500 transition hover:text-accent-400">← Volver al correo</Link>
                    <h2 className="text-lg font-display font-bold text-white">Generador de buzones</h2>
                </div>
            }
        >
            <Head title="Generador de buzones - Admin" />

            <div className="py-6 sm:py-8">
                <div className="mx-auto grid max-w-7xl gap-5 px-4 lg:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.1fr)] sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-primary-900/70 p-5 shadow-xl shadow-black/10 sm:p-6">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent-500">Equipo de correo</p>
                        <h3 className="mt-2 text-base font-bold text-white">Crear una identidad de correo</h3>
                        <p className="mt-2 text-xs leading-relaxed text-primary-500">Cada identidad controla quién puede leer, recibir alertas y enviar desde esa dirección en la bandeja web.</p>

                        <fieldset className="mt-5">
                            <legend className="text-[10px] font-bold uppercase tracking-widest text-primary-400">Cómo recibirá los correos</legend>
                            <div className="mt-2 grid gap-3 sm:grid-cols-2">
                                <label className={`cursor-pointer rounded-xl border p-3 transition ${data.incoming_source === 'resend' ? 'border-sky-500/50 bg-sky-500/[0.08]' : 'border-white/10 bg-primary-950/40'}`}>
                                    <input type="radio" name="incoming_source" value="resend" checked={data.incoming_source === 'resend'} onChange={event => setData('incoming_source', event.target.value)} className="sr-only" />
                                    <span className="block text-xs font-bold text-white">Web con Resend</span>
                                    <span className="mt-1 block text-[10px] leading-relaxed text-primary-400">Recomendado. Sin contraseñas IMAP; los mensajes llegan mediante el webhook de Resend.</span>
                                </label>
                                <label className={`cursor-pointer rounded-xl border p-3 transition ${data.incoming_source === 'imap' ? 'border-accent-500/50 bg-accent-500/[0.08]' : 'border-white/10 bg-primary-950/40'}`}>
                                    <input type="radio" name="incoming_source" value="imap" checked={data.incoming_source === 'imap'} onChange={event => setData('incoming_source', event.target.value)} className="sr-only" />
                                    <span className="block text-xs font-bold text-white">Conectar IMAP</span>
                                    <span className="mt-1 block text-[10px] leading-relaxed text-primary-400">Sólo si ya existe un buzón externo y necesitas importarlo a esta bandeja.</span>
                                </label>
                            </div>
                        </fieldset>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <Field label="Dirección del buzón" error={errors.address}><input value={data.address} onChange={event => setData('address', event.target.value)} type="email" placeholder="contacto@melkerven.net" className={inputClass} /></Field>
                            <Field label="Nombre visible" error={errors.display_name}><input value={data.display_name} onChange={event => setData('display_name', event.target.value)} placeholder="Equipo Melkerven" className={inputClass} /></Field>
                        </div>

                        {data.incoming_source === 'resend' ? (
                            <div className="mt-4 rounded-xl border border-sky-500/20 bg-sky-500/[0.05] p-3 text-[10px] leading-relaxed text-sky-100">
                                Crear este buzón no modifica DNS ni crea cuentas pagadas. Cuando se habilite la recepción del dominio en Resend, los correos dirigidos a esta dirección se asociarán automáticamente al equipo indicado aquí.
                            </div>
                        ) : (
                            <div className="mt-4 space-y-3">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Servidor IMAP" error={errors.incoming_host}><input value={data.incoming_host} onChange={event => setData('incoming_host', event.target.value)} placeholder="mail.ejemplo.com" autoCapitalize="none" className={inputClass} /></Field>
                                    <Field label="Puerto" error={errors.incoming_port}><input value={data.incoming_port} onChange={event => setData('incoming_port', Number(event.target.value))} type="number" min="1" max="65535" className={inputClass} /></Field>
                                    <Field label="Usuario IMAP" error={errors.incoming_username}><input value={data.incoming_username} onChange={event => setData('incoming_username', event.target.value)} placeholder="contacto@melkerven.net" autoCapitalize="none" className={inputClass} /></Field>
                                    <Field label="Contraseña IMAP" error={errors.incoming_password}><input value={data.incoming_password} onChange={event => setData('incoming_password', event.target.value)} type="password" autoComplete="new-password" className={inputClass} /></Field>
                                </div>
                                <label className="block rounded-xl border border-white/10 bg-primary-950/40 p-3 text-xs text-primary-300">
                                    <span className="block text-[9px] font-bold uppercase tracking-widest text-primary-500">Seguridad IMAP</span>
                                    <select value={data.incoming_encryption} onChange={event => setData('incoming_encryption', event.target.value)} className={`${inputClass} mt-2`}>
                                        <option value="ssl">SSL/TLS directo · 993</option>
                                        <option value="starttls">STARTTLS · 143</option>
                                        <option value="tls">TLS</option>
                                    </select>
                                </label>
                            </div>
                        )}

                        <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-primary-950/40 p-3">
                            {data.incoming_source === 'imap' && <Check checked={data.incoming_validate_certificate} onChange={checked => setData('incoming_validate_certificate', checked)} label="Exigir certificado TLS válido" />}
                            <Check checked={data.is_shared} onChange={checked => setData('is_shared', checked)} label="Buzón compartido" />
                            <Check checked={data.is_active} onChange={checked => setData('is_active', checked)} label="Activar al guardar" />
                        </div>

                        <div className="mt-5 border-t border-white/10 pt-5">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary-300">Personas con acceso</h4>
                            <p className="mt-1 text-[10px] leading-relaxed text-primary-500">Un miembro puede leer y enviar. Un responsable también podrá administrar la configuración del buzón.</p>
                            {errors.member_ids && <p className="mt-2 text-xs text-red-400">{errors.member_ids}</p>}
                            {errors.manager_ids && <p className="mt-2 text-xs text-red-400">{errors.manager_ids}</p>}
                            <div className="mt-3 space-y-2">
                                {users.map(user => {
                                    const isMember = data.member_ids.includes(user.id);
                                    return <div key={user.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
                                        <Check checked={isMember} onChange={() => toggleMember(user.id)} label={<span><span className="block text-xs font-semibold text-primary-200">{user.name}</span><span className="block text-[10px] text-primary-500">{user.email}</span></span>} />
                                        <label className={`flex items-center gap-2 text-[10px] font-semibold ${isMember ? 'text-accent-300' : 'text-primary-600'}`}>
                                            <input type="checkbox" disabled={!isMember} checked={data.manager_ids.includes(user.id)} onChange={() => toggleManager(user.id)} className="rounded border-white/20 bg-primary-950 text-accent-500 focus:ring-accent-500 disabled:opacity-40" /> Responsable
                                        </label>
                                    </div>;
                                })}
                            </div>
                        </div>

                        <button disabled={processing} className="mt-5 w-full rounded-xl bg-accent-500 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-accent-500/20 transition hover:bg-accent-600 disabled:opacity-50">{processing ? 'Creando…' : 'Crear buzón para el equipo'}</button>
                    </form>

                    <section className="space-y-4">
                        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/[0.04] p-5">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-sky-300">Cómo organizar los tres buzones</p>
                            <p className="mt-2 text-xs leading-relaxed text-primary-300">Crea los personales <strong>tvargas@</strong> y <strong>lsulca@</strong> con un solo miembro cada uno. Después crea <strong>contacto@</strong> como compartido y marca a ambos: cada correo generará alertas para los dos y podrán responder desde esa identidad.</p>
                        </div>

                        {flash.success && <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-3 text-xs text-emerald-200">{flash.success}</p>}
                        {flash.error && <p className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-xs text-red-200">{flash.error}</p>}

                        {accounts.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/10 bg-primary-900/40 p-10 text-center">
                                <p className="text-sm font-semibold text-primary-300">Aún no hay identidades de correo.</p>
                                <p className="mt-2 text-xs text-primary-500">Crea los buzones del equipo aquí. No se crea una cuenta pagada de correo externo.</p>
                            </div>
                        ) : accounts.map(account => {
                            const [label, color] = status(account);
                            return <article key={account.id} className="rounded-2xl border border-white/10 bg-primary-900/70 p-5 shadow-xl shadow-black/10">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div><h3 className="text-sm font-bold text-white">{account.display_name || account.address}</h3><p className="mt-1 text-xs text-primary-500">{account.address} · {account.provider === 'resend' ? 'Recepción web con Resend' : `IMAP ${account.incoming_host}:${account.incoming_port}`}</p></div>
                                    <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${color}`}>{label}</span>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">{account.users.map(user => <span key={user.id} className="rounded-lg bg-white/[0.05] px-2.5 py-1.5 text-[10px] text-primary-300">{user.name}{user.pivot?.can_manage ? ' · responsable' : ''}</span>)}</div>
                                {account.last_sync_error && <p className="mt-4 rounded-lg bg-red-500/[0.07] px-3 py-2 text-[10px] leading-relaxed text-red-200">La última conexión falló. Revisa el servidor y las credenciales antes de sincronizar.</p>}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button onClick={() => configureImap(account)} className="rounded-lg border border-white/15 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-primary-300 transition hover:border-accent-500/40 hover:text-accent-300">{account.provider === 'resend' ? 'Conectar histórico GoDaddy' : 'Editar conexión IMAP'}</button>
                                    {account.provider !== 'resend' && <button onClick={() => testAccount(account)} className="rounded-lg border border-accent-500/30 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-accent-300 transition hover:bg-accent-500/10">Probar conexión</button>}
                                    {account.provider !== 'resend' && <button onClick={() => startHistoryImport(account)} disabled={account.history_import_status === 'queued' || account.history_import_status === 'running'} className="rounded-lg bg-accent-500/15 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-accent-200 transition hover:bg-accent-500/25 disabled:cursor-not-allowed disabled:opacity-50">{account.history_import_status === 'queued' || account.history_import_status === 'running' ? 'Migración en curso…' : 'Importar historial completo'}</button>}
                                    {account.provider !== 'resend' && account.history_import_status === 'completed' && <button onClick={() => switchToResend(account)} className="rounded-lg border border-sky-500/30 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-sky-200 transition hover:bg-sky-500/10">Finalizar y usar Resend</button>}
                                </div>
                                {account.history_import_status && account.history_import_status !== 'idle' && <p className="mt-3 rounded-lg border border-white/10 bg-primary-950/50 px-3 py-2 text-[10px] leading-relaxed text-primary-300">Historial: <strong className="text-white">{account.history_import_status === 'completed' ? 'completado' : account.history_import_status === 'failed' ? 'requiere revisión' : 'en curso'}</strong> · {account.history_imported_messages || 0} mensajes · {account.history_imported_attachments || 0} adjuntos{account.history_import_error ? ` · ${account.history_import_error}` : ''}</p>}
                                {editingAccountId === account.id && imapData && <div className="mt-4 space-y-3 rounded-xl border border-accent-500/25 bg-accent-500/[0.05] p-4">
                                    <div><p className="text-[10px] font-bold uppercase tracking-widest text-accent-300">Migrar histórico desde GoDaddy</p><p className="mt-1 text-[10px] leading-relaxed text-primary-400">La contraseña se cifra al guardar y no se muestra después. Primero prueba la conexión; luego inicia la importación por lotes.</p></div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Field label="Servidor IMAP"><input value={imapData.incoming_host} onChange={event => setImapData({ ...imapData, incoming_host: event.target.value })} className={inputClass} /></Field>
                                        <Field label="Puerto"><input value={imapData.incoming_port} onChange={event => setImapData({ ...imapData, incoming_port: Number(event.target.value) })} type="number" className={inputClass} /></Field>
                                        <Field label="Usuario"><input value={imapData.incoming_username} onChange={event => setImapData({ ...imapData, incoming_username: event.target.value })} type="email" className={inputClass} /></Field>
                                        <Field label="Contraseña GoDaddy"><input value={imapData.incoming_password} onChange={event => setImapData({ ...imapData, incoming_password: event.target.value })} type="password" autoComplete="new-password" className={inputClass} /></Field>
                                    </div>
                                    <label className="flex items-center gap-2 text-[10px] text-primary-300"><input type="checkbox" checked={imapData.incoming_validate_certificate} onChange={event => setImapData({ ...imapData, incoming_validate_certificate: event.target.checked })} className="rounded border-white/20 bg-primary-950 text-accent-500" /> Exigir certificado TLS válido</label>
                                    <div className="flex flex-wrap gap-2"><button type="button" onClick={() => updateImap(account)} className="rounded-lg bg-accent-500 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-white">Guardar conexión segura</button><button type="button" onClick={() => { setEditingAccountId(null); setImapData(null); }} className="rounded-lg border border-white/15 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-primary-300">Cancelar</button></div>
                                </div>}
                            </article>;
                        })}
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const inputClass = 'w-full rounded-lg border border-white/10 bg-primary-950/60 px-3 py-2.5 text-xs text-primary-100 outline-none placeholder:text-primary-700 focus:border-accent-500';

function Field({ label, error, children }) {
    return <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-400"><span>{label}</span><div className="mt-2">{children}</div>{error && <span className="mt-1.5 block normal-case tracking-normal text-xs font-normal text-red-400">{error}</span>}</label>;
}

function Check({ checked, onChange, label }) {
    return <label className="flex cursor-pointer items-start gap-2.5 text-[10px] leading-relaxed text-primary-400"><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} className="mt-0.5 rounded border-white/20 bg-primary-950 text-accent-500 focus:ring-accent-500" /><span>{label}</span></label>;
}
