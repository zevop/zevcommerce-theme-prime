'use client';

import React, { useEffect, useState } from 'react';
import {
  useTheme,
  getProducts,
  getCollection,
  ProductCard,
} from '@zevcommerce/storefront-api';

export default function RecommendedProducts({ settings }: { settings: any }) {
  const { storeConfig, theme } = useTheme();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const mobileColumns = theme?.settings?.productCards?.mobileColumns || 2;

  // In a real scenario, this might take a productId context to find related items.
  // For now, we'll implement it as "You may also like" -> Featured Collection or Latest Products
  const limit = parseInt(settings.limit || '4');
  const columns = parseInt(settings.columns || '4');

  useEffect(() => {
    async function fetch() {
      if (!storeConfig?.handle) return;
      setLoading(true);
      try {
        let data = [];
        if (settings.source_collection) {
          const collection = await getCollection(storeConfig.handle, settings.source_collection);
          data = collection.products.map((p: any) => p.product);
        } else {
          // Default to latest products if no collection specified (simulating recommendations)
          const res = await getProducts(storeConfig.handle, 1, limit);
          data = res.data;
        }
        setProducts(data.slice(0, limit));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [storeConfig?.handle, settings.source_collection, limit]);

  if (!loading && products.length === 0) return null;

  const gridColsClass = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  }[columns] || 'lg:grid-cols-4';

  return (
    <section className="py-16 border-t" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
      <div className="container mx-auto px-4">
        {settings.heading && (
          <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: 'var(--color-heading)' }}>{settings.heading}</h2>
        )}

        {loading ? (
          <div className={`grid grid-cols-${mobileColumns} ${gridColsClass} gap-6`}>
            {[...Array(columns)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl animate-pulse" style={{ backgroundColor: 'var(--color-border)' }}></div>
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-${mobileColumns} ${gridColsClass} gap-x-6 gap-y-10`}>
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                domain={storeConfig?.handle || ''}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export const schema = {
  type: 'recommended_products',
  name: 'Recommended Products',
  settings: [
    {
      type: 'text',
      id: 'heading',
      label: 'Heading',
      default: 'You may also like'
    },
    {
      type: 'collection_picker',
      id: 'source_collection',
      label: 'Source Collection',
      info: 'Fallback products to show. If empty, shows latest products.'
    },
    {
      type: 'range',
      id: 'limit',
      label: 'Number of products',
      min: 2,
      max: 12,
      step: 1,
      default: 4
    },
    {
      type: 'select',
      id: 'columns',
      label: 'Desktop Columns',
      options: [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' }
      ],
      default: '4'
    }
  ]
};
