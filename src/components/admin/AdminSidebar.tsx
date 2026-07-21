import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Tag,
  Star,
  CreditCard,
  Settings,
  ChevronLeft,
  LogOut,
  Zap,
  X,
} from 'lucide-react';
import type { AdminTab } from '@/App';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  isMobile: boolean;
  currentTab: AdminTab;
  onNavigate: (tab: AdminTab) => void;
  onLogout: () => void;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: AdminTab;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

export default function AdminSidebar({
  isCollapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
  isMobile,
  currentTab,
  onNavigate,
  onLogout,
}: AdminSidebarProps) {
  const [role, setRole] = useState(() => db.getUserRole());
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  const syncState = async () => {
    setRole(db.getUserRole());
    const orders = await db.getOrders();
    setPendingOrdersCount(orders.filter((o) => o.orderStatus === 'Pending').length);
  };

  useEffect(() => {
    syncState();
    window.addEventListener('storage', syncState);
    return () => window.removeEventListener('storage', syncState);
  }, []);

  const isActive = (href: AdminTab) => currentTab === href;

  const navGroups: NavGroup[] = [
    {
      title: 'Overview',
      items: [{ label: 'Dashboard', icon: LayoutDashboard, href: '/admin' }],
    },
    {
      title: 'Commerce',
      items: [
        { label: 'Orders', icon: ShoppingBag, href: '/admin/orders', badge: pendingOrdersCount },
        ...(role !== 'Staff'
          ? [
              { label: 'Products', icon: Package, href: '/admin/products' as AdminTab },
              { label: 'Customers', icon: Users, href: '/admin/customers' as AdminTab },
            ]
          : []),
      ],
    },
    ...(role === 'Super Admin'
      ? [
          {
            title: 'Marketing',
            items: [
              { label: 'Coupons', icon: Tag, href: '/admin/coupons' as AdminTab },
              { label: 'Categories', icon: Star, href: '/admin/categories' as AdminTab },
            ],
          },
          {
            title: 'Finance',
            items: [{ label: 'Payments', icon: CreditCard, href: '/admin/payments' as AdminTab }],
          },
          {
            title: 'System',
            items: [{ label: 'Settings', icon: Settings, href: '/admin/settings' as AdminTab }],
          },
        ]
      : []),
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-center size-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold shadow-lg shrink-0">
          <Zap className="size-5" />
        </div>
        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-extrabold text-white truncate">ERHA Admin</h1>
            <p className="text-[10px] text-slate-400 truncate">Store Management</p>
          </div>
        )}
        {isMobile ? (
          <button onClick={onMobileClose} className="ml-auto p-1.5 text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        ) : (
          <button onClick={onToggle} className="ml-auto p-1.5 text-slate-400 hover:text-white">
            <ChevronLeft className={`size-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 px-3">
        {navGroups.map((group) => (
          <div key={group.title}>
            {!isCollapsed && (
              <h2 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {group.title}
              </h2>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <button
                    key={item.href}
                    onClick={() => onNavigate(item.href)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <Icon className={`size-4 shrink-0 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                    {!isCollapsed && item.badge ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout button */}
      <div className="p-3 border-t border-slate-800 shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
        >
          <LogOut className="size-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] shadow-2xl lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <aside
      className="hidden lg:block shrink-0 transition-all duration-300"
      style={{ width: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
    >
      {sidebarContent}
    </aside>
  );
}
