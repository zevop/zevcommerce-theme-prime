'use client';

import { CollectionItemBlock } from '../blocks/StandardBlocks';
import { BaseCollectionItemSchema } from '../blocks/schemas';
import { useQuery } from '@tanstack/react-query';
import { getCollection } from '@zevcommerce/storefront-api';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useState, useRef } from 'react';

// Helper to resolve collection data for text/spotlight layouts that don't use the standard block
function useCollectionData(domain: string, slug: string) {
  return useQuery({
    queryKey: ['collection', domain, slug],
    queryFn: () => domain && slug ? getCollection(domain, slug) : null,
    enabled: !!domain && !!slug
  });
}

export default function CollectionList({ settings, blocks = [] }: { settings: any, blocks: any[] }) {
  const layout = settings.layout || 'grid';
  const columns = settings.columns || 3;
  const mobileLayout = settings.mobile_layout || 'carousel';

  // Resolve grid columns
  const gridClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  }[columns as 2 | 3 | 4] || 'md:grid-cols-3';

  // Extract global card settings to avoid collision with block settings (like title)
  const cardSettings = {
    image_aspect_ratio: settings.image_aspect_ratio,
    image_object_fit: settings.image_object_fit,
    image_overlay_opacity: settings.image_overlay_opacity,
    content_position: settings.content_position
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {settings.title && (
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center md:text-left">
            {settings.title}
          </h2>
        )}

        {/* Text Links Layout */}
        {layout === 'text_list' && (
          <div className="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start">
            {blocks.map((block: any, index: number) => (
              <TextLinkItem key={block.id || index} settings={block.settings} />
            ))}
          </div>
        )}

        {/* Spotlight Layout */}
        {layout === 'spotlight' && (
          <SpotlightLayout blocks={blocks} />
        )}

        {/* Grid / Bento / Editorial Layouts */}
        {(layout === 'grid' || layout === 'bento' || layout === 'editorial') && (
          <div className={`
            grid
            ${layout === 'grid' ? gridClasses : ''}
            ${layout === 'grid' && mobileLayout === 'stack' ? 'grid-cols-1' : ''}
            ${layout === 'grid' && mobileLayout === 'carousel' ? 'flex overflow-x-auto snap-x md:grid md:overflow-visible' : ''}
          `} style={{ gap: 'var(--grid-gap, 24px)' }}>
            {blocks.map((block: any, index: number) => {
              // Bento Logic: First item spans 2 rows/cols if we have enough items
              const isBentoHero = layout === 'bento' && index === 0;
              const bentoClass = isBentoHero ? 'md:col-span-2 md:row-span-2 min-h-[400px]' : 'min-h-[250px]';

              // Editorial Logic: Alternating visual style could be added here

              return (
                <div
                  key={block.id || index}
                  className={`
                    ${layout === 'bento' ? bentoClass : ''}
                    ${layout === 'grid' && mobileLayout === 'carousel' ? 'min-w-[280px] snap-center' : ''}
                    ${layout === 'editorial' ? 'flex items-center gap-6' : ''}
                    w-full
                  `}
                >
                  <CollectionItemBlock
                    settings={{ ...cardSettings, ...block.settings }}
                    className={isBentoHero ? 'h-full' : ''}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Carousel Layout (Desktop+Mobile) */}
        {layout === 'carousel' && (
          <div className="relative group">
            <div className="flex overflow-x-auto snap-x gap-6 pb-4 scrollbar-hide">
              {blocks.map((block: any, index: number) => (
                <div key={block.id || index} className="min-w-[280px] sm:min-w-[320px] snap-center">
                  <CollectionItemBlock settings={{ ...cardSettings, ...block.settings }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Sub-component for Text Links
function TextLinkItem({ settings }: { settings: any }) {
  const params = useParams();
  const domain = params?.domain as string;
  const { data: collection } = useCollectionData(domain, settings.collection);
  const title = settings.title || collection?.title || 'Collection';

  return (
    <Link
      href={collection ? `/search/${collection.slug}` : '#'}
      className="text-lg md:text-xl font-medium hover:opacity-60 transition-all flex items-center gap-2 group"
    >
      {title}
      <ArrowRight className={`h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-bold ${settings.icon_position === 'left' ? 'order-first' : ''}`} />
    </Link>
  );
}

// Sub-component for Spotlight Layout
function SpotlightLayout({ blocks }: { blocks: any[] }) {
  const [activeParams, setActiveParams] = useState(blocks[0]?.settings);
  const params = useParams();
  const domain = params?.domain as string;

  // Convert settings to a unified data structure if needed, 
  // but simpler to just use the active settings to fetch data.

  return (
    <div className="grid md:grid-cols-12 gap-8 items-center h-auto min-h-[500px]">
      {/* List Side */}
      <div className="md:col-span-4 space-y-2 order-2 md:order-1">
        {blocks.map((block: any, index: number) => (
          <button
            key={block.id || index}
            onClick={() => setActiveParams(block.settings)}
            className={`w-full text-left p-4 rounded-xl transition-all ${activeParams === block.settings
              ? 'btn-primary shadow-lg scale-105'
              : 'opacity-50 hover:opacity-80'
              }`}
            style={activeParams !== block.settings ? { backgroundColor: 'var(--color-border)' } : undefined}
          >
            <span className="text-lg font-bold block">
              {block.settings.title || 'Collection'}
            </span>
          </button>
        ))}
      </div>

      {/* Preview Side */}
      <div className="md:col-span-8 h-full min-h-[400px] order-1 md:order-2">
        <CollectionItemBlock settings={activeParams} className="h-full w-full shadow-2xl" />
      </div>
    </div>
  );
}

export const CollectionListSchema = {
  type: 'collection_list',
  name: 'Collection List',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Section Heading',
      default: 'Shop by Category'
    },
    {
      type: 'select',
      id: 'layout',
      label: 'Layout',
      options: [
        { value: 'grid', label: 'Grid' },
        { value: 'carousel', label: 'Carousel' },
        { value: 'bento', label: 'Bento Grid' },
        { value: 'text_list', label: 'Text Links' },
        { value: 'spotlight', label: 'Spotlight' }
      ],
      default: 'grid'
    },
    {
      type: 'range',
      id: 'columns',
      label: 'Columns (Grid Only)',
      min: 2,
      max: 4,
      step: 1,
      default: 3,
      show_if: { id: 'layout', value: 'grid' }
    },
    {
      type: 'select',
      id: 'mobile_layout',
      label: 'Mobile Layout',
      options: [
        { value: 'stack', label: 'Stacked' },
        { value: 'carousel', label: 'Carousel' }
      ],
      default: 'carousel',
      show_if: { id: 'layout', value: 'grid' }
    },
    {
      type: 'header',
      label: 'Card Style'
    },
    {
      type: 'select',
      id: 'image_aspect_ratio',
      label: 'Image Aspect Ratio',
      options: [
        { value: 'auto', label: 'Auto / Original' },
        { value: 'square', label: 'Square (1:1)' },
        { value: 'portrait', label: 'Portrait (3:4)' },
        { value: 'landscape', label: 'Landscape (16:9)' },
        { value: 'circle', label: 'Circle' }
      ],
      default: 'square'
    },
    {
      type: 'select',
      id: 'image_object_fit',
      label: 'Image Fit',
      options: [
        { value: 'cover', label: 'Cover (Crop)' },
        { value: 'contain', label: 'Contain (No Crop)' }
      ],
      default: 'cover'
    },
    {
      type: 'range',
      id: 'image_overlay_opacity',
      label: 'Image Overlay Opacity (%)',
      min: 0,
      max: 90,
      step: 10,
      default: 0
    },
    {
      type: 'select',
      id: 'content_position',
      label: 'Content Position',
      options: [
        { value: 'bottom_left', label: 'Bottom Left' },
        { value: 'bottom_center', label: 'Bottom Center' },
        { value: 'center', label: 'Center' },
        { value: 'below', label: 'Below Image' }
      ],
      default: 'bottom_left'
    }
  ],
  blocks: [
    BaseCollectionItemSchema
  ],
  presets: [
    {
      name: 'Collection List: Grid',
      settings: { layout: 'grid', columns: 3 },
      blocks: [
        { type: 'collection_item', settings: { title: 'New Arrivals' } },
        { type: 'collection_item', settings: { title: 'Best Sellers' } },
        { type: 'collection_item', settings: { title: 'Sale' } }
      ]
    }
  ]
};
