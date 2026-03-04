'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme, getProduct, ProductCard } from '@zevcommerce/storefront-api';
import { ArrowRight } from 'lucide-react';

export default function ProductHighlight({ settings }: { settings: any }) {
  const { storeConfig } = useTheme();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      if (!settings.product || !storeConfig?.handle) return;
      setLoading(true);
      try {
        const data = await getProduct(storeConfig.handle, settings.product);
        setProduct(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [settings.product, storeConfig?.handle]);

  // Layout logic
  const isImageRight = settings.layout === 'image_right';

  // Custom Lifestyle Image or Product Image fallback
  const displayImage = settings.image?.src || product?.media?.[0]?.url || '/placeholder-life.jpg';

  if (!settings.product && !settings.image) {
    return (
      <section className="py-16 text-center border-dashed border-2 m-4 rounded-xl" style={{ borderColor: 'var(--color-border)' }}>
        <p className="opacity-50">Configure Product Highlight (Image + Product)</p>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 overflow-hidden" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Lifestyle Image Side */}
          <div className={`relative ${isImageRight ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className={`relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl`}>
              <img
                src={displayImage}
                alt="Lifestyle"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10"></div> {/* Subtle overlay */}

              {/* Optional overlaid text if provided */}
              {(settings.heading || settings.subheading) && (
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-black/80 to-transparent text-white">
                  {settings.subheading && <p className="text-sm font-medium tracking-widest uppercase mb-2">{settings.subheading}</p>}
                  {settings.heading && <h3 className="text-3xl font-bold">{settings.heading}</h3>}
                </div>
              )}
            </div>
          </div>

          {/* Product & Context Side */}
          <div className={`space-y-8 ${isImageRight ? 'lg:order-1' : 'lg:order-2'} max-w-lg mx-auto lg:mx-0`}>
            <div className="space-y-4 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--color-heading)' }}>
                {settings.title || "Shop the Look"}
              </h2>
              <p className="text-lg leading-relaxed opacity-70">
                {settings.description || "Pair this item with your everyday style. Crafted for comfort and designed for impact."}
              </p>
            </div>

            {/* The Product Card Highlight */}
            {product ? (
              <div className="p-6 rounded-2xl border shadow-xl max-w-sm mx-auto lg:mx-0 transition-transform hover:scale-[1.02]" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                <div className="flex gap-4 items-center mb-4">
                  <div className="h-20 w-20 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: 'var(--color-border)' }}>
                    <img src={product.media?.[0]?.url || '/placeholder-product.png'} className="h-full w-full object-cover" alt="" />
                  </div>
                  <div>
                    <h4 className="font-bold line-clamp-1" style={{ color: 'var(--color-heading)' }}>{product.title}</h4>
                    <p className="opacity-60">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: storeConfig?.currency || 'NGN' }).format(product.price)}</p>
                  </div>
                </div>
                <Link
                  href={`/products/${product.handle}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl btn-primary py-4 px-6 font-medium transition-colors"
                >
                  View Product <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <div className="animate-pulse h-48 rounded-2xl" style={{ backgroundColor: 'var(--color-border)' }}></div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'product_highlight',
  name: 'Product Highlight',
  settings: [
    {
      type: 'header',
      label: 'Media'
    },
    {
      type: 'image',
      id: 'image',
      label: 'Lifestyle Image'
    },
    {
      type: 'select',
      id: 'layout',
      label: 'Desktop Layout',
      options: [
        { value: 'image_left', label: 'Image Left' },
        { value: 'image_right', label: 'Image Right' }
      ],
      default: 'image_left'
    },
    {
      type: 'header',
      label: 'Product'
    },
    {
      type: 'product_picker',
      id: 'product',
      label: 'Product',
      default: ''
    },
    {
      type: 'header',
      label: 'Content'
    },
    {
      type: 'text',
      id: 'title',
      label: 'Section Title',
      default: 'Style Inspiration'
    },
    {
      type: 'textarea',
      id: 'description',
      label: 'Section Description',
      default: 'Discover the story behind this piece.'
    },
    {
      type: 'text',
      id: 'heading',
      label: 'Image Overlay Heading',
      info: 'Optional text over the image'
    },
    {
      type: 'text',
      id: 'subheading',
      label: 'Image Overlay Subheading'
    }
  ]
};
