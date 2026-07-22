import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

function SignaturePreview({ html }) {
    if (!html) {
        return <p className="p-5 text-xs text-primary-500">Aún no hay una firma. Se enviará sólo el contenido que escribas.</p>;
    }

    return <iframe title="Vista previa de firma" sandbox="" srcDoc={html} className="h-40 w-full bg-white" />;
}

export default function Settings({ preferences }) {
    const [permissionMessage, setPermissionMessage] = useState('');
    const { data, setData, patch, processing, errors } = useForm({
        mail_signature_html: preferences.mail_signature_html || '',
        mail_in_app_notifications: preferences.mail_in_app_notifications,
        mail_desktop_notifications: preferences.mail_desktop_notifications,
        mail_sound_notifications: preferences.mail_sound_notifications,
    });

    const submit = (event) => {
        event.preventDefault();
        patch(route('admin.mail.settings.update'));
    };

    const requestDesktopPermission = async () => {
        if (!('Notification' in window)) {
            setPermissionMessage('Este navegador no admite avisos del escritorio.');
            return;
        }

        const permission = await Notification.requestPermission();
        const enabled = permission === 'granted';
        setData('mail_desktop_notifications', enabled);
        setPermissionMessage(enabled ? 'Permiso concedido. Guarda los cambios para activarlo.' : 'El permiso no fue concedido; seguirás recibiendo alertas dentro del panel.');
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <Link href={route('admin.mail.index')} className="mb-1 inline-flex text-[10px] font-bold uppercase tracking-widest text-primary-500 transition hover:text-accent-400">← Volver al correo</Link>
                    <h2 className="text-lg font-display font-bold text-white">Preferencias de correo</h2>
                </div>
            }
        >
            <Head title="Preferencias de correo - Admin" />

            <div className="py-6 sm:py-8">
                <form onSubmit={submit} className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] lg:px-8">
                    <section className="rounded-2xl border border-white/10 bg-primary-900/70 p-5 shadow-xl shadow-black/10 sm:p-6">
                        <div className="mb-5">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent-500">Identidad de envío</p>
                            <h3 className="mt-2 text-base font-bold text-white">Firma profesional</h3>
                            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-primary-500">Se añade a los correos enviados desde tu usuario. Admite HTML básico, tablas, enlaces HTTPS e imágenes HTTPS. El sistema elimina scripts, iframes, estilos inseguros y enlaces peligrosos.</p>
                        </div>

                        <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-400" htmlFor="signature-html">Firma HTML</label>
                        <textarea id="signature-html" value={data.mail_signature_html} onChange={event => setData('mail_signature_html', event.target.value)} rows="14" className="mt-2 w-full rounded-xl border border-white/10 bg-primary-950/60 p-4 font-mono text-xs leading-6 text-primary-200 outline-none placeholder:text-primary-600 focus:border-accent-500" placeholder={'<p><strong>Nombre Apellido</strong><br>Área comercial · Melkerven<br><a href="https://melkerven.net">melkerven.net</a></p>'} />
                        {errors.mail_signature_html && <p className="mt-2 text-xs text-red-400">{errors.mail_signature_html}</p>}
                    </section>

                    <div className="space-y-5">
                        <section className="overflow-hidden rounded-2xl border border-white/10 bg-primary-900/70 shadow-xl shadow-black/10">
                            <div className="border-b border-white/5 px-5 py-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Vista previa aislada</h3>
                                <p className="mt-1 text-[10px] text-primary-500">La previsualización no ejecuta contenido activo.</p>
                            </div>
                            <SignaturePreview html={data.mail_signature_html} />
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-primary-900/70 p-5 shadow-xl shadow-black/10">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent-500">Alertas</p>
                            <h3 className="mt-2 text-base font-bold text-white">Cómo quieres enterarte</h3>
                            <div className="mt-5 space-y-4">
                                <label className="flex cursor-pointer gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                                    <input type="checkbox" checked={data.mail_in_app_notifications} onChange={event => setData('mail_in_app_notifications', event.target.checked)} className="mt-0.5 rounded border-white/20 bg-primary-950 text-accent-500 focus:ring-accent-500" />
                                    <span><span className="block text-xs font-semibold text-primary-200">Panel y campana</span><span className="mt-1 block text-[10px] leading-relaxed text-primary-500">Guarda una alerta dentro de Melkerven para cada correo recibido.</span></span>
                                </label>
                                <label className="flex cursor-pointer gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                                    <input type="checkbox" checked={data.mail_sound_notifications} onChange={event => setData('mail_sound_notifications', event.target.checked)} className="mt-0.5 rounded border-white/20 bg-primary-950 text-accent-500 focus:ring-accent-500" />
                                    <span><span className="block text-xs font-semibold text-primary-200">Sonido con la sesión abierta</span><span className="mt-1 block text-[10px] leading-relaxed text-primary-500">Sólo se reproduce mientras tengas el panel abierto.</span></span>
                                </label>
                                <label className="flex cursor-pointer gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                                    <input type="checkbox" checked={data.mail_desktop_notifications} onChange={event => setData('mail_desktop_notifications', event.target.checked)} className="mt-0.5 rounded border-white/20 bg-primary-950 text-accent-500 focus:ring-accent-500" />
                                    <span><span className="block text-xs font-semibold text-primary-200">Avisos del navegador</span><span className="mt-1 block text-[10px] leading-relaxed text-primary-500">Muestran una notificación del sistema mientras el navegador permita recibirla.</span></span>
                                </label>
                            </div>
                            <button type="button" onClick={requestDesktopPermission} className="mt-4 rounded-lg border border-accent-500/30 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-accent-400 transition hover:bg-accent-500/10">Autorizar avisos del navegador</button>
                            {permissionMessage && <p className="mt-3 text-[10px] leading-relaxed text-primary-400">{permissionMessage}</p>}
                        </section>

                        <section className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-300">Acceso seguro</h3>
                            <p className="mt-2 text-[11px] leading-relaxed text-primary-400">La autenticación de dos factores por email no debe depender de esta misma bandeja. Antes de producción se migrará a una aplicación autenticadora (TOTP) y códigos de recuperación.</p>
                        </section>

                        <button disabled={processing} className="w-full rounded-xl bg-accent-500 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-accent-500/20 transition hover:bg-accent-600 disabled:opacity-50">{processing ? 'Guardando...' : 'Guardar preferencias'}</button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
