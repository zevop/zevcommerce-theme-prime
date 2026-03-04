import React from 'react';
import { useTheme, BlockRenderer } from '@zevcommerce/storefront-api';

export default function CheckoutSection({ settings, blocks }: { settings: any, blocks: any[] }) {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <BlockRenderer blocks={blocks} sectionSettings={settings} />
      </main>
    </div>
  );
}

export const schema = {
  type: 'checkout-page',
  name: 'Checkout Page',
  settings: [],
  blocks: [
    {
      type: 'checkout_page_title',
      name: 'Page Title',
      settings: [
        {
          type: 'checkbox',
          id: 'show_title',
          label: 'Show Title',
          default: true
        },
        {
          type: 'text',
          id: 'title',
          label: 'Title',
          default: 'Checkout'
        },
        {
          type: 'color',
          id: 'color',
          label: 'Text Color',
          default: '#000000'
        },
        {
          type: 'select',
          id: 'alignment',
          label: 'Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ],
          default: 'left'
        }
      ]
    },
    {
      type: 'checkout_form',
      name: 'Checkout Form',
      limit: 1,
      allow_delete: false,
      settings: [
        {
          type: 'info',
          id: 'info',
          label: 'Note',
          default: 'The checkout form styles are inherited from your global theme settings.'
        }
      ]
    }
  ]
};
