"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';

interface CartDrawerProps {
  whatsappNumber?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ whatsappNumber = "+584246678858" }) => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [nameError, setNameError] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (!customerName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);

    // Build Whatsapp message
    let message = `¡Hola Borceguí! 👋\nMi nombre es *${customerName.trim()}* y deseo realizar un pedido:\n\n`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   • Talla: *${item.selectedSize}*\n`;
      message += `   • Cantidad: ${item.quantity}\n`;
      message += `   • Precio Unitario: $${item.product.price.toFixed(2)}\n\n`;
    });

    message += `*Total a pagar: $${totalPrice.toFixed(2)}*\n\n`;
    message += `Por favor confirmen la disponibilidad para coordinar el pago y envío. ¡Muchas gracias!`;

    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-zinc-950 text-white h-full shadow-2xl flex flex-col border-l border-zinc-800 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Carrito de Compras</h2>
              <p className="text-xs text-zinc-400">Tus productos seleccionados</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-12">
              <ShoppingBag className="w-16 h-16 mb-4 text-zinc-700 stroke-1" />
              <p className="text-lg font-medium text-zinc-400">Tu carrito está vacío</p>
              <p className="text-xs text-zinc-600 mt-1 max-w-xs">
                Explora nuestras líneas Deportiva y Casual y elige tu talla.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-zinc-700 text-sm font-semibold rounded-xl transition-all"
              >
                Ver Calzados
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex items-center gap-4 hover:border-zinc-700 transition-all"
              >
                <img
                  src={item.product.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg bg-zinc-800"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white leading-snug">{item.product.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="inline-block px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold rounded">
                      Talla {item.selectedSize}
                    </span>
                    <span className="text-xs font-bold text-zinc-300">
                      ${item.product.price.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-800 px-2 py-1 gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                        className="text-zinc-400 hover:text-white text-xs font-bold px-1"
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                        className="text-zinc-400 hover:text-white text-xs font-bold px-1"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                  className="p-2 text-zinc-500 hover:text-red-400 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-800 bg-zinc-950 space-y-4">
            <div className="flex justify-between items-center text-sm text-zinc-400">
              <span>Subtotal:</span>
              <span className="text-lg font-extrabold text-cyan-400">${totalPrice.toFixed(2)}</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Nombre y Apellido del Cliente <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej. Carlos Mendoza"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`w-full bg-zinc-900 border ${
                  nameError ? 'border-red-500' : 'border-zinc-800'
                } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors`}
              />
              {nameError && (
                <p className="text-xs text-red-400">Ingresa tu nombre para enviar el pedido por WhatsApp.</p>
              )}
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <PhoneCall className="w-5 h-5 fill-current" />
              Procesar Compra por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
