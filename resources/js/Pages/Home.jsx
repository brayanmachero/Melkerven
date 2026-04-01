import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import useScrollAnimation from '@/Hooks/useScrollAnimation';

export default function Home({ auth }) {
    const hardwareRef = useScrollAnimation();
    const visionRef = useScrollAnimation();
    const ctaRef = useScrollAnimation();

    return (
        <PublicLayout auth={auth}>
            <Head>
                <title>Infraestructura TI de Alto Nivel - Melkerven</title>
                <meta name="description" content="Melkerven Chile: Suministro crítico de hardware, servidores y componentes de TI importados. Potenciamos la continuidad operativa de su empresa con estándares globales." />
                <meta property="og:title" content="Infraestructura TI de Alto Nivel - Melkerven" />
                <meta property="og:description" content="Suministro crítico de hardware, servidores y componentes de TI importados. Potenciamos la continuidad operativa de su empresa." />
                <meta property="og:image" content="/images/logo-light.png" />
                <meta property="og:type" content="website" />
            </Head>

            {/* Hero Section - Impactful V2 */}
            <section className="relative min-h-[75vh] flex items-center overflow-hidden">
                {/* Background Image with Tech Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero_datacenter_tech.png"
                        alt="Melkerven Datacenter"
                        className="size-full object-cover opacity-60 scale-105"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/90 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 mb-8 blur-none animate-fade-in">
                            <span className="size-2 bg-accent-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-accent-400">Expertos en Importación TI</span>
                        </div>

                        <h1 className="text-5xl sm:text-7xl font-display font-medium text-white leading-[0.95] mb-6 tracking-tighter">
                            Infraestructura <br />
                            <span className="text-accent-500">Tecnológica</span> <br />
                            sin fronteras.
                        </h1>

                        <p className="text-lg text-primary-200 mb-10 leading-relaxed max-w-xl font-light">
                            Melkerven Chile: Suministro crítico de hardware, servidores y componentes de TI importados. Potenciamos la continuidad operativa de su empresa con estándares globales.
                        </p>

                        <div className="flex flex-wrap gap-5">
                            <Link
                                href="/catalog"
                                className="btn-premium bg-accent-500 text-white hover:bg-accent-600 shadow-2xl shadow-accent-500/20"
                            >
                                Explorar Hardware
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            <Link
                                href="/contact"
                                className="btn-premium bg-white/5 text-white border border-white/10 hover:bg-white/10 backdrop-blur-md"
                            >
                                Solicitar Cotización
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Visual Accent Lines */}
                <div className="absolute bottom-0 right-0 w-1/3 h-px bg-gradient-to-r from-transparent via-accent-500 to-transparent opacity-30"></div>
                <div className="absolute top-1/4 right-0 w-px h-64 bg-gradient-to-b from-transparent via-accent-500 to-transparent opacity-20"></div>
            </section>

            {/* Hardware Impact Section */}
            <section ref={hardwareRef} className="py-20 bg-primary-950 relative overflow-hidden scroll-animate">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl">
                                <img
                                    src="/tech_components_impact.png"
                                    alt="Hardware Precision"
                                    className="size-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 to-transparent"></div>
                            </div>
                            {/* Stats Overlay */}
                            <div className="absolute -bottom-6 -right-6 tech-card !p-8 shadow-3xl bg-primary-900/90 backdrop-blur-xl border-accent-500/30">
                                <div className="text-3xl font-bold text-white mb-1">10+</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-accent-400">Años de Experticia</div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <h2 className="text-4xl sm:text-5xl font-display font-medium text-white mb-8 tracking-tight">
                                Calidad que impulsa <br /> la próxima generación.
                            </h2>
                            <p className="text-lg text-primary-300 mb-10 leading-relaxed">
                                No solo importamos cajas. Analizamos la arquitectura de su servidor y seleccionamos los componentes (Enterprise SSDs, RAM DDR5, Procesos Xeon/EPYC) que garantizan el máximo rendimiento.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: 'Importación Directa', desc: 'Sin intermediarios, precios competitivos desde USA y Europa.' },
                                    { title: 'Componentes Críticos', desc: 'Stock permanente de piezas difíciles de encontrar en el mercado local.' },
                                    { title: 'Garantía Asegurada', desc: 'Respaldo total en cada equipo y repuesto suministrado por Melkerven.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5 group">
                                        <div className="size-12 rounded-xl bg-primary-900 border border-primary-800 flex items-center justify-center text-accent-500 group-hover:border-accent-500/50 transition-colors shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                            <p className="text-sm text-primary-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & History - Dark Industrial V2 */}
            <section ref={visionRef} className="py-24 border-y border-white/5 bg-primary-950 scroll-animate">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16">
                        <div className="tech-card">
                            <div className="size-10 bg-accent-500/10 rounded-lg flex items-center justify-center text-accent-500 mb-6 border border-accent-500/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
                            <p className="text-primary-300 leading-relaxed font-light">
                                Proporcionar infraestructura TI de vanguardia que permita a las empresas chilenas competir a nivel global, mediante la importación estratégica de hardware de alta fiabilidad.
                            </p>
                        </div>
                        <div className="tech-card border-l-accent-500">
                            <div className="size-10 bg-accent-500/10 rounded-lg flex items-center justify-center text-accent-500 mb-6 border border-accent-500/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Nuestra Trayectoria</h2>
                            <p className="text-primary-300 leading-relaxed font-light">
                                Melkerven ha evolucionado desde una empresa de suministros hacia un socio de infraestructura crítico, conectando las mejores marcas tecnológicas del mundo con el mercado nacional.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* High Impact CTA Section */}
            <section ref={ctaRef} className="py-20 relative overflow-hidden bg-primary-950 scroll-animate">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="relative rounded-[3rem] p-10 sm:p-20 border border-white/10 overflow-hidden group">
                        {/* Background glow */}
                        <div className="absolute -top-48 -left-48 size-96 bg-accent-500/20 rounded-full blur-[120px] pointer-events-none group-hover:bg-accent-500/30 transition-colors duration-1000"></div>
                        <div className="absolute -bottom-48 -right-48 size-96 bg-primary-400/10 rounded-full blur-[120px] pointer-events-none"></div>

                        <div className="relative z-10 text-center max-w-4xl mx-auto">
                            <h2 className="text-4xl sm:text-6xl font-display font-medium text-white mb-8 tracking-tighter leading-tight">
                                Impulse su <span className="text-accent-500">Potencia de Fuego</span> Tecnológica.
                            </h2>
                            <p className="text-lg text-primary-300 mb-10 max-w-2xl mx-auto font-light">
                                ¿Busca un componente descatalogado o necesita armar un datacenter desde cero? Nosotros lo gestionamos.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6">
                                <Link
                                    href="/contact"
                                    className="btn-premium bg-white text-primary-950 hover:bg-primary-50 px-12"
                                >
                                    Solicitar Información Crítica
                                </Link>
                                <a
                                    href="https://wa.me/56988198559"
                                    className="btn-premium bg-transparent text-white border border-white/20 hover:bg-white/5 px-12"
                                >
                                    Hablar con un Experto
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
