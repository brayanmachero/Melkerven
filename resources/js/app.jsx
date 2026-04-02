import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { CurrencyProvider } from './Contexts/CurrencyContext';
import { LanguageProvider } from './Contexts/LanguageContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <LanguageProvider>
                <CurrencyProvider>
                    <App {...props} />
                </CurrencyProvider>
            </LanguageProvider>
        );
    },
    progress: {
        color: '#0ea5e9',
        showSpinner: true,
    },
});
