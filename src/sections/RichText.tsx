'use client';

import { BlockRenderer } from '@zevcommerce/storefront-api';

interface RichTextProps {
  settings: {
    alignment: 'left' | 'center' | 'right';
    width: 'narrow' | 'medium' | 'wide';
    background_color: string;
    text_color: string;
  };
  blocks: any[];
}

export default function RichText({ settings, blocks }: RichTextProps) {
  const {
    alignment = 'center',
    width = 'medium',
    background_color = 'var(--color-background)',
    text_color = 'var(--color-text)'
  } = settings;

  const maxWidthClasses = {
    narrow: 'max-w-2xl',
    medium: 'max-w-4xl',
    wide: 'max-w-6xl'
  };

  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }[alignment];

  return (
    <section className="py-16 md:py-24 px-4" style={{ backgroundColor: background_color, color: text_color }}>
      <div className={`mx-auto w-full flex flex-col ${alignClass} ${maxWidthClasses[width]}`}>
        <BlockRenderer blocks={blocks} sectionSettings={settings} className={`flex flex-col gap-4 w-full ${alignClass}`} />
      </div>
    </section>
  );
}

export const schema = {
  type: 'rich_text',
  name: 'Rich text',
  settings: [
    {
      type: 'select',
      id: 'alignment',
      label: 'Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' }
      ],
      default: 'center'
    },
    {
      type: 'select',
      id: 'width',
      label: 'Content Width',
      options: [
        { value: 'narrow', label: 'Narrow' },
        { value: 'medium', label: 'Medium' },
        { value: 'wide', label: 'Wide' }
      ],
      default: 'medium'
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
      default: '#000000'
    }
  ],
  defaultBlocks: [
    { type: 'heading', settings: { text: 'Talk about your brand', size: 'lg' } },
    { type: 'text', settings: { text: 'Share information about your brand with your customers. Describe a product, make announcements, or welcome customers to your store.' } },
    { type: 'button', settings: { text: 'Button label', link: '#' } }
  ]
};
