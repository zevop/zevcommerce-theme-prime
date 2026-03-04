'use client';

import { BlockRenderer } from '@zevcommerce/storefront-api';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface MulticolumnProps {
  settings: {
    title: string;
    columns: number;
    alignment: 'left' | 'center';
    image_aspect_ratio: 'feature' | 'portrait' | 'square' | 'circle';
    background_color: string;
    card_background: boolean;
    button_text: string;
    button_link: string;
  };
  blocks: any[];
}

export default function Multicolumn({ settings, blocks }: MulticolumnProps) {
  const {
    title,
    columns = 3,
    alignment = 'left',
    image_aspect_ratio = 'feature',
    background_color = '#ffffff',
    card_background = false,
    button_text,
    button_link
  } = settings;

  let gridClass = 'grid-cols-1 md:grid-cols-3';
  if (columns === 2) gridClass = 'grid-cols-1 md:grid-cols-2';
  if (columns === 4) gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  const alignClass = alignment === 'center' ? 'text-center' : 'text-left';

  const aspectClasses: any = {
    feature: 'aspect-[3/2]',
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
    circle: 'aspect-square rounded-full'
  }

  const currentAspect = aspectClasses[image_aspect_ratio] || 'aspect-[3/2]';

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: background_color }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Section Header */}
        {title && (
          <div className={`mb-12 ${alignClass}`}>
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>
        )}

        {/* Grid */}
        <div className={`grid ${gridClass} gap-8`}>
          {blocks.map((block: any, index: number) => {
            if (block.type !== 'column') return null;
            const {
              image,
              heading,
              text,
              link,
              link_text
            } = block.settings;

            const hasCardBg = card_background;
            const bgClass = hasCardBg ? 'p-6 rounded-2xl' : '';
            const imageUrl = typeof image === 'string' ? image : image?.url;

            return (
              <div key={block.id || index} className={`flex flex-col ${alignClass} ${bgClass} group`} style={hasCardBg ? { backgroundColor: 'var(--color-border)' } : undefined}>
                {imageUrl && (
                  <div className={`w-full relative overflow-hidden mb-6 ${currentAspect} ${card_background && image_aspect_ratio !== 'circle' ? 'rounded-xl' : ''}`} style={{ backgroundColor: 'var(--color-border)' }}>
                    <img
                      src={imageUrl}
                      alt={heading || 'Column image'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="flex-1">
                  {heading && <h3 className="text-xl font-bold mb-3">{heading}</h3>}
                  {text && <div className="opacity-60 mb-4 whitespace-pre-wrap leading-relaxed">{text}</div>}

                  {link && link_text && (
                    <Link href={link} className="inline-flex items-center font-semibold text-sm hover:underline hover:opacity-70 transition-opacity mt-auto">
                      {link_text} <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Section Footer Button */}
        {button_text && button_link && (
          <div className={`mt-12 ${alignClass}`}>
            <Link
              href={button_link}
              className="btn-primary inline-block px-8 py-3 font-bold transition-colors"
            >
              {button_text}
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}

export const schema = {
  type: 'multicolumn',
  name: 'Multicolumn',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Heading',
      default: 'Multicolumn'
    },
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
      id: 'image_aspect_ratio',
      label: 'Image Ratio',
      options: [
        { value: 'feature', label: 'Feature (3:2)' },
        { value: 'portrait', label: 'Portrait (3:4)' },
        { value: 'square', label: 'Square (1:1)' },
        { value: 'circle', label: 'Circle' }
      ],
      default: 'feature'
    },
    {
      type: 'select',
      id: 'alignment',
      label: 'Text Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' }
      ],
      default: 'left'
    },
    {
      type: 'checkbox',
      id: 'card_background',
      label: 'Enable column background',
      default: false
    },
    {
      type: 'color',
      id: 'background_color',
      label: 'Section Background',
      default: '#ffffff'
    },
    {
      type: 'header',
      content: 'Section Button'
    },
    {
      type: 'text',
      id: 'button_text',
      label: 'Button Label'
    },
    {
      type: 'text',
      id: 'button_link',
      label: 'Button Link'
    }
  ],
  blocks: [
    {
      type: 'column',
      name: 'Column',
      settings: [
        {
          type: 'image',
          id: 'image',
          label: 'Image'
        },
        {
          type: 'text',
          id: 'heading',
          label: 'Heading',
          default: 'Column'
        },
        {
          type: 'textarea',
          id: 'text',
          label: 'Description',
          default: 'Pair text with an image to focus on your chosen product, collection, or blog post.'
        },
        {
          type: 'text',
          id: 'link_text',
          label: 'Link label',
          default: 'Optional link'
        },
        {
          type: 'text',
          id: 'link',
          label: 'Link url'
        }
      ]
    }
  ],
  defaultBlocks: [
    { type: 'column', settings: { heading: 'Column', text: 'Description text goes here.' } },
    { type: 'column', settings: { heading: 'Column', text: 'Description text goes here.' } },
    { type: 'column', settings: { heading: 'Column', text: 'Description text goes here.' } }
  ]
};
