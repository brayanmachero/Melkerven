import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { useState } from 'react';

export default function Faq({ auth, faqs }) {
    const [openIndex, setOpenIndex] = useState({});
    const toggle = (categoryIndex, itemIndex) => {
        const key = `${categoryIndex}-${itemIndex}`;
        setOpenIndex((previous) => ({ ...previous, [key]: !previous[key] }));
    };

    return (
        <PublicLayout auth={auth}>
            <Head><title>Preguntas frecuentes | Melkerven</title><meta name="description" content="Respuestas sobre compras, envíos, garantías, cotizaciones y soporte técnico de Melkerven." /></Head>
            <section className="relative min-h-screen overflow-hidden bg-cloud-50 py-16 sm:py-20"><div className="public-network absolute inset-0 opacity-60" /><div className="section-shell relative z-10 max-w-5xl"><Breadcrumbs items={[{ label: 'Preguntas frecuentes' }]} /><div className="mx-auto mt-8 max-w-2xl text-center"><div className="public-eyebrow justify-center before:hidden">Centro de ayuda</div><h1 className="mt-5 text-4xl font-semibold tracking-[-.05em] text-ink-950 sm:text-6xl">Respuestas antes de <span className="text-signal-600">cotizar.</span></h1><p className="mt-5 text-lg leading-8 text-ink-600">Información útil sobre solicitud técnica, suministro, garantía y seguimiento.</p></div>
                <div className="mt-14 space-y-10">{faqs.map((category, categoryIndex) => <section key={`${category.category}-${categoryIndex}`}><h2 className="mb-4 flex items-center gap-3 text-xl font-semibold text-ink-950"><span className="flex size-8 items-center justify-center rounded-lg bg-signal-50 text-xs font-bold text-signal-700">{categoryIndex + 1}</span>{category.category}</h2><div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-[0_12px_30px_rgba(31,62,82,.06)]">{category.items.map((item, itemIndex) => { const key = `${categoryIndex}-${itemIndex}`; const isOpen = openIndex[key]; return <div key={key} className="border-b border-ink-100 last:border-0"><button type="button" onClick={() => toggle(categoryIndex, itemIndex)} aria-expanded={isOpen} aria-controls={`faq-answer-${key}`} className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left hover:bg-signal-50/60"><span className="text-sm font-semibold text-ink-800">{item.question}</span><svg aria-hidden="true" className={`size-5 shrink-0 text-signal-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" /></svg></button>{isOpen && <div id={`faq-answer-${key}`} className="border-t border-ink-100 px-6 py-5 text-sm leading-7 text-ink-600">{item.answer}</div>}</div>; })}</div></section>)}</div>
                <div className="mt-16 rounded-3xl border border-ink-100 bg-white p-8 text-center shadow-sm"><h2 className="text-2xl font-semibold text-ink-950">¿No encontró su caso?</h2><p className="mt-3 text-sm text-ink-500">Envíenos el modelo, código de parte o escenario técnico y lo revisamos con usted.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link href={route('contact')} className="public-button">Hacer una consulta</Link><a href="https://wa.me/56988198559" target="_blank" rel="noopener noreferrer" className="public-button-secondary">WhatsApp directo</a></div></div>
            </div></section>
        </PublicLayout>
    );
}
