import { useTheme, BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '../blocks/schemas';

export default function Hero({ settings, blocks }: { settings: any, blocks: any[] }) {
  const { storeConfig } = useTheme();
  const storeName = storeConfig?.name || 'Store';

  // Process blocks to replace {{store_name}}
  const processedBlocks = blocks.map(block => {
    if (block.type === 'heading' && block.settings?.text) {
      return {
        ...block,
        settings: {
          ...block.settings,
          text: block.settings.text.replace(/{{store_name}}/g, storeName)
        }
      };
    }
    return block;
  });
  // Styles from settings
  const heightClass = settings.height === 'large' ? 'min-h-[600px]' : 'min-h-[400px]';

  // Section Alignment (Base)
  // Maps to Flex Column Alignment (items-*) and Text Alignment (text-*)
  const getSectionAlignment = (align: string) => {
    switch (align) {
      case 'left': return 'items-start text-left';
      case 'right': return 'items-end text-right';
      case 'center':
      default: return 'items-center text-center';
    }
  };
  const sectionAlignmentClass = getSectionAlignment(settings.alignment || 'center');

  const getVerticalAlignment = (align: string) => {
    switch (align) {
      case 'top': return 'justify-start';
      case 'bottom': return 'justify-end';
      case 'center':
      default: return 'justify-center';
    }
  };
  const verticalAlignmentClass = getVerticalAlignment(settings.vertical_alignment || 'center');

  // Helper to resolve Block Alignment (Override vs Inherit)
  const getBlockAlignment = (blockSettings: any) => {
    // If override disabled, return empty (inherits from parent)
    if (!blockSettings.enable_custom_alignment) return '';

    const align = blockSettings.alignment || 'center';
    switch (align) {
      case 'left': return 'self-start text-left';
      case 'right': return 'self-end text-right';
      case 'center': return 'self-center text-center';
      default: return 'self-center text-center';
    }
  };

  // Safely resolve background image (handle object or string)
  const resolveImage = (img: any) => {
    if (!img) return undefined;
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return undefined;
  };

  const rawBgImage = resolveImage(settings.bg_image);
  const bgImage = rawBgImage ? `url("${rawBgImage}")` : undefined;

  // Section Colors (Override)
  const sectionStyle: React.CSSProperties = {
    backgroundImage: bgImage,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  if (settings.section_bg_color) sectionStyle.backgroundColor = settings.section_bg_color;

  return (
    <div
      className={`relative flex flex-col items-center w-full bg-gray-900 text-white ${heightClass} ${verticalAlignmentClass}`}
      style={sectionStyle}
    >
      {/* Overlay: Only show if NO background override is set. */}
      {!settings.section_bg_color && <div className="absolute inset-0 bg-black/40"></div>}

      {/* Container: Just width constraint. */}
      <div className={`relative z-10 container-custom py-20`}>
        <BlockRenderer
          blocks={processedBlocks}
          sectionSettings={settings}
          className={settings.layout === 'spread'
            ? 'w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6'
            : `w-full flex flex-col ${sectionAlignmentClass}`
          }
        />
      </div>
    </div>
  );
}

export const schema = {
  type: 'hero',
  name: 'Hero Banner',
  max_blocks: 5,
  settings: [
    {
      type: 'select',
      id: 'height',
      label: 'Section Height',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'large', label: 'Large' },
      ],
      default: 'large',
    },
    {
      type: 'select',
      id: 'alignment',
      label: 'Text Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      default: 'center',
    },
    {
      type: 'select',
      id: 'layout',
      label: 'Content Layout',
      options: [
        { value: 'stack', label: 'Stacked (Default)' },
        { value: 'spread', label: 'Spread (Split Bottom)' },
      ],
      default: 'stack',
    },
    {
      type: 'select',
      id: 'vertical_alignment',
      label: 'Vertical Alignment',
      options: [
        { value: 'top', label: 'Top' },
        { value: 'center', label: 'Center' },
        { value: 'bottom', label: 'Bottom' },
      ],
      default: 'center',
    },
    {
      type: 'image',
      id: 'bg_image',
      label: 'Background Image',
    },
    {
      type: 'color',
      id: 'section_bg_color',
      label: 'Background Override',
    }
  ],
  blocks: getSharedBlocks([
    {
      type: 'heading',
      name: 'Heading',
      settings: [
        {
          type: 'text',
          id: 'text',
          label: 'Heading',
          default: 'Welcome to {{store_name}}',
        },
        {
          type: 'select',
          id: 'tag',
          label: 'HTML Tag',
          options: [
            { value: 'h1', label: 'H1' },
            { value: 'h2', label: 'H2' },
          ],
          default: 'h1'
        },
        {
          type: 'color',
          id: 'color',
          label: 'Text Color',
        },
        {
          type: 'color',
          id: 'text_bg_color',
          label: 'Text Background',
        },
        {
          type: 'checkbox',
          id: 'enable_custom_alignment',
          label: 'Enable Custom Alignment',
          default: false
        },
        {
          type: 'select',
          id: 'alignment',
          label: 'Alignment',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ],
          default: 'center',
          show_if: 'enable_custom_alignment'
        },
      ],
    },
    {
      type: 'text',
      name: 'Description',
      settings: [
        {
          type: 'textarea',
          id: 'text',
          label: 'Text content',
          default: 'The default theme for Intech Commerce.',
        },
        {
          type: 'color',
          id: 'color',
          label: 'Text Color',
        },
        {
          type: 'color',
          id: 'text_bg_color',
          label: 'Text Background',
        },
        {
          type: 'checkbox',
          id: 'enable_custom_alignment',
          label: 'Enable Custom Alignment',
          default: false
        },
        {
          type: 'select',
          id: 'alignment',
          label: 'Alignment',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ],
          default: 'center',
          show_if: 'enable_custom_alignment'
        },
      ],
    },
    {
      type: 'button',
      name: 'Button',
      settings: [
        {
          type: 'text',
          id: 'text',
          label: 'Button text',
          default: 'Start Shopping',
        },
        {
          type: 'text',
          id: 'link',
          label: 'Button link',
          default: '/products',
        },
        {
          type: 'color',
          id: 'bg_color',
          label: 'Button Color',
        },
        {
          type: 'color',
          id: 'text_color',
          label: 'Button Text Color',
        }
      ],
    },
  ]),
  defaultBlocks: [
    { type: 'heading' },
    { type: 'text' },
    { type: 'button' }
  ]
};
