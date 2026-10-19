export type CategoryType = 'all' | 'phone' | 'laptop' | 'audio' | 'accessories';

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  categoryName: string;
  price: number; // in VNĐ
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  image: string;
  galleryImages: string[];
  description: string;
  features: string[];
  specs: Record<string, string>;
  inStock: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  brand: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
}

export interface OrderData {
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  date: string;
}
