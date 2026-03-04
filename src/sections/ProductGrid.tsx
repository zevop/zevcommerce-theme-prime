import { BlockRenderer } from '@zevcommerce/storefront-api';

export default function ProductGrid({ settings, blocks }: { settings: any, blocks: any[] }) {
  const {
    background_color = '#ffffff',
    text_color = '#111827',
    padding_top = 80,
    padding_bottom = 80,
    width = 'container'
  } = settings;

  const maxWidthClasses = {
    'container': 'container mx-auto px-4',
    'narrow': 'max-w-4xl mx-auto px-4',
    'full': 'w-full px-4'
  };

  const style = {
    backgroundColor: background_color,
    color: text_color,
    paddingTop: `${padding_top}px`,
    paddingBottom: `${padding_bottom}px`
  };

  return (
    <section style={style}>
      <div className={maxWidthClasses[width as keyof typeof maxWidthClasses]}>
        <BlockRenderer blocks={blocks} sectionSettings={settings} className="flex flex-col gap-8" />
      </div>
    </section>
  );
}

export const schema = {
  type: 'product-grid',
  name: 'Product Grid',
  max_blocks: 10,
  settings: [
    {
      type: 'header',
      content: 'Layout'
    },
    {
      type: 'select',
      id: 'width',
      label: 'Section Width',
      options: [
        { value: 'container', label: 'Standard' },
        { value: 'narrow', label: 'Narrow' },
        { value: 'full', label: 'Full Width' }
      ],
      default: 'container'
    },
    {
      type: 'range',
      id: 'padding_top',
      label: 'Padding Top',
      min: 0,
      max: 160,
      step: 8,
      default: 80,
      unit: 'px'
    },
    {
      type: 'range',
      id: 'padding_bottom',
      label: 'Padding Bottom',
      min: 0,
      max: 160,
      step: 8,
      default: 80,
      unit: 'px'
    },
    {
      type: 'header',
      content: 'Default Grid Settings'
    },
    {
      type: 'collection',
      id: 'collection',
      label: 'Default Collection'
    },
    {
      type: 'select',
      id: 'columns',
      label: 'Desktop Columns',
      options: [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' }
      ],
      default: '4'
    },
    {
      type: 'select',
      id: 'image_ratio',
      label: 'Image Aspect Ratio',
      options: [
        { value: 'square', label: 'Square' },
        { value: 'portrait', label: 'Portrait' },
        { value: 'landscape', label: 'Landscape' },
        { value: 'video', label: 'Video' }
      ],
      default: 'portrait'
    },
    {
      type: 'header',
      content: 'Colors'
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
      default: '#111827'
    }
  ],
  blocks: [
    {
      type: 'heading',
      name: 'Heading',
      settings: [
        { type: 'text', id: 'text', label: 'Text', default: 'Featured Collection' },
        { type: 'select', id: 'size', label: 'Size', options: [{ value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }], default: 'lg' }
      ]
    },
    {
      type: 'text',
      name: 'Subheading',
      settings: [
        { type: 'text', id: 'text', label: 'Text', default: '' }
      ]
    },
    {
      type: 'product_grid_items',
      name: 'Grid Items',
      limit: 1,
      settings: [
        { type: 'collection', id: 'collection', label: 'Collection' },
        { type: 'range', id: 'limit', label: 'Products Limit', min: 2, max: 24, step: 1, default: 8 },
        { type: 'select', id: 'columns_desktop', label: 'Desktop Columns', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }], default: '4' },
        { type: 'select', id: 'image_ratio', label: 'Image Ratio', options: [{ value: 'square', label: 'Square' }, { value: 'portrait', label: 'Portrait' }, { value: 'landscape', label: 'Landscape' }], default: 'portrait' }
      ]
    }
  ],
  defaultBlocks: [
    {
      type: 'heading',
      settings: { text: 'Featured Collection' }
    },
    {
      type: 'product_grid_items',
      settings: {}
    }
  ]
};
