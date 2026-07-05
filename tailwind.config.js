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
                sans: ['"DM Sans"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                ink: 'rgb(var(--color-ink) / <alpha-value>)',
                muted: 'rgb(var(--color-muted) / <alpha-value>)',
                accent: {
                    DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
                    dk: 'rgb(var(--color-accent-dk) / <alpha-value>)',
                },
                tint: 'rgb(var(--color-tint) / <alpha-value>)',
                line: 'rgb(var(--color-line) / <alpha-value>)',
                card: 'rgb(var(--color-card) / <alpha-value>)',
                positive: {
                    DEFAULT: 'rgb(var(--color-green) / <alpha-value>)',
                    tint: 'rgb(var(--color-green-tint) / <alpha-value>)',
                },
                warning: {
                    DEFAULT: 'rgb(var(--color-amber) / <alpha-value>)',
                    tint: 'rgb(var(--color-amber-tint) / <alpha-value>)',
                },
                surface: 'rgb(var(--color-surface) / <alpha-value>)',
            },
            borderRadius: {
                card: '12px',
                field: '8px',
            },
            minHeight: {
                tap: '44px',
            },
            minWidth: {
                tap: '44px',
            },
        },
    },

    plugins: [forms],
};
