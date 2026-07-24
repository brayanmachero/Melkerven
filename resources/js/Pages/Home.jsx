import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import useScrollAnimation from '@/Hooks/useScrollAnimation';

const environments = [
    { number: '01', title: 'Data center y virtualización', description: 'Servidores, memoria, procesamiento y expansión para cargas críticas y crecimiento sostenido.', tags: ['Rack', 'CPU', 'DDR5'] },
    { number: '02', title: 'Almacenamiento y continuidad', description: 'Unidades empresariales, controladoras y repuestos para proteger capacidad y disponibilidad.', tags: ['SAS', 'NVMe', 'RAID'] },
    { number: '03', title: 'Redes y conectividad', description: 'Componentes para enlaces, switching y expansión de infraestructura en oficina, sucursal o sala técnica.', tags: ['SFP', 'Switching', 'NIC'] },
    { number: '04', title: 'Repuesto crítico', description: 'Localización de piezas difíciles de encontrar para extender la vida útil de su plataforma actual.', tags: ['OEM', 'Legacy', 'Importación'] },
];

const process = [
    ['01', 'Definimos la necesidad', 'Cuéntenos el modelo, la carga de trabajo o el síntoma. Convertimos su requerimiento en una especificación clara.'],
    ['02', 'Validamos compatibilidad', 'Revisamos el componente, plataforma y alternativas antes de avanzar con la propuesta.'],
    ['03', 'Gestionamos el suministro', 'Centralizamos cotización, importación y seguimiento para que su equipo no pierda tiempo buscando.'],
];

function ArrowIcon() {
    return (
        <svg aria-hidden="true" className="size-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.3 3.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4-1.4l4.3-4.3H3a1 1 0 1 1 0-2h11.6l-4.3-4.3a1 1 0 0 1 0-1.4Z" clipRule="evenodd" />
        </svg>
    );
}

function NetworkBackdrop() {
    return (
        <>
            <div className="public-network absolute inset-0 opacity-80" />
            <div className="public-grid absolute inset-0 opacity-55" />
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full text-signal-400/45" viewBox="0 0 1440 760" fill="none" preserveAspectRatio="none">
                <path className="network-flow" d="M-20 520C185 495 232 294 445 348s230 143 405 29 315-188 620-158" stroke="currentColor" strokeWidth="1.2" />
                <path className="network-flow" d="M-30 165c188 43 281 133 445 60s275-105 433 8 322 206 618 102" stroke="currentColor" strokeWidth="1" />
                <circle className="network-pulse fill-signal-400 stroke-none" cx="445" cy="348" r="5" />
                <circle className="network-pulse fill-signal-500 stroke-none" cx="848" cy="233" r="6" />
                <circle className="network-pulse fill-signal-400 stroke-none" cx="1170" cy="356" r="4" />
            </svg>
        </>
    );
}

