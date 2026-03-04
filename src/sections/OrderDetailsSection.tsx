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

// Helper to format currency
const useCurrencyFormatter = () => {
  const { storeConfig } = useTheme();
  const currency = storeConfig?.currency || 'NGN';
  return (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(amount);
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
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {settings.back_label || 'Back to Orders'}
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
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
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>

        {/* Action Button (e.g. Reorder or Download Invoice - Placeholder) */}
        {/* <button className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition">
          Download Invoice
        </button> */}
      </div>
    </div>
  );
}

function OrderItemsBlock({ settings, order }: { settings: any, order: any }) {
  const formatPrice = useCurrencyFormatter();

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-400" />
          {settings.title || 'Items'} ({order.items?.length || 0})
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {order.items?.map((item: any, idx: number) => (
          <div key={idx} className="p-6 flex items-start gap-4 hover:bg-gray-50/30 transition">
            {settings.show_images && (
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Package className="w-8 h-8" />
                  </div>
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
              <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
              {item.variantName && <p className="text-xs text-gray-400 mt-1">{item.variantName}</p>}
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
              {item.quantity > 1 && (
                <p className="text-xs text-gray-500 mt-1">{formatPrice(item.price)} each</p>
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
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gray-400" />
          {settings.title || 'Summary'}
        </h3>
      </div>
      <div className="p-6 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(order.itemsTotal || 0)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>{formatPrice(order.shippingTotal || 0)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax</span>
          <span>{formatPrice(order.taxTotal || 0)}</span>
        </div>
        <div
          className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-gray-900"
          style={{ color: settings.total_color }}
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
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            {settings.shipping_title || 'Shipping Address'}
          </h3>
        </div>
        <div className="p-6 text-sm text-gray-600 leading-relaxed">
          <p className="font-medium text-gray-900 mb-1">{shipping.firstName || order.customer?.firstName} {shipping.lastName || order.customer?.lastName}</p>
          <p>{shipping.address1}</p>
          {shipping.address2 && <p>{shipping.address2}</p>}
          <p>{shipping.city}, {shipping.province}</p>
          <p>{shipping.country}</p>
          <p className="mt-2 text-gray-500">{shipping.phone || order.customer?.phone}</p>
        </div>
      </div>

      {/* Optional: Show Billing if different, or just generic Info */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-gray-400" />
            {settings.delivery_title || 'Delivery Info'}
          </h3>
        </div>
        <div className="p-6 text-sm text-gray-600 leading-relaxed">
          <p className="mb-2"><span className="font-medium text-gray-900">Method:</span> Standard Delivery</p>
          <p className="mb-2">
            <span className="font-medium text-gray-900">Status: </span>
            <span className="capitalize">{order.fulfillmentStatus || 'Unfulfilled'}</span>
          </p>
          {order.trackingNumber && (
            <p><span className="font-medium text-gray-900">Tracking:</span> {order.trackingNumber}</p>
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
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-500 max-w-md">We couldn't find the order you're looking for.</p>
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
      className="py-12 bg-gray-50 min-h-screen"
      style={{
        paddingTop: `${settings.padding_top}px`,
        paddingBottom: `${settings.padding_bottom}px`,
        backgroundColor: settings.background_color
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
