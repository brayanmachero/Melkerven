import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Head, useForm } from '@inertiajs/react';

export default function Contact({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '', email: '', subject: '', message: '' });
    const submit = (event) => {
        event.preventDefault();
        post(route('contact.store'), { onSuccess: () => reset() });
    };
    const fields = [
        ['contact-name', 'Identidad / empresa', 'text', 'Nombre completo', 'name'],
        ['contact-email', 'Correo electrónico', 'email', 'ejemplo@empresa.cl', 'email'],
    ];

    return (
        <PublicLayout auth={auth}>
            <Head><title>Cotizaciones y búsqueda técnica | Melkerven</title><meta name="description" content="Solicite una cotización, busque un repuesto crítico o consulte la compatibilidad de servidores, storage y redes con el equipo técnico de Melkerven." /></Head>
            <section className="relative min-h-[85vh] overflow-hidden bg-cloud-50 py-16 sm:py-20">
                <div className="public-network absolute inset-0 opacity-60" /><div className="pointer-events-none absolute right-[-10rem] top-[-9rem] size-[32rem] rounded-full bg-signal-300/30 blur-[105px]" />
                <div className="section-shell relative z-10"><Breadcrumbs items={[{ label: 'Contacto' }]} />
                    <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
                        <div><div className="public-eyebrow">Canal directo</div><h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em] text-ink-950 sm:text-7xl">Conectamos su <span className="text-signal-600">necesidad TI.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-ink-600">Si busca un repuesto crítico, soporte para servidores o una importación a pedido, convierta su necesidad en una consulta técnica clara.</p><div className="mt-8 rounded-2xl border border-signal-200 bg-white/80 p-5 text-sm leading-6 text-ink-600 shadow-sm"><strong className="text-ink-950">Para acelerar la evaluación:</strong> incluya marca, modelo, código de parte, cantidad o una foto de la etiqueta del equipo.</div>
                            <div className="mt-10 space-y-6">{[['Ubicación', 'Badajoz 100, Las Condes, Santiago'], ['Correo', 'contacto@melkerven.net'], ['WhatsApp', '+56 9 8819 8559']].map(([label, value]) => <div key={label} className="flex gap-4"><span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-xl bg-signal-50 text-sm font-bold text-signal-700">0</span><div><p className="text-[10px] font-bold uppercase tracking-widest text-ink-400">{label}</p>{label === 'WhatsApp' ? <a href="https://wa.me/56988198559" className="mt-1 inline-block text-base font-semibold text-signal-700 hover:text-signal-500">{value}</a> : <p className="mt-1 text-base font-semibold text-ink-800">{value}</p>}</div></div>)}</div>
                        </div>
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_24px_60px_rgba(31,62,82,.12)] sm:p-9"><div className="public-network absolute inset-0 opacity-35" /><div className="relative"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-signal-700">Nueva solicitud</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-ink-950">Cuéntenos qué necesita</h2><p id="contact-form-help" className="mt-3 text-sm leading-6 text-ink-500">Mientras más específico sea el requerimiento, mejor podremos orientar la búsqueda y la compatibilidad.</p>
                            <form onSubmit={submit} className="mt-8 space-y-5"> <div className="grid gap-5 sm:grid-cols-2">{fields.map(([id, label, type, placeholder, key]) => <div key={id}><label htmlFor={id} className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-ink-500">{label}</label><input id={id} type={type} value={data[key]} onChange={(event) => setData(key, event.target.value)} placeholder={placeholder} required className="w-full rounded-xl border border-ink-200 bg-cloud-50 px-4 py-3.5 text-sm text-ink-950 placeholder-ink-300 focus:border-signal-500 focus:ring-signal-500/20" />{errors[key] && <p className="mt-1 text-xs text-rose-600">{errors[key]}</p>}</div>)}</div>
                                <div><label htmlFor="contact-subject" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-ink-500">Asunto de la consulta</label><input id="contact-subject" type="text" value={data.subject} onChange={(event) => setData('subject', event.target.value)} placeholder="Ej: Cotización de servidor o repuesto" required className="w-full rounded-xl border border-ink-200 bg-cloud-50 px-4 py-3.5 text-sm text-ink-950 placeholder-ink-300 focus:border-signal-500 focus:ring-signal-500/20" />{errors.subject && <p className="mt-1 text-xs text-rose-600">{errors.subject}</p>}</div>
                                <div><label htmlFor="contact-message" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-ink-500">Requerimiento detallado</label><textarea id="contact-message" aria-describedby="contact-form-help" rows="7" value={data.message} onChange={(event) => setData('message', event.target.value)} placeholder="Marca, modelo, código de parte, cantidad, plataforma o escenario técnico…" required className="w-full resize-none rounded-xl border border-ink-200 bg-cloud-50 px-4 py-3.5 text-sm text-ink-950 placeholder-ink-300 focus:border-signal-500 focus:ring-signal-500/20" />{errors.message && <p className="mt-1 text-xs text-rose-600">{errors.message}</p>}</div>
                                <button type="submit" disabled={processing} className="public-button w-full disabled:opacity-50">{processing ? 'Enviando solicitud…' : 'Enviar solicitud técnica'}</button>
                            </form></div></div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
