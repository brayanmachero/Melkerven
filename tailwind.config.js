import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                display: ['Outfit', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#0b1120',
                },
                accent: {
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                },
                cloud: {
                    50: '#f7fafc',
                    100: '#eef4f7',
                    200: '#dce9ee',
                    300: '#c3d7e0',
                    400: '#9ab8c6',
                    500: '#7798a9',
                },
                ink: {
                    50: '#eef4f7',
                    100: '#dbe7ed',
                    300: '#8ea8b7',
                    500: '#527083',
                    700: '#29485b',
                    800: '#1d394b',
                    900: '#152d40',
                    950: '#102536',
                },
                signal: {
                    50: '#f0f7fa',
                    100: '#dceef4',
                    200: '#c1dfe9',
                    300: '#9bc8d7',
                    400: '#78adbf',
                    500: '#578ca3',
                    600: '#41758d',
                    700: '#315c73',
                },
                surface: {
                    800: '#1e293b',
                    900: '#0f172a',
                }
            },
        },
    },

    plugins: [forms],
};
