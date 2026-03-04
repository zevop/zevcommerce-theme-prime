import Link from 'next/link';
import { BlockRenderer, useCartStore, useTheme } from '@zevcommerce/storefront-api';

export default function CartSection({ settings, blocks }: { settings: any; blocks?: any[] }) {
  const { items, totalPrice } = useCartStore();
  const { storeConfig } = useTheme();
  const currency = storeConfig?.currency || 'NGN';

  if (items.length === 0) {
    return (
      <div className="py-24 md:py-32 text-center max-w-7xl mx-auto px-4">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-border)' }}>
          <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight" style={{ color: 'var(--color-heading)', fontFamily: 'var(--font-heading)' }}>
          Your cart is empty
        </h1>
        <p className="mb-8 max-w-sm mx-auto text-sm" style={{ color: 'var(--color-secondary)' }}>
          Looks like you haven't added anything to your cart yet. Start exploring our collection!
        </p>
        <Link
          href="/collections/all"
          className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold transition-all active:scale-[0.98] hover:opacity-90"
          style={{ backgroundColor: 'var(--color-button-bg)', color: 'var(--color-button-text)', borderRadius: 'var(--btn-primary-radius)' }}
        >
          Browse Products
        </Link>
      </div>
    )
  }

  const itemBlocks = blocks?.filter(b => b.type === 'cart_items') || [];
  const summaryBlocks = blocks?.filter(b => b.type === 'cart_summary') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-10 tracking-tight" style={{ color: 'var(--color-heading)', fontFamily: 'var(--font-heading)' }}>
        Your Cart <span className="text-base font-normal opacity-50 ml-2">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <BlockRenderer blocks={itemBlocks} sectionSettings={settings} />
        </div>

        <div className="lg:col-span-5 mt-12 lg:mt-0">
          <div className="lg:sticky lg:top-28">
            <BlockRenderer blocks={summaryBlocks} sectionSettings={settings} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const schema = {
  type: 'cart-page',
  name: 'Cart Page',
  settings: [],
  blocks: [
    {
      type: 'cart_items',
      name: 'Cart Items',
      settings: []
    },
    {
      type: 'cart_summary',
      name: 'Order Summary',
      settings: []
    }
  ],
  defaultBlocks: [
    { type: 'cart_items' },
    { type: 'cart_summary' }
  ]
};
