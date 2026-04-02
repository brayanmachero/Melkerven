import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function TwoFactor({ status }) {
    const { data, setData, post, processing, errors } = useForm({ code: '' });
    const { post: resendPost, processing: resending } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('two-factor.verify'));
    };

    const resend = (e) => {
        e.preventDefault();
        resendPost(route('two-factor.resend'));
    };

    return (
        <GuestLayout>
            <Head title="Verificación 2FA - Melkerven" />

            <div className="mb-8 text-center lg:text-left">
                <h1 className="text-3xl font-display font-medium text-white tracking-tighter mb-2">
                    Verificación <span className="text-accent-500">2FA</span>
                </h1>
                <p className="text-xs text-primary-500 font-bold uppercase tracking-widest">
                    Ingrese el código enviado a su email
                </p>
            </div>

            {status && (
                <div className="mb-6 tech-card !p-4 border-l-4 border-l-green-500 bg-green-500/5 text-green-400 text-xs font-bold uppercase tracking-widest">
                    {status}
                </div>
            )}

            <div className="mb-6 tech-card !p-4 border-l-4 border-l-accent-500 bg-accent-500/5">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-accent-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-primary-300 text-sm leading-relaxed">
                        Hemos enviado un código de 6 dígitos a su correo electrónico. El código expira en 10 minutos.
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary-400 ml-1">
                        Código de Verificación
                    </label>
                    <input
                        type="text"
                        value={data.code}
                        className="tech-input w-full text-center text-2xl tracking-[0.5em] font-mono"
                        maxLength={6}
                        autoFocus
                        placeholder="000000"
                        onChange={(e) => setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                    <InputError message={errors.code} className="mt-2" />
                </div>

                <button
                    type="submit"
                    className="w-full btn-premium bg-accent-500 text-white hover:bg-accent-600 py-4 text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl shadow-accent-500/20 active:scale-95 disabled:opacity-50"
                    disabled={processing || data.code.length !== 6}
                >
                    {processing ? 'Verificando...' : 'Verificar Código'}
                </button>
            </form>

            <div className="mt-6 flex items-center justify-between">
                <button
                    onClick={resend}
                    disabled={resending}
                    className="text-[10px] font-bold uppercase tracking-widest text-primary-500 hover:text-accent-400 transition-colors disabled:opacity-50"
                >
                    {resending ? 'Enviando...' : 'Reenviar Código'}
                </button>

                <a
                    href={route('logout')}
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('logout-form').submit();
                    }}
                    className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                >
                    Cerrar Sesión
                </a>
                <form id="logout-form" action={route('logout')} method="POST" className="hidden">
                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />
                </form>
            </div>
        </GuestLayout>
    );
}
