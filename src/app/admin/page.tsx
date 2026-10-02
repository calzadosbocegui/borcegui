"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, StoreConfig, PaymentMethod, ProductSize } from '@/types/database';
import { INITIAL_PRODUCTS, INITIAL_STORE_CONFIG, INITIAL_PAYMENT_METHODS } from '@/data/initialData';
import { 
  Plus, Edit, Trash2, Save, RefreshCw, PhoneCall, MapPin, 
  CreditCard, Package, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, X 
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'config' | 'payments'>('products');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [config, setConfig] = useState<StoreConfig>(INITIAL_STORE_CONFIG);
  const [payments, setPayments] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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
      const { data: payData } = await supabase.from('payment_methods').select('*').order('created_at', { ascending: true });
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
      const configValueJSON = JSON.stringify({
        whatsapp_number: config.whatsapp_number,
        store_address: config.store_address,
        store_name: config.store_name || 'Borceguí',
      });

      const { error } = await supabase.from('store_config').upsert({
        id: configId,
        key: 'store_settings',
        value: configValueJSON,
        whatsapp_number: config.whatsapp_number,
        store_address: config.store_address,
        store_name: config.store_name || 'Borceguí',
      });

      if (error) {
        console.error('Supabase store_config error:', error);
        showNotification(`Error de Supabase (${error.code}): ${error.message}. ${error.details || ''}`, true);
      } else {
        showNotification('¡Configuración de la tienda actualizada correctamente en Supabase!');
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
      id: `prod-${Date.now()}`,
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
      model_code: prod.model_code || `BORC-${prod.id.slice(0, 6).toUpperCase()}`,
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
    if (!editingProduct?.name || !editingProduct?.price || !editingProduct?.model_code?.trim()) {
      showNotification('Por favor completa los campos obligatorios: Nombre, Código de Modelo y Precio.', true);
      return;
    }

    setLoading(true);
    const prodId = editingProduct.id || `prod-${Date.now()}`;
    const modelCode = editingProduct.model_code.trim().toUpperCase();

    const newProd: Product = {
      id: prodId,
      name: editingProduct.name,
      model_code: modelCode,
      description: editingProduct.description || '',
      price: Number(editingProduct.price),
      category: (editingProduct.category as 'deportiva' | 'casual') || 'deportiva',
      images: editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
      features: editingProduct.features || [],
      product_sizes: editingSizes.map((s, idx) => ({ id: `size-${idx}`, product_id: prodId, size: s.size, stock: Number(s.stock) }))
    };

    // Attempt Supabase Upsert with model_code payload
    try {
      const { error: prodError } = await supabase.from('products').upsert({
        id: newProd.id,
        name: newProd.name,
        model_code: newProd.model_code,
        description: newProd.description,
        price: newProd.price,
        category: newProd.category,
        images: newProd.images
      });

      if (prodError) {
        console.error('Error guardando producto en Supabase:', prodError);
        showNotification(`Error Supabase Productos [${prodError.code}]: ${prodError.message}`, true);
        setLoading(false);
        return;
      }

      // Delete & Insert sizes
      await supabase.from('product_sizes').delete().eq('product_id', newProd.id);
      const { error: sizeError } = await supabase.from('product_sizes').insert(
        editingSizes.map(s => ({ product_id: newProd.id, size: s.size, stock: Number(s.stock) }))
      );

      if (sizeError) {
        console.error('Error guardando tallas en Supabase:', sizeError);
        showNotification(`Producto guardado, pero falló guardar tallas: ${sizeError.message}`, true);
      } else {
        showNotification('¡Producto y tallas guardados exitosamente en Supabase!');
      }

      // Update Local State on Success
      setProducts(prev => {
        const idx = prev.findIndex(p => p.id === prodId);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = newProd;
          return updated;
        }
        return [newProd, ...prev];
      });

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

            <form onSubmit={handleSaveConfig} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Número de WhatsApp Oficial (Pedidos)
                </label>
                <input
                  type="text"
                  value={config.whatsapp_number}
                  onChange={(e) => setConfig({ ...config, whatsapp_number: e.target.value })}
                  placeholder="+584246678858"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
                <p className="text-[11px] text-zinc-500">
                  Formato con código de país (Ej: +58 424-6678858). A este número llegarán las compras procesadas desde el carrito.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Dirección Física de la Tienda / Showroom
                </label>
                <textarea
                  rows={3}
                  value={config.store_address}
                  onChange={(e) => setConfig({ ...config, store_address: e.target.value })}
                  placeholder="Calle Páez, Edificio Capri, Chacao, Caracas, Venezuela"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <Save className="w-4 h-4" />
                Guardar Configuración en Supabase
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
                  className="w-1/2 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  Guardar en Base de Datos
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
