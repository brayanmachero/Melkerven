import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
    es: {
        nav: { home: 'Inicio', catalog: 'Catálogo', about: 'Quiénes Somos', contact: 'Contacto', blog: 'Blog', faq: 'FAQ', tracking: 'Seguimiento', login: 'Login', register: 'Registrarse', myAccount: 'Mi Cuenta' },
        footer: { nav: 'Navegación', hq: 'Sede Central', support: 'Soporte Directo', newsletter: 'Mantente Informado', newsletterDesc: 'Recibe novedades sobre productos, ofertas y tecnología.', subscribe: 'Suscribir', rights: 'Melkerven Chile' },
        catalog: { search: 'Buscar', filters: 'Filtros', sort: 'Ordenar', noProducts: 'No se encontraron productos.', addToCart: 'Agregar', compare: 'Comparar', viewDetails: 'Ver Detalles' },
        product: { addToCart: 'Agregar al Carrito', requestQuote: 'Solicitar Cotización', outOfStock: 'Sin Stock', notifyMe: 'Avisarme', specs: 'Especificaciones', reviews: 'Reseñas', related: 'Productos Relacionados', warranty: 'Garantía', volumePricing: 'Precios por Volumen' },
        cart: { title: 'Carrito de Compras', empty: 'Tu carrito está vacío.', total: 'Total', checkout: 'Proceder al Pago', coupon: 'Código de cupón', apply: 'Aplicar' },
        common: { loading: 'Cargando...', save: 'Guardar', cancel: 'Cancelar', delete: 'Eliminar', edit: 'Editar', create: 'Crear', back: 'Volver', search: 'Buscar' },
    },
    en: {
        nav: { home: 'Home', catalog: 'Catalog', about: 'About Us', contact: 'Contact', blog: 'Blog', faq: 'FAQ', tracking: 'Tracking', login: 'Login', register: 'Register', myAccount: 'My Account' },
        footer: { nav: 'Navigation', hq: 'Headquarters', support: 'Direct Support', newsletter: 'Stay Informed', newsletterDesc: 'Get updates on products, deals and technology.', subscribe: 'Subscribe', rights: 'Melkerven Chile' },
        catalog: { search: 'Search', filters: 'Filters', sort: 'Sort', noProducts: 'No products found.', addToCart: 'Add', compare: 'Compare', viewDetails: 'View Details' },
        product: { addToCart: 'Add to Cart', requestQuote: 'Request Quote', outOfStock: 'Out of Stock', notifyMe: 'Notify Me', specs: 'Specifications', reviews: 'Reviews', related: 'Related Products', warranty: 'Warranty', volumePricing: 'Volume Pricing' },
        cart: { title: 'Shopping Cart', empty: 'Your cart is empty.', total: 'Total', checkout: 'Proceed to Payment', coupon: 'Coupon code', apply: 'Apply' },
        common: { loading: 'Loading...', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', create: 'Create', back: 'Back', search: 'Search' },
    },
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(localStorage.getItem('melkerven_lang') || 'es');

    const toggleLanguage = () => {
        const newLang = language === 'es' ? 'en' : 'es';
        setLanguage(newLang);
        localStorage.setItem('melkerven_lang', newLang);
    };

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];
        for (const k of keys) {
            value = value?.[k];
        }
        return value || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        return {
            language: 'es',
            t: (key) => {
                const keys = key.split('.');
                let value = translations.es;
                for (const k of keys) { value = value?.[k]; }
                return value || key;
            },
            toggleLanguage: () => {},
        };
    }
    return context;
}

export default LanguageContext;
