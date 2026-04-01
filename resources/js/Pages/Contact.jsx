import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Head, useForm } from '@inertiajs/react';

export default function Contact({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <PublicLayout auth={auth}>
            <Head title="Soporte y Consultas de Hardware" />

            <section className="py-20 bg-primary-950 relative overflow-hidden min-h-[85vh]">
                <div className="absolute top-0 right-0 size-96 bg-accent-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <Breadcrumbs items={[{ label: 'Contacto' }]} />
                    <div className="grid lg:grid-cols-2 gap-20">
                        {/* Info Column */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px w-12 bg-accent-500"></div>
                                <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-500">Canal Directo</span>
                            </div>
                            <h1 className="text-5xl sm:text-7xl font-display font-medium text-white mb-10 tracking-tighter transition-all">
                                Conectamos su <br /><span className="text-accent-500">Necesidad TI.</span>
                            </h1>
                            <p className="text-lg text-primary-300 mb-12 font-light leading-relaxed max-w-lg">
                                Si busca un repuesto crítico, soporte para servidores o una importación a pedido, nuestro equipo de expertos está listo para gestionar su solicitud.
                            </p>

                            <div className="space-y-10">
                                <div className="flex items-start gap-6 group">
                                    <div className="size-14 bg-primary-900 border border-primary-800 rounded-2xl flex items-center justify-center text-accent-500 shrink-0 group-hover:border-accent-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1 uppercase tracking-widest text-xs">Ubicación Estratégica</h4>
                                        <p className="text-primary-300 font-light text-lg">Badajoz 100, Las Condes, Santiago</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6 group">
                                    <div className="size-14 bg-primary-900 border border-primary-800 rounded-2xl flex items-center justify-center text-accent-500 shrink-0 group-hover:border-accent-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1 uppercase tracking-widest text-xs">Enlace Digital</h4>
                                        <p className="text-primary-300 font-light text-lg">contacto@melkerven.net</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6 group">
                                    <div className="size-14 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center text-green-500 shrink-0 group-hover:border-green-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.92s.214.123.67.345c1.497.747 3.174 1.14 4.895 1.141 5.432 0 9.853-4.42 9.856-9.853.002-2.625-1.02-5.093-2.879-6.955-1.856-1.856-4.327-2.877-6.953-2.879-5.433 0-9.854 4.421-9.856 9.853-.001 1.838.51 3.633 1.479 5.228l.204.336-1.097 4.006 4.103-1.077z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1 uppercase tracking-widest text-xs">WhatsApp Directo</h4>
                                        <a href="https://wa.me/56988198559" className="text-green-500 font-bold hover:text-green-400 transition-colors text-lg italic">
                                            +56 9 8819 8559
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="tech-card !p-12 relative bg-primary-900 border-primary-800 shadow-3xl">
                            <div className="absolute top-0 right-0 p-12 pointer-events-none opacity-5 group">
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-10 tracking-tight">Formulario de Solicitud</h2>
                            <form onSubmit={submit} className="space-y-8">
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-3">Identidad / Empresa</label>
                                        <input
                                            type="text"
                                            className="w-full bg-primary-950 border-primary-800 rounded-xl px-5 py-4 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light"
                                            placeholder="Nombre completo"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-3">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            className="w-full bg-primary-950 border-primary-800 rounded-xl px-5 py-4 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light"
                                            placeholder="ejemplo@correo.cl"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-3">Asunto de la Consulta</label>
                                    <input
                                        type="text"
                                        className="w-full bg-primary-950 border-primary-800 rounded-xl px-5 py-4 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light"
                                        placeholder="Ej: Cotización Servidores / Repuestos Dell"
                                        value={data.subject}
                                        onChange={e => setData('subject', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-3">Requerimiento Detallado</label>
                                    <textarea
                                        rows="6"
                                        className="w-full bg-primary-950 border-primary-800 rounded-xl px-5 py-4 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light resize-none"
                                        placeholder="Describa el equipo, repuesto o soporte que necesita..."
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-5 bg-accent-500 text-white font-bold rounded-2xl hover:bg-accent-600 transition-all shadow-2xl shadow-accent-500/20 active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-sm"
                                >
                                    Enviar Solicitud de Soporte
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
