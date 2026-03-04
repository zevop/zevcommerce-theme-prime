import { useTheme, BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks, withColumnSettings } from '../blocks/schemas';

export default function Footer({ settings, blocks }: { settings: any, blocks: any[] }) {
  const { storeConfig } = useTheme();
  const { description, backgroundColor = '#F9FAFB', textColor = '#374151', alignment = 'left' } = settings;
  const storeName = storeConfig?.name || 'Store';

  return (
    <footer className={`pt-20 pb-16 text-${alignment}`} style={{ backgroundColor, color: textColor }}>
      {/* Top accent border */}
      <div className="h-px w-full mb-20" style={{ background: `linear-gradient(90deg, transparent, var(--color-border), transparent)` }} />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Column 0: Brand — wider for more presence */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}>
              {storeName}
            </h3>
            {description && (
              <p className="text-sm max-w-xs leading-relaxed opacity-60" style={{ color: textColor }}>
                {description}
              </p>
            )}
            <BlockRenderer blocks={blocks} columnIndex={0} />
          </div>

          {/* Columns 1-3: Dynamic Blocks */}
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="md:col-span-2 space-y-4 first:md:col-start-7">
              <BlockRenderer blocks={blocks} columnIndex={idx} />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export const schema = {
  type: 'footer',
  name: 'Footer Content',
  settings: [
    {
      type: 'textarea',
      id: 'description',
      label: 'Store Description',
      default: 'Beautifully designed e-commerce experiences built for conversion.',
    },
    {
      type: 'color',
      id: 'backgroundColor',
      label: 'Background Color',
      default: '#F9FAFB',
    },
    {
      type: 'color',
      id: 'textColor',
      label: 'Text Color',
      default: '#374151',
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
      default: 'left',
    }
  ],
  blocks: getSharedBlocks([
    {
      type: 'link_list',
      name: 'Link List',
      settings: [
        {
          type: 'text',
          id: 'title',
          label: 'Column Title',
          default: 'Quick Links'
        },
        {
          type: 'link_list',
          id: 'menu',
          label: 'Select Menu',
          default: 'footer'
        }
      ]
    },
    {
      type: 'social_link',
      name: 'Social Link',
      settings: [
        {
          type: 'select',
          id: 'platform',
          label: 'Platform',
          options: [
            { value: 'facebook', label: 'Facebook' },
            { value: 'twitter', label: 'Twitter' },
            { value: 'instagram', label: 'Instagram' },
            { value: 'linkedin', label: 'LinkedIn' },
            { value: 'youtube', label: 'YouTube' },
            { value: 'tiktok', label: 'TikTok' }
          ],
          default: 'instagram'
        },
        {
          type: 'text',
          id: 'url',
          label: 'Link URL',
          default: 'https://instagram.com'
        },
        {
          type: 'color',
          id: 'icon_color',
          label: 'Icon Color',
          default: '#9CA3AF'
        }
      ]
    }
  ], withColumnSettings)
};

