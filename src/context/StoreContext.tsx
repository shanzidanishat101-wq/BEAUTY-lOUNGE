import React, { createContext, useContext, useState, useEffect } from 'react';
import { PageView, Product, CartItem, Order, Address, UserProfile, AdminUser } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_ADDRESSES, INITIAL_USER, INITIAL_ADMIN_USER, ASSETS } from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  price?: number;
  type: 'cart' | 'info' | 'success';
}

interface StoreContextType {
  currentPage: PageView;
  navigateTo: (page: PageView) => void;
  products: Product[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, shade?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;
  deliveryFee: number;
  couponCode: string;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };

  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Addresses
  addresses: Address[];
  addAddress: (addr: Omit<Address, 'id'>) => void;

  // User
  user: UserProfile;
  updateUser: (data: Partial<UserProfile>) => void;

  // Modals & Overlays
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  trackingModalOrder: Order | null;
  setTrackingModalOrder: (order: Order | null) => void;
  isBatchImportOpen: boolean;
  setIsBatchImportOpen: (open: boolean) => void;

  // Dark Mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Product Management (Full CRUD)
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Product / Parcel Tracking
  trackingQuery: string;
  setTrackingQuery: (q: string) => void;
  lookupOrderOrTracking: (code: string) => Order | null;

  // Admin Authentication
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  loginAdmin: (email: string, password: string) => { success: boolean; message: string };
  logoutAdmin: () => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, price?: number) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  // Dark Mode State with document element synchronization
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('beauty_lounge_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('beauty_lounge_dark_mode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('beauty_lounge_dark_mode', 'false');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Products CRUD State with local persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('beauty_lounge_products');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PRODUCTS;
  });

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem('beauty_lounge_products', JSON.stringify(newProducts));
    } catch (e) {
      console.error(e);
    }
  };

  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newProduct: Product = {
      ...prodData,
      id: newId,
    };
    const updated = [newProduct, ...products];
    saveProducts(updated);
    showToast(`Added "${newProduct.name}" to inventory!`);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveProducts(updated);
    showToast(`Updated product specifications.`);
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    const filtered = products.filter((p) => p.id !== id);
    saveProducts(filtered);
    showToast(`Removed "${target?.name || 'Product'}" from catalog.`);
  };

  // Tracking query state & lookup helper
  const [trackingQuery, setTrackingQuery] = useState<string>('');

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial cart matching the Checkout screen (Image 7):
  // 1. Aura Dew Niacinamide 10% + Zinc Serum (30ml) @ ৳1,650
  // 2. Invisible Sun Shield Water Gel SPF 50+ (50ml) @ ৳2,100
  // Total = ৳3,750
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0],
      quantity: 1,
    },
    {
      product: INITIAL_PRODUCTS[2],
      quantity: 1,
    },
  ]);

  const [couponCode, setCouponCode] = useState<string>('DHAKAGLOW');
  const [discountAmount, setDiscountAmount] = useState<number>(250);
  const deliveryFee = 70; // Dhaka Metro flat delivery

  // Wishlist: 3 curated items initially
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    INITIAL_PRODUCTS[0].id,
    INITIAL_PRODUCTS[1].id,
    INITIAL_PRODUCTS[3].id,
  ]);

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [isBatchImportOpen, setIsBatchImportOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, price?: number) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, price, type: 'cart' }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, quantity = 1, shade?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedShade === shade
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [...prev, { product, quantity, selectedShade: shade }];
      }
    });
    showToast(`Added to Bag: ${product.name}`, product.price);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + (cart.length > 0 ? deliveryFee : 0));

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'DHAKAGLOW' || clean === 'DHAKA10') {
      setCouponCode(clean);
      setDiscountAmount(250);
      return { success: true, message: 'Promo applied! ৳250 luxury discount activated.' };
    }
    return { success: false, message: 'Invalid coupon code. Try DHAKAGLOW or DHAKA10' };
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to Curated Wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const placeOrder = (orderData: Partial<Order>): Order => {
    const newId = `BL-${Math.floor(80000 + Math.random() * 19999)}`;
    const newOrder: Order = {
      id: newId,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' at ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      customerName: orderData.customerName || user.name,
      customerPhone: orderData.customerPhone || user.phone,
      customerEmail: orderData.customerEmail || user.email,
      location: orderData.location || 'Banani, Dhaka',
      fullAddress: orderData.fullAddress || 'House 42, Road 11, Block D, Banani, Dhaka-1213',
      items: cart.map((c) => ({
        id: c.product.id,
        name: c.product.name + (c.selectedShade ? ` (${c.selectedShade})` : ''),
        price: c.product.price,
        quantity: c.quantity,
        imageUrl: c.product.imageUrl,
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      deliveryFee: deliveryFee,
      total: cartTotal,
      paymentMethod: orderData.paymentMethod || 'cod',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'COD Approved' : 'Paid',
      courier: 'Steadfast / Pathao Express',
      courierTrackingId: `ST-${Math.floor(900000 + Math.random() * 99999)}-BD`,
      status: 'Processing',
      expectedDelivery: 'Tomorrow by 4:00 PM',
      timeline: {
        confirmed: 'Just now',
      },
      ...orderData,
    };

    setOrders((prev) => [newOrder, ...prev]);
    // update user lifetime stats
    setUser((prev) => ({
      ...prev,
      points: prev.points + Math.floor(newOrder.total / 10),
    }));

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order #${orderId} status updated to ${status}`);
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      ...addr,
    };
    setAddresses((prev) => [newAddr, ...prev]);
    showToast('New delivery address saved');
  };

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('beauty_lounge_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('beauty_lounge_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const loginAdmin = (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      return { success: false, message: 'Please provide both email and password' };
    }

    if (
      (trimmedEmail === 'operations@beautylounge.bd' ||
        trimmedEmail === 'admin@beautylounge.bd' ||
        trimmedEmail === 'admin') &&
      (password === 'admin' || password === 'admin123' || password === 'lounge2026')
    ) {
      const userObj: AdminUser = {
        ...INITIAL_ADMIN_USER,
        email: trimmedEmail.includes('@') ? trimmedEmail : 'operations@beautylounge.bd',
        lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setIsAdminAuthenticated(true);
      setAdminUser(userObj);
      try {
        localStorage.setItem('beauty_lounge_admin_auth', 'true');
        localStorage.setItem('beauty_lounge_admin_user', JSON.stringify(userObj));
      } catch (e) {
        console.error(e);
      }
      showToast(`Welcome back, ${userObj.name}! Lounge OS activated.`);
      return { success: true, message: 'Authentication successful' };
    } else if (password.length >= 4 && (trimmedEmail.includes('@') || trimmedEmail === 'admin')) {
      const namePart = trimmedEmail.includes('@') ? trimmedEmail.split('@')[0] : trimmedEmail;
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const userObj: AdminUser = {
        name: `${formattedName} (Ops Manager)`,
        email: trimmedEmail.includes('@') ? trimmedEmail : `${trimmedEmail}@beautylounge.bd`,
        role: 'Operations & Inventory Lead',
        location: 'Banani HQ, Dhaka',
        avatarUrl: ASSETS.profileAvatar,
        lastLogin: 'Just now',
      };
      setIsAdminAuthenticated(true);
      setAdminUser(userObj);
      try {
        localStorage.setItem('beauty_lounge_admin_auth', 'true');
        localStorage.setItem('beauty_lounge_admin_user', JSON.stringify(userObj));
      } catch (e) {
        console.error(e);
      }
      showToast(`Welcome back, ${userObj.name}! Lounge OS activated.`);
      return { success: true, message: 'Authentication successful' };
    } else {
      return { success: false, message: 'Invalid credentials. Use demo: operations@beautylounge.bd / admin123' };
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    try {
      localStorage.removeItem('beauty_lounge_admin_auth');
      localStorage.removeItem('beauty_lounge_admin_user');
    } catch (e) {
      console.error(e);
    }
    showToast('Logged out from Lounge OS Admin Portal');
  };

  const lookupOrderOrTracking = (code: string): Order | null => {
    const q = code.trim().toLowerCase();
    if (!q) return null;
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === q ||
        o.courierTrackingId.toLowerCase() === q ||
        o.customerPhone.includes(q)
    );
    return found || null;
  };

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        navigateTo,
        isDarkMode,
        toggleDarkMode,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        trackingQuery,
        setTrackingQuery,
        lookupOrderOrTracking,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTotal,
        deliveryFee,
        couponCode,
        discountAmount,
        applyCoupon,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        addresses,
        addAddress,
        user,
        updateUser,
        quickViewProduct,
        setQuickViewProduct,
        trackingModalOrder,
        setTrackingModalOrder,
        isBatchImportOpen,
        setIsBatchImportOpen,
        isAdminAuthenticated,
        adminUser,
        loginAdmin,
        logoutAdmin,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
