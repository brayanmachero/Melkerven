import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Head } from '@inertiajs/react';

const principles = [
    ['Criterio antes de compra', 'Traducimos el requerimiento técnico en una referencia verificable antes de proponer el equipo.'],
    ['Continuidad operacional', 'Buscamos piezas críticas y alternativas compatibles para reducir tiempos de inactividad.'],
    ['Seguimiento claro', 'Una sola conversación para cotización, suministro y estado de la solicitud.'],
];

export default function About({ auth }) {
    return (
        <PublicLayout auth={auth}>
            <Head>
                <title>Infraestructura, suministro y criterio técnico | Melkerven</title>
                <meta name="description" content="Conozca cómo Melkerven conecta hardware empresarial y repuestos críticos con empresas que necesitan continuidad, compatibilidad y acompañamiento técnico." />
            </Head>
            <section className="relative overflow-hidden bg-cloud-50 py-16 sm:py-20">
                <div className="public-network absolute inset-0 opacity-60" />
                <div className="pointer-events-none absolute -left-32 top-12 size-[27rem] rounded-full bg-signal-300/25 blur-[100px]" />
                <div className="section-shell relative z-10">
                    <Breadcrumbs items={[{ label: 'Nosotros' }]} />
                    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                        <div>
                            <div className="public-eyebrow">Nuestra identidad</div>
                            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em] text-ink-950 sm:text-7xl">Suministro técnico con <span className="text-signal-600">información clara.</span></h1>
                            <p className="mt-7 border-l-2 border-signal-400 pl-6 text-xl leading-8 text-ink-700">Melkerven conecta necesidades operativas con componentes empresariales, configuraciones compatibles y una ruta de suministro trazable.</p>
                            <p className="mt-6 max-w-xl text-base leading-7 text-ink-600">Más que publicar productos sin contexto, buscamos comprender la plataforma, el código de parte y la criticidad para que cada cotización tenga una base técnica útil.</p>
                            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-ink-200 pt-7"><div><p className="text-3xl font-semibold text-ink-950">Global</p><p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-signal-700">Búsqueda y suministro</p></div><div><p className="text-3xl font-semibold text-ink-950">Trazable</p><p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-signal-700">Solicitud a propuesta</p></div></div>
                        </div>
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-3 shadow-[0_25px_65px_rgba(31,62,82,0.12)]"><div className="public-network absolute inset-0 opacity-40" /><img src="/tech_components_impact.png" alt="Componentes de infraestructura tecnológica" className="relative aspect-[4/5] w-full rounded-[1.55rem] object-cover opacity-90" /><div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/70 bg-white/85 p-5 backdrop-blur"><p className="text-[10px] font-bold uppercase tracking-widest text-signal-700">Criterio técnico</p><p className="mt-2 text-lg font-semibold leading-6 text-ink-950">Cada solicitud parte desde la información que realmente importa.</p></div></div>
                    </div>
                    <div className="mt-20 grid gap-5 md:grid-cols-3">{principles.map(([title, description], index) => <article key={title} className="relative overflow-hidden rounded-3xl border border-ink-100 bg-white p-7 shadow-[0_14px_36px_rgba(31,62,82,.07)]"><span className="absolute right-6 top-4 text-5xl font-semibold text-ink-950/[.04]">0{index + 1}</span><span className="text-[10px] font-bold uppercase tracking-[.2em] text-signal-700">0{index + 1}</span><h2 className="mt-6 text-xl font-semibold text-ink-950">{title}</h2><p className="mt-3 text-sm leading-6 text-ink-500">{description}</p></article>)}</div>
                </div>
            </section>
        </PublicLayout>
    );
}
