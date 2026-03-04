'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  useTheme,
  useCustomerAuth,
  useEditor,
  getMyOrders,
  cn,
} from '@zevcommerce/storefront-api';
import {
  User, Package, MapPin, CreditCard, LogOut,
  ChevronRight, Eye, Search, Filter, Calendar,
  ArrowUpRight, ArrowDownRight, TrendingUp,
  Settings, Shield, Clock, Truck, Plus
} from 'lucide-react';

// --- STYLING HELPERS ---
const getShadowClass = (style: string) => {
  switch (style) {
    case 'none': return 'shadow-none';
    case 'subtle': return 'shadow-sm';
    case 'smooth': return 'shadow-md';
    case 'hard': return 'shadow-lg';
    default: return 'shadow-none';
  }
};

// --- MOCK DATA ---
const MOCK_CUSTOMER = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+234 800 123 4567',
  addresses: [
    { id: '1', name: 'Home', address: '123 Main Street, Lagos, Nigeria', isDefault: true },
    { id: '2', name: 'Office', address: '456 Business Ave, Lagos, Nigeria', isDefault: false },
  ]
};

const MOCK_ORDERS = [
  { id: 'ORD-001', date: '2024-01-15', status: 'Delivered', total: 45000, items: 3 },
  { id: 'ORD-002', date: '2024-01-10', status: 'Processing', total: 28500, items: 2 },
  { id: 'ORD-003', date: '2024-01-05', status: 'Shipped', total: 15000, items: 1 },
  { id: 'ORD-004', date: '2023-12-28', status: 'Delivered', total: 12000, items: 1 },
  { id: 'ORD-005', date: '2023-12-20', status: 'Cancelled', total: 5500, items: 1 },
];

// --- COMPONENTS ---

/**
 * Personalizable Stat Card for Dashboard
 */
function StatCard({ label, value, icon: Icon, settings, blockSettings, shadowStyle, borderRadius }: any) {
  const cardBg = blockSettings.card_bg || 'var(--color-background)';
  const iconColor = blockSettings.icon_color || 'var(--color-primary)';
  const iconBg = blockSettings.icon_bg || 'rgba(var(--color-primary-rgb), 0.1)';
  const labelColor = blockSettings.label_color || 'var(--color-secondary)';
  const valueColor = blockSettings.value_color || 'var(--color-heading)';
  const labelSize = blockSettings.label_size || 12;
  const valueSize = blockSettings.value_size || 20;

  return (
    <div
      className={cn(
        "border flex items-center gap-4 transition-all",
        getShadowClass(shadowStyle)
      )}
      style={{
        borderRadius: `${borderRadius}px`,
        backgroundColor: cardBg,
        borderColor: 'var(--color-border)',
        padding: `${blockSettings.padding || 20}px`
      }}
    >
      <div
        className="p-3 rounded-xl flex-shrink-0"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p
          className="font-semibold uppercase tracking-wider mb-0.5"
          style={{ color: labelColor, fontSize: `${labelSize}px` }}
        >
          {label}
        </p>
        <p
          className="font-bold leading-tight"
          style={{ color: valueColor, fontSize: `${valueSize}px` }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// --- BLOCKS ---

/**
 * Account Navigation Sidebar
 */
function AccountNavBlock({ settings, activeTab, onTabChange, sectionSettings }: { settings: any; activeTab: string; onTabChange: (tab: string) => void, sectionSettings: any }) {
  const navItems = [
    { id: 'dashboard', label: settings.dashboard_label || 'Dashboard', icon: User },
    { id: 'profile', label: settings.profile_label || 'Profile', icon: Shield },
    { id: 'orders', label: settings.orders_label || 'Orders', icon: Package },
    { id: 'addresses', label: settings.addresses_label || 'Addresses', icon: MapPin },
  ];

  const borderRadius = settings.border_radius ?? sectionSettings.border_radius ?? 12;

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        const activeIconColor = settings.active_icon_color || '#FFFFFF';
        const defaultIconColor = settings.icon_color || '#9CA3AF';

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 text-left transition-all group",
              isActive
                ? (settings.use_soft_active ? "font-semibold" : "text-white font-medium")
                : "",
              isActive && getShadowClass(settings.active_shadow)
            )}
            style={{
              borderRadius: `${borderRadius}px`,
              backgroundColor: isActive
                ? (settings.active_color || (settings.use_soft_active ? 'var(--color-border)' : 'var(--color-primary)'))
                : undefined,
              color: isActive && settings.use_soft_active
                ? (settings.active_text_color || 'var(--color-heading)')
                : (!isActive ? 'var(--color-secondary)' : undefined),
              fontSize: `${settings.font_size || 14}px`
            }}
          >
            <div className="flex items-center gap-3">
              <Icon
                className="w-5 h-5 transition-colors"
                style={{ color: isActive ? activeIconColor : defaultIconColor }}
              />
              <span>{item.label}</span>
            </div>
            {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
          </button>
        );
      })}

      <div className="border-t my-4" style={{ borderColor: 'var(--color-border)' }} />

      <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 transition-all hover:opacity-70" style={{ borderRadius: `${borderRadius}px` }}>
        <LogOut className="w-5 h-5" />
        <span style={{ fontSize: `${settings.font_size || 14}px` }}>Sign Out</span>
      </button>
    </nav>
  );
}

