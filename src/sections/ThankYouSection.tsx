'use client';

import React from 'react';
import { BlockRenderer } from '@zevcommerce/storefront-api';

export default function ThankYouSection({ settings, blocks }: { settings: any, blocks: any[] }) {
  return (
    <div className="min-h-[80vh] flex flex-col" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
      {/* Decorative accent bar */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, var(--color-accent), var(--color-primary))' }} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-xl mx-auto">
          {/* Card container */}
          <div className="rounded-2xl shadow-sm border p-8 md:p-12 text-center space-y-2" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
            <BlockRenderer blocks={blocks} sectionSettings={settings} />
          </div>

          {/* Reassurance strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs opacity-40" style={{ color: 'var(--color-text)' }}>
            <span>Secure Checkout</span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-current" />
            <span>Confirmation Sent</span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-current" />
            <span>Track Your Order</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export const schema = {
  type: 'thank-you-page',
  name: 'Thank You Page',
  settings: [],
  blocks: [
    {
      type: 'thank_you_icon',
      name: 'Status Icon',
      settings: [
        {
          type: 'select',
          id: 'mode',
          label: 'Display Mode',
          options: [
            { label: 'Icon', value: 'icon' },
            { label: 'Custom Image', value: 'image' }
          ],
          default: 'icon'
        },
        {
          type: 'select',
          id: 'icon',
          label: 'Icon',
          options: [
            { label: 'Check Circle', value: 'check' },
            { label: 'Heart', value: 'heart' },
            { label: 'Thumbs Up', value: 'thumbs_up' },
            { label: 'Party', value: 'party' },
            { label: 'Gift', value: 'gift' },
            { label: 'Shopping Bag', value: 'bag' }
          ],
          default: 'check'
        },
        {
          type: 'image_picker',
          id: 'image',
          label: 'Custom Image'
        },
        {
          type: 'range',
          id: 'size',
          label: 'Size (px)',
          min: 40,
          max: 200,
          step: 4,
          default: 80
        },
        {
          type: 'color',
          id: 'color',
          label: 'Icon Color',
          default: '#16a34a'
        },
        {
          type: 'color',
          id: 'background_color',
          label: 'Background Color',
          default: '#f0fdf4'
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
          default: 'center'
        }
      ]
    },
    {
      type: 'thank_you_header',
      name: 'Header Message',
      allow_delete: false,
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
          default: 'Order Placed!'
        },
        {
          type: 'textarea',
          id: 'subtitle',
          label: 'Subtitle',
          default: 'Thank you for your purchase. Your order has been successfully placed.'
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
          default: 'center'
        }
      ]
    },
    {
      type: 'order_details',
      name: 'Order Number',
      allow_delete: false,
      settings: []
    },
    {
      type: 'gift_card_codes',
      name: 'Gift Card Codes',
      allow_delete: false,
      settings: []
    },
    {
      type: 'payment_instructions',
      name: 'Payment Instructions',
      allow_delete: false,
      settings: [
        {
          type: 'info',
          id: 'restriction_info',
          label: 'Visibility',
          default: 'Visible only when offline payment is used (e.g. Bank Transfer).'
        },
        {
          type: 'text',
          id: 'title',
          label: 'Title',
          default: 'Payment Instructions'
        },
        {
          type: 'header',
          label: 'Styling'
        },
        {
          type: 'color',
          id: 'background_color',
          label: 'Background Color',
          default: '#ffffff'
        },
        {
          type: 'color',
          id: 'text_color',
          label: 'Text Color',
          default: '#4b5563'
        },
        {
          type: 'color',
          id: 'border_color',
          label: 'Border Color',
          default: '#e5e7eb'
        },
        {
          type: 'color',
          id: 'heading_color',
          label: 'Heading Color',
          default: '#111827'
        },
        {
          type: 'color',
          id: 'icon_color',
          label: 'Icon Color',
          default: '#9ca3af'
        },
        {
          type: 'range',
          id: 'border_width',
          label: 'Border Width',
          min: 0,
          max: 10,
          default: 1
        },
        {
          type: 'range',
          id: 'border_radius',
          label: 'Border Radius',
          min: 0,
          max: 40,
          default: 12
        },
        {
          type: 'range',
          id: 'padding',
          label: 'Padding',
          min: 0,
          max: 80,
          step: 4,
          default: 32
        }
      ]
    },
    {
      type: 'continue_shopping',
      name: 'Continue Button',
      settings: [
        {
          type: 'text',
          id: 'button_text',
          label: 'Button Text',
          default: 'Continue Shopping'
        }
      ]
    }
  ]
};
