import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Cart({ auth, cart, subtotal, shippingRates }) {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [shippingCost, setShippingCost] = useState(0);
    const [documentType, setDocumentType] = useState('boleta');
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponApplied, setCouponApplied] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const [createAccount, setCreateAccount] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        customer_name: auth.user?.name || '',
        customer_rut: auth.user?.rut || '',
        customer_email: auth.user?.email || '',
        customer_phone: auth.user?.phone || '',
        shipping_commune: '',
        shipping_address: '',
        shipping_rate_id: '',
        document_type: 'boleta',
        business_name: '',
        business_rut: '',
        business_giro: '',
        business_address: '',
        create_account: false,
        password: '',
        password_confirmation: '',
        coupon_code: '',
    });

    const handleRegionChange = (regionId) => {
        const region = shippingRates.find(r => r.id == regionId);
        setSelectedRegion(region);
        setShippingCost(region ? parseFloat(region.base_cost) : 0);
        setData('shipping_rate_id', regionId);
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        router.patch(route('cart.update'), { id, quantity }, { preserveScroll: true });
    };

    const removeItem = (id) => {
        router.delete(route('cart.remove'), { data: { id } }, { preserveScroll: true });
    };

    // Calculations
    const netTotal = subtotal;
    const iva = Math.round(netTotal * 0.19);
    const productsWithIva = netTotal + iva;
    const totalBeforeDiscount = productsWithIva + shippingCost;
    const total = Math.max(0, totalBeforeDiscount - couponDiscount);

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const response = await fetch(route('cart.coupon'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({ code: couponCode, subtotal: productsWithIva }),
            });
            const result = await response.json();
            if (result.valid) {
                setCouponDiscount(result.discount);
                setCouponApplied(result);
                setData('coupon_code', couponCode);
            } else {
                setCouponError(result.message || 'Cupón no válido');
                setCouponDiscount(0);
                setCouponApplied(null);
            }
        } catch {
            setCouponError('Error al validar cupón');
        }
        setCouponLoading(false);
    };

    const removeCoupon = () => {
        setCouponCode('');
        setCouponDiscount(0);
        setCouponApplied(null);
        setCouponError('');
        setData('coupon_code', '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payment.initiate'));
    };

    return (
        <PublicLayout auth={auth}>
            <Head title="Módulo de Adquisición - Detalle de Orden" />

            <section className="py-20 bg-primary-950 min-h-screen relative overflow-hidden">
                <div className="absolute top-0 right-0 size-[500px] bg-accent-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-8 bg-accent-500"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-500">Logística y Facturación</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-display font-medium text-white tracking-tighter">
                            Finalizar <span className="text-accent-500 font-light italic">Adquisición</span>
                        </h1>
                    </div>

                    {Object.keys(cart).length > 0 ? (
                        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-12 items-start">
                            {/* Form Sections */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Items List Preview */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-4">Suministros Seleccionados</h3>
                                    {Object.values(cart).map((item) => (
                                        <div key={item.id} className="tech-card !p-4 flex gap-4 sm:gap-6 items-center bg-primary-900/30 border-white/5">
                                            <div className="size-16 bg-primary-950 rounded-lg border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="size-full object-contain p-2" />
                                                ) : (
                                                    <svg className="size-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                                )}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h4 className="text-white font-bold text-sm truncate">{item.name}</h4>
                                                <p className="text-[10px] text-primary-500 uppercase tracking-widest">${new Intl.NumberFormat('es-CL').format(item.price)} c/u</p>
                                            </div>
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="size-8 rounded-lg bg-primary-950 border border-white/10 text-primary-400 hover:text-white hover:border-accent-500/30 flex items-center justify-center transition-all text-sm font-bold"
                                                >
                                                    −
                                                </button>
                                                <span className="w-10 text-center text-white font-bold text-sm">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="size-8 rounded-lg bg-primary-950 border border-white/10 text-primary-400 hover:text-white hover:border-accent-500/30 flex items-center justify-center transition-all text-sm font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-white font-display font-medium text-sm">
                                                    ${new Intl.NumberFormat('es-CL').format(item.price * item.quantity)}
                                                </p>
                                            </div>
                                            <button type="button" onClick={() => removeItem(item.id)} className="text-primary-600 hover:text-red-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Personal & Shipping Info */}
                                <div className="tech-card !p-8 bg-primary-900/50 border-white/5 space-y-8">
                                    <div>
                                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                            <span className="size-5 bg-accent-500 rounded flex items-center justify-center text-[10px]">1</span>
                                            Datos del Receptor / Despacho
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Nombre Completo</label>
                                                <input type="text" value={data.customer_name} onChange={e => setData('customer_name', e.target.value)} className="tech-input w-full" placeholder="Ej: Juan Pérez" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">RUT Personal</label>
                                                <input type="text" value={data.customer_rut} onChange={e => setData('customer_rut', e.target.value)} className="tech-input w-full" placeholder="12.345.678-9" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Email de Contacto</label>
                                                <input type="email" value={data.customer_email} onChange={e => setData('customer_email', e.target.value)} className="tech-input w-full" placeholder="correo@ejemplo.com" required />
                                                {errors.customer_email && <div className="text-red-400 text-[10px] mt-1">{errors.customer_email}</div>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Teléfono Móvil</label>
                                                <input type="tel" value={data.customer_phone} onChange={e => setData('customer_phone', e.target.value)} className="tech-input w-full" placeholder="+56 9 ..." required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Región de Despacho</label>
                                                <select
                                                    className="tech-input w-full"
                                                    value={data.shipping_rate_id}
                                                    onChange={(e) => handleRegionChange(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Selección Logística...</option>
                                                    {shippingRates.map(rate => (
                                                        <option key={rate.id} value={rate.id}>{rate.region_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Comuna</label>
                                                <input type="text" value={data.shipping_commune} onChange={e => setData('shipping_commune', e.target.value)} className="tech-input w-full" placeholder="Ej: Las Condes" required />
                                            </div>
                                            <div className="sm:col-span-2 space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Dirección de Entrega</label>
                                                <input type="text" value={data.shipping_address} onChange={e => setData('shipping_address', e.target.value)} className="tech-input w-full" placeholder="Calle, número, depto/oficina" required />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Billing Info */}
                                <div className="tech-card !p-8 bg-primary-900/50 border-white/5 space-y-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                            <span className="size-5 bg-accent-500 rounded flex items-center justify-center text-[10px]">2</span>
                                            Documento Tributario
                                        </h3>
                                        <div className="flex gap-2 bg-primary-950 p-1 rounded-xl border border-white/5">
                                            <button
                                                type="button"
                                                onClick={() => { setDocumentType('boleta'); setData('document_type', 'boleta'); }}
                                                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${documentType === 'boleta' ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/20' : 'text-primary-500 hover:text-white'}`}
                                            >
                                                Boleta
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setDocumentType('factura'); setData('document_type', 'factura'); }}
                                                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${documentType === 'factura' ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/20' : 'text-primary-500 hover:text-white'}`}
                                            >
                                                Factura
                                            </button>
                                        </div>
                                    </div>

                                    {documentType === 'factura' && (
                                        <div className="grid sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Razón Social</label>
                                                <input type="text" value={data.business_name} onChange={e => setData('business_name', e.target.value)} className="tech-input w-full" placeholder="Empresa SPA" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">RUT Empresa</label>
                                                <input type="text" value={data.business_rut} onChange={e => setData('business_rut', e.target.value)} className="tech-input w-full" placeholder="77.654.321-K" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Giro Comercial</label>
                                                <input type="text" value={data.business_giro} onChange={e => setData('business_giro', e.target.value)} className="tech-input w-full" placeholder="Servicios TI" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Dirección Legal</label>
                                                <input type="text" value={data.business_address} onChange={e => setData('business_address', e.target.value)} className="tech-input w-full" placeholder="Av. Principal 123" required />
                                            </div>
                                        </div>
                                    )}

                                    {documentType === 'boleta' && (
                                        <p className="text-primary-400 text-xs font-light bg-primary-950/50 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Se emitirá Boleta de Venta electrónica a los datos del receptor arriba indicados.
                                        </p>
                                    )}
                                </div>

                                {/* Guest Account Creation Option */}
                                {!auth.user && (
                                    <div className="tech-card !p-8 bg-primary-900/50 border-white/5 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                                <span className="size-5 bg-accent-500 rounded flex items-center justify-center text-[10px]">3</span>
                                                Cuenta de Usuario
                                            </h3>
                                            <span className="text-[9px] text-primary-500 font-bold uppercase tracking-widest">Opcional</span>
                                        </div>

                                        <label className="flex items-start gap-4 cursor-pointer group">
                                            <div className="relative mt-0.5">
                                                <input
                                                    type="checkbox"
                                                    checked={createAccount}
                                                    onChange={(e) => {
                                                        setCreateAccount(e.target.checked);
                                                        setData('create_account', e.target.checked);
                                                    }}
                                                    className="sr-only peer"
                                                />
                                                <div className="size-5 rounded border border-white/20 bg-primary-950 peer-checked:bg-accent-500 peer-checked:border-accent-500 transition-all flex items-center justify-center">
                                                    {createAccount && (
                                                        <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-sm text-white font-medium group-hover:text-accent-400 transition-colors">
                                                    Crear cuenta automáticamente
                                                </span>
                                                <p className="text-[11px] text-primary-500 mt-1 leading-relaxed">
                                                    Podrás hacer seguimiento de tus pedidos, ver historial de compras y cotizaciones desde tu panel personal.
                                                </p>
                                            </div>
                                        </label>

                                        {createAccount && (
                                            <div className="grid sm:grid-cols-2 gap-6 pt-2 animate-in fade-in slide-in-from-top-4 duration-500">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Contraseña</label>
                                                    <input
                                                        type="password"
                                                        value={data.password}
                                                        onChange={e => setData('password', e.target.value)}
                                                        className="tech-input w-full"
                                                        placeholder="Mínimo 8 caracteres"
                                                        required
                                                        minLength={8}
                                                    />
                                                    {errors.password && <div className="text-red-400 text-[10px] mt-1">{errors.password}</div>}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Confirmar Contraseña</label>
                                                    <input
                                                        type="password"
                                                        value={data.password_confirmation}
                                                        onChange={e => setData('password_confirmation', e.target.value)}
                                                        className="tech-input w-full"
                                                        placeholder="Repite tu contraseña"
                                                        required
                                                        minLength={8}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {!createAccount && (
                                            <p className="text-primary-400 text-xs font-light bg-primary-950/50 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 text-primary-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Puedes comprar sin crear cuenta. Si ya tienes una, <Link href={route('login')} className="text-accent-400 underline hover:text-accent-300">inicia sesión aquí</Link>.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Summary Card */}
                            <div className="space-y-6 lg:sticky lg:top-28">
                                <div className="tech-card !p-8 bg-primary-900/80 backdrop-blur-3xl border-accent-500/10 shadow-2xl">
                                    <h3 className="text-xl font-display font-medium text-white mb-8 tracking-tight">Liquidación de <span className="text-accent-500">Suministro</span></h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-sm py-2">
                                            <span className="text-primary-400 font-light">Subtotal Neto</span>
                                            <span className="text-white font-bold">${new Intl.NumberFormat('es-CL').format(netTotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm py-2">
                                            <span className="text-primary-400 font-light italic">Impuesto (IVA 19%)</span>
                                            <span className="text-white font-bold">${new Intl.NumberFormat('es-CL').format(iva)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm py-2 border-b border-white/5">
                                            <span className="text-primary-400 font-light">Costo Logístico (Flete)</span>
                                            <span className="text-accent-500 font-bold">
                                                {shippingCost > 0 ? `$${new Intl.NumberFormat('es-CL').format(shippingCost)}` : '--'}
                                            </span>
                                        </div>

                                        {/* Coupon Section */}
                                        <div className="py-3 border-b border-white/5">
                                            {couponApplied ? (
                                                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                                                    <div>
                                                        <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Cupón: {couponApplied.code}</span>
                                                        <p className="text-green-300 text-xs">-${new Intl.NumberFormat('es-CL').format(couponDiscount)}</p>
                                                    </div>
                                                    <button type="button" onClick={removeCoupon} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={couponCode}
                                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                            placeholder="Código de cupón"
                                                            className="flex-1 bg-primary-800/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-primary-500 focus:border-accent-500/50 focus:outline-none"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={applyCoupon}
                                                            disabled={couponLoading}
                                                            className="px-3 py-2 bg-accent-500/20 text-accent-400 rounded-lg text-xs font-bold hover:bg-accent-500/30 transition disabled:opacity-50"
                                                        >
                                                            {couponLoading ? '...' : 'Aplicar'}
                                                        </button>
                                                    </div>
                                                    {couponError && <p className="text-red-400 text-xs mt-1">{couponError}</p>}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-end pt-6">
                                            <span className="text-sm text-white font-bold uppercase tracking-widest">Total Orden</span>
                                            <div className="text-right">
                                                <p className="text-3xl font-display font-medium text-white tracking-tighter">
                                                    ${new Intl.NumberFormat('es-CL').format(total)}
                                                </p>
                                                <p className="text-[10px] text-primary-500 font-bold uppercase tracking-widest italic">{selectedRegion ? `Entrega en ${selectedRegion.estimated_days}d` : 'Pendiente Región'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!selectedRegion || processing}
                                        className="w-full btn-premium bg-accent-500 text-white hover:bg-accent-600 py-5 text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl shadow-accent-500/20 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group/btn"
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin size-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Redirigiendo a MercadoPago...
                                            </span>
                                        ) : 'Proceder al Pago Seguro'}
                                    </button>

                                    {auth.user && (
                                        <p className="mt-4 text-center text-xs text-green-400/70">
                                            Conectado como {auth.user.name}
                                        </p>
                                    )}

                                    <div className="mt-6 flex flex-col items-center gap-2 opacity-50">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary-500">Pago seguro con</span>
                                        <span className="text-sm font-bold text-[#009ee3]">MercadoPago</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="py-32 tech-card border-dashed border-primary-800 bg-transparent text-center">
                            <div className="text-6xl mb-8 opacity-40">🛒</div>
                            <h3 className="text-3xl font-display font-medium text-white mb-4">No hay suministros pendientes</h3>
                            <p className="text-primary-400 mb-12 max-w-md mx-auto font-light">
                                Su módulo de adquisición está vacío. Explore nuestro catálogo técnico para añadir componentes críticos.
                            </p>
                            <Link
                                href={route('catalog')}
                                className="btn-premium bg-accent-500 text-white hover:bg-accent-600 px-10"
                            >
                                Ver Catálogo de Ingeniería
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
