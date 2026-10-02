"use client";

import React, { useState } from 'react';
import { Product } from '@/types/database';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ChevronLeft, ChevronRight, Check, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'];

  const sizes = product.product_sizes || [];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
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
    <div className="group bg-zinc-900/60 border border-zinc-800/80 hover:border-cyan-500/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-cyan-500/10">
      
      {/* Product Image Slider */}
      <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden flex items-center justify-center">
        <img
          src={images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-cyan-400 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          {product.category}
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

      {/* Product Details */}
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

        {/* Interactive Size Selector */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-zinc-300">Seleccionar Talla:</span>
            {sizeError && (
              <span className="text-[11px] text-red-400 font-medium animate-bounce">
                ¡Elige una talla!
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {sizes.length === 0 ? (
              <div className="col-span-4 text-xs text-zinc-500 italic text-center py-1">
                Tallas disponibles al consultar
              </div>
            ) : (
              sizes.map((s) => {
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
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                        : available
                        ? 'bg-zinc-950 text-zinc-200 border-zinc-800 hover:border-zinc-600 hover:text-white'
                        : 'bg-zinc-950/40 text-zinc-600 border-zinc-900 cursor-not-allowed line-through'
                    }`}
                  >
                    {s.size}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
            addedAnimation
              ? 'bg-emerald-500 text-black'
              : 'bg-gradient-to-r from-zinc-100 to-zinc-300 text-black hover:from-cyan-400 hover:to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/25'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              ¡Agregado al Carrito!
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              Agregar al Carrito
            </>
          )}
        </button>
      </div>
    </div>
  );
};
