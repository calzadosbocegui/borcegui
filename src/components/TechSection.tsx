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
          
          {/* Feature 1 */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 space-y-5 hover:border-cyan-500/40 transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
              <RotateCw className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white">Ajuste Dial Micrométrico (Sin Cordones)</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Sistema de cierre giratorio micrométrico de respuesta instantánea. Olvídate de atar cordones o sufrir presiones desproporcionadas en el empeine.
            </p>
            <ul className="space-y-2 text-xs text-zinc-300 font-medium pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Ajuste perfecto en 1 segundo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Presión uniforme y confortable
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 space-y-5 hover:border-cyan-500/40 transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white">Más Seguridad & Máximo Confort</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Guayas de acero ultra-resistentes recubiertas y suelas absorbentes de impacto para brindar estabilidad y dinamismo en cada paso.
            </p>
            <ul className="space-y-2 text-xs text-zinc-300 font-medium pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Cero desenganche accidental
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Ergonomía de alto rendimiento
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 space-y-5 hover:border-cyan-500/40 transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white">Diseño Innovador & Vanguardista</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Tecnología de última generación que combina estética moderna, siluetas futuristas y materiales duraderos listos para cualquier reto.
            </p>
            <ul className="space-y-2 text-xs text-zinc-300 font-medium pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Liberación rápida en 1 clic
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Estilo urbano e imponente
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
