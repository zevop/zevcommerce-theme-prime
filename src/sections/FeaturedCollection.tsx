'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import {
  useTheme,
  getCollection,
  ProductCard,
  cn,
} from '@zevcommerce/storefront-api';

// Helper for scroll behavior
const scrollContainer = (container: HTMLElement | null, direction: 'left' | 'right') => {
  if (!container) return;
  const scrollAmount = container.clientWidth * 0.8;
  const targetScroll = container.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
  container.scrollTo({
    left: targetScroll,
    behavior: 'smooth'
  });
};

export default function FeaturedCollection({ settings }: { settings: any }) {
  const { storeConfig } = useTheme();
  const [products, setProducts] = useState<any[]>([]);
  const [collectionInfo, setCollectionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const domain = storeConfig?.handle || '';
  const collectionHandle = settings.collection;
  const limit = parseInt(settings.limit || '8');
  const columns = parseInt(settings.columns || '4');
  const layout = settings.layout || 'grid';

  // Visual Settings
  const aspectRatio = settings.aspect_ratio || 'portrait';
  const objectFit = settings.object_fit || 'cover';
  const borderRadius = settings.border_radius || 'lg';
  const showBorder = settings.show_border || false;

  useEffect(() => {
    async function fetchData() {
      if (!domain || !collectionHandle) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch collection to get products and metadata
        const collection = await getCollection(domain, collectionHandle);
        if (collection) {
          setCollectionInfo(collection);
          // Assuming structure: collection.products = [{ product: ... }, ...]
          const productList = collection.products?.map((p: any) => p.product) || [];
          setProducts(productList.slice(0, limit));
        }
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [domain, collectionHandle, limit]);

  if (!collectionHandle) {
    return (
      <section className="py-16 bg-gray-50 border-y border-dashed border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-lg font-medium text-gray-400">Select a collection to display</h3>
        </div>
      </section>
    );
  }

  // Styles
  const sectionPadding = {
    'none': 'py-0',
    'small': 'py-8',
    'medium': 'py-16',
    'large': 'py-24'
  }[settings.padding_y as 'none' | 'small' | 'medium' | 'large'] || 'py-16';

  const gapClass = {
    'none': 'gap-0',
    'small': 'gap-4',
    'medium': 'gap-8',
    'large': 'gap-12'
  }[settings.gap as 'none' | 'small' | 'medium' | 'large'] || 'gap-8';

  const gridColsClass = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5'
  }[columns as 2 | 3 | 4 | 5] || 'lg:grid-cols-4';

  const cardStyleClass = showBorder ? 'border border-gray-200 shadow-sm' : '';

  // Loading State
  if (loading) {
    return (
      <div className={`container mx-auto px-4 ${sectionPadding}`}>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 w-1/4 rounded"></div>
          <div className={`grid grid-cols-2 ${gridColsClass} gap-6`}>
            {[...Array(columns)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return null;
  }

  return (
    <section className={`bg-white ${sectionPadding} overflow-hidden`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div className="max-w-2xl">
            {(settings.title || collectionInfo?.title) && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                {settings.title || collectionInfo?.title}
              </h2>
            )}
            {settings.show_description && (settings.description || collectionInfo?.description) && (
              <p className="mt-4 text-lg text-gray-600 line-clamp-2">
                {settings.description || collectionInfo?.description}
              </p>
            )}
          </div>

          {settings.show_view_all && (
            <Link
              href={`/collections/${collectionInfo?.handle}`}
              className="hidden md:flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
            >
              View all <ArrowRight size={16} />
            </Link>
          )}

          {/* Carousel Controls */}
          {layout === 'carousel' && (
            <div className="flex gap-2 md:hidden">
              <button onClick={() => scrollContainer(scrollRef.current, 'left')} className="p-2 rounded-full border border-gray-200 hover:bg-gray-50">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scrollContainer(scrollRef.current, 'right')} className="p-2 rounded-full border border-gray-200 hover:bg-gray-50">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Content Layouts */}

        {/* GRID LAYOUT */}
        {layout === 'grid' && (
          <div className={`grid grid-cols-2 md:grid-cols-3 ${gridColsClass} ${gapClass}`}>
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                domain={domain}
                aspectRatio={aspectRatio}
                objectFit={objectFit}
                borderRadius={borderRadius}
                className={cardStyleClass}
              />
            ))}
          </div>
        )}

        {/* CAROUSEL LAYOUT */}
        {layout === 'carousel' && (
          <div className="relative group">
            {/* Desktop Nav Arrows */}
            <button
              onClick={() => scrollContainer(scrollRef.current, 'left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:flex"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scrollContainer(scrollRef.current, 'right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:flex"
            >
              <ChevronRight size={24} />
            </button>

            <div
              ref={scrollRef}
              className={`flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-4 ${gapClass}`}
            >
              {products.map(product => (
                <div
                  key={product.id}
                  className={`snap-center shrink-0 w-[280px] sm:w-[320px] md:w-[calc(100%/${columns}-1rem)]`}
                >
                  <ProductCard
                    product={product}
                    domain={domain}
                    aspectRatio={aspectRatio}
                    objectFit={objectFit}
                    borderRadius={borderRadius}
                    className={cardStyleClass}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDITORIAL LAYOUT */}
        {layout === 'editorial' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Featured Item (First Product or Collection Image) */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
              <div className={`relative overflow-hidden ${borderRadius === 'full' ? 'rounded-3xl' : `rounded-${borderRadius === 'none' ? 'none' : '2xl'}`} aspect-[3/4] bg-gray-100`}>
                <img
                  src={collectionInfo?.image?.url || products[0]?.media?.[0]?.url || '/placeholder-collection.jpg'}
                  className="w-full h-full object-cover"
                  alt={collectionInfo?.title || "Collection"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                  <span className="text-sm font-medium uppercase tracking-wider mb-2">Featured Collection</span>
                  <h3 className="text-3xl font-bold mb-4">{collectionInfo?.title}</h3>
                  <Link
                    href={`/collections/${collectionInfo?.handle}`}
                    className="inline-flex items-center gap-2 text-white font-semibold hover:underline"
                  >
                    Shop Collection <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className={`lg:col-span-7 xl:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-6`}>
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  domain={domain}
                  aspectRatio="square" // Editorial usually looks good with squares in the grid part
                  borderRadius={borderRadius}
                />
              ))}
            </div>
          </div>
        )}

        {settings.show_view_all && (
          <div className="mt-12 text-center md:hidden">
            <Link
              href={`/collections/${collectionInfo?.handle}`}
              className="inline-flex h-12 items-center justify-center rounded-full border border-gray-200 px-8 text-sm font-medium transition-colors hover:bg-gray-50 bg-white shadow-sm"
            >
              View all products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export const schema = {
  type: 'featured_collection',
  name: 'Featured Collection',
  settings: [
    {
      type: 'header',
      label: 'Content'
    },
    {
      type: 'collection_picker',
      id: 'collection',
      label: 'Collection',
      default: ''
    },
    {
      type: 'text',
      id: 'title',
      label: 'Heading',
      info: 'Defaults to collection title if empty'
    },
    {
      type: 'textarea',
      id: 'description',
      label: 'Description',
      info: 'Defaults to collection description if empty'
    },
    {
      type: 'checkbox',
      id: 'show_description',
      label: 'Show Description',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_view_all',
      label: 'Show "View All" button',
      default: true
    },
    {
      type: 'header',
      label: 'Layout'
    },
    {
      type: 'select',
      id: 'layout',
      label: 'Layout Style',
      options: [
        { value: 'grid', label: 'Grid' },
        { value: 'carousel', label: 'Carousel' },
        { value: 'editorial', label: 'Editorial' }
      ],
      default: 'grid'
    },
    {
      type: 'range',
      id: 'columns',
      label: 'Desktop Columns',
      min: 2,
      max: 5,
      step: 1,
      default: 4,
      show_if: { id: 'layout', value: 'grid' } // Also relevant for carousel, but let's keep it simple
    },
    {
      type: 'range',
      id: 'limit',
      label: 'Number of products',
      min: 4,
      max: 24,
      step: 4,
      default: 8
    },
    {
      type: 'select',
      id: 'padding_y',
      label: 'Vertical Padding',
      options: [
        { value: 'none', label: 'None' },
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' }
      ],
      default: 'medium'
    },
    {
      type: 'select',
      id: 'gap',
      label: 'Grid Gap',
      options: [
        { value: 'none', label: 'None' },
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' }
      ],
      default: 'medium'
    },
    {
      type: 'header',
      label: 'Card Style'
    },
    {
      type: 'select',
      id: 'aspect_ratio',
      label: 'Image Aspect Ratio',
      options: [
        { value: 'auto', label: 'Auto' },
        { value: 'square', label: 'Square (1:1)' },
        { value: 'portrait', label: 'Portrait (3:4)' },
        { value: 'landscape', label: 'Landscape (16:9)' }
      ],
      default: 'portrait'
    },
    {
      type: 'select',
      id: 'object_fit',
      label: 'Image Fit',
      options: [
        { value: 'cover', label: 'Cover' },
        { value: 'contain', label: 'Contain' }
      ],
      default: 'cover'
    },
    {
      type: 'select',
      id: 'border_radius',
      label: 'Corner Radius',
      options: [
        { value: 'none', label: 'Square' },
        { value: 'sm', label: 'Small' },
        { value: 'lg', label: 'Large' },
        { value: 'full', label: 'Round' }
      ],
      default: 'lg'
    },
    {
      type: 'checkbox',
      id: 'show_border',
      label: 'Show Border',
      default: false
    }
  ]
};
