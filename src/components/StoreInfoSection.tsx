"use client";

import React from 'react';
import { PaymentMethod, StoreConfig } from '@/types/database';
import { MapPin, CreditCard, DollarSign, Smartphone, Landmark, Wallet, CheckCircle, ShieldCheck } from 'lucide-react';

interface StoreInfoSectionProps {
  config: StoreConfig | null;
  paymentMethods: PaymentMethod[];
}

export const StoreInfoSection: React.FC<StoreInfoSectionProps> = ({ config, paymentMethods }) => {
  const defaultAddress = config?.store_address || "Calle Páez, Edificio Capri, Chacao, Caracas, Venezuela";

  // Helper icon mapper
  const renderPaymentIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('zelle')) return <DollarSign className="w-5 h-5 text-emerald-400" />;
    if (lower.includes('pago móvil') || lower.includes('pago movil')) return <Smartphone className="w-5 h-5 text-cyan-400" />;
    if (lower.includes('bancamiga') || lower.includes('banco')) return <Landmark className="w-5 h-5 text-blue-400" />;
    if (lower.includes('paypal')) return <Wallet className="w-5 h-5 text-indigo-400" />;
    return <CreditCard className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <section id="tienda" className="py-20 bg-zinc-950 border-t border-zinc-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Physical Store Location */}
          <div className="lg:col-span-5 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                <MapPin className="w-3.5 h-3.5" />
                TIENDA FÍSICA Y ATENCIÓN
              </div>

              <h3 className="text-2xl font-black text-white">Visítanos en Chacao</h3>

              <p className="text-zinc-300 text-sm leading-relaxed">
                Ven a probarte tus modelos Borceguí favoritos directamente en nuestro showroom oficial:
              </p>

              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 space-y-2">
                <p className="text-sm font-bold text-white flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{defaultAddress}</span>
                </p>
                <p className="text-xs text-zinc-400 pl-7">
                  Horario de Atención: Lunes a Sábado de 9:00 AM a 6:00 PM
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Garantía de Calzado Original
              </span>
              <a
                href={config?.instagram_url || "https://instagram.com/borcegui2026"}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline font-mono font-bold"
              >
                {config?.instagram_handle || "@borcegui2026"} ↗
              </a>
            </div>
          </div>

          {/* Right Column: Official Payment Methods */}
          <div className="lg:col-span-7 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                <CreditCard className="w-3.5 h-3.5" />
                MÉTODOS DE PAGO OFICIALES
              </div>
              <h3 className="text-2xl font-black text-white">Pagos Rápidos y Seguros</h3>
              <p className="text-zinc-400 text-sm">
                Aceptamos múltiples opciones para facilitar tu compra nacional e internacional:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paymentMethods.length === 0 ? (
                /* Fallback layout matching official requested list if DB query loading */
                [
                  { name: 'Zelle', details: 'Transferencias en USD al instante' },
                  { name: 'Bancamiga', details: 'Cuentas nacionales en Bs y USD' },
                  { name: 'Pago Móvil', details: 'Disponible para todos los bancos en VE' },
                  { name: 'PayPal', details: 'Pagos con tarjeta de crédito/débito' },
                  { name: 'Efectivo', details: 'Dólares ($) y Euros (€) en tienda y delivery' },
                  { name: 'Punto de Venta', details: 'Tarjetas de débito/crédito en nuestro showroom' },
                ].map((pm, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 flex items-start gap-3 hover:border-zinc-700 transition-all"
                  >
                    <div className="p-2 bg-zinc-900 rounded-xl">
                      {renderPaymentIcon(pm.name)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{pm.name}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{pm.details}</p>
                    </div>
                  </div>
                ))
              ) : (
                paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 flex items-start gap-3 hover:border-zinc-700 transition-all"
                  >
                    <div className="p-2 bg-zinc-900 rounded-xl">
                      {renderPaymentIcon(pm.name)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{pm.name}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{pm.details}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
