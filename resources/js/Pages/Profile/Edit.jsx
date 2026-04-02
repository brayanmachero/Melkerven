import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status, sessions = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const { post: toggleTwoFactor, processing: toggling2FA } = useForm({});
    const { data: sessionData, setData: setSessionData, delete: destroySessions, processing: destroyingSessions, errors: sessionErrors } = useForm({ password: '' });

    const handleToggle2FA = (e) => {
        e.preventDefault();
        toggleTwoFactor(route('profile.two-factor'));
    };

    const handleDestroySessions = (e) => {
        e.preventDefault();
        destroySessions(route('profile.sessions.destroy'), {
            preserveScroll: true,
            onSuccess: () => setSessionData('password', ''),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-px w-8 bg-accent-500"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-500">Configuración de Cuenta</span>
                    </div>
                    <h2 className="text-3xl font-display font-medium text-white tracking-tight">
                        Mi <span className="text-accent-500">Perfil</span>
                    </h2>
                </div>
            }
        >
            <Head title="Mi Perfil" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    <div className="tech-card !p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="tech-card !p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* Two-Factor Authentication */}
                    {user.role === 'admin' && (
                        <div className="tech-card !p-8 border-accent-500/20">
                            <section className="max-w-xl">
                                <header className="mb-6">
                                    <h2 className="text-lg font-display font-medium text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Autenticación de Dos Factores (2FA)
                                    </h2>
                                    <p className="mt-1 text-sm text-primary-400">
                                        Agrega una capa extra de seguridad a tu cuenta. Al activarla, se te enviará un código por email cada vez que inicies sesión.
                                    </p>
                                </header>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-primary-900/50 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${user.two_factor_enabled ? 'bg-green-500 shadow-lg shadow-green-500/30' : 'bg-primary-600'}`}></div>
                                        <span className="text-sm text-primary-300">
                                            {user.two_factor_enabled ? 'Activado — Se enviará un código por email al iniciar sesión' : 'Desactivado'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleToggle2FA}
                                        disabled={toggling2FA}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                                            user.two_factor_enabled
                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                                                : 'bg-accent-500/10 text-accent-400 border border-accent-500/20 hover:bg-accent-500/20'
                                        }`}
                                    >
                                        {toggling2FA ? '...' : user.two_factor_enabled ? 'Desactivar' : 'Activar'}
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Active Sessions */}
                    <div className="tech-card !p-8 border-white/5">
                        <section className="max-w-xl">
                            <header className="mb-6">
                                <h2 className="text-lg font-display font-medium text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Sesiones Activas
                                </h2>
                                <p className="mt-1 text-sm text-primary-400">
                                    Gestiona y cierra tus sesiones activas en otros dispositivos.
                                </p>
                            </header>

                            {sessions.length > 0 ? (
                                <div className="space-y-3">
                                    {sessions.map((session, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-primary-900/50 border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm text-primary-300">
                                                        {session.ip_address}
                                                        {session.is_current && <span className="ml-2 text-green-400 text-xs">(esta sesión)</span>}
                                                    </p>
                                                    <p className="text-xs text-primary-500">{session.last_active}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-primary-500">No se pueden obtener las sesiones activas con el driver de sesión actual.</p>
                            )}

                            {sessions.length > 1 && (
                                <form onSubmit={handleDestroySessions} className="mt-6 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary-400 ml-1">
                                            Confirma tu contraseña para cerrar otras sesiones
                                        </label>
                                        <input
                                            type="password"
                                            value={sessionData.password}
                                            className="tech-input w-full"
                                            placeholder="Tu contraseña actual"
                                            onChange={(e) => setSessionData('password', e.target.value)}
                                        />
                                        {sessionErrors.password && <p className="text-red-400 text-xs">{sessionErrors.password}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={destroyingSessions}
                                        className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-[10px] font-bold uppercase tracking-widest transition-all"
                                    >
                                        Cerrar Otras Sesiones
                                    </button>
                                </form>
                            )}
                        </section>
                    </div>

                    <div className="tech-card !p-8 border-red-500/20">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
