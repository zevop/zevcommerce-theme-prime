import Link from 'next/link';
import { BlockRenderer, useCartStore, useTheme } from '@zevcommerce/storefront-api';

export default function CartSection({ settings, blocks }: { settings: any; blocks?: any[] }) {
  const { items, totalPrice } = useCartStore();
  const { storeConfig } = useTheme();
  const currency = storeConfig?.currency || 'NGN';

  if (items.length === 0) {
    return (
      <div className="py-24 text-center max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-black mb-6 tracking-tight" style={{ color: 'var(--color-heading)', fontFamily: 'var(--font-heading)' }}>Your cart is empty</h1>
        <p className="mb-10 max-w-md mx-auto font-medium" style={{ color: 'var(--color-secondary)' }}>
          Start adding some products to your cart to see them here!
        </p>
        <Link
          href="/collections/all"
          className="inline-flex items-center justify-center px-10 py-4 font-bold uppercase tracking-widest text-sm transition-all active:scale-[0.98]"
          style={{ backgroundColor: 'var(--color-button-bg)', color: 'var(--color-button-text)', borderRadius: 'var(--btn-primary-radius)', letterSpacing: 'var(--btn-primary-letter-spacing)' }}
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  const itemBlocks = blocks?.filter(b => b.type === 'cart_items') || [];
  const summaryBlocks = blocks?.filter(b => b.type === 'cart_summary') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-black mb-12 tracking-tight" style={{ color: 'var(--color-heading)', fontFamily: 'var(--font-heading)' }}>
        Shopping Cart
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-8">
          <BlockRenderer blocks={itemBlocks} sectionSettings={settings} />
        </div>

        <div className="lg:col-span-4 mt-16 lg:mt-0">
          <BlockRenderer blocks={summaryBlocks} sectionSettings={settings} />
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
