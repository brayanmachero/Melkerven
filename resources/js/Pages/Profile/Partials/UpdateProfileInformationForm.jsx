import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            rut: user.rut || '',
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <svg className="size-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Información del Perfil
                </h2>
                <p className="mt-2 text-sm text-primary-400 font-light">
                    Actualiza la información de tu cuenta y dirección de correo electrónico.
                </p>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Nombre Completo</label>
                    <input
                        id="name"
                        className="w-full bg-primary-950 border border-primary-800 rounded-xl px-5 py-3.5 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light text-sm"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoFocus
                        autoComplete="name"
                    />
                    <InputError className="mt-1" message={errors.name} />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Correo Electrónico</label>
                    <input
                        id="email"
                        type="email"
                        className="w-full bg-primary-950 border border-primary-800 rounded-xl px-5 py-3.5 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light text-sm"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-1" message={errors.email} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Teléfono</label>
                        <input
                            id="phone"
                            type="tel"
                            className="w-full bg-primary-950 border border-primary-800 rounded-xl px-5 py-3.5 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light text-sm"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="+56 9 ..."
                        />
                        <InputError className="mt-1" message={errors.phone} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="rut" className="text-[10px] font-bold uppercase tracking-widest text-primary-500">RUT</label>
                        <input
                            id="rut"
                            type="text"
                            className="w-full bg-primary-950 border border-primary-800 rounded-xl px-5 py-3.5 text-white focus:border-accent-500 focus:ring-accent-500/20 transition-all font-light text-sm"
                            value={data.rut}
                            onChange={(e) => setData('rut', e.target.value)}
                            placeholder="12.345.678-9"
                        />
                        <InputError className="mt-1" message={errors.rut} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                        <p className="text-sm text-yellow-400">
                            Tu correo electrónico no ha sido verificado.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 text-accent-500 underline hover:text-accent-400 font-bold"
                            >
                                Reenviar verificación
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <p className="mt-2 text-sm font-medium text-green-400">
                                Se ha enviado un nuevo enlace de verificación.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-4">
                    <button
                        disabled={processing}
                        className="btn-premium bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/20 disabled:opacity-50 text-xs uppercase tracking-widest"
                    >
                        Guardar Cambios
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-400 font-bold">✓ Guardado</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
