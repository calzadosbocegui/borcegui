"use client";

import React, { useState } from 'react';
import { Product } from '@/types/database';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ChevronLeft, ChevronRight, Check, Zap, Share2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeModalImageIndex, setActiveModalImageIndex] = useState(0);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800'];

  const sizes = product.product_sizes || [];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <>
      <div 
        onClick={() => setIsDetailModalOpen(true)}
        className="group bg-zinc-900/60 border border-zinc-800/80 hover:border-cyan-500/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer"
      >
        
        {/* Product Image Slider */}
        <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden flex items-center justify-center">
          <img
            src={images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Category Badge, Code & WhatsApp Share Button */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
            <div className="flex gap-2">
              <span className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-cyan-400 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                {product.category}
              </span>
              {product.model_code && (
                <span className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-zinc-300 text-[10px] font-mono font-bold px-2 py-1 rounded-full">
                  {product.model_code}
                </span>
              )}
            </div>

            {/* Quick Share via WhatsApp button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const shareText = encodeURIComponent(`¡Mira este calzado Borceguí! 👟\n*${product.name}*\nRef: ${product.model_code || 'BORCEGUI'}\nPrecio: $${product.price.toFixed(2)}\n\nVer en tienda: ${window.location.origin}`);
                window.open(`https://wa.me/?text=${shareText}`, '_blank');
              }}
              title="Compartir por WhatsApp"
              className="p-1.5 rounded-full bg-emerald-500/90 text-black hover:bg-emerald-400 shadow-md transition-all active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Quick Zoom Hint Badge */}
          <span className="absolute bottom-3 right-3 bg-zinc-950/80 backdrop-blur-md text-cyan-400 text-[10px] font-semibold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-zinc-800">
            🔍 Ver Detalles & Tallas ({images.length})
          </span>

          {/* Image Controls if multiple */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-cyan-500 hover:text-black opacity-0 group-hover:opacity-100 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-cyan-500 hover:text-black opacity-0 group-hover:opacity-100 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-cyan-400 w-4' : 'bg-zinc-600'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Product Details (Limpio en el Catálogo: Solo Nombre, Descripción breve y Precio) */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                {product.name}
              </h3>
              <span className="text-lg font-black text-cyan-400">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Botón Ver Detalles / Descripción Completa & Tallas */}
          <button
            onClick={() => setIsDetailModalOpen(true)}
            className="w-full py-3 px-4 rounded-xl font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 bg-gradient-to-r from-zinc-900 to-zinc-950 text-cyan-400 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900 transition-all shadow-md"
          >
            <span>Ver Descripción Completa & Tallas</span>
            <span className="text-sm">➔</span>
          </button>
        </div>
      </div>

      {/* FULL PRODUCT DETAILS & MULTI-IMAGE CAROUSEL MODAL (OPTIMIZED FOR MOBILE SCROLL & CLEAN SIZES) */}
      {isDetailModalOpen && (
        <div 
          onClick={() => setIsDetailModalOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/85 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-6"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-4xl w-full p-5 sm:p-8 space-y-6 my-auto relative animate-in zoom-in-95 duration-200 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header Sticky Bar / Close Button for Easy Mobile Exit */}
            <div className="sticky top-0 z-20 -mt-2 -mx-2 pt-2 pb-3 px-2 bg-zinc-950/95 backdrop-blur-md flex items-center justify-between border-b border-zinc-800/60 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
                  {product.model_code || 'BORCEGUÍ'}
                </span>
                <span className="text-xs text-zinc-400 font-medium truncate max-w-[180px] sm:max-w-none">
                  {product.name}
                </span>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 text-black font-extrabold text-xs hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
              >
                <span>Cerrar</span>
                <span className="text-base leading-none">✕</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
              
              {/* Left Column: Interactive Main Zoom Image & Gallery Thumbnails */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group">
                  <img
                    src={images[activeModalImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500 cursor-zoom-in"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-cyan-400 text-[10px] font-mono px-2.5 py-1 rounded-lg border border-zinc-800">
                    🔍 Toca / Pasa el cursor para Zoom
                  </div>
                </div>

                {/* Thumbnails list (Supports multiple images 6-8+) */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveModalImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          idx === activeModalImageIndex
                            ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/20'
                            : 'border-zinc-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Complete Product Specs */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold rounded-full uppercase">
                      {product.category}
                    </span>
                    {product.model_code && (
                      <span className="px-3 py-1 bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs font-mono font-bold rounded-full">
                        Ref: {product.model_code}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{product.name}</h2>
                  <p className="text-2xl font-black text-cyan-400 mt-2">${product.price.toFixed(2)}</p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold mb-2">
                    Descripción Completa
                  </h4>
                  <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
                    {product.description}
                  </p>
                </div>

                {product.features && product.features.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold mb-2">
                      Características & Tecnología
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                      {product.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 bg-zinc-900/40 px-3 py-2 rounded-xl border border-zinc-800">
                          <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Size picker in Modal (Clean Size text, no redundant disp) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-zinc-300">Seleccionar Talla Disponibles:</span>
                    {sizeError && (
                      <span className="text-xs text-red-400 font-semibold animate-bounce">
                        ¡Elige una talla para continuar!
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {sizes.map((s) => {
                      const available = s.stock > 0;
                      const isSelected = selectedSize === s.size;
                      return (
                        <button
                          key={s.id || s.size}
                          disabled={!available}
                          onClick={() => {
                            setSelectedSize(s.size);
                            setSizeError(false);
                          }}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                              : available
                              ? 'bg-zinc-900 text-zinc-200 border-zinc-800 hover:border-zinc-700'
                              : 'bg-zinc-950/40 text-zinc-600 border-zinc-900 line-through'
                          }`}
                        >
                          {s.size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-2xl font-extrabold text-sm uppercase flex items-center justify-center gap-2 transition-all ${
                    addedAnimation
                      ? 'bg-emerald-500 text-black'
                      : 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg shadow-cyan-500/20'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-5 h-5 stroke-[3]" />
                      ¡Agregado al Carrito!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Agregar al Carrito de Compras
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
