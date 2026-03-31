import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-bold text-red-400 flex items-center gap-3">
                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    Eliminar Cuenta
                </h2>
                <p className="mt-2 text-sm text-primary-400 font-light">
                    Una vez que tu cuenta sea eliminada, todos sus datos serán borrados permanentemente. Descarga cualquier información que desees conservar antes de proceder.
                </p>
            </header>

            <button
                onClick={confirmUserDeletion}
                className="btn-premium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 text-xs uppercase tracking-widest"
            >
                Eliminar Cuenta
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-8 bg-primary-900">
                    <h2 className="text-lg font-bold text-white flex items-center gap-3">
                        <span className="size-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400">⚠</span>
                        ¿Estás seguro?
                    </h2>

                    <p className="mt-3 text-sm text-primary-400 font-light">
                        Una vez que tu cuenta sea eliminada, todos sus datos serán borrados permanentemente. Por favor, ingresa tu contraseña para confirmar.
                    </p>

                    <div className="mt-6 space-y-2">
                        <label htmlFor="password" className="sr-only">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full bg-primary-950 border border-primary-800 rounded-xl px-5 py-3.5 text-white focus:border-red-500 focus:ring-red-500/20 transition-all font-light text-sm"
                            autoFocus
                            placeholder="Tu contraseña..."
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="btn-premium bg-white/5 text-primary-300 border border-white/10 hover:bg-white/10 text-xs uppercase tracking-widest"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn-premium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 text-xs uppercase tracking-widest"
                        >
                            Eliminar Cuenta
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
