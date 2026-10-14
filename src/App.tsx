import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { TrackingMapModal } from './components/TrackingMapModal';
import { BatchImportModal } from './components/BatchImportModal';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { TrackingPage } from './pages/TrackingPage';

const AppContent: React.FC = () => {
  const { currentPage, toasts, removeToast, isDarkMode } = useStore();

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop-catalog':
      case 'skincare':
      case 'makeup':
      case 'haircare':
      case 'fragrance':
      case 'offers':
        return <CatalogPage />;
      case 'tracking':
        return <TrackingPage />;
      case 'cart-checkout':
        return <CheckoutPage />;
      case 'customer-account':
        return <AccountPage />;
      case 'admin-portal':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  const isAdmin = currentPage === 'admin-portal';

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#12090c] text-[#fdebed]' : 'bg-[#fff2f4] text-[#1e1315]'} font-sans antialiased flex flex-col justify-between transition-colors duration-300`}>
      {!isAdmin && <Header />}

      <main className={`w-full min-h-screen ${!isAdmin ? 'pt-32 sm:pt-36' : ''}`}>
        {renderCurrentView()}
      </main>

      {!isAdmin && <Footer />}

      {/* Global Modals */}
      <QuickViewModal />
      <TrackingMapModal />
      <BatchImportModal />

      {/* Floating Interactive Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#1f1a1c] text-[#f8eef1] px-5 py-3.5 rounded-full shadow-2xl flex items-center justify-between gap-3 transform transition-all animate-in slide-in-from-bottom-5 duration-300"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-[#ffdcbd] text-lg fill shrink-0">
                check_circle
              </span>
              <span className="text-xs font-semibold truncate">{toast.message}</span>
            </div>
            {toast.price !== undefined && (
              <span className="text-xs font-bold text-[#ffdad6] shrink-0">
                ৳{toast.price.toLocaleString()}
              </span>
            )}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#847371] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
