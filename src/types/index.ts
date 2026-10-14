export type PageView =
  | 'home'
  | 'shop-catalog'
  | 'skincare'
  | 'makeup'
  | 'haircare'
  | 'fragrance'
  | 'offers'
  | 'tracking'
  | 'cart-checkout'
  | 'customer-account'
  | 'admin-portal';

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: 'Skincare' | 'Makeup' | 'Sun Protection' | 'Haircare' | 'Fragrance' | 'Accessories';
  subCategory?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  imageUrl: string;
  badge?: string;
  subBadge?: string;
  inStock: boolean;
  stockCount: number;
  reorderPoint?: number;
  volumeOrSize?: string;
  shades?: { name: string; hex: string }[];
  targetSkinTypes: string[];
  actives: string[];
  finish?: string;
  locationStock?: string;
  isBestseller?: boolean;
  isMonsoonProof?: boolean;
  isEidExclusive?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedShade?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  location: string;
  fullAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  paymentStatus: 'Paid' | 'Pending' | 'COD Approved';
  courier: string;
  courierTrackingId: string;
  status: 'New' | 'Processing' | 'Out for Delivery' | 'In-Transit' | 'Delivered' | 'Returned';
  expectedDelivery: string;
  timeline: {
    confirmed: string;
    packed?: string;
    outForDelivery?: string;
    delivered?: string;
  };
}

export interface Address {
  id: string;
  type: 'Home' | 'Office';
  isPrimary: boolean;
  fullName: string;
  phone: string;
  division: string;
  district: string;
  thana: string;
  street: string;
  postalCode: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  tier: string;
  points: number;
  pointsToNextTier: number;
  storeCredit: number;
  avatarUrl: string;
  skinType: string;
  skinConcerns: string[];
  preferredBrands: string[];
}

export interface AdminUser {
  name: string;
  email: string;
  role: string;
  location: string;
  avatarUrl: string;
  lastLogin?: string;
}
