import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Terminal de Acceso - Melkerven" />

            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-3xl font-display font-medium text-white tracking-tighter mb-2">
                    Acceso a <span className="text-accent-500">Terminal</span>
                </h1>
                <p className="text-xs text-primary-500 font-bold uppercase tracking-widest">Ingrese sus credenciales de suministro</p>
            </div>

            {status && (
                <div className="mb-6 tech-card !p-4 border-l-4 border-l-green-500 bg-green-500/5 text-green-400 text-xs font-bold uppercase tracking-widest">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary-400 ml-1">Identificador de Usuario (Email)</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="tech-input w-full"
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary-400">Clave de Seguridad</label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-[10px] font-bold uppercase tracking-widest text-primary-600 hover:text-accent-500 transition-colors"
                            >
                                ¿Olvidó su clave?
                            </Link>
                        )}
                    </div>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="tech-input w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-[10px] font-bold text-primary-500 uppercase tracking-widest group-hover:text-primary-300 transition-colors">
                            Mantener Sesión Activa
                        </span>
                    </label>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full btn-premium bg-accent-500 text-white hover:bg-accent-600 py-4 text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl shadow-accent-500/20 active:scale-95 disabled:opacity-50"
                        disabled={processing}
                    >
                        {processing ? 'Autenticando...' : 'Iniciar Sesión'}
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <div className="relative flex justify-center">
                            <span className="bg-primary-900/40 px-4 text-[10px] font-bold uppercase tracking-widest text-primary-600">O continuar con</span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <a
                            href={route('social.redirect', 'google')}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-primary-300 hover:bg-white/10 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                            Google
                        </a>
                        <a
                            href={route('social.redirect', 'microsoft')}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-primary-300 hover:bg-white/10 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#f25022" d="M1 1h10v10H1z"/><path fill="#00a4ef" d="M1 13h10v10H1z"/><path fill="#7fba00" d="M13 1h10v10H13z"/><path fill="#ffb900" d="M13 13h10v10H13z"/></svg>
                            Microsoft
                        </a>
                    </div>

                    <p className="mt-8 text-center text-[10px] text-primary-500 font-bold uppercase tracking-widest">
                        ¿No tiene una cuenta? {' '}
                        <Link href={route('register')} className="text-accent-500 hover:text-accent-400 underline decoration-accent-500/30 underline-offset-4">
                            Regístrese Aquí
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
