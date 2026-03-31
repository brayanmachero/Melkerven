import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <svg className="size-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Actualizar Contraseña
                </h2>
                <p className="mt-2 text-sm text-primary-400 font-light">
                    Usa una contraseña larga y segura para mantener tu cuenta protegida.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-8 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="current_password" className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Contraseña Actual</label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="w-full bg-primary-950 border border-primary-800 rounded-xl px-5 py-3.5 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light text-sm"
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-1" />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Nueva Contraseña</label>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="w-full bg-primary-950 border border-primary-800 rounded-xl px-5 py-3.5 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light text-sm"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password_confirmation" className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Confirmar Contraseña</label>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="w-full bg-primary-950 border border-primary-800 rounded-xl px-5 py-3.5 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light text-sm"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-1" />
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <button
                        disabled={processing}
                        className="btn-premium bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/20 disabled:opacity-50 text-xs uppercase tracking-widest"
                    >
                        Actualizar Contraseña
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-400 font-bold">✓ Actualizado</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
