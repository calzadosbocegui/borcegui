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

        // Fetch Payment Methods (Direct select without order/filter columns that trigger 400 Bad Request)
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

  return (
    <CartProvider>
      <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-cyan-500 selection:text-black">
        {/* Navigation Bar */}
        <Navbar />

        {/* Floating Cart Modal / Drawer */}
        <CartDrawer whatsappNumber={config.whatsapp_number} />

        {/* Hero Section (dinámico con el Banner del Admin y fallback al producto destacado) */}
        <HeroSection heroProduct={products[0]} config={config} />

        {/* History Section */}
        <HistorySection />

        {/* Interactive Products Catalog (6 Sporty + 2 Casual) */}
        <CatalogSection products={products} loading={loading} />

        {/* Technological Pillar - Dial System */}
        <TechSection />

        {/* Store Location & Official Payment Methods */}
        <StoreInfoSection config={config} paymentMethods={paymentMethods} />

        {/* Premium Footer */}
        <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-zinc-500 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-extrabold">
                B
              </div>
              <span className="font-bold text-zinc-300">
                BORCEGUÍ © 2026. Todos los derechos reservados.
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href={config.instagram_url || "https://instagram.com/borcegui2026"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-mono font-bold bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/30"
              >
                <span>📸</span>
                <span>{config.instagram_handle || "@borcegui2026"}</span>
              </a>
              <span>•</span>
              <span className="text-zinc-400">Chacao, Caracas</span>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}
