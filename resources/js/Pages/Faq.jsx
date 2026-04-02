import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { useState } from 'react';

export default function Faq({ auth, faqs }) {
    const [openIndex, setOpenIndex] = useState({});

    const toggle = (catIdx, itemIdx) => {
        const key = `${catIdx}-${itemIdx}`;
        setOpenIndex(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <PublicLayout auth={auth}>
            <Head title="Preguntas Frecuentes" />

            <section className="py-20 bg-gradient-to-b from-primary-900/50 to-transparent">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumbs items={[{ label: 'Preguntas Frecuentes' }]} />

                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            Preguntas <span className="text-accent-500">Frecuentes</span>
                        </h1>
                        <p className="text-primary-400 text-lg max-w-2xl mx-auto">
                            Encuentra respuestas a las consultas más comunes sobre nuestros productos y servicios.
                        </p>
                    </div>

                    <div className="space-y-10">
                        {faqs.map((category, catIdx) => (
                            <div key={catIdx}>
                                <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-3">
                                    <span className="size-8 rounded-lg bg-accent-500/10 flex items-center justify-center text-accent-400 text-sm font-bold border border-accent-500/20">
                                        {catIdx + 1}
                                    </span>
                                    {category.category}
                                </h2>
                                <div className="space-y-2">
                                    {category.items.map((item, itemIdx) => {
                                        const key = `${catIdx}-${itemIdx}`;
                                        const isOpen = openIndex[key];
                                        return (
                                            <div key={itemIdx} className="border border-white/10 rounded-xl overflow-hidden bg-primary-900/30">
                                                <button
                                                    onClick={() => toggle(catIdx, itemIdx)}
                                                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
                                                >
                                                    <span className="text-white font-medium text-sm pr-4">{item.question}</span>
                                                    <svg
                                                        className={`size-5 text-accent-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                {isOpen && (
                                                    <div className="px-6 pb-4 text-primary-400 text-sm leading-relaxed border-t border-white/5 pt-3">
                                                        {item.answer}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-16 text-center p-8 rounded-2xl bg-primary-900/50 border border-white/10">
                        <h3 className="text-xl font-display font-bold text-white mb-2">¿No encontraste lo que buscabas?</h3>
                        <p className="text-primary-400 text-sm mb-6">Nuestro equipo está disponible para resolver cualquier consulta.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={route('contact')}
                                className="px-6 py-3 bg-accent-500 text-white rounded-xl text-sm font-bold hover:bg-accent-600 transition-all"
                            >
                                Contáctanos
                            </a>
                            <a
                                href="https://wa.me/56988198559"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-green-500/10 text-green-400 rounded-xl text-sm font-bold hover:bg-green-500/20 transition-all border border-green-500/20"
                            >
                                WhatsApp Directo
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
