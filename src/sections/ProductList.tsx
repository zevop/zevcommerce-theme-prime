'use client';

import React from 'react';
import { useCollection, useTheme, BlockRenderer } from '@zevcommerce/storefront-api';

export default function ProductList({ settings, blocks }: { settings: any; blocks?: any[] }) {
  const { collection, loading } = useCollection();
  const { storeConfig } = useTheme();

  if (loading) {
    return <div className="py-24 text-center max-w-7xl mx-auto px-4">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-10 w-64 rounded mb-4" style={{ backgroundColor: 'var(--color-border)' }}></div>
        <div className="h-6 w-96 rounded mb-12" style={{ backgroundColor: 'var(--color-border)' }}></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-[4/5] rounded-2xl" style={{ backgroundColor: 'var(--color-border)' }}></div>
          ))}
        </div>
      </div>
    </div>;
  }

  if (!collection) {
    return (
      <div className="py-24 text-center border-dashed border-2 m-8 rounded-3xl" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-border)' }}>
        <p className="opacity-40 font-medium">Collection will be displayed here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <BlockRenderer blocks={blocks || []} sectionSettings={settings} />
    </div>
  );
}

export const schema = {
  type: 'product-list',
  name: 'Product ListTemplate',
  settings: [],
  blocks: [
    {
      type: 'collection_heading',
      name: 'Heading',
      settings: []
    },
    {
      type: 'collection_description',
      name: 'Description',
      settings: []
    },
    {
      type: 'product_grid',
      name: 'Product Grid',
      settings: [
        {
          type: 'select',
          id: 'columns',
          label: 'Desktop Columns',
          options: [
            { value: '2', label: '2 Columns' },
            { value: '3', label: '3 Columns' },
            { value: '4', label: '4 Columns' }
          ],
          default: '4'
        }
      ]
    }
  ],
  defaultBlocks: [
    { type: 'collection_heading' },
    { type: 'product_grid' }
  ]
};
