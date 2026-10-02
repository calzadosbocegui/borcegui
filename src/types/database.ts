export interface StoreConfig {
  id: string;
  whatsapp_number: string;
  store_name: string;
  store_address: string;
  updated_at?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  details: string;
  icon_name?: string;
  is_active: boolean;
  created_at?: string;
}

export interface ProductSize {
  id: string;
  product_id: string;
  size: number | string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'deportiva' | 'casual';
  images: string[];
  features?: string[];
  is_featured?: boolean;
  product_sizes?: ProductSize[];
  created_at?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: number | string;
  quantity: number;
}
