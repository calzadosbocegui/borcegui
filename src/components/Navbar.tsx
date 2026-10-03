"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, RotateCw, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-1 group-hover:border-cyan-500/50 transition-all duration-300">
            <img src="/logo-borcegui.png" alt="Borceguí" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-wider uppercase bg-gradient-to-r from-white via-zinc-200 to-cyan-400 bg-clip-text text-transparent">
              BORCEGUÍ
            </span>
            <span className="block text-[10px] tracking-widest text-cyan-400 font-semibold -mt-1">
              SYSTEM FIT 2026
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <Link href="/#inicio" className="hover:text-cyan-400 transition-colors">
            Inicio
          </Link>
          <Link href="/#historia" className="hover:text-cyan-400 transition-colors">
            Historia
          </Link>
          <Link href="/#catalogo" className="hover:text-cyan-400 transition-colors">
            Catálogo
          </Link>
          <Link href="/#tecnologia" className="hover:text-cyan-400 transition-colors">
            Tecnología Dial
          </Link>
          <Link href="/#tienda" className="hover:text-cyan-400 transition-colors">
            Ubicación & Pagos
          </Link>
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-cyan-500/50 transition-all text-xs font-mono"
          >
            Admin Office
          </Link>
        </nav>

        {/* Cart & Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 text-zinc-200 hover:text-cyan-400 transition-all flex items-center gap-2 group"
            aria-label="Carrito de Compras"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-xs font-semibold">Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800 px-4 pt-2 pb-6 space-y-4">
          <Link
            href="/#inicio"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-200 font-medium py-2 hover:text-cyan-400"
          >
            Inicio
          </Link>
          <Link
            href="/#historia"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-200 font-medium py-2 hover:text-cyan-400"
          >
            Historia
          </Link>
          <Link
            href="/#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-200 font-medium py-2 hover:text-cyan-400"
          >
            Catálogo
          </Link>
          <Link
            href="/#tecnologia"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-200 font-medium py-2 hover:text-cyan-400"
          >
            Tecnología Dial
          </Link>
          <Link
            href="/#tienda"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-zinc-200 font-medium py-2 hover:text-cyan-400"
          >
            Ubicación & Pagos
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-block mt-2 px-4 py-2 rounded-lg bg-zinc-800 text-cyan-400 border border-zinc-700 text-xs font-mono"
          >
            Panel Admin
          </Link>
        </div>
      )}
    </header>
  );
};
