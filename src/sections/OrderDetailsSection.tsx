'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useTheme,
  useCustomerAuth,
  useEditor,
  getOrder,
  cn,
  getStorePermalink,
} from '@zevcommerce/storefront-api';
import { ArrowLeft, Package, MapPin, CreditCard, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { formatPrice } from '../helpers/format-price';

// Helper to format currency
const useCurrencyFormatter = () => {
  const { storeConfig } = useTheme();
  const currency = storeConfig?.currency || 'NGN';
  return (amount: number) => formatPrice(amount, currency);
};

// --- BLOCKS ---

const MOCK_ORDER = {
  id: 'mock-order-1',
  orderNumber: '1001',
  paymentStatus: 'PAID',
  createdAt: new Date().toISOString(),
  items: [
    { name: 'Classic T-Shirt', quantity: 2, price: 5000, variantName: 'Size: M', image: '' },
    { name: 'Denim Jeans', quantity: 1, price: 15000, variantName: 'Size: 32', image: '' }
  ],
  itemsTotal: 25000,
  shippingTotal: 2000,
  taxTotal: 1875,
  totalAmount: 28875,
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Lekki Phase 1',
    city: 'Lagos',
    province: 'Lagos',
    country: 'Nigeria',
    phone: '+234 800 123 4567'
  },
  fulfillmentStatus: 'Unfulfilled'
};

