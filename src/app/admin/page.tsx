"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, StoreConfig, PaymentMethod, ProductSize, HeroSlide } from '@/types/database';
import { INITIAL_PRODUCTS, INITIAL_STORE_CONFIG, INITIAL_PAYMENT_METHODS } from '@/data/initialData';
import { 
  Plus, Edit, Trash2, Save, RefreshCw, PhoneCall, MapPin, 
  CreditCard, Package, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, X, Lock, LogIn, Image as ImageIcon
} from 'lucide-react';

export default function AdminDashboard() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'products' | 'config' | 'payments'>('products');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [config, setConfig] = useState<StoreConfig>(INITIAL_STORE_CONFIG);
  const [payments, setPayments] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New slide entry state
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideSubtitle, setNewSlideSubtitle] = useState('');
  const [newSlideBadge, setNewSlideBadge] = useState('EDICIÓN ESPECIAL');
  const [newSlideImage, setNewSlideImage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((loginUsername === 'admin' || loginUsername === 'borcegui') && loginPassword === 'borcegui2026') {
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Usuario o contraseña incorrectos. Verifica tus credenciales de acceso.');
    }
  };

  // Edit/Create Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingSizes, setEditingSizes] = useState<{ size: number | string; stock: number }[]>([
    { size: 40, stock: 10 },
    { size: 41, stock: 10 },
    { size: 42, stock: 10 },
  ]);

  // Payment Method Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Partial<PaymentMethod> | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Store Config
      const { data: configData } = await supabase.from('store_config').select('*');
      if (configData && configData.length > 0) {
        // Find main item or take first
        const item = configData.find((c: any) => c.key === 'store_settings' || c.id === '1') || configData[0];
        let parsedConfig: Partial<StoreConfig> = { ...item };
        if (item.value && typeof item.value === 'string') {
          try {
            const parsed = JSON.parse(item.value);
            parsedConfig = { ...parsedConfig, ...parsed };
          } catch (e) {
            // value is plain string
          }
        }
        setConfig(prev => ({ ...prev, ...parsedConfig }));
      }

      // 2. Fetch Payment Methods
      const { data: payData } = await supabase.from('payment_methods').select('*');
      if (payData && payData.length > 0) setPayments(payData);

      // 3. Fetch Products with sizes
      const { data: prodData } = await supabase.from('products').select('*, product_sizes(*)').order('created_at', { ascending: false });
      if (prodData && prodData.length > 0) setProducts(prodData);
    } catch (err) {
      console.log('Using local fallback state for Admin Office', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string, isError = false) => {
    setStatusMessage(msg);
    setStatusIsError(isError);
    setTimeout(() => setStatusMessage(null), 6000);
  };

  const [statusIsError, setStatusIsError] = useState(false);

  // --- STORE CONFIG SAVE ---
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const configId = config.id || '1';
      const payloadObj = {
        id: configId,
        key: 'store_settings',
        store_name: config.store_name || 'Borceguí',
        whatsapp_number: config.whatsapp_number,
        store_address: config.store_address,
        instagram_handle: config.instagram_handle || '@borcegui2026',
        instagram_url: config.instagram_url || 'https://instagram.com/borcegui2026',
        hero_title: config.hero_title || 'INNOVACIÓN TOTAL EN TU PASO.',
        hero_subtitle: config.hero_subtitle || 'FÁCIL DE PONER, FÁCIL DE AJUSTAR.',
        hero_image_url: config.hero_image_url || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000',
        hero_cta_text: config.hero_cta_text || 'Explorar Catálogo 2026',
        hero_slides: config.hero_slides || [],
        updated_at: new Date().toISOString()
      };

      const configValueJSON = JSON.stringify(payloadObj);

      // Save ONLY id, key, and value to prevent PGRST204 error on unexisting table columns
      const { error } = await supabase.from('store_config').upsert({
        id: configId,
        key: 'store_settings',
        value: configValueJSON
      }, { onConflict: 'id' });

      if (error) {
        console.error('Supabase store_config error:', error);
        showNotification(`Error de Supabase (${error.code}): ${error.message}. ${error.details || ''}`, true);
      } else {
        showNotification('¡Configuración unificada de la tienda guardada correctamente en Supabase!');
      }
    } catch (err: any) {
      console.error('Save config exception:', err);
      showNotification(`Excepción al guardar: ${err?.message || err}`, true);
    } finally {
      setLoading(false);
    }
  };

  // --- PRODUCT MANAGEMENT ---
  const handleOpenNewProduct = () => {
    const timestampCode = Math.floor(1000 + Math.random() * 9000);
    setEditingProduct({
      id: '',
      name: '',
      model_code: `BORC-${timestampCode}`,
      description: '',
      price: 85.00,
      category: 'deportiva',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
      features: ['Dial Micrométrico', 'Guayas de acero'],
    });
    setEditingSizes([
      { size: 36, stock: 5 },
      { size: 37, stock: 10 },
      { size: 38, stock: 10 },
      { size: 39, stock: 8 },
    ]);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct({
      ...prod,
      model_code: prod.model_code || `BORC-${String(prod.id).slice(0, 6).toUpperCase()}`,
    });
    if (prod.product_sizes && prod.product_sizes.length > 0) {
      setEditingSizes(prod.product_sizes.map(s => ({ size: s.size, stock: s.stock })));
    } else {
      setEditingSizes([{ size: 40, stock: 5 }]);
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación explícita con mensajes claros
    if (!editingProduct?.name?.trim()) {
      showNotification('⚠️ El campo "Nombre del Modelo" es obligatorio.', true);
      return;
    }
    if (!editingProduct?.model_code?.trim()) {
      showNotification('⚠️ El campo "Código de Modelo" (ej. BORC-1001) es obligatorio.', true);
      return;
    }
    if (!editingProduct?.price || Number(editingProduct.price) <= 0) {
      showNotification('⚠️ El campo "Precio" debe ser mayor a 0.', true);
      return;
    }
    if (editingSizes.length === 0) {
      showNotification('⚠️ Agrega al menos una talla con su stock antes de guardar.', true);
      return;
    }
    const invalidSize = editingSizes.find(s => !s.size || Number(s.stock) < 0);
    if (invalidSize) {
      showNotification('⚠️ Revisa las tallas: hay un campo vacío o con stock inválido.', true);
      return;
    }

    setLoading(true);
    const isEditing = !!(editingProduct.id && !editingProduct.id.startsWith('prod-'));
    const modelCode = editingProduct.model_code.trim().toUpperCase();

    try {
      let savedId: string;

      if (isEditing) {
        // UPDATE existing product
        const { error: prodError } = await supabase.from('products').upsert({
          id: editingProduct.id,
          name: editingProduct.name,
          model_code: modelCode,
          description: editingProduct.description || '',
          price: Number(editingProduct.price),
          category: editingProduct.category || 'deportiva',
          images: editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
        });

        if (prodError) {
          console.error('Error actualizando producto en Supabase:', prodError);
          showNotification(`Error Supabase Productos [${prodError.code}]: ${prodError.message}`, true);
          setLoading(false);
          return;
        }
        savedId = String(editingProduct.id);
      } else {
        // INSERT new product without id field so database generates it
        const { data: insertedData, error: prodError } = await supabase
          .from('products')
          .insert({
            name: editingProduct.name,
            model_code: modelCode,
            description: editingProduct.description || '',
            price: Number(editingProduct.price),
            category: editingProduct.category || 'deportiva',
            images: editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
          })
          .select('id')
          .single();

        if (prodError || !insertedData) {
          console.error('Error insertando producto en Supabase:', prodError);
          showNotification(`Error Supabase Productos [${prodError?.code}]: ${prodError?.message}`, true);
          setLoading(false);
          return;
        }
        savedId = String(insertedData.id);
      }

      // Delete & Insert sizes with valid numeric/generated savedId
      await supabase.from('product_sizes').delete().eq('product_id', savedId);
      const { error: sizeError } = await supabase.from('product_sizes').insert(
        editingSizes.map(s => ({ product_id: savedId, size: s.size, stock: Number(s.stock) }))
      );

      if (sizeError) {
        console.error('Error guardando tallas en Supabase:', sizeError);
        showNotification(`Producto guardado, pero falló guardar tallas: ${sizeError.message}`, true);
      } else {
        showNotification('¡Producto y tallas guardados exitosamente en Supabase!');
      }

      // Refresh real data from DB
      await fetchAdminData();
      setIsProductModalOpen(false);
    } catch (err: any) {
      console.error('Excepción guardando producto:', err);
      showNotification(`Error de red o ejecución: ${err?.message || err}`, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este calzado?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error('Error eliminando producto:', error);
        showNotification(`Error al eliminar de Supabase: ${error.message}`, true);
      } else {
        setProducts(prev => prev.filter(p => p.id !== id));
        showNotification('Producto eliminado de Supabase.');
      }
    } catch (err: any) {
      showNotification(`Excepción al eliminar: ${err?.message || err}`, true);
    }
  };

  // --- PAYMENT METHOD MANAGEMENT ---
  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment?.name) return;

    const payId = editingPayment.id || `pay-${Date.now()}`;
    const newPay: PaymentMethod = {
      id: payId,
      name: editingPayment.name,
      details: editingPayment.details || '',
      is_active: editingPayment.is_active ?? true,
    };

    try {
      const { error } = await supabase.from('payment_methods').upsert({
        id: newPay.id,
        name: newPay.name,
        details: newPay.details,
        is_active: newPay.is_active
      }, { onConflict: 'id' });

      if (error) {
        console.error('Error guardando método de pago:', error);
        showNotification(`Error Supabase Métodos de Pago: ${error.message}`, true);
      } else {
        setPayments(prev => {
          const idx = prev.findIndex(p => p.id === payId);
          if (idx > -1) {
            const updated = [...prev];
            updated[idx] = newPay;
            return updated;
          }
          return [...prev, newPay];
        });
        showNotification('Método de pago guardado exitosamente en Supabase.');
        setIsPaymentModalOpen(false);
      }
    } catch (err: any) {
      showNotification(`Excepción método de pago: ${err?.message || err}`, true);
    }
  };

  const handleDeletePayment = async (id: string) => {
    try {
      const { error } = await supabase.from('payment_methods').delete().eq('id', id);
      if (error) {
        showNotification(`Error al eliminar método de pago: ${error.message}`, true);
      } else {
        setPayments(prev => prev.filter(p => p.id !== id));
        showNotification('Método de pago eliminado de Supabase.');
      }
    } catch (e: any) {
      showNotification(`Excepción al eliminar: ${e?.message || e}`, true);
    }
  };

  // --- LOGIN GUARD FOR ADMIN OFFICE ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-md w-full bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 space-y-6 backdrop-blur-md shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto text-cyan-400">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Acceso Privado Admin</h2>
            <p className="text-xs text-zinc-400">Ingresa tus credenciales oficiales para gestionar la tienda Borceguí</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-xl text-red-400 text-xs font-semibold text-center animate-bounce">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">Usuario Admin</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-sm rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <LogIn className="w-4 h-4" />
              Iniciar Sesión en Panel Admin
            </button>
          </form>

          <div className="text-center pt-2 border-t border-zinc-800/60">
            <Link href="/" className="text-xs text-zinc-400 hover:text-cyan-400 transition-colors">
              ← Volver a la Tienda Pública
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/60 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold flex items-center gap-2">
                Panel de Administración
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                  BORCEGUÍ ADMIN OFFICE
                </span>
              </h1>
              <p className="text-xs text-zinc-400">Gestión en tiempo real conectada con Supabase DB</p>
            </div>
          </div>

          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sincronizar DB
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Status Toast */}
        {statusMessage && (
          <div className={`mb-6 p-4 rounded-xl border text-sm font-semibold flex items-center gap-3 animate-in fade-in duration-300 ${
            statusIsError 
              ? 'bg-red-500/10 border-red-500/40 text-red-400' 
              : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
          }`}>
            {statusIsError ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-3 border-b border-zinc-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'products'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Package className="w-4 h-4" />
            Gestión de Calzados ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'config'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            WhatsApp & Tienda Física
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'payments'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Métodos de Pago ({payments.length})
          </button>
        </div>

        {/* TAB 1: PRODUCTS LIST */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-zinc-200">Inventario de Calzados</h2>
              <button
                onClick={handleOpenNewProduct}
                className="flex items-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Agregar Nuevo Calzado
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all"
                >
                  <div className="flex gap-4">
                    <img
                      src={prod.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'}
                      alt={prod.name}
                      className="w-20 h-20 object-cover rounded-xl bg-zinc-950 border border-zinc-800"
                    />
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {prod.category}
                      </span>
                      <h3 className="font-extrabold text-sm text-white">{prod.name}</h3>
                      <p className="text-xs font-bold text-zinc-300">${prod.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Stock by size summary */}
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                    <span className="text-[11px] text-zinc-400 font-semibold block mb-1.5">Stock por Tallas:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {prod.product_sizes && prod.product_sizes.length > 0 ? (
                        prod.product_sizes.map((s) => (
                          <span
                            key={s.id || s.size}
                            className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                              s.stock > 0 ? 'bg-zinc-900 text-zinc-300 border border-zinc-800' : 'bg-red-950/40 text-red-400 border border-red-900/40'
                            }`}
                          >
                            T{s.size}: {s.stock} un.
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-zinc-500 italic">Sin tallas especificadas</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                    <button
                      onClick={() => handleOpenEditProduct(prod)}
                      className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Editar / Tallas
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 bg-zinc-950 hover:bg-red-950/30 rounded-xl border border-zinc-800 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CONFIG STORE (WHATSAPP & ADDRESS) */}
        {activeTab === 'config' && (
          <div className="max-w-2xl bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Configuración de la Tienda Borceguí</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Actualiza el número oficial de WhatsApp para los pedidos y la dirección física del showroom.
              </p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-6">
              {/* Bloque 1: Contacto y Redes */}
              <div className="space-y-4 bg-zinc-950 p-5 rounded-2xl border border-zinc-800/80">
                <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  1. Datos Principales de Contacto & Instagram
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Número de WhatsApp Oficial (Pedidos)
                    </label>
                    <input
                      type="text"
                      value={config.whatsapp_number}
                      onChange={(e) => setConfig({ ...config, whatsapp_number: e.target.value })}
                      placeholder="+584246678858"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Usuario de Instagram
                    </label>
                    <input
                      type="text"
                      value={config.instagram_handle || ''}
                      onChange={(e) => setConfig({ ...config, instagram_handle: e.target.value })}
                      placeholder="@borcegui2026"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Enlace URL Directo a Instagram
                  </label>
                  <input
                    type="url"
                    value={config.instagram_url || ''}
                    onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
                    placeholder="https://instagram.com/borcegui2026"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Dirección Física de la Tienda / Showroom
                  </label>
                  <textarea
                    rows={2}
                    value={config.store_address}
                    onChange={(e) => setConfig({ ...config, store_address: e.target.value })}
                    placeholder="Calle Páez, Edificio Capri, Chacao, Caracas, Venezuela"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              {/* Bloque 2: Gestión Total del Banner Carrusel Rotativo (Hero Multi-Slide) */}
              <div className="space-y-5 bg-zinc-950 p-5 rounded-2xl border border-zinc-800/80">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    2. Gestión del Carrusel Rotativo Hero (Banners Publicitarios)
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {(config.hero_slides || []).length} Banners Activos
                  </span>
                </div>

                {/* Form to add a new slide to the carousel */}
                <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    Agregar Nueva Imagen Publicitaria al Carrusel Rotativo
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-300">Título del Banner</label>
                      <input
                        type="text"
                        value={newSlideTitle}
                        onChange={(e) => setNewSlideTitle(e.target.value)}
                        placeholder="NUEVA COLECCIÓN DEPORTIVA 2026"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-300">Subtítulo Destacado</label>
                      <input
                        type="text"
                        value={newSlideSubtitle}
                        onChange={(e) => setNewSlideSubtitle(e.target.value)}
                        placeholder="MÁXIMA RESISTENCIA Y ERGONOMÍA URBANA"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-zinc-300 block">Imagen (Local o URL)</label>
                    <div className="flex gap-2 items-center">
                      <label className="flex-1 bg-zinc-950 border border-dashed border-zinc-700 hover:border-cyan-500 rounded-xl px-3 py-2 cursor-pointer text-center text-xs font-bold text-cyan-400 transition-all">
                        <span>📁 Elegir Imagen del Dispositivo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (reader.result) {
                                  setNewSlideImage(reader.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      <input
                        type="url"
                        value={newSlideImage}
                        onChange={(e) => setNewSlideImage(e.target.value)}
                        placeholder="o pega una URL de imagen..."
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {newSlideImage && (
                    <div className="flex items-center gap-3 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                      <img src={newSlideImage} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-zinc-800" />
                      <span className="text-xs text-zinc-400">Vista previa lista para agregar</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (!newSlideImage) {
                        showNotification('Por favor selecciona o pega una URL de imagen para la diapositiva.', true);
                        return;
                      }
                      const slideItem: HeroSlide = {
                        id: `slide-${Date.now()}`,
                        image_url: newSlideImage,
                        title: newSlideTitle || 'NUEVO CALZADO BORCEGUÍ',
                        subtitle: newSlideSubtitle || 'TECNOLOGÍA DE DIAL GIRATORIO',
                        badge_text: newSlideBadge || 'EDICIÓN ESPECIAL'
                      };
                      const existing = config.hero_slides || [];
                      setConfig({ ...config, hero_slides: [...existing, slideItem] });
                      setNewSlideImage('');
                      setNewSlideTitle('');
                      setNewSlideSubtitle('');
                      showNotification('¡Imagen añadida a la lista del carrusel!');
                    }}
                    className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all uppercase"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    Añadir al Carrusel Publicitario
                  </button>
                </div>

                {/* List of active slides in carousel */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    Banners Actualmente en el Carrusel Rotativo:
                  </label>
                  
                  {(!config.hero_slides || config.hero_slides.length === 0) ? (
                    <div className="p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800 text-center text-xs text-zinc-500 italic">
                      Se está mostrando el banner por defecto. Agrega arriba tus propios banners publicitarios.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {config.hero_slides.map((slide, sIdx) => (
                        <div
                          key={slide.id || sIdx}
                          className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800 gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={slide.image_url} alt={slide.title} className="w-12 h-12 object-cover rounded-lg shrink-0 border border-zinc-800" />
                            <div className="min-w-0">
                              <p className="text-xs font-extrabold text-white truncate">{slide.title || 'Banner Publicitario'}</p>
                              <p className="text-[11px] text-zinc-400 truncate">{slide.subtitle || 'Borceguí 2026'}</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = config.hero_slides?.filter((_, idx) => idx !== sIdx);
                              setConfig({ ...config, hero_slides: updated });
                              showNotification('Banner removido del carrusel.');
                            }}
                            className="p-2 text-zinc-500 hover:text-red-400 bg-zinc-950 rounded-lg border border-zinc-800 hover:bg-red-950/40 transition-all shrink-0"
                            title="Eliminar de Carrusel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Texto del Botón Principal (CTA)
                  </label>
                  <input
                    type="text"
                    value={config.hero_cta_text || ''}
                    onChange={(e) => setConfig({ ...config, hero_cta_text: e.target.value })}
                    placeholder="Explorar Catálogo 2026"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all uppercase tracking-wider"
              >
                <Save className="w-4 h-4 stroke-[3]" />
                Guardar Configuración Unificada en Supabase
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: PAYMENT METHODS */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-zinc-200">Métodos de Pago Aceptados</h2>
              <button
                onClick={() => {
                  setEditingPayment({ name: '', details: '', is_active: true });
                  setIsPaymentModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Agregar Método de Pago
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {payments.map((pm) => (
                <div
                  key={pm.id}
                  className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex items-start justify-between gap-4"
                >
                  <div>
                    <h3 className="font-extrabold text-sm text-white">{pm.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1">{pm.details}</p>
                    <span className="inline-block mt-3 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20">
                      Activo
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingPayment(pm);
                        setIsPaymentModalOpen(true);
                      }}
                      className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePayment(pm.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* PRODUCT MODAL (CREATE / EDIT) */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-black text-white">
                {editingProduct.id ? 'Editar Calzado & Stock' : 'Agregar Nuevo Calzado Borceguí'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">
                    Nombre del Modelo <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Ej. Borceguí Apex Runner Dial"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">
                    Código de Modelo <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.model_code || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, model_code: e.target.value })}
                    placeholder="Ej. BORC-1001"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Categoría</label>
                  <select
                    value={editingProduct.category || 'deportiva'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="deportiva">Línea Deportiva</option>
                    <option value="casual">Línea Casual</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Precio ($ USD) <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

                {/* Multi-Image Gallery Manager (Allows 6-8+ images) */}
                <div className="space-y-2 col-span-2 pt-2 border-t border-zinc-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-xs font-bold text-cyan-400 block">Galería de Fotografías ({editingProduct.images?.length || 0})</label>
                      <span className="text-[10px] text-zinc-500">Puedes agregar múltiples imágenes (6-8 fotos) por calzado</span>
                    </div>
                    <label className="cursor-pointer px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-xl border border-cyan-500/30 flex items-center gap-1.5">
                      + Subir Nueva Foto
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach((file) => {
                            const reader = new FileReader();
                            reader.onload = (uploadEvent) => {
                              const result = uploadEvent.target?.result as string;
                              if (result) {
                                setEditingProduct((prev) => ({
                                  ...prev,
                                  images: [...(prev?.images || []), result],
                                }));
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                      />
                    </label>
                  </div>

                  {/* Images List */}
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-zinc-950 rounded-xl border border-zinc-900">
                    {(editingProduct.images || []).map((imgUrl, imgIdx) => (
                      <div key={imgIdx} className="relative group rounded-lg overflow-hidden aspect-square border border-zinc-800 bg-zinc-900">
                        <img src={imgUrl} alt={`Foto ${imgIdx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editingProduct.images || []).filter((_, i) => i !== imgIdx);
                            setEditingProduct({ ...editingProduct, images: updated });
                          }}
                          className="absolute top-1 right-1 p-1 bg-black/70 text-red-400 hover:text-red-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Descripción del Producto</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Tallas & Stock Management (Supports 24-40) */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-xs font-extrabold text-cyan-400 block">Tallas y Stock Disponibles</label>
                    <span className="text-[10px] text-zinc-500">
                      Rango recomendado para Línea Casual: Tallas 24 a 40
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingSizes([
                        { size: 24, stock: 5 },
                        { size: 28, stock: 8 },
                        { size: 32, stock: 10 },
                        { size: 36, stock: 10 },
                        { size: 40, stock: 5 },
                      ])}
                      className="text-[11px] px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 text-cyan-400 font-bold rounded-lg"
                    >
                      Preset Casual (24-40)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSizes([...editingSizes, { size: 38, stock: 5 }])}
                      className="text-xs text-cyan-400 font-bold hover:underline"
                    >
                      + Añadir Talla
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto p-1">
                  {editingSizes.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Talla (Ej. 41)"
                        value={s.size}
                        onChange={(e) => {
                          const updated = [...editingSizes];
                          updated[idx].size = e.target.value;
                          setEditingSizes(updated);
                        }}
                        className="w-1/2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="number"
                        placeholder="Stock (Ej. 10)"
                        value={s.stock}
                        onChange={(e) => {
                          const updated = [...editingSizes];
                          updated[idx].stock = parseInt(e.target.value) || 0;
                          setEditingSizes(updated);
                        }}
                        className="w-1/2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingSizes(editingSizes.filter((_, i) => i !== idx))}
                        className="text-zinc-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="w-1/2 py-3 bg-zinc-900 text-zinc-300 font-bold text-xs rounded-xl border border-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-1/2 py-3 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all ${
                    loading
                      ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-black'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    'Guardar en Base de Datos'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT METHOD MODAL */}
      {isPaymentModalOpen && editingPayment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-6">
            <h3 className="text-lg font-black text-white">Método de Pago</h3>
            <form onSubmit={handleSavePayment} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Nombre (Ej. Zelle, Pago Móvil)</label>
                <input
                  type="text"
                  required
                  value={editingPayment.name || ''}
                  onChange={(e) => setEditingPayment({ ...editingPayment, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Detalles / Instrucciones</label>
                <textarea
                  rows={3}
                  value={editingPayment.details || ''}
                  onChange={(e) => setEditingPayment({ ...editingPayment, details: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="w-1/2 py-3 bg-zinc-900 text-zinc-300 font-bold text-xs rounded-xl border border-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-cyan-500 text-black font-extrabold text-xs rounded-xl"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
