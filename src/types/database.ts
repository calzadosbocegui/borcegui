export interface HeroSlide {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  badge_text?: string;
  target_product_id?: string;
}

export interface StoreConfig {
  id: string;
  key?: string;
  whatsapp_number: string;
  store_name: string;
  store_address: string;
  instagram_handle?: string;
  instagram_url?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image_url?: string;
  hero_cta_text?: string;
  hero_slides?: HeroSlide[];
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
  model_code?: string;
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
