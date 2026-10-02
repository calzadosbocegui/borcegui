import { Product, StoreConfig, PaymentMethod } from '@/types/database';

export const INITIAL_STORE_CONFIG: StoreConfig = {
  id: '1',
  store_name: 'Borceguí',
  whatsapp_number: '+584246678858',
  store_address: 'Calle Páez, Edificio Capri, Chacao, Caracas, Venezuela',
};

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  { id: '1', name: 'Zelle', details: 'Transferencias en USD inmediatas', is_active: true },
  { id: '2', name: 'Bancamiga', details: 'Cuentas corrientes / Moneda extranjera', is_active: true },
  { id: '3', name: 'Pago Móvil', details: 'Bancos nacionales en Bolívares (Bs)', is_active: true },
  { id: '4', name: 'PayPal', details: 'Tarjeta de crédito / Débito USD', is_active: true },
  { id: '5', name: 'Efectivo', details: 'Dólares ($) y Euros (€) en tienda física o delivery', is_active: true },
  { id: '6', name: 'Punto de Venta', details: 'Débito / Crédito directo en showroom', is_active: true },
];

export const INITIAL_PRODUCTS: Product[] = [
  // 6 modelos Línea Deportiva (Tonos uniformes y frescos para dinamismo, juventud y seguridad)
  {
    id: 'dep-1',
    name: 'Borceguí Apex Runner Dial',
    description: 'Diseño deportivo aerodinámico ultraligero con suela de amortiguación responsiva, tonos uniformes y frescos para dinamismo, juventud y seguridad.',
    price: 85.00,
    category: 'deportiva',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800'
    ],
    features: ['Dial Micrométrico Pro', 'Guayas de acero', 'Transpirable Mesh 3D'],
    product_sizes: [
      { id: 's1', product_id: 'dep-1', size: 36, stock: 6 },
      { id: 's2', product_id: 'dep-1', size: 37, stock: 8 },
      { id: 's3', product_id: 'dep-1', size: 38, stock: 10 },
      { id: 's4', product_id: 'dep-1', size: 39, stock: 12 },
      { id: 's5', product_id: 'dep-1', size: 40, stock: 5 },
    ]
  },
  {
    id: 'dep-2',
    name: 'Borceguí Stealth Sport Dial',
    description: 'Tonos frescos con acentos cian corporativos y tecnología Dial giratorio para mayor seguridad y velocidad.',
    price: 90.00,
    category: 'deportiva',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800'
    ],
    features: ['Suela Anti-derrapante', 'Sistema Dial Integrado', 'Ergonomía Deportiva'],
    product_sizes: [
      { id: 's6', product_id: 'dep-2', size: 35, stock: 4 },
      { id: 's7', product_id: 'dep-2', size: 36, stock: 8 },
      { id: 's8', product_id: 'dep-2', size: 37, stock: 10 },
      { id: 's9', product_id: 'dep-2', size: 38, stock: 6 },
    ]
  },
  {
    id: 'dep-3',
    name: 'Borceguí Velocity Cyan Edition',
    description: 'Edición juvenil con acento turquesa intenso en el rotor del dial y amortiguador responsivo.',
    price: 95.00,
    category: 'deportiva',
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800'
    ],
    features: ['Rotor Turquesa Exclusivo', 'Plantilla Memoria de Impacto', 'Ajuste Anatómico'],
    product_sizes: [
      { id: 's10', product_id: 'dep-3', size: 36, stock: 6 },
      { id: 's11', product_id: 'dep-3', size: 37, stock: 5 },
      { id: 's12', product_id: 'dep-3', size: 38, stock: 9 },
    ]
  },
  {
    id: 'dep-4',
    name: 'Borceguí Power Fit Dial',
    description: 'Diseñado para entrenamiento dinámico con tonos dinámicos y soporte integral al tobillo.',
    price: 88.00,
    category: 'deportiva',
    images: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800'
    ],
    features: ['Soporte de Tobillo Reforzado', 'Suela de Goma vulcanizada'],
    product_sizes: [
      { id: 's13', product_id: 'dep-4', size: 36, stock: 6 },
      { id: 's14', product_id: 'dep-4', size: 37, stock: 8 },
      { id: 's15', product_id: 'dep-4', size: 38, stock: 4 },
      { id: 's16', product_id: 'dep-4', size: 39, stock: 5 },
    ]
  },
  {
    id: 'dep-5',
    name: 'Borceguí Turbo Boost Light',
    description: 'Chasis de peso mínimo en tonos frescos con microperforaciones láser para máxima ventilación.',
    price: 82.00,
    category: 'deportiva',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800'
    ],
    features: ['Microperforación AirFlow', 'Dial Compacto Fit'],
    product_sizes: [
      { id: 's17', product_id: 'dep-5', size: 34, stock: 3 },
      { id: 's18', product_id: 'dep-5', size: 35, stock: 7 },
      { id: 's19', product_id: 'dep-5', size: 36, stock: 10 },
      { id: 's20', product_id: 'dep-5', size: 37, stock: 6 },
    ]
  },
  {
    id: 'dep-6',
    name: 'Borceguí Trek Dynamic Dial',
    description: 'Calzado híbrido en tonos uniformes de alta visibilidad para tracción multidireccional y seguridad.',
    price: 98.00,
    category: 'deportiva',
    images: [
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800'
    ],
    features: ['Suela Multidireccional', 'Construcción Repelente'],
    product_sizes: [
      { id: 's21', product_id: 'dep-6', size: 36, stock: 5 },
      { id: 's22', product_id: 'dep-6', size: 37, stock: 7 },
      { id: 's23', product_id: 'dep-6', size: 38, stock: 9 },
      { id: 's24', product_id: 'dep-6', size: 39, stock: 4 },
    ]
  },

  // 2 modelos Línea Casual (En imponente y elegante color negro para firmeza, determinación e innovación, Tallas 24-40)
  {
    id: 'cas-1',
    name: 'Borceguí Executive Black Dial',
    description: 'Imponente y elegante color negro para firmeza, determinación e innovación con cierre dial micrométrico (Rango de tallas 24 a 40).',
    price: 92.00,
    category: 'casual',
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800'
    ],
    features: ['Elegante Color Negro Imponente', 'Cierre Dial Micrométrico', 'Plantilla Ergonómica Premium'],
    product_sizes: [
      { id: 'cs1', product_id: 'cas-1', size: 24, stock: 5 },
      { id: 'cs2', product_id: 'cas-1', size: 28, stock: 8 },
      { id: 'cs3', product_id: 'cas-1', size: 32, stock: 10 },
      { id: 'cs4', product_id: 'cas-1', size: 36, stock: 12 },
      { id: 'cs5', product_id: 'cas-1', size: 40, stock: 6 },
    ]
  },
  {
    id: 'cas-2',
    name: 'Borceguí Minimalist Stealth Black',
    description: 'Estilo vanguardista monocromático en imponente color negro absoluto. Firmeza, confort y tecnología de ajuste sin cordones (Rango 24-40).',
    price: 88.00,
    category: 'casual',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800'
    ],
    features: ['Negro Absoluto Vanguardista', 'Sistema de Ajuste Rápido sin Cordones', 'Suela Amortiguada'],
    product_sizes: [
      { id: 'cs6', product_id: 'cas-2', size: 24, stock: 4 },
      { id: 'cs7', product_id: 'cas-2', size: 28, stock: 6 },
      { id: 'cs8', product_id: 'cas-2', size: 34, stock: 8 },
      { id: 'cs9', product_id: 'cas-2', size: 38, stock: 10 },
      { id: 'cs10', product_id: 'cas-2', size: 40, stock: 7 },
    ]
  }
];
