'use client';

import { BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '../blocks/schemas';

/*
  Image with Text Section
  - Configurable split layout (Image + Content)
  - Similar to SplitShowcase but with more flexible settings
*/

interface ImageWithTextProps {
  settings: {
    image: any;
    image_position: 'left' | 'right';
    image_width: 'small' | 'medium' | 'large';
    height: 'small' | 'medium' | 'large';
    background_color: string;
    text_color: string;
    mobile_stack: 'image_first' | 'content_first';
  };
  blocks: any[];
}

export default function ImageWithText({ settings, blocks }: ImageWithTextProps) {
  const {
    image,
    image_position = 'left',
    image_width = 'medium', // small | medium | large
    height = 'medium',
    background_color,
    text_color,
    mobile_stack = 'image_first'
  } = settings;

  // Resolve image
  const imageUrl = typeof image === 'string' ? image : image?.url;

  // Layout classes
  const isImageRight = image_position === 'right';

  // Widths mapping
  const widthClasses = {
    small: { image: 'lg:w-1/3', text: 'lg:w-2/3' },
    medium: { image: 'lg:w-1/2', text: 'lg:w-1/2' },
    large: { image: 'lg:w-2/3', text: 'lg:w-1/3' }
  };

  const currentWidth = widthClasses[image_width] || widthClasses.medium;

  // Height mapping
  const heightStyles = {
    small: { minHeight: '400px' },
    medium: { minHeight: '550px' },
    large: { minHeight: '700px' }
  };

  const contentOrder = isImageRight ? 'lg:flex-row-reverse' : 'lg:flex-row';
  const mobileOrder = mobile_stack === 'image_first' ? 'flex-col' : 'flex-col-reverse';

  return (
    <section className={`w-full flex ${contentOrder} ${mobileOrder} overflow-hidden`} style={heightStyles[height]}>
      {/* Image Side */}
      <div className={`w-full ${currentWidth.image} relative min-h-[300px]`} style={{ backgroundColor: 'var(--color-border)' }}>
        {imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <span className="text-lg font-medium">No Image Selected</span>
          </div>
        )}
      </div>

      {/* Content Side */}
      <div
        className={`w-full ${currentWidth.text} flex flex-col justify-center p-8 lg:p-16`}
        style={{ backgroundColor: background_color || 'var(--color-background)', color: text_color || 'var(--color-text)' }}
      >
        <div className="max-w-xl mx-auto w-full">
          <BlockRenderer blocks={blocks} sectionSettings={settings} className="flex flex-col gap-6" />
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'image_with_text',
  name: 'Image with Text',
  settings: [
    {
      type: 'image',
      id: 'image',
      label: 'Image'
    },
    {
      type: 'select',
      id: 'image_position',
      label: 'Image Position',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' }
      ],
      default: 'left'
    },
    {
      type: 'select',
      id: 'image_width',
      label: 'Image Width',
      options: [
        { value: 'small', label: 'Small (1/3)' },
        { value: 'medium', label: 'Medium (1/2)' },
        { value: 'large', label: 'Large (2/3)' }
      ],
      default: 'medium'
    },
    {
      type: 'select',
      id: 'height',
      label: 'Section Height',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' }
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
    },
    {
      type: 'select',
      id: 'mobile_stack',
      label: 'Mobile Layout',
      options: [
        { value: 'image_first', label: 'Image First' },
        { value: 'content_first', label: 'Content First' }
      ],
      default: 'image_first'
    }
  ],
  blocks: getSharedBlocks(),
  defaultBlocks: [
    { type: 'heading', settings: { text: 'Image with text', tag: 'h2' } },
    { type: 'text', settings: { text: 'Pair text with an image to focus on your chosen product, collection, or blog post.' } },
    { type: 'button', settings: { text: 'Read More' } }
  ]
};
