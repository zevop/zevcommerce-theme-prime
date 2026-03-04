'use client';

import {
  Truck, ShieldCheck, RefreshCw, Smartphone,
  Gift, Award, Leaf, Globe, Headphones,
  CreditCard, Zap, Archive, Box, Star
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  truck: Truck,
  shield: ShieldCheck,
  return: RefreshCw,
  support: Headphones,
  mobile: Smartphone,
  gift: Gift,
  award: Award,
  eco: Leaf,
  global: Globe,
  card: CreditCard,
  zap: Zap,
  box: Box,
  archive: Archive,
  star: Star
};

interface IconsWithTextProps {
  settings: {
    background_color: string;
    text_color: string;
    columns: number;
    alignment: 'left' | 'center';
  };
  blocks: any[];
}

export default function IconsWithText({ settings, blocks }: IconsWithTextProps) {
  const {
    background_color,
    text_color,
    columns = 3,
    alignment = 'center'
  } = settings;

  let gridClass = 'grid-cols-1 md:grid-cols-3';
  if (columns === 2) gridClass = 'grid-cols-1 md:grid-cols-2';
  if (columns === 4) gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  const alignClass = alignment === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <section className="py-16 px-4 md:px-8" style={{ backgroundColor: background_color || 'var(--color-background)', color: text_color || 'var(--color-text)' }}>
      <div className={`max-w-7xl mx-auto grid ${gridClass} gap-16`}>
        {blocks.map((block: any, index: number) => {
          if (block.type !== 'icon_column') return null;

          const { icon, heading, text } = block.settings;
          const IconComponent = ICON_MAP[icon] || Star;

          return (
            <div key={block.id || index} className={`flex flex-col ${alignClass}`}>
              <div className="mb-5 p-4 rounded-full inline-block" style={{ backgroundColor: 'var(--color-border)' }}>
                <IconComponent className="w-7 h-7 opacity-70" style={{ color: 'var(--color-heading)' }} />
              </div>
              {heading && <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-heading)' }}>{heading}</h3>}
              {text && <p className="leading-relaxed opacity-70" style={{ color: 'var(--color-text)' }}>{text}</p>}
            </div>
          )
        })}
      </div>
      {blocks.length === 0 && (
        <div className="text-center opacity-40 py-12" style={{ color: 'var(--color-text)' }}>Add icon blocks to display features</div>
      )}
    </section>
  );
}

export const schema = {
  type: 'icons_with_text',
  name: 'Icons with text',
  settings: [
    {
      type: 'range',
      id: 'columns',
      label: 'Columns per row (Desktop)',
      min: 2,
      max: 4,
      step: 1,
      default: 3
    },
    {
      type: 'select',
      id: 'alignment',
      label: 'Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' }
      ],
      default: 'center'
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
  blocks: [
    {
      type: 'icon_column',
      name: 'Column',
      settings: [
        {
          type: 'select',
          id: 'icon',
          label: 'Icon',
          options: [
            { value: 'truck', label: 'Truck / Shipping' },
            { value: 'shield', label: 'Shield / Secure' },
            { value: 'return', label: 'Return' },
            { value: 'support', label: 'Support / Headphones' },
            { value: 'gift', label: 'Gift' },
            { value: 'star', label: 'Star' },
            { value: 'award', label: 'Award' },
            { value: 'eco', label: 'Leaf / Eco' },
            { value: 'global', label: 'Globe' },
            { value: 'card', label: 'Credit Card' },
            { value: 'zap', label: 'Zap / Fast' }
          ],
          default: 'star'
        },
        {
          type: 'text',
          id: 'heading',
          label: 'Heading',
          default: 'Feature heading'
        },
        {
          type: 'textarea',
          id: 'text',
          label: 'Description',
          default: 'Describe your feature here'
        }
      ]
    }
  ],
  defaultBlocks: [
    { type: 'icon_column', settings: { icon: 'truck', heading: 'Free Shipping', text: 'On all orders over $100' } },
    { type: 'icon_column', settings: { icon: 'shield', heading: 'Secure Payment', text: '100% secure payment processing' } },
    { type: 'icon_column', settings: { icon: 'support', heading: '24/7 Support', text: 'We are here to help anytime' } }
  ]
}
