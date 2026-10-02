"use client";

import React, { useState } from 'react';
import { Product } from '@/types/database';
import { ProductCard } from '@/components/ProductCard';
import { Filter, Flame, Compass } from 'lucide-react';

interface CatalogSectionProps {
  products: Product[];
  loading?: boolean;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({ products, loading = false }) => {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'deportiva' | 'casual'>('todos');

  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'todos') return true;
    return p.category === activeCategory;
  });

  const deportivaCount = products.filter((p) => p.category === 'deportiva').length;
  const casualCount = products.filter((p) => p.category === 'casual').length;

  return (
    <section id="catalogo" className="py-24 bg-zinc-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
              <Flame className="w-3.5 h-3.5" />
              CATÁLOGO BORCEGUÍ 2026
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              COLECCIONES EXCLUSIVAS
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl">
              Selecciona entre nuestra Línea Deportiva (6 modelos) y Línea Casual (2 modelos) con dial de cierre rápido.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800 self-start md:self-auto">
            <button
              onClick={() => setActiveCategory('todos')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeCategory === 'todos'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Todos ({products.length})
            </button>
            <button
              onClick={() => setActiveCategory('deportiva')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeCategory === 'deportiva'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Línea Deportiva ({deportivaCount})
            </button>
            <button
              onClick={() => setActiveCategory('casual')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeCategory === 'casual'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Línea Casual ({casualCount})
            </button>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 bg-zinc-900/30 border border-zinc-800/80 rounded-3xl">
            <Compass className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
            <p className="text-lg font-bold text-zinc-400">No se encontraron productos en esta línea</p>
            <p className="text-xs text-zinc-600 mt-1">Intenta seleccionar otra categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
