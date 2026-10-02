"use client";

import React from 'react';
import { RotateCw, Zap, Shield, Sparkles, CheckCircle } from 'lucide-react';

export const TechSection: React.FC = () => {
  return (
    <section id="tecnologia" className="py-24 bg-zinc-950 border-t border-zinc-900 text-white relative overflow-hidden">
      {/* Dynamic Grid Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Zap className="w-4 h-4" />
            NUESTRO PILAR TECNOLÓGICO
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            SISTEMA DE AJUSTE RÁPIDO CON <br />
            <span className="bg-gradient-to-r from-cyan-400 via-cyan-200 to-white bg-clip-text text-transparent">
              DIAL GIRATORIO (SIN CORDONES)
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Olvídate de nudos, cordones desatados o presión desigual. Borceguí introduce el ajuste de precisión milimétrica listo en un solo giro.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 space-y-5 hover:border-cyan-500/40 transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
              <RotateCw className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white">1. Presiona & Gira</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Empuja la perilla del dial para enganchar el mecanismo y gírala en sentido horario para ajustar la tensión milímetro a milímetro.
            </p>
            <ul className="space-y-2 text-xs text-zinc-300 font-medium pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Ajuste óptimo en 1 segundo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Sin puntos de presión dolorosos
              </li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 space-y-5 hover:border-cyan-500/40 transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white">2. Guayas de Acero Blindado</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              En lugar de tela o fibras convencionales, el sistema utiliza micro-cables de acero revestidos en polímero anti-fricción de grado militar.
            </p>
            <ul className="space-y-2 text-xs text-zinc-300 font-medium pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Resistencia a tracción extrema
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                No absorbe agua ni acumula mugre
              </li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 space-y-5 hover:border-cyan-500/40 transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white">3. Liberación Instantánea</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Al finalizar tu rutina o jornada laboral, simplemente jala el dial hacia arriba para soltar toda la tensión de inmediato y quitar el calzado sin esfuerzo.
            </p>
            <ul className="space-y-2 text-xs text-zinc-300 font-medium pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Apertura completa en un clic
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Máxima durabilidad comprobada
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