/**
 * Profile Block
 */
function ProfileBlock({ settings, sectionSettings }: { settings: any, sectionSettings: any }) {
  const [editing, setEditing] = useState(false);
  const { customer } = useCustomerAuth();
  const { isEditorMode } = useEditor();
  const activeCustomer = isEditorMode ? MOCK_CUSTOMER : (customer || MOCK_CUSTOMER);

  const [formData, setFormData] = useState({
    firstName: activeCustomer?.firstName || '',
    lastName: activeCustomer?.lastName || '',
    email: activeCustomer?.email || '',
    phone: activeCustomer?.phone || '',
  });

  const borderRadius = settings.border_radius ?? sectionSettings.border_radius ?? 12;
  const shadowClass = getShadowClass(settings.shadow_style || sectionSettings.shadow_style);

  return (
    <div
      className={cn("border overflow-hidden", shadowClass)}
      style={{ borderRadius: `${borderRadius}px`, backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
    >
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-heading)', fontFamily: 'var(--font-heading)' }}>Personal Information</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="p-6">
        {editing ? (
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase mb-1 opacity-50" style={{ color: 'var(--color-text)' }}>First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-heading)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase mb-1 opacity-50" style={{ color: 'var(--color-text)' }}>Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-heading)' }}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1 opacity-50" style={{ color: 'var(--color-text)' }}>Email</label>
              <input
                type="email"
                readOnly
                value={formData.email}
                className="w-full px-4 py-2 border rounded-lg cursor-not-allowed opacity-50"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-bold text-white transition active:scale-95"
              style={{ backgroundColor: settings.button_color || 'var(--color-primary)' }}
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p className="text-xs font-semibold uppercase opacity-50" style={{ color: 'var(--color-text)' }}>First Name</p>
              <p className="font-medium mt-1" style={{ color: 'var(--color-heading)' }}>{formData.firstName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase opacity-50" style={{ color: 'var(--color-text)' }}>Last Name</p>
              <p className="font-medium mt-1" style={{ color: 'var(--color-heading)' }}>{formData.lastName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase opacity-50" style={{ color: 'var(--color-text)' }}>Email Address</p>
              <p className="font-medium mt-1" style={{ color: 'var(--color-heading)' }}>{formData.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase opacity-50" style={{ color: 'var(--color-text)' }}>Status</p>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-100 mt-1">
                Verified
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Advanced Order History Block
 */
function OrdersBlock({ settings, sectionSettings, hideFilters = false }: { settings: any, sectionSettings: any, hideFilters?: boolean }) {
  const { storeConfig } = useTheme();
  const { isEditorMode } = useEditor();
  const currency = storeConfig?.currency || 'NGN';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (isEditorMode) {
      setOrders(MOCK_ORDERS);
    }
  }, [isEditorMode]);

  const itemsPerPage = hideFilters ? (settings.dashboard_items || 3) : (settings.items_per_page || 5);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(amount);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
      case 'processing': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'border opacity-70';
    }
  };

  const borderRadius = settings.border_radius ?? sectionSettings.border_radius ?? 12;
  const shadowClass = getShadowClass(settings.shadow_style || sectionSettings.shadow_style);

  // Table styling extraction
  const tableBg = settings.table_bg || 'var(--color-background)';
  const headerBg = settings.header_bg || 'var(--color-border)';
  const headerTextColor = settings.header_text_color || 'var(--color-secondary)';
  const rowTextColor = settings.row_text_color || 'var(--color-heading)';
  const rowBorderColor = settings.row_border_color || 'var(--color-border)';

  return (
    <div className="space-y-6">
      {!hideFilters && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold" style={{ color: settings.title_color }}>{settings.title || 'Order History'}</h2>

          <div className="flex items-center gap-3">
            {settings.search_enabled && (
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border rounded-lg text-sm outline-none focus:border-primary w-48 transition-all"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-heading)' }}
                />
              </div>
            )}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary appearance-none min-w-[110px]"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-heading)' }}
            >
              <option value="all">All States</option>
              <option value="delivered">Delivered</option>
              <option value="processing">Processing</option>
            </select>
          </div>
        </div>
      )}

      {hideFilters && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: settings.dashboard_title_color || 'var(--color-heading)' }}>
            {settings.dashboard_title || 'Recent Orders'}
          </h2>
          <button onClick={() => window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'orders' }))} className="text-sm text-primary font-medium hover:underline">
            View all
          </button>
        </div>
      )}

      <div
        className={cn("border overflow-hidden", shadowClass)}
        style={{ borderRadius: `${borderRadius}px`, backgroundColor: tableBg, borderColor: 'var(--color-border)' }}
      >
        {paginatedOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead style={{ backgroundColor: headerBg }}>
                <tr className="border-b" style={{ borderColor: rowBorderColor }}>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: headerTextColor }}>Order</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: headerTextColor }}>Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: headerTextColor }}>Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right" style={{ color: headerTextColor }}>Total</th>
                  <th className="px-6 py-4 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: rowBorderColor }}>
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:opacity-80">
                    <td className="px-6 py-4">
                      <span className="font-bold" style={{ color: rowTextColor }}>{order.id}</span>
                      <p className="text-[10px] mt-0.5 opacity-50" style={{ color: 'var(--color-text)' }}>{order.items} items</p>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: rowTextColor }}>
                      {new Date(order.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border", getStatusColor(order.status))}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold" style={{ color: rowTextColor }}>
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="opacity-30 hover:opacity-100 transition-opacity p-1"
                        style={{ color: 'var(--color-text)' }}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: 'var(--color-text)' }} />
            <h3 className="text-base font-bold" style={{ color: 'var(--color-heading)' }}>No orders found</h3>
            <p className="text-sm opacity-50 max-w-[200px] mx-auto" style={{ color: 'var(--color-text)' }}>Try adjusting your filters.</p>
          </div>
        )}

        {!hideFilters && totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="text-xs font-bold hover:opacity-100 disabled:opacity-30 uppercase tracking-widest transition-opacity opacity-50"
              style={{ color: 'var(--color-text)' }}
            >
              Prev
            </button>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--color-text)' }}>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="text-xs font-bold hover:opacity-100 disabled:opacity-30 uppercase tracking-widest transition-opacity opacity-50"
              style={{ color: 'var(--color-text)' }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Report Block (Summary Stats)
 */
function ReportBlock({ settings, sectionSettings }: { settings: any, sectionSettings: any }) {
  const { customer } = useCustomerAuth();
  const { isEditorMode } = useEditor();

  const totalOrders = isEditorMode ? "24" : (customer?.totalOrders || "0");
  const totalSpent = isEditorMode ? "₦145,000" : (customer?.totalSpentFormatted || "₦0");
  const loyaltySavings = isEditorMode ? "₦12,500" : (customer?.loyaltyPointsFormatted || "₦0");

  const shadowStyle = settings.shadow_style || sectionSettings.shadow_style;
  const borderRadius = settings.border_radius ?? sectionSettings.border_radius ?? 12;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {settings.show_total_orders !== false && (
        <StatCard
          label={settings.orders_label || "Total Orders"}
          value={totalOrders}
          icon={Package}
          blockSettings={settings}
          shadowStyle={shadowStyle}
          borderRadius={borderRadius}
        />
      )}
      {settings.show_total_spent !== false && (
        <StatCard
          label={settings.spent_label || "Total Spent"}
          value={totalSpent}
          icon={TrendingUp}
          blockSettings={settings}
          shadowStyle={shadowStyle}
          borderRadius={borderRadius}
        />
      )}
      {settings.show_loyalty !== false && (
        <StatCard
          label={settings.loyalty_label || "Loyalty Savings"}
          value={loyaltySavings}
          icon={ArrowUpRight}
          blockSettings={settings}
          shadowStyle={shadowStyle}
          borderRadius={borderRadius}
        />
      )}
    </div>
  );
}

