"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const MAPS_URL = "https://goo.gl/maps/aQJurk1Nd2ewkjdw9?g_st=ac";

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

        {/* Header Actions: Maps, Instagram & Cart */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Google Maps Button */}
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 transition-all text-xs font-bold shadow-lg shadow-cyan-500/10 group"
            title="Ubicación en Google Maps"
          >
            <MapPin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="hidden lg:inline uppercase font-mono tracking-wider text-[11px]">Ubicación</span>
          </a>

          {/* Instagram Button */}
          <a
            href="https://instagram.com/borcegui2026"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500/15 to-purple-500/15 border border-pink-500/30 hover:border-pink-400 text-pink-300 hover:text-white transition-all text-xs font-bold shadow-lg shadow-pink-500/5 group"
            title="Instagram Oficial Borceguí"
          >
            <svg className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="hidden lg:inline uppercase font-mono tracking-wider text-[11px]">Instagram</span>
          </a>

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
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-cyan-400 font-bold py-2"
          >
            <MapPin className="w-4 h-4 shrink-0" />
            <span>Abrir en Google Maps ↗</span>
          </a>
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
