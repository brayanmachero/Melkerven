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
