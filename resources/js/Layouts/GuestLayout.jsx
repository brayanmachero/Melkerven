import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-primary-950 flex flex-col lg:flex-row overflow-hidden">
            {/* Visual Branding Side */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/auth_tech_bg.png')] bg-cover bg-center grayscale-[0.5] hover:grayscale-0 transition-all duration-1000 scale-105"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/40 to-transparent"></div>

                <div className="relative z-10 p-20 flex flex-col justify-between h-full">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="size-12 bg-accent-500 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.3)]">
                            <span className="text-white font-display font-bold text-2xl uppercase tracking-tighter">M</span>
                        </div>
                        <span className="text-3xl font-display font-medium tracking-tighter text-white">
                            MELKERVEN<span className="text-accent-500">.</span>
                        </span>
                    </Link>

                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-accent-500"></div>
                            <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent-500">Acceso Restringido</span>
                        </div>
                        <h2 className="text-5xl font-display font-medium text-white mb-6 tracking-tighter leading-tight">
                            Infraestructura de <br /> <span className="text-accent-500 font-light">Suministro Crítico</span>
                        </h2>
                        <p className="text-primary-400 max-w-md font-light leading-relaxed">
                            Ingrese a su terminal privada para gestionar órdenes de hardware industrial y solicitudes de importación global.
                        </p>
                    </div>

                    <div className="text-[10px] text-primary-600 font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} Melkerven High-Tech Division
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-grow flex items-center justify-center p-6 sm:p-12 relative">
                {/* Decorative gradients */}
                <div className="absolute top-1/4 right-0 size-96 bg-accent-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="w-full max-w-md relative">
                    <div className="lg:hidden mb-12 flex justify-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="size-10 bg-accent-500 rounded-xl flex items-center justify-center">
                                <span className="text-white font-display font-bold text-xl uppercase tracking-tighter">M</span>
                            </div>
                        </Link>
                    </div>

                    <div className="tech-card !p-8 sm:!p-12 bg-primary-900/40 backdrop-blur-xl border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-500/20 to-transparent"></div>
                        {children}
                    </div>

                    <div className="mt-8 text-center">
                        <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-primary-500 hover:text-accent-400 transition-colors">
                            ← Volver al Portal Público
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
