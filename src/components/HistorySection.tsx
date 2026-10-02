"use client";

import React, { useState } from 'react';
import { BookOpen, ShieldAlert, Award, ChevronDown, ChevronUp } from 'lucide-react';

export const HistorySection: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="historia" className="py-20 bg-zinc-950 border-t border-zinc-900 text-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cyan-400 text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            HERENCIA & ORIGEN
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            ¿DE DÓNDE NACE EL NOMBRE <span className="text-cyan-400 uppercase">BORCEGUÍ</span>?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Una tradición centenaria nacida en la Edad Media adaptada con la máxima ingeniería contemporánea del siglo XXI.
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-400" />
                Del Calzado Medieval a la Revolución Dial
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                En la Edad Media, los <strong>borceguíes</strong> eran reconocidos como el calzado de cuero más firme, seguro y resistente, concebido para brindar máxima protección en cada batalla. Hoy, en <strong>Borceguí</strong>, recuperamos esa herencia de fortaleza y confianza para adaptarla a las exigencias del estilo de vida contemporáneo.
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                En <strong>Borceguí 2026</strong>, tomamos ese legado histórico de protección y resistencia y lo fusionamos con nuestro <strong>Pilar Tecnológico de Dial Giratorio</strong>: resistencia indestructible sin perder elegancia.
              </p>
            </div>

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800/80 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Evolución del Concepto
              </h4>
              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                  <span><strong>Siglo XV:</strong> Cuero robusto con amarrado artesanal para protección.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                  <span><strong>Siglo XX:</strong> Adaptación militar e industrial con cordones de alta tensión.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                  <span><strong>Borceguí 2026:</strong> Sistema sin cordones de guaya de acero ultrarresistente y dial micro-ajustable en 1 segundo.</span>
                </li>
              </ul>
            </div>
          </div>

          {expanded && (
            <div className="pt-6 border-t border-zinc-800 text-zinc-300 text-sm space-y-3 animate-in fade-in duration-300">
              <p>
                Cada par de calzados Borceguí está concebido para la versatilidad de la vida urbana y deportiva moderna en Venezuela y Latinoamérica. Garantiza comodidad constante sin presiones irregulares en el empeine, protegiendo tus tobillos con estilo y personalidad.
              </p>
            </div>
          )}

          <div className="text-center pt-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {expanded ? (
                <>
                  <span>Mostrar menos</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Leer más sobre la historia</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
