import { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

const CLP_TO_USD_RATE = 1 / (parseInt(document.querySelector('meta[name="usd-to-clp"]')?.content) || 950);

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState('CLP');

    const formatPrice = (amountCLP) => {
        if (!amountCLP && amountCLP !== 0) return '—';
        if (currency === 'USD') {
            const usd = amountCLP * CLP_TO_USD_RATE;
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(usd);
        }
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amountCLP);
    };

    const toggleCurrency = () => setCurrency(prev => prev === 'CLP' ? 'USD' : 'CLP');

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        // Fallback for pages not wrapped in provider
        return {
            currency: 'CLP',
            formatPrice: (amount) => {
                if (!amount && amount !== 0) return '—';
                return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount);
            },
            toggleCurrency: () => {},
        };
    }
    return context;
}

export default CurrencyContext;
