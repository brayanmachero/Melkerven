import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function DteIndex({ status, message }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-display font-bold text-white">Facturación Electrónica (DTE)</h2>}>
            <Head title="Facturación Electrónica" />
            <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-primary-900/50 border border-white/10 rounded-2xl p-8 text-center">
                    <div className="size-20 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-yellow-500/20">
                        <svg className="size-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-3">Integración en Preparación</h3>
                    <p className="text-primary-400 max-w-lg mx-auto mb-8">{message}</p>

                    <div className="bg-primary-800/50 rounded-xl p-6 text-left max-w-md mx-auto">
                        <h4 className="text-white font-bold text-sm mb-4">Requisitos para activar:</h4>
                        <ul className="space-y-3">
                            {[
                                'Certificado digital del SII',
                                'Resolución de autorización',
                                'RUT de la empresa',
                                'Clave del contribuyente (SII)',
                            ].map((req, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-primary-300">
                                    <span className="size-5 rounded-full bg-primary-700 flex items-center justify-center text-primary-500 text-xs">
                                        {i + 1}
                                    </span>
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="mt-8 text-primary-500 text-xs">
                        Una vez proporcionadas las credenciales, se habilitará la emisión automática de boletas y facturas electrónicas.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
