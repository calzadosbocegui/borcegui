"use client";

import React from 'react';
import { Product, StoreConfig } from '@/types/database';
import { ShieldCheck, Cpu, Zap, RotateCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  heroProduct?: Product | null;
  config?: StoreConfig | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ heroProduct, config }) => {
  const heroImage = config?.hero_image_url || heroProduct?.images?.[0] || "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000";
  const mainTitle = config?.hero_title || "INNOVACIÓN TOTAL EN TU PASO.";
  const subTitle = config?.hero_subtitle || "FÁCIL DE PONER, FÁCIL DE AJUSTAR.";
  const ctaText = config?.hero_cta_text || "Explorar Catálogo 2026";
  const badgeCode = heroProduct?.model_code || "COLECCIÓN OFICIAL";
  const badgeTitle = heroProduct?.name || "Borceguí Performance Dial";

  return (
    <section id="inicio" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-zinc-950 text-white">
      {/* Glow Background Gradient Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Identity */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              Colección Oficial {config?.instagram_handle || '@borcegui2026'}
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              {mainTitle} <br />
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-200 to-white bg-clip-text text-transparent uppercase">
                {subTitle}
              </span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed">
              Diseño vanguardista con tecnología de dial giratorio sin cordones. Calzado de máxima ergonomía, elegancia y alto rendimiento urbano.
            </p>

            {/* Quick Benefits Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-semibold text-zinc-300">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
                <RotateCw className="w-4 h-4 text-cyan-400" />
                Cierre Giratorio Dial Pro
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
                <Zap className="w-4 h-4 text-cyan-400" />
                Ajuste Milimétrico en 1 Seg
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Suela Shock-Absorber
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#catalogo"
                className="px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 transition-all text-center"
              >
                {ctaText}
              </a>
              <a
                href="#tecnologia"
                className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm rounded-xl border border-zinc-800 transition-all text-center"
              >
                Conocer Sistema Dial
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 shadow-2xl group">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
                <img
                  src={heroImage}
                  alt={badgeTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                {/* Overlaid Badge Info */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">{badgeCode}</p>
                      <h4 className="text-base font-extrabold text-white">{badgeTitle}</h4>
                    </div>
                    <span className="px-2.5 py-1 bg-cyan-500 text-black text-xs font-black rounded-lg">
                      NEW
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
