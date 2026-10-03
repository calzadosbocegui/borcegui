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
  const [highlightSlug, setHighlightSlug] = useState<string | null>(null);

  // Read ?calzado= URL param and store it for CatalogSection auto-scroll
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('calzado');
    if (slug) {
      setHighlightSlug(slug);
      // Scroll smoothly to catalog section
      setTimeout(() => {
        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    }
  }, []);

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
        <CatalogSection products={products} loading={loading} highlightSlug={highlightSlug} />

        {/* Technological Pillar - Dial System */}
        <TechSection />

        {/* Store Location & Official Payment Methods */}
        <StoreInfoSection config={config} paymentMethods={paymentMethods} />

        {/* Floating Actions (Instagram & WhatsApp) */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col sm:flex-row items-end sm:items-center gap-3">
          {/* Floating Instagram Button */}
          <a
            href={config.instagram_url || "https://instagram.com/borcegui2026"}
            target="_blank"
            rel="noreferrer"
            className="p-3.5 sm:px-4 sm:py-3.5 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-extrabold shadow-2xl shadow-pink-500/30 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group border border-pink-400/30"
            title="Síguenos en Instagram @borcegui2026"
          >
            <svg className="w-5 h-5 fill-current text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="hidden sm:inline text-xs uppercase tracking-wider font-mono">
              Instagram
            </span>
          </a>

          {/* Floating WhatsApp Support Button */}
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hola Borceguí 👟. Tengo una consulta sobre sus calzados.')}`}
            target="_blank"
            rel="noreferrer"
            className="p-3.5 sm:px-4 sm:py-3.5 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 font-extrabold shadow-2xl shadow-emerald-500/40 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group"
            title="Atención Personalizada por WhatsApp"
          >
            <MessageCircle className="w-5 h-5 fill-black stroke-emerald-500" />
            <span className="hidden sm:inline text-xs uppercase tracking-wider font-mono">
              WhatsApp
            </span>
          </a>
        </div>

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
