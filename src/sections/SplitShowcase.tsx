import { BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '../blocks/schemas';

/*
  Split Showcase Section
  - Fixed split layout (Image + Content)
  - Configurable proportions
*/

export default function SplitShowcase({ settings, blocks }: { settings: any, blocks: any[] }) {
  const {
    image,
    image_position = 'left',
    image_width = 'half', // half | one_third | two_thirds
    height = 'medium',
    background_color = '#ffffff',
    text_color = '#000000',
    mobile_stack = 'image_first'
  } = settings;

  // Resolve image
  const imageUrl = typeof image === 'string' ? image : image?.url;

  // Layout classes
  const isImageRight = image_position === 'right';

  // Widths
  const getImageWidthClass = () => {
    switch (image_width) {
      case 'one_third': return 'lg:w-1/3';
      case 'two_thirds': return 'lg:w-2/3';
      case 'half':
      default: return 'lg:w-1/2';
    }
  }
  const getTextWidthClass = () => {
    switch (image_width) {
      case 'one_third': return 'lg:w-2/3';
      case 'two_thirds': return 'lg:w-1/3';
      case 'half':
      default: return 'lg:w-1/2';
    }
  }

  // Height
  const getHeightStyle = () => {
    switch (height) {
      case 'small': return { minHeight: '400px' };
      case 'large': return { minHeight: '700px' };
      case 'medium':
      default: return { minHeight: '550px' };
    }
  }

  const contentOrder = isImageRight ? 'lg:flex-row-reverse' : 'lg:flex-row';
  const mobileOrder = mobile_stack === 'image_first' ? 'flex-col' : 'flex-col-reverse';

  return (
    <section className={`w-full flex ${contentOrder} ${mobileOrder} overflow-hidden`} style={getHeightStyle()}>
      {/* Image Side */}
      <div className={`w-full ${getImageWidthClass()} relative min-h-[300px]`} style={{ backgroundColor: 'var(--color-border)' }}>
        {imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-40" style={{ backgroundColor: 'var(--color-border)' }}>
            <span className="text-lg font-medium">No Image Selected</span>
          </div>
        )}
      </div>

      {/* Content Side */}
      <div
        className={`w-full ${getTextWidthClass()} flex flex-col justify-center p-8 lg:p-16`}
        style={{ backgroundColor: background_color, color: text_color }}
      >
        <div className="max-w-xl mx-auto w-full">
          <BlockRenderer blocks={blocks} className="flex flex-col gap-4" />
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'split_showcase',
  name: 'Split Showcase',
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
        { value: 'one_third', label: 'Small (1/3)' },
        { value: 'half', label: 'Medium (1/2)' },
        { value: 'two_thirds', label: 'Large (2/3)' }
      ],
      default: 'half'
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
    { type: 'heading', settings: { text: 'Split Showcase', tag: 'h2' } },
    { type: 'text', settings: { text: 'Highlight a feature or product detail.' } },
    { type: 'button', settings: { text: 'Learn More' } }
  ]
}
