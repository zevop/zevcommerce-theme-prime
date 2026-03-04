'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  useTheme,
  getProduct,
  ProductDataProvider,
  useProduct,
  cn,
  useCartStore,
  BlockRenderer,
} from '@zevcommerce/storefront-api';

// Reuse existing blocks from ProductDetail logic or reimplement simplified versions for this section?
// Reimplementing simplified versions for better control within this specific section context is often safer for independent styling.

function FeaturedProductContent({ settings, blocks }: { settings: any, blocks?: any[] }) {
  const { product, loading } = useProduct();
  const { storeConfig } = useTheme();

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square rounded-xl" style={{ backgroundColor: 'var(--color-border)' }}></div>
          <div className="space-y-4 py-8">
            <div className="h-8 w-2/3 rounded" style={{ backgroundColor: 'var(--color-border)' }}></div>
            <div className="h-4 w-1/3 rounded" style={{ backgroundColor: 'var(--color-border)' }}></div>
            <div className="h-24 w-full rounded" style={{ backgroundColor: 'var(--color-border)' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const mediaPosition = settings.media_position || 'left';
  const flexDirection = mediaPosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row';
  const sectionBg = settings.background_color || 'transparent';
  const textColor = settings.text_color || 'inherit';

  const infoBlocks = blocks?.filter(b => b.type !== 'product_images') || [];
  const mediaBlocks = blocks?.filter(b => b.type === 'product_images') || [];

  // If no media block provided, fallback to a simple image
  const mainImage = product.media?.[0]?.url;

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: sectionBg, color: textColor }}>
      <div className="container mx-auto px-4">
        <div className={`flex flex-col ${flexDirection} gap-12 md:gap-16 items-center`}>
          {/* Media Column */}
          <div className="w-full md:w-1/2">
            {mediaBlocks.length > 0 ? (
              <BlockRenderer blocks={mediaBlocks} sectionSettings={settings} />
            ) : (
              <div className={cn(
                "relative overflow-hidden shadow-2xl shadow-black/5 ring-1 ring-black/5",
                settings.image_radius === 'full' ? 'rounded-full aspect-square' : `rounded-${settings.image_radius || '3xl'} aspect-square`,
                "max-w-xl mx-auto group"
              )}>
                <img
                  src={mainImage || '/placeholder-product.png'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={product.title}
                />
              </div>
            )}
          </div>

          {/* Info Column */}
          <div className="w-full md:w-1/2 text-left space-y-2 max-w-lg">
            <BlockRenderer blocks={infoBlocks} sectionSettings={settings} />

            {settings.show_view_details && (
              <div className="pt-4">
                <Link
                  href={`/products/${product.handle}`}
                  className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary hover:opacity-70 transition-all border-b-2 border-primary/20 pb-1"
                >
                  View Details
                  <span className="text-xl">→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function FeaturedProduct({ settings, blocks }: { settings: any, blocks?: any[] }) {
  const [product, setProduct] = useState<any>(null);
  const { storeConfig } = useTheme();

  // Fetch product wrapper
  useEffect(() => {
    async function fetch() {
      if (!settings.product || !storeConfig?.handle) return;
      const data = await getProduct(storeConfig.handle, settings.product); // settings.product is handle/slug
      setProduct(data);
    }
    fetch();
  }, [settings.product, storeConfig?.handle]);

  if (!settings.product) {
    return (
      <div className="py-24 text-center border-dashed border-2 m-8 rounded-3xl" style={{ backgroundColor: 'var(--color-border)', borderColor: 'var(--color-border)' }}>
        <p className="opacity-40 font-medium tracking-wide">Select a product to feature</p>
      </div>
    );
  }

  return (
    <ProductDataProvider product={product} loading={!product}>
      <FeaturedProductContent settings={settings} blocks={blocks} />
    </ProductDataProvider>
  );
}

export const schema = {
  type: 'featured_product',
  name: 'Featured Product',
  settings: [
    {
      type: 'product_picker',
      id: 'product',
      label: 'Product',
      default: ''
    },
    {
      type: 'header',
      label: 'Layout'
    },
    {
      type: 'select',
      id: 'media_position',
      label: 'Image Position',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' }
      ],
      default: 'left'
    },
    {
      type: 'select',
      id: 'image_radius',
      label: 'Image Corner Radius',
      options: [
        { value: 'none', label: 'Square' },
        { value: 'lg', label: 'Rounded' },
        { value: '3xl', label: 'Large Rounded' },
        { value: 'full', label: 'Circle' }
      ],
      default: '3xl'
    },
    {
      type: 'header',
      label: 'Content'
    },
    {
      type: 'checkbox',
      id: 'show_vendor',
      label: 'Show Vendor',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_description',
      label: 'Show Description',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_view_details',
      label: 'Show View Details Button',
      default: true
    },
    {
      type: 'header',
      label: 'Colors'
    },
    {
      type: 'color',
      id: 'background_color',
      label: 'Background',
      default: '#FFFFFF'
    },
    {
      type: 'color',
      id: 'text_color',
      label: 'Text',
      default: '#111827'
    },
    {
      type: 'color',
      id: 'button_bg',
      label: 'Button Background',
      default: '#000000'
    },
    {
      type: 'color',
      id: 'button_text',
      label: 'Button Text',
      default: '#FFFFFF'
    }
  ],
  blocks: [
    { type: 'product_images' },
    { type: 'product_title' },
    { type: 'product_price' },
    { type: 'product_variants' },
    { type: 'add_to_cart' },
    { type: 'product_description' }
  ]
};
