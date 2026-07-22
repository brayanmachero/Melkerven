import { useEffect, useState } from 'react';

export default function MailPwaInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        const capturePrompt = (event) => {
            event.preventDefault();
            setDeferredPrompt(event);
        };

        window.addEventListener('beforeinstallprompt', capturePrompt);

        return () => window.removeEventListener('beforeinstallprompt', capturePrompt);
    }, []);

    const install = async () => {
        if (!deferredPrompt) {
            setShowHelp(true);
            return;
        }

        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
    };

    if (window.matchMedia?.('(display-mode: standalone)').matches) {
        return null;
    }

    return (
        <div className="mt-3 rounded-xl border border-sky-500/20 bg-sky-500/[0.05] p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-sky-300">Acceso rápido</p>
            <p className="mt-1 text-[10px] leading-relaxed text-primary-400">Instala Correo Melkerven para abrir la bandeja desde el inicio de tu teléfono.</p>
            <button type="button" onClick={install} className="mt-2 text-[9px] font-bold uppercase tracking-widest text-accent-400 transition hover:text-white">
                {deferredPrompt ? 'Instalar aplicación' : 'Cómo añadirla al inicio'}
            </button>
            {showHelp && <p className="mt-2 text-[10px] leading-relaxed text-primary-500">En Android abre el menú del navegador y elige “Instalar aplicación”. En iPhone usa Compartir → “Añadir a pantalla de inicio”.</p>}
        </div>
    );
}