function OrderHeaderBlock({ settings, order }: { settings: any, order: any }) {
  const router = useRouter();
  const params = useParams();
  const domain = params?.domain as string;

  return (
    <div className="mb-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-6 transition-opacity"
        style={{ color: 'var(--color-text)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        {settings.back_label || 'Back to Orders'}
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--color-heading)', fontFamily: 'var(--font-heading)' }}>
            Order #{order.orderNumber}
            <span
              className="text-sm px-3 py-1 rounded-full font-medium border"
              style={{
                color: order.paymentStatus === 'PAID' ? settings.badge_paid_color : settings.badge_unpaid_color,
                borderColor: order.paymentStatus === 'PAID' ? `${settings.badge_paid_color}40` : `${settings.badge_unpaid_color}40`,
                backgroundColor: order.paymentStatus === 'PAID' ? `${settings.badge_paid_color}10` : `${settings.badge_unpaid_color}10`
              }}
            >
              {order.paymentStatus}
            </span>
          </h1>
          <p className="mt-2 flex items-center gap-2 opacity-60" style={{ color: 'var(--color-text)' }}>
            <Clock className="w-4 h-4" />
            Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function OrderItemsBlock({ settings, order }: { settings: any, order: any }) {
  const formatPrice = useCurrencyFormatter();

  return (
    <div className="rounded-xl border overflow-hidden mb-8" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-border)' }}>
        <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--color-heading)' }}>
          <Package className="w-5 h-5 opacity-40" style={{ color: 'var(--color-text)' }} />
          {settings.title || 'Items'} ({order.items?.length || 0})
        </h3>
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
        {order.items?.map((item: any, idx: number) => (
          <div key={idx} className="p-6 flex items-start gap-4 transition hover:opacity-80" style={{ borderColor: 'var(--color-border)' }}>
            {settings.show_images && (
              <div className="w-20 h-20 rounded-lg flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-20" style={{ color: 'var(--color-text)' }}>
                    <Package className="w-8 h-8" />
                  </div>
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate" style={{ color: 'var(--color-heading)' }}>{item.name}</h4>
              <p className="text-sm mt-1 opacity-60" style={{ color: 'var(--color-text)' }}>Quantity: {item.quantity}</p>
              {item.variantName && <p className="text-xs mt-1 opacity-40" style={{ color: 'var(--color-text)' }}>{item.variantName}</p>}
            </div>
            <div className="text-right">
              <p className="font-bold" style={{ color: 'var(--color-heading)' }}>{formatPrice(item.price * item.quantity)}</p>
              {item.quantity > 1 && (
                <p className="text-xs mt-1 opacity-60" style={{ color: 'var(--color-text)' }}>{formatPrice(item.price)} each</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderSummaryBlock({ settings, order }: { settings: any, order: any }) {
  const formatPrice = useCurrencyFormatter();

  return (
    <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-border)' }}>
        <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--color-heading)' }}>
          <CreditCard className="w-5 h-5 opacity-40" style={{ color: 'var(--color-text)' }} />
          {settings.title || 'Summary'}
        </h3>
      </div>
      <div className="p-6 space-y-3">
        <div className="flex justify-between text-sm opacity-70" style={{ color: 'var(--color-text)' }}>
          <span>Subtotal</span>
          <span>{formatPrice(order.itemsTotal || 0)}</span>
        </div>
        <div className="flex justify-between text-sm opacity-70" style={{ color: 'var(--color-text)' }}>
          <span>Shipping</span>
          <span>{formatPrice(order.shippingTotal || 0)}</span>
        </div>
        <div className="flex justify-between text-sm opacity-70" style={{ color: 'var(--color-text)' }}>
          <span>Tax</span>
          <span>{formatPrice(order.taxTotal || 0)}</span>
        </div>
        <div
          className="border-t pt-3 flex justify-between font-bold text-lg"
          style={{ color: settings.total_color || 'var(--color-heading)', borderColor: 'var(--color-border)' }}
        >
          <span>Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}

function OrderAddressBlock({ settings, order }: { settings: any, order: any }) {
  // Use shipping address or fallback to customer info
  const shipping = order.shippingAddress || {};
  const billing = order.billingAddress || shipping; // Fallback logic

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-border)' }}>
          <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--color-heading)' }}>
            <MapPin className="w-5 h-5 opacity-40" style={{ color: 'var(--color-text)' }} />
            {settings.shipping_title || 'Shipping Address'}
          </h3>
        </div>
        <div className="p-6 text-sm leading-relaxed opacity-70" style={{ color: 'var(--color-text)' }}>
          <p className="font-medium mb-1 opacity-100" style={{ color: 'var(--color-heading)' }}>{shipping.firstName || order.customer?.firstName} {shipping.lastName || order.customer?.lastName}</p>
          <p>{shipping.address1}</p>
          {shipping.address2 && <p>{shipping.address2}</p>}
          <p>{shipping.city}, {shipping.province}</p>
          <p>{shipping.country}</p>
          <p className="mt-2 opacity-60">{shipping.phone || order.customer?.phone}</p>
        </div>
      </div>

      {/* Optional: Show Billing if different, or just generic Info */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-border)' }}>
          <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--color-heading)' }}>
            <Truck className="w-5 h-5 opacity-40" style={{ color: 'var(--color-text)' }} />
            {settings.delivery_title || 'Delivery Info'}
          </h3>
        </div>
        <div className="p-6 text-sm leading-relaxed opacity-70" style={{ color: 'var(--color-text)' }}>
          <p className="mb-2"><span className="font-medium" style={{ color: 'var(--color-heading)' }}>Method:</span> Standard Delivery</p>
          <p className="mb-2">
            <span className="font-medium" style={{ color: 'var(--color-heading)' }}>Status: </span>
            <span className="capitalize">{order.fulfillmentStatus || 'Unfulfilled'}</span>
          </p>
          {order.trackingNumber && (
            <p><span className="font-medium" style={{ color: 'var(--color-heading)' }}>Tracking:</span> {order.trackingNumber}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- MAIN SECTION ---

const BLOCKS: Record<string, React.FC<any>> = {
  order_header: OrderHeaderBlock,
  order_items: OrderItemsBlock,
  order_summary: OrderSummaryBlock,
  order_address: OrderAddressBlock,
};

export default function OrderDetailsSection({ settings, blocks }: { settings: any, blocks?: any[] }) {
  const params = useParams();
  const domain = params?.domain as string;
  const orderId = params?.id as string;
  const { isEditorMode } = useEditor();
  const router = useRouter();

  const { data: realOrder, isLoading } = useQuery({
    queryKey: ['order-details', domain, orderId],
    queryFn: () => getOrder(domain, orderId),
    enabled: !!domain && !!orderId && !isEditorMode
  });

  const order = isEditorMode ? MOCK_ORDER : realOrder;

  if (isLoading && !isEditorMode) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order && !isEditorMode) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
        <XCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-heading)' }}>Order Not Found</h2>
        <p className="opacity-60 max-w-md" style={{ color: 'var(--color-text)' }}>We couldn't find the order you're looking for.</p>
        <button
          onClick={() => router.push('/account')}
          className="mt-6 text-primary font-medium hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Account
        </button>
      </div>
    );
  }

  const defaultBlocks = [
    { type: 'order_header', settings: {} },
    { type: 'order_address', settings: {} },
    { type: 'order_items', settings: { show_images: true } },
    { type: 'order_summary', settings: { title: 'Order Summary' } },
  ];

  const activeBlocks = blocks && blocks.length > 0 ? blocks : defaultBlocks;
  const headerBlock = activeBlocks.find(b => b.type === 'order_header');
  const addressBlock = activeBlocks.find(b => b.type === 'order_address');
  const itemsBlock = activeBlocks.find(b => b.type === 'order_items');
  const summaryBlock = activeBlocks.find(b => b.type === 'order_summary');

  return (
    <section
      className="py-12 min-h-screen"
      style={{
        paddingTop: `${settings.padding_top}px`,
        paddingBottom: `${settings.padding_bottom}px`,
        backgroundColor: settings.background_color || 'var(--color-background)'
      }}
    >
      <div
        className="container mx-auto px-4"
        style={{ maxWidth: settings.content_width || '1152px' }}
      >
        {headerBlock && <OrderHeaderBlock settings={headerBlock.settings} order={order} />}

        {addressBlock && <OrderAddressBlock settings={addressBlock.settings} order={order} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {itemsBlock && <OrderItemsBlock settings={itemsBlock.settings} order={order} />}
          </div>
          <div className="lg:col-span-1">
            {summaryBlock && <OrderSummaryBlock settings={summaryBlock.settings} order={order} />}
          </div>
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'order-details-section',
  name: 'Order Details',
  settings: [
    { type: 'header', content: 'Layout' },
    { type: 'text', id: 'content_width', label: 'Max Width (px)', default: '1152' },
    { type: 'range', id: 'padding_top', label: 'Padding Top', min: 0, max: 100, step: 4, default: 48 },
    { type: 'range', id: 'padding_bottom', label: 'Padding Bottom', min: 0, max: 100, step: 4, default: 48 },
    { type: 'color', id: 'background_color', label: 'Section Background', default: '#F9FAFB' }
  ],
  blocks: [
    {
      type: 'order_header',
      name: 'Order Header',
      limit: 1,
      allow_delete: false,
      settings: [
        { type: 'text', id: 'back_label', label: 'Back Link Label', default: 'Back to Orders' },
        { type: 'color', id: 'badge_paid_color', label: 'Paid Badge Color', default: '#15803d' },
        { type: 'color', id: 'badge_unpaid_color', label: 'Unpaid Badge Color', default: '#a16207' }
      ]
    },
    {
      type: 'order_items',
      name: 'Order Items List',
      limit: 1,
      allow_delete: false,
      settings: [
        { type: 'text', id: 'title', label: 'Block Title', default: 'Items' },
        { type: 'checkbox', id: 'show_images', label: 'Show Product Images', default: true }
      ]
    },
    {
      type: 'order_summary',
      name: 'Order Summary Card',
      limit: 1,
      allow_delete: false,
      settings: [
        { type: 'text', id: 'title', label: 'Block Title', default: 'Order Summary' },
        { type: 'color', id: 'total_color', label: 'Total Amount Color', default: '#111827' }
      ]
    },
    {
      type: 'order_address',
      name: 'Shipping & Delivery Info',
      limit: 1,
      allow_delete: false,
      settings: [
        { type: 'text', id: 'shipping_title', label: 'Shipping Title', default: 'Shipping Address' },
        { type: 'text', id: 'delivery_title', label: 'Delivery Title', default: 'Delivery Info' }
      ]
    }
  ]
};
