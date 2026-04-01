import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Head, Link } from '@inertiajs/react';

export default function About({ auth }) {
    return (
        <PublicLayout auth={auth}>
            <Head title="Nuestra Infraestructura" />

            <section className="py-20 bg-primary-950 relative overflow-hidden font-light">
                <div className="absolute top-0 left-0 size-96 bg-accent-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <Breadcrumbs items={[{ label: 'Nosotros' }]} />
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px w-12 bg-accent-500"></div>
                                <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-500">Nuestra Identidad</span>
                            </div>
                            <h1 className="text-5xl sm:text-7xl font-display font-medium text-white mb-8 tracking-tighter">
                                Excelencia en <br />
                                <span className="text-accent-500 font-light">Suministro Técnico</span>
                            </h1>
                            <p className="text-xl text-primary-300 leading-relaxed mb-8 font-light italic border-l-2 border-accent-500/30 pl-8">
                                Melkerven Chile nació para conectar los centros de innovación tecnológica más avanzados del mundo con la infraestructura crítica de nuestro país.
                            </p>
                            <p className="text-lg text-primary-400 leading-relaxed mb-10 font-light">
                                Somos más que un importador; somos un socio estratégico que entiende que cada componente es vital para la continuidad operativa. Suministramos hardware original con estándares industriales para data centers y empresas de alto nivel.
                            </p>

                            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                <div>
                                    <div className="text-4xl font-bold text-white mb-1 tracking-tight">Directo</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-accent-400">USA • ASIA • EUROPA</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-white mb-1 tracking-tight">Crítico</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-accent-400">STOCK DISPONIBLE</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 relative group">
                                <img
                                    src="/tech_components_impact.png"
                                    alt="Technical Quality"
                                    className="size-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-transparent to-transparent"></div>
                                <div className="absolute bottom-10 left-10 right-10">
                                    <p className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Inspección de Calidad</p>
                                    <h3 className="text-2xl font-bold text-white leading-tight">Cada pieza cuenta con el respaldo técnico original.</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-24 grid md:grid-cols-3 gap-10">
                        {[
                            { icon: '🤝', title: 'Relaciones de Confianza', desc: 'Gestionamos alianzas directas con fabricantes OEM para asegurar el suministro.' },
                            { icon: '🛡️', title: 'Back-to-Back Support', desc: 'Respuesta rápida en garantías y soporte técnico especializado de nivel industrial.' },
                            { icon: '🌎', title: 'Alcance Mundial', desc: 'Localización de componentes descatalogados u obsoletos para mantenimiento operativo.' }
                        ].map((card, i) => (
                            <div key={i} className="tech-card h-full">
                                <div className="text-4xl mb-6">{card.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter tracking-tighter">{card.title}</h3>
                                <p className="text-primary-400 text-sm leading-relaxed font-light">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
