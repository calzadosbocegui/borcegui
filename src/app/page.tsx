"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, StoreConfig, PaymentMethod } from '@/types/database';
import { INITIAL_PRODUCTS, INITIAL_STORE_CONFIG, INITIAL_PAYMENT_METHODS } from '@/data/initialData';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { HeroSection } from '@/components/HeroSection';
import { HistorySection } from '@/components/HistorySection';
import { CatalogSection } from '@/components/CatalogSection';
import { TechSection } from '@/components/TechSection';
import { StoreInfoSection } from '@/components/StoreInfoSection';

import { SplashScreen } from '@/components/SplashScreen';
import { MessageCircle, Share2 } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [config, setConfig] = useState<StoreConfig>(INITIAL_STORE_CONFIG);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch Store Config (Unificado)
        const { data: configData } = await supabase.from('store_config').select('*');
        if (configData && configData.length > 0) {
          const item = configData.find((c: any) => c.key === 'store_settings' || c.id === '1') || configData[0];
          let parsedConfig: Partial<StoreConfig> = { ...item };
          if (item.value && typeof item.value === 'string') {
            try {
              const parsed = JSON.parse(item.value);
              parsedConfig = { ...parsedConfig, ...parsed };
            } catch (e) {
              // plain text
            }
          }
          setConfig(prev => ({ ...prev, ...parsedConfig }));
        }

        // Fetch Payment Methods
        const { data: payData, error: payErr } = await supabase.from('payment_methods').select('*');
        if (payErr) {
          console.error('Error cargando payment_methods:', payErr);
        } else if (payData && payData.length > 0) {
          const active = payData.filter((p: any) => p.is_active !== false);
          setPaymentMethods(active.length > 0 ? active : payData);
        }

        // Fetch Products with Sizes
        const { data: prodData } = await supabase
          .from('products')
          .select('*, product_sizes(*)')
          .order('created_at', { ascending: false });

        if (prodData && prodData.length > 0) {
          setProducts(prodData);
        }
      } catch (err) {
        console.log('Serving seamless fallback dataset', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const cleanPhone = (config.whatsapp_number || '+584246678858').replace(/[^0-9]/g, '');

  return (
    <CartProvider>
      {/* Animated Splash Screen */}
      <SplashScreen />

      <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-cyan-500 selection:text-black relative">
        {/* Navigation Bar */}
        <Navbar />

        {/* Floating Cart Modal / Drawer */}
        <CartDrawer whatsappNumber={config.whatsapp_number} />

        {/* Hero Section (Carrusel Rotativo + Banner Admin) */}
        <HeroSection heroProduct={products[0]} config={config} />

        {/* History Section */}
        <HistorySection />

        {/* Interactive Products Catalog (6 Sporty + 2 Casual) */}
        <CatalogSection products={products} loading={loading} />

        {/* Technological Pillar - Dial System */}
        <TechSection />

        {/* Store Location & Official Payment Methods */}
        <StoreInfoSection config={config} paymentMethods={paymentMethods} />

        {/* Floating WhatsApp Support Button */}
        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hola Borceguí 👟. Tengo una consulta sobre sus calzados.')}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 font-extrabold shadow-2xl shadow-emerald-500/40 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group"
          title="Atención Personalizada por WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-black stroke-emerald-500" />
          <span className="hidden sm:inline text-xs uppercase tracking-wider font-mono">
            Atención WhatsApp
          </span>
        </a>

        {/* Premium Footer con Enlace Ultra Visible a Instagram y Logo Oficial */}
        <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-zinc-500 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-1">
                <img src="/logo-borcegui.png" alt="Borceguí Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-zinc-300">
                BORCEGUÍ © 2026. Todos los derechos reservados.
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={config.instagram_url || "https://instagram.com/borcegui2026"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-pink-500/40 hover:border-pink-400 text-white font-extrabold text-xs transition-all hover:scale-105 shadow-lg shadow-pink-500/10 group"
              >
                <Share2 className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                <span className="text-pink-300 font-mono tracking-wider">VISÍTANOS EN INSTAGRAM</span>
                <span className="text-cyan-400 font-mono font-bold bg-zinc-950/80 px-2 py-0.5 rounded-lg border border-zinc-800">
                  {config.instagram_handle || "@borcegui2026"}
                </span>
              </a>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <span className="text-zinc-400 font-mono">Chacao, Caracas VE</span>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}
