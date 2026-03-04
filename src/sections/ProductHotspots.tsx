'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme, getProduct, cn } from '@zevcommerce/storefront-api';
import { Plus } from 'lucide-react';
import { formatPrice } from '../helpers/format-price';

// Single Hotspot Component
function HotspotDot({ block, domain }: { block: any, domain: string }) {
  const [product, setProduct] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { storeConfig } = useTheme();

  useEffect(() => {
    async function fetch() {
      if (block.settings.product) {
        try {
          const data = await getProduct(domain, block.settings.product);
          setProduct(data);
        } catch (e) { /* ignore */ }
      }
    }
    fetch();
  }, [block.settings.product, domain]);

  if (!product) return null;

  return (
    <div
      className="absolute group"
      style={{ top: `${block.settings.position_top}%`, left: `${block.settings.position_left}%` }}
    >
      {/* The Dot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-10"
        style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-heading)' }}
        aria-label={`View ${product.title}`}
      >
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: block.settings.color || 'var(--color-text)' }}></span>
        <div className="absolute inset-0 rounded-full opacity-20 animate-ping" style={{ backgroundColor: 'var(--color-background)' }}></div>
      </button>

      {/* The Card (Tooltip) */}
      <div className={cn(
        "absolute z-20 w-64 rounded-xl shadow-xl overflow-hidden transition-all duration-300 transform p-2",
        "bottom-full mb-4 left-1/2 -translate-x-1/2", // Position above dot centered
        "opacity-0 invisible group-hover:opacity-100 group-hover:visible hover:opacity-100 hover:visible", // Show on hover dot or card
        isOpen ? "opacity-100 visible" : "" // Toggle for mobile click
      )} style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="flex gap-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: 'var(--color-border)' }}>
            <img src={product.media?.[0]?.url} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h4 className="font-bold text-sm truncate" style={{ color: 'var(--color-heading)' }}>{product.title}</h4>
            <span className="opacity-50 text-xs mt-1">
              {formatPrice(product.price, storeConfig?.currency || 'NGN')}
            </span>
            <Link
              href={`/products/${product.handle}`}
              className="text-xs font-semibold text-primary mt-2 hover:underline flex items-center gap-1"
            >
              View Details
            </Link>
          </div>
        </div>
        {/* Triangle pointer */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 transform rotate-45" style={{ backgroundColor: 'var(--color-background)' }}></div>
      </div>
    </div>
  );
}

export default function ProductHotspots({ settings, blocks }: { settings: any, blocks: any[] }) {
  const { storeConfig } = useTheme();

  if (!settings.image?.src) {
    return (
      <div className="py-24 border-dashed border-2 m-4 rounded-xl text-center opacity-40" style={{ backgroundColor: 'var(--color-border)', borderColor: 'var(--color-border)' }}>
        Select an image to add hotspots
      </div>
    );
  }

  return (
    <section style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="relative w-full">
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
          <img
            src={settings.image.src}
            alt="Shop the look"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" style={{ opacity: (settings.overlay_opacity || 20) / 100 }}></div>

          {/* Text Content */}
          {(settings.title || settings.subheading) && (
            <div className="absolute top-12 left-8 md:top-24 md:left-24 text-white max-w-lg z-0 pointer-events-none select-none">
              {settings.subheading && <p className="uppercase tracking-widest text-sm font-semibold mb-2">{settings.subheading}</p>}
              {settings.title && <h2 className="text-4xl md:text-6xl font-bold">{settings.title}</h2>}
            </div>
          )}

          {/* Hotspots Layer */}
          <div className="absolute inset-0">
            {blocks?.map((block, idx) => (
              <HotspotDot key={block.id || idx} block={block} domain={storeConfig?.handle || ''} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'product_hotspots',
  name: 'Product Hotspots',
  settings: [
    {
      type: 'image',
      id: 'image',
      label: 'Main Image'
    },
    {
      type: 'text',
      id: 'title',
      label: 'Heading',
      default: 'Shop the look'
    },
    {
      type: 'text',
      id: 'subheading',
      label: 'Subheading'
    },
    {
      type: 'range',
      id: 'overlay_opacity',
      label: 'Overlay Opacity',
      min: 0,
      max: 90,
      step: 10,
      default: 20
    }
  ],
  blocks: [
    {
      type: 'hotspot',
      name: 'Product Dot',
      settings: [
        {
          type: 'product_picker',
          id: 'product',
          label: 'Product'
        },
        {
          type: 'range',
          id: 'position_top',
          label: 'Vertical Position (%)',
          min: 0,
          max: 100,
          step: 1,
          default: 50
        },
        {
          type: 'range',
          id: 'position_left',
          label: 'Horizontal Position (%)',
          min: 0,
          max: 100,
          step: 1,
          default: 50
        },
        {
          type: 'color',
          id: 'color',
          label: 'Dot Color',
          default: '#000000'
        }
      ]
    }
  ]
};