/**
 * Advanced Addresses Block
 */
function AddressesBlock({ settings, sectionSettings }: { settings: any, sectionSettings: any }) {
  const { customer } = useCustomerAuth();
  const { isEditorMode } = useEditor();
  const addresses = isEditorMode ? MOCK_CUSTOMER.addresses : (customer?.addresses || []);

  const borderRadius = settings.border_radius ?? sectionSettings.border_radius ?? 12;
  const shadowClass = getShadowClass(settings.shadow_style || sectionSettings.shadow_style);

  // Granular styling
  const cardBg = settings.card_bg || 'var(--color-background)';
  const titleColor = settings.title_color || 'var(--color-heading)';
  const textColor = settings.text_color || 'var(--color-secondary)';
  const iconColor = settings.icon_color || 'var(--color-border)';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-heading)', fontFamily: 'var(--font-heading)' }}>{settings.title || 'Saved Addresses'}</h2>
        {!settings.hide_add_button && (
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold hover:opacity-70 transition-opacity" style={{ borderColor: 'var(--color-border)', color: 'var(--color-heading)' }}>
            <Plus className="w-4 h-4" />
            Add New
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr: any) => (
          <div
            key={addr.id}
            className={cn("border p-6 group transition-all", shadowClass)}
            style={{ borderRadius: `${borderRadius}px`, backgroundColor: cardBg, borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: iconColor }} />
                <h3 className="font-bold" style={{ color: titleColor }}>{addr.name}</h3>
              </div>
              {addr.isDefault && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded border opacity-50" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>Default</span>
              )}
            </div>
            <p className="text-xs leading-relaxed mb-6" style={{ color: textColor }}>{addr.address}</p>
            <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button className="text-[10px] font-bold uppercase tracking-widest hover:opacity-100 transition-opacity opacity-50" style={{ color: 'var(--color-text)' }}>Edit Info</button>
              <button className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN SECTION ---

export default function AccountSection({ settings, blocks }: { settings: any; blocks?: any[] }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isEditorMode } = useEditor();

  // Listen for tab switch events from dashboard
  useEffect(() => {
    const handleSwitch = (e: any) => setActiveTab(e.detail);
    window.addEventListener('switch-tab', handleSwitch);
    return () => window.removeEventListener('switch-tab', handleSwitch);
  }, []);

  const sectionProps = {
    shadow_style: settings.shadow_style || 'none',
    border_radius: settings.border_radius ?? 12
  };

  const defaultBlocks = [
    { type: 'account_nav', settings: {} },
    { type: 'report', settings: {} },
    { type: 'orders', settings: { dashboard_title: 'Recent Orders', dashboard_items: 3 } },
    { type: 'addresses', settings: { hide_add_button: true } },
  ];

  const actualBlocks = blocks && blocks.length > 0 ? blocks : defaultBlocks;
  const navBlock = actualBlocks.find(b => b.type === 'account_nav');
  const reportBlock = actualBlocks.find(b => b.type === 'report');
  const recentOrdersBlock = actualBlocks.find(b => b.type === 'orders');
  const summaryAddressesBlock = actualBlocks.find(b => b.type === 'addresses');

  const profileBlock = actualBlocks.find(b => b.type === 'profile');
  const fullOrdersBlock = actualBlocks.find(b => b.type === 'orders');
  const fullAddressesBlock = actualBlocks.find(b => b.type === 'addresses');

  return (
    <section
      className="py-12 min-h-screen transition-all"
      style={{
        paddingTop: `${settings.padding_top}px`,
        paddingBottom: `${settings.padding_bottom}px`,
        backgroundColor: settings.background_color || 'var(--color-background)'
      }}
    >
      <div
        className="container mx-auto px-4"
        style={{ maxWidth: settings.content_width || '1200px' }}
      >
        {settings.show_header && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: settings.title_color || 'var(--color-heading)', fontFamily: 'var(--font-heading)' }}>
              {settings.title || 'My Account'}
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--color-secondary)' }}>Manage your orders and account settings.</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div
              className={cn("border p-4", getShadowClass(settings.shadow_style))}
              style={{ borderRadius: `${sectionProps.border_radius}px`, backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
            >
              {navBlock && (
                <AccountNavBlock
                  settings={navBlock.settings}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  sectionSettings={sectionProps}
                />
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 max-w-5xl space-y-8">
            {activeTab === 'dashboard' && (
              <>
                {reportBlock && <ReportBlock settings={reportBlock.settings} sectionSettings={sectionProps} />}
                <div className="space-y-10">
                  {recentOrdersBlock && settings.show_recent_orders !== false && (
                    <OrdersBlock settings={recentOrdersBlock.settings} sectionSettings={sectionProps} hideFilters={true} />
                  )}
                  {summaryAddressesBlock && settings.show_recent_addresses !== false && (
                    <AddressesBlock settings={summaryAddressesBlock.settings} sectionSettings={sectionProps} />
                  )}
                </div>
              </>
            )}

            {activeTab === 'profile' && (
              <ProfileBlock settings={profileBlock?.settings || {}} sectionSettings={sectionProps} />
            )}

            {activeTab === 'orders' && (
              <OrdersBlock settings={fullOrdersBlock?.settings || {}} sectionSettings={sectionProps} />
            )}

            {activeTab === 'addresses' && (
              <AddressesBlock settings={fullAddressesBlock?.settings || {}} sectionSettings={sectionProps} />
            )}
          </div>
        </div>
      </div>

      {/* 
         Mock Modal Styling Integration 
         Note: The actual modal would be rendered by a separate component, 
         but we expose the styles here at the section level schema.
      */}
    </section>
  );
}

// --- SCHEMA ---
export const schema = {
  type: 'account-section',
  name: 'Account Dashboard',
  settings: [
    { type: 'header', content: 'Layout' },
    { type: 'text', id: 'content_width', label: 'Max Width (px)', default: '1200' },
    { type: 'range', id: 'padding_top', label: 'Padding Top', min: 0, max: 100, step: 4, default: 48 },
    { type: 'range', id: 'padding_bottom', label: 'Padding Bottom', min: 0, max: 100, step: 4, default: 48 },
    { type: 'header', content: 'Design' },
    {
      type: 'select', id: 'shadow_style', label: 'Shadow Effect', options: [
        { value: 'none', label: 'None (Clean)' },
        { value: 'subtle', label: 'Subtle' },
        { value: 'smooth', label: 'Smooth' }
      ], default: 'none'
    },
    { type: 'range', id: 'border_radius', label: 'Border Radius', min: 0, max: 30, step: 2, default: 12 },
    { type: 'color', id: 'background_color', label: 'Background', default: '#FFFFFF' },
    { type: 'header', content: 'Dashboard Content' },
    { type: 'checkbox', id: 'show_recent_orders', label: 'Show Recent Orders', default: true },
    { type: 'checkbox', id: 'show_recent_addresses', label: 'Show Saved Addresses', default: true },
    { type: 'header', content: 'Modal Styling (Add Address)' },
    { type: 'text', id: 'modal_title', label: 'Modal Title', default: 'Add New Address' },
    { type: 'text', id: 'modal_cancel_label', label: 'Cancel Button Label', default: 'Cancel' },
    { type: 'text', id: 'modal_submit_label', label: 'Submit Button Label', default: 'Save Address' },
    { type: 'color', id: 'modal_bg', label: 'Overlay Background', default: 'rgba(0,0,0,0.5)' },
    { type: 'color', id: 'modal_content_bg', label: 'Modal Background', default: '#FFFFFF' },
    { type: 'range', id: 'modal_radius', label: 'Modal Radius', min: 0, max: 40, default: 20 },
    { type: 'color', id: 'modal_primary_button_bg', label: 'Primary Button Background', default: '#111827' },
    { type: 'color', id: 'modal_primary_button_text', label: 'Primary Button Text', default: '#FFFFFF' },
    { type: 'color', id: 'modal_title_color', label: 'Title Color', default: '#111827' },
    { type: 'color', id: 'modal_input_bg', label: 'Input Background', default: '#F9FAFB' },
    { type: 'color', id: 'modal_input_border', label: 'Input Border Color', default: '#E5E7EB' },
    { type: 'header', content: 'Header' },
    { type: 'checkbox', id: 'show_header', label: 'Show Title', default: true },
    { type: 'text', id: 'title', label: 'Title', default: 'My Account' },
    { type: 'color', id: 'title_color', label: 'Title Color' }
  ],
  blocks: [
    {
      type: 'account_nav',
      name: 'Navigation Sidebar',
      limit: 1,
      allow_delete: false,
      settings: [
        { type: 'text', id: 'dashboard_label', label: 'Dashboard Label', default: 'Dashboard' },
        { type: 'text', id: 'profile_label', label: 'Profile Label', default: 'Profile' },
        { type: 'text', id: 'orders_label', label: 'Orders Label', default: 'Orders' },
        { type: 'text', id: 'addresses_label', label: 'Addresses Label', default: 'Addresses' },
        { type: 'header', content: 'Icon Styling' },
        { type: 'color', id: 'icon_color', label: 'Default Icon Color', default: '#9CA3AF' },
        { type: 'color', id: 'active_icon_color', label: 'Active Icon Color', default: '#FFFFFF' },
        { type: 'header', content: 'Active State' },
        { type: 'checkbox', id: 'use_soft_active', label: 'Use Softer Active Style', default: false },
        { type: 'color', id: 'active_color', label: 'Active Background' },
        { type: 'color', id: 'active_text_color', label: 'Active Text Color' },
        {
          type: 'select', id: 'active_shadow', label: 'Active Item Shadow', options: [
            { value: 'none', label: 'None' },
            { value: 'subtle', label: 'Subtle' }
          ], default: 'none'
        }
      ]
    },
    {
      type: 'report',
      name: 'Overview Stats',
      settings: [
        { type: 'header', content: 'Visibility' },
        { type: 'checkbox', id: 'show_total_orders', label: 'Show Total Orders', default: true },
        { type: 'checkbox', id: 'show_total_spent', label: 'Show Total Spent', default: true },
        { type: 'checkbox', id: 'show_loyalty', label: 'Show Loyalty Savings', default: true },
        { type: 'header', content: 'Labels' },
        { type: 'text', id: 'orders_label', label: 'Orders Label', default: 'Total Orders' },
        { type: 'text', id: 'spent_label', label: 'Spent Label', default: 'Total Spent' },
        { type: 'text', id: 'loyalty_label', label: 'Loyalty Label', default: 'Loyalty Savings' },
        { type: 'header', content: 'Design' },
        { type: 'color', id: 'card_bg', label: 'Card Background', default: '#FFFFFF' },
        { type: 'color', id: 'icon_color', label: 'Icon Color', default: '#2563EB' },
        { type: 'color', id: 'icon_bg', label: 'Icon Background', default: '#EFF6FF' },
        { type: 'color', id: 'label_color', label: 'Label Color', default: '#6B7280' },
        { type: 'color', id: 'value_color', label: 'Value Color', default: '#111827' },
        { type: 'range', id: 'label_size', label: 'Label Font Size', min: 10, max: 16, step: 1, default: 12 },
        { type: 'range', id: 'value_size', label: 'Value Font Size', min: 16, max: 32, step: 2, default: 20 },
        { type: 'range', id: 'padding', label: 'Card Padding', min: 12, max: 32, step: 4, default: 20 }
      ]
    },
    {
      type: 'profile',
      name: 'Profile Settings',
      limit: 1,
      allow_delete: false,
      settings: [
        { type: 'color', id: 'button_color', label: 'Update Button Color' }
      ]
    },
    {
      type: 'orders',
      name: 'Order History',
      limit: 1,
      allow_delete: false,
      settings: [
        { type: 'text', id: 'title', label: 'Page Title', default: 'Order History' },
        { type: 'color', id: 'title_color', label: 'Title Color', default: '#111827' },
        { type: 'text', id: 'dashboard_title', label: 'Dashboard Title', default: 'Recent Orders' },
        { type: 'color', id: 'dashboard_title_color', label: 'Dashboard Title Color' },
        { type: 'range', id: 'dashboard_items', label: 'Items on Dashboard', min: 1, max: 5, default: 3 },
        { type: 'range', id: 'items_per_page', label: 'Items per Page', min: 5, max: 20, step: 1, default: 10 },
        { type: 'checkbox', id: 'search_enabled', label: 'Enable Search', default: true },
        { type: 'header', content: 'Table Styling' },
        { type: 'color', id: 'table_bg', label: 'Table Background', default: '#FFFFFF' },
        { type: 'color', id: 'header_bg', label: 'Header Background', default: '#F9FAFB' },
        { type: 'color', id: 'header_text_color', label: 'Header Text Color', default: '#9CA3AF' },
        { type: 'color', id: 'row_text_color', label: 'Row Text Color', default: '#111827' },
        { type: 'color', id: 'row_border_color', label: 'Row Border Color', default: '#F3F4F6' }
      ]
    },
    {
      type: 'addresses',
      name: 'Shipping Addresses',
      limit: 1,
      allow_delete: false,
      settings: [
        { type: 'text', id: 'title', label: 'Block Title', default: 'Saved Addresses' },
        { type: 'header', content: 'Card Style Override' },
        { type: 'color', id: 'card_bg', label: 'Card Background', default: '#FFFFFF' },
        { type: 'color', id: 'title_color', label: 'Title Color', default: '#111827' },
        { type: 'color', id: 'text_color', label: 'Text Color', default: '#6B7280' },
        { type: 'color', id: 'icon_color', label: 'Icon Color', default: '#D1D5DB' }
      ]
    }
  ]
};
