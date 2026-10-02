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
  // 6 modelos Línea Deportiva
  {
    id: 'dep-1',
    name: 'Borceguí Apex Runner Dial',
    description: 'Diseño deportivo aerodinámico ultraligero con suela de amortiguación responsiva y sistema Dial Pro.',
    price: 85.00,
    category: 'deportiva',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800'
    ],
    features: ['Dial Pro 1-click', 'Guayas de acero inoxidables', 'Transpirable Mesh 3D'],
    product_sizes: [
      { id: 's1', product_id: 'dep-1', size: 39, stock: 5 },
      { id: 's2', product_id: 'dep-1', size: 40, stock: 8 },
      { id: 's3', product_id: 'dep-1', size: 41, stock: 12 },
      { id: 's4', product_id: 'dep-1', size: 42, stock: 6 },
      { id: 's5', product_id: 'dep-1', size: 43, stock: 3 },
    ]
  },
  {
    id: 'dep-2',
    name: 'Borceguí Stealth Carbon Sport',
    description: 'Acabados en negro mate con acentos turquesa corporativos y refuerzo lateral de estabilidad.',
    price: 90.00,
    category: 'deportiva',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800'
    ],
    features: ['Suela Anti-derrapante', 'Sistema Dial Integrado', 'Capellada Sintética Premium'],
    product_sizes: [
      { id: 's6', product_id: 'dep-2', size: 40, stock: 4 },
      { id: 's7', product_id: 'dep-2', size: 41, stock: 10 },
      { id: 's8', product_id: 'dep-2', size: 42, stock: 7 },
      { id: 's9', product_id: 'dep-2', size: 43, stock: 2 },
    ]
  },
  {
    id: 'dep-3',
    name: 'Borceguí Velocity Cyan Edition',
    description: 'Edición limitada con acento turquesa intenso en el rotor de la perilla y amortiguador en talón.',
    price: 95.00,
    category: 'deportiva',
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800'
    ],
    features: ['Rotor Turquesa Exclusivo', 'Plantilla Memoria de Impacto', 'Ajuste Anatómico'],
    product_sizes: [
      { id: 's10', product_id: 'dep-3', size: 39, stock: 6 },
      { id: 's11', product_id: 'dep-3', size: 41, stock: 5 },
      { id: 's12', product_id: 'dep-3', size: 42, stock: 9 },
    ]
  },
  {
    id: 'dep-4',
    name: 'Borceguí CrossFit Power Dial',
    description: 'Diseñado para entrenamiento de alta intensidad, levantamiento y soporte seguro al tobillo.',
    price: 88.00,
    category: 'deportiva',
    images: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800'
    ],
    features: ['Soporte de Tobillo Reforzado', 'Suela de Goma vulcanizada'],
    product_sizes: [
      { id: 's13', product_id: 'dep-4', size: 40, stock: 6 },
      { id: 's14', product_id: 'dep-4', size: 41, stock: 8 },
      { id: 's15', product_id: 'dep-4', size: 42, stock: 4 },
      { id: 's16', product_id: 'dep-4', size: 43, stock: 5 },
    ]
  },
  {
    id: 'dep-5',
    name: 'Borceguí Turbo Boost Light',
    description: 'Chasis de peso mínimo con microperforaciones láser para máxima frescura en carreras largas.',
    price: 82.00,
    category: 'deportiva',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800'
    ],
    features: ['Microperforación Láser AirFlow', 'Dial Compacto Fit'],
    product_sizes: [
      { id: 's17', product_id: 'dep-5', size: 38, stock: 3 },
      { id: 's18', product_id: 'dep-5', size: 39, stock: 7 },
      { id: 's19', product_id: 'dep-5', size: 40, stock: 10 },
      { id: 's20', product_id: 'dep-5', size: 41, stock: 6 },
    ]
  },
  {
    id: 'dep-6',
    name: 'Borceguí All-Terrain Trek Dial',
    description: 'Calzado híbrido deportivo-trekking para terreno irregular con tracción multidireccional.',
    price: 98.00,
    category: 'deportiva',
    images: [
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800'
    ],
    features: ['Suela Multidireccional All-Grip', 'Construcción Repelente al Agua'],
    product_sizes: [
      { id: 's21', product_id: 'dep-6', size: 40, stock: 5 },
      { id: 's22', product_id: 'dep-6', size: 41, stock: 7 },
      { id: 's23', product_id: 'dep-6', size: 42, stock: 9 },
      { id: 's24', product_id: 'dep-6', size: 43, stock: 4 },
    ]
  },

  // 2 modelos Línea Casual
  {
    id: 'cas-1',
    name: 'Borceguí Urban Executive Dial',
    description: 'Elegancia sofisticada para oficina y eventos informales con cuero sintético mate y cierre giratorio discreto.',
    price: 92.00,
    category: 'casual',
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800'
    ],
    features: ['Estilo Ejecutivo Urbano', 'Cierre Dial Oculto Pro', 'Plantilla Ergonómica Confort'],
    product_sizes: [
      { id: 's25', product_id: 'cas-1', size: 40, stock: 6 },
      { id: 's26', product_id: 'cas-1', size: 41, stock: 11 },
      { id: 's27', product_id: 'cas-1', size: 42, stock: 8 },
      { id: 's28', product_id: 'cas-1', size: 43, stock: 5 },
    ]
  },
  {
    id: 'cas-2',
    name: 'Borceguí Minimalist Street Casual',
    description: 'Estilo callejero vanguardista en monocromo oscuro con sistema de ajuste rápido y suela plana amortiguada.',
    price: 88.00,
    category: 'casual',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800'
    ],
    features: ['Perfil Bajo Streetwear', 'Ajuste Instantáneo sin Lazos'],
    product_sizes: [
      { id: 's29', product_id: 'cas-2', size: 39, stock: 4 },
      { id: 's30', product_id: 'cas-2', size: 40, stock: 8 },
      { id: 's31', product_id: 'cas-2', size: 41, stock: 9 },
      { id: 's32', product_id: 'cas-2', size: 42, stock: 7 },
    ]
  }
];