export default function Home({ auth }) {
    const environmentRef = useScrollAnimation();
    const processRef = useScrollAnimation();
    const ctaRef = useScrollAnimation();

    return (
        <PublicLayout auth={auth}>
            <Head>
                <title>Infraestructura TI para Operaciones Críticas | Melkerven</title>
                <meta name="description" content="Hardware empresarial, servidores, storage, redes y repuestos críticos para infraestructura TI. Melkerven gestiona la búsqueda y el suministro técnico para empresas en Chile." />
                <meta property="og:title" content="Infraestructura TI para Operaciones Críticas | Melkerven" />
                <meta property="og:description" content="Servidores, storage, redes y repuestos críticos con acompañamiento técnico e importación a pedido." />
                <meta property="og:type" content="website" />
            </Head>

            <section className="relative isolate min-h-[calc(100vh-4.5rem)] overflow-hidden bg-cloud-50">
                <NetworkBackdrop />
                <div className="pointer-events-none absolute right-[-10rem] top-[-9rem] size-[34rem] rounded-full bg-signal-300/35 blur-[110px]" />
                <div className="pointer-events-none absolute bottom-[-12rem] left-[20%] size-[30rem] rounded-full bg-cloud-300/50 blur-[100px]" />
                <div className="absolute inset-y-0 right-0 hidden w-[46%] overflow-hidden lg:block">
                    <img src="/hero_datacenter_tech.png" alt="" className="size-full object-cover opacity-[0.16] mix-blend-multiply" fetchpriority="high" />
                    <div className="absolute inset-0 bg-gradient-to-l from-cloud-50/5 via-cloud-50/70 to-cloud-50" />
                </div>

                <div className="section-shell relative flex min-h-[calc(100vh-4.5rem)] items-center py-16 lg:py-20">
                    <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.18fr)_minmax(320px,.72fr)] lg:gap-16">
                        <div className="max-w-3xl">
                            <div className="public-eyebrow mb-7">Infraestructura TI · Chile</div>
                            <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-ink-950 sm:text-6xl lg:text-7xl">
                                Tecnología clara para <span className="text-signal-600">operaciones que no se pueden detener.</span>
                            </h1>
                            <p className="mt-7 max-w-2xl text-base leading-8 text-ink-600 sm:text-lg">
                                Encontramos y suministramos hardware empresarial, componentes compatibles y repuestos críticos para que su infraestructura no se detenga por falta de una pieza.
                            </p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link href={route('contact')} className="public-button">
                                    Solicitar una cotización <ArrowIcon />
                                </Link>
                                <Link href={route('catalog')} className="public-button-secondary">
                                    Explorar catálogo técnico
                                </Link>
                            </div>
                            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-ink-600">
                                {['Asesoría para compatibilidad', 'Importación a pedido', 'Seguimiento de solicitud'].map((item) => (
                                    <span key={item} className="inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-signal-500" />{item}</span>
                                ))}
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_28px_80px_rgba(34,67,87,0.14)] backdrop-blur-md sm:p-8 lg:mt-10">
                            <div className="absolute inset-0 public-network opacity-40" />
                            <div className="relative flex items-center justify-between border-b border-ink-100 pb-5">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-signal-600">Mesa técnica</p>
                                    <p className="mt-1 text-lg font-semibold text-ink-950">De necesidad a suministro</p>
                                </div>
                                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-500" />Activo</span>
                            </div>
                            <ol className="relative mt-6 space-y-5">
                                {[
                                    ['Requerimiento', 'Modelo, código de parte o escenario'],
                                    ['Validación', 'Compatibilidad y alternativa técnica'],
                                    ['Propuesta', 'Suministro y trazabilidad de la solicitud'],
                                ].map(([title, detail], index) => (
                                    <li key={title} className="flex gap-4">
                                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-signal-200 bg-signal-50 text-xs font-bold text-signal-700">0{index + 1}</span>
                                        <span><span className="block text-sm font-semibold text-ink-950">{title}</span><span className="mt-1 block text-sm leading-5 text-ink-500">{detail}</span></span>
                                    </li>
                                ))}
                            </ol>
                            <div className="relative mt-7 rounded-2xl border border-signal-100 bg-signal-50/70 p-4 text-sm leading-6 text-ink-600">
                                ¿No encuentra el producto? Envíe el modelo o una foto de la etiqueta y partimos desde ahí.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y border-ink-100 bg-white">
                <div className="section-shell grid gap-6 py-7 text-center sm:grid-cols-3 sm:text-left">
                    {[
                        ['Hardware empresarial', 'Servidores, almacenamiento, redes y componentes'],
                        ['Criterio técnico', 'Compatibilidad antes de definir la alternativa'],
                        ['Canal directo', 'Cotización, seguimiento y soporte en un solo lugar'],
                    ].map(([title, description]) => (
                        <div key={title} className="flex items-start justify-center gap-3 sm:justify-start">
                            <span className="mt-1 size-2 rounded-full bg-signal-500 shadow-[0_0_14px_rgba(87,140,163,.5)]" />
                            <div><p className="text-sm font-semibold text-ink-950">{title}</p><p className="mt-1 text-xs leading-5 text-ink-500">{description}</p></div>
                        </div>
                    ))}
                </div>
            </section>

            <section ref={environmentRef} className="scroll-animate relative overflow-hidden bg-cloud-50 py-24">
                <div className="public-grid absolute inset-0 opacity-35" />
                <div className="section-shell relative">
                    <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
                        <div>
                            <div className="public-eyebrow">Por entorno</div>
                            <h2 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.05em] text-ink-950 sm:text-5xl">Una ruta clara, aunque su necesidad no venga en una caja.</h2>
                        </div>
                        <p className="max-w-2xl text-base leading-7 text-ink-600">En lugar de obligar a las personas a navegar un catálogo infinito, la experiencia parte por el entorno, la criticidad y la compatibilidad del componente que necesitan.</p>
                    </div>

                    <div className="mt-12 grid gap-4 md:grid-cols-2">
                        {environments.map((environment) => (
                            <article key={environment.number} className="group relative overflow-hidden rounded-3xl border border-ink-100 bg-white p-7 shadow-[0_16px_38px_rgba(31,62,82,0.06)] transition duration-500 hover:-translate-y-1 hover:border-signal-300 hover:shadow-[0_22px_52px_rgba(31,62,82,0.12)]">
                                <span className="absolute right-6 top-5 text-5xl font-display font-semibold tracking-[-0.08em] text-ink-950/[0.035]">{environment.number}</span>
                                <span className="text-[10px] font-bold tracking-[0.2em] text-signal-600">{environment.number}</span>
                                <h3 className="mt-6 max-w-sm text-2xl font-semibold tracking-[-0.04em] text-ink-950">{environment.title}</h3>
                                <p className="mt-4 max-w-md text-sm leading-6 text-ink-500">{environment.description}</p>
                                <div className="mt-7 flex flex-wrap gap-2">
                                    {environment.tags.map((tag) => <span key={tag} className="rounded-full border border-ink-100 bg-cloud-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-600">{tag}</span>)}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section ref={processRef} className="scroll-animate border-y border-ink-100 bg-white py-24">
                <div className="section-shell">
                    <div className="max-w-2xl">
                        <div className="public-eyebrow">Cómo trabajamos</div>
                        <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-ink-950 sm:text-5xl">Menos fricción entre la urgencia técnica y la respuesta correcta.</h2>
                    </div>
                    <div className="mt-14 grid gap-8 md:grid-cols-3">
                        {process.map(([number, title, description]) => (
                            <article key={number} className="relative border-t border-ink-200 pt-6">
                                <span className="text-xs font-bold tracking-[0.2em] text-signal-600">{number}</span>
                                <h3 className="mt-5 text-xl font-semibold text-ink-950">{title}</h3>
                                <p className="mt-3 text-sm leading-6 text-ink-500">{description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section ref={ctaRef} className="scroll-animate relative overflow-hidden bg-cloud-100 py-24">
                <NetworkBackdrop />
                <div className="section-shell relative">
                    <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-ink-950 px-7 py-12 text-center shadow-[0_28px_72px_rgba(16,37,54,.20)] sm:px-14 sm:py-16">
                        <div className="absolute inset-0 public-network opacity-20" />
                        <div className="relative mx-auto max-w-3xl">
                            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-signal-300"><span className="h-px w-7 bg-signal-300" />Solicitud técnica<span className="h-px w-7 bg-signal-300" /></div>
                            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">¿Tiene una pieza, un modelo o una operación que no puede esperar?</h2>
                            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-ink-100">Cuéntenos qué necesita. Un requerimiento bien descrito permite responder con una propuesta más útil desde el primer contacto.</p>
                            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link href={route('contact')} className="btn-premium bg-white px-8 text-ink-950 hover:bg-cloud-100">Enviar requerimiento <ArrowIcon /></Link>
                                <a href="https://wa.me/56988198559" target="_blank" rel="noopener noreferrer" className="btn-premium border border-white/20 bg-white/5 px-8 text-white hover:bg-white/10">Hablar por WhatsApp</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
