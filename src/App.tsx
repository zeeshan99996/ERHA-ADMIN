import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminLogin from '@/components/admin/AdminLogin';
import { DashboardPage } from '@/routes/admin/index';
import { OrdersPage } from '@/routes/admin/orders';
import { ProductsPage } from '@/routes/admin/products';
import { CustomersPage } from '@/routes/admin/customers';
import { CategoriesPage } from '@/routes/admin/categories';
import { CouponsPage } from '@/routes/admin/coupons';
import { PaymentsPage } from '@/routes/admin/payments';
import { SettingsPage } from '@/routes/admin/settings';

export type AdminTab =
  | '/admin'
  | '/admin/orders'
  | '/admin/products'
  | '/admin/customers'
  | '/admin/categories'
  | '/admin/coupons'
  | '/admin/payments'
  | '/admin/settings';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      localStorage.getItem('erha_admin_auth') === 'true' ||
      sessionStorage.getItem('erha_admin_auth') === 'true'
    );
  });

  const getTabFromHash = (): AdminTab => {
    const hash = window.location.hash.replace('#', '');
    const validTabs: AdminTab[] = [
      '/admin',
      '/admin/orders',
      '/admin/products',
      '/admin/customers',
      '/admin/categories',
      '/admin/coupons',
      '/admin/payments',
      '/admin/settings',
    ];
    if (validTabs.includes(hash as AdminTab)) return hash as AdminTab;
    return '/admin';
  };

  const [currentTab, setCurrentTab] = useState<AdminTab>(getTabFromHash);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentTab(getTabFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (tab: AdminTab) => {
    window.location.hash = tab;
    setCurrentTab(tab);
    setMobileOpen(false);
  };

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(
        localStorage.getItem('erha_admin_auth') === 'true' ||
        sessionStorage.getItem('erha_admin_auth') === 'true'
      );
    };
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const titleMap: Record<AdminTab, { title: string; subtitle: string }> = {
    '/admin': { title: 'Dashboard', subtitle: 'Welcome back, Admin!' },
    '/admin/orders': { title: 'Orders', subtitle: 'Manage customer orders' },
    '/admin/products': { title: 'Products', subtitle: 'Manage your inventory' },
    '/admin/customers': { title: 'Customers', subtitle: 'View and manage customers' },
    '/admin/categories': { title: 'Categories', subtitle: 'Manage product categories' },
    '/admin/coupons': { title: 'Coupons', subtitle: 'Manage discount codes' },
    '/admin/payments': { title: 'Payments', subtitle: 'Transaction history' },
    '/admin/settings': { title: 'Settings', subtitle: 'Store configuration' },
  };

  const pageInfo = titleMap[currentTab] || titleMap['/admin'];

  if (!isAuthenticated) {
    return (
      <>
        <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      <AdminSidebar
        isCollapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        isMobile={isMobile}
        currentTab={currentTab}
        onNavigate={navigateTo}
        onLogout={() => {
          localStorage.removeItem('erha_admin_auth');
          sessionStorage.removeItem('erha_admin_auth');
          setIsAuthenticated(false);
        }}
      />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <AdminHeader
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onMobileMenuOpen={() => setMobileOpen(true)}
          onNavigate={navigateTo}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {currentTab === '/admin' && <DashboardPage />}
            {currentTab === '/admin/orders' && <OrdersPage />}
            {currentTab === '/admin/products' && <ProductsPage />}
            {currentTab === '/admin/customers' && <CustomersPage />}
            {currentTab === '/admin/categories' && <CategoriesPage />}
            {currentTab === '/admin/coupons' && <CouponsPage />}
            {currentTab === '/admin/payments' && <PaymentsPage />}
            {currentTab === '/admin/settings' && <SettingsPage />}
          </div>
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
