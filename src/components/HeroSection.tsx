"use client";

import React, { useState, useEffect } from 'react';
import { Product, StoreConfig, HeroSlide } from '@/types/database';
import { ShieldCheck, Zap, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  heroProduct?: Product | null;
  config?: StoreConfig | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ heroProduct, config }) => {
  // Build slide items array
  const defaultSlides: HeroSlide[] = [
    {
      id: 'slide-1',
      image_url: config?.hero_image_url || heroProduct?.images?.[0] || "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000",
      title: config?.hero_title || "INNOVACIÓN TOTAL EN TU PASO.",
      subtitle: config?.hero_subtitle || "FÁCIL DE PONER, FÁCIL DE AJUSTAR.",
      badge_text: "NUEVA COLECCIÓN BORCEGUÍ"
    }
  ];

  const slides: HeroSlide[] = (config?.hero_slides && config.hero_slides.length > 0)
    ? config.hero_slides
    : defaultSlides;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto rotation timer every 4.0 seconds (4000ms)
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[currentSlideIndex] || slides[0];
  const mainTitle = activeSlide?.title || config?.hero_title || "INNOVACIÓN TOTAL EN TU PASO.";
  const subTitle = activeSlide?.subtitle || config?.hero_subtitle || "FÁCIL DE PONER, FÁCIL DE AJUSTAR.";
  const ctaText = config?.hero_cta_text || "Explorar Catálogo 2026";

  return (
    <section id="inicio" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-zinc-950 text-white">
      {/* Glow Background Gradient Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Identity */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight transition-all duration-700">
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

          {/* Right Column: E-commerce Banner Pro with Opacity Cross-Fade & Fixed Height */}
          <div className="lg:col-span-5 relative">
            <a 
              href="#catalogo"
              className="block relative mx-auto w-full rounded-3xl overflow-hidden border border-zinc-800/80 bg-gradient-to-b from-zinc-900 to-zinc-950 p-3 shadow-2xl group cursor-pointer"
            >
              <div className="h-[320px] sm:h-[400px] w-full rounded-2xl overflow-hidden relative bg-zinc-900">
                {slides.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      idx === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={slide.image_url}
                      alt={slide.title || mainTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-70" />
                  </div>
                ))}

                {/* Overlaid Clean Title Bar without fixed badge text */}
                <div className="absolute bottom-4 left-4 right-4 z-20 p-4 rounded-xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 text-left">
                  <div className="flex items-center justify-between gap-3">
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-extrabold text-white line-clamp-1">{mainTitle}</h4>
                      <p className="text-xs text-cyan-400 font-medium line-clamp-1">{subTitle}</p>
                    </div>
                    <span className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-black rounded-xl shrink-0 transition-colors shadow-md">
                      VER ➔
                    </span>
                  </div>
                </div>

                {/* Dots indicator for Slider */}
                {slides.length > 1 && (
                  <div className="absolute top-4 right-4 z-20 flex gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800">
                    {slides.map((_, idx) => (
                      <span
                        key={idx}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentSlideIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-500 cursor-pointer ${
                          idx === currentSlideIndex ? 'bg-cyan-400 w-5' : 'bg-zinc-600 hover:bg-zinc-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
