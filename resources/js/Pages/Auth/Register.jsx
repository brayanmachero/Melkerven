import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registro de Suministro - Melkerven" />

            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-3xl font-display font-medium text-white tracking-tighter mb-2">
                    Nuevo <span className="text-accent-500">Operador</span>
                </h1>
                <p className="text-xs text-primary-500 font-bold uppercase tracking-widest">Cree su cuenta para importar hardware</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary-400 ml-1">Nombre Completo</label>
                    <input
                        id="name"
                        name="name"
                        value={data.name}
                        className="tech-input w-full"
                        autoComplete="name"
                        autoFocus
                        required
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary-400 ml-1">Email Corporativo</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="tech-input w-full"
                        autoComplete="username"
                        required
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary-400 ml-1">Clave de Acceso</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="tech-input w-full"
                        autoComplete="new-password"
                        required
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary-400 ml-1">Confirmar Clave</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="tech-input w-full"
                        autoComplete="new-password"
                        required
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        className="w-full btn-premium bg-accent-500 text-white hover:bg-accent-600 py-4 text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl shadow-accent-500/20 active:scale-95 disabled:opacity-50"
                        disabled={processing}
                    >
                        {processing ? 'Procesando Registro...' : 'Crear Cuenta Industrial'}
                    </button>

                    <p className="mt-8 text-center text-[10px] text-primary-500 font-bold uppercase tracking-widest">
                        ¿Ya tiene una cuenta? {' '}
                        <Link href={route('login')} className="text-accent-500 hover:text-accent-400 underline decoration-accent-500/30 underline-offset-4">
                            Iniciar Sesión
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
