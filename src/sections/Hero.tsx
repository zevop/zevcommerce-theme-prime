'use client';

import { useTheme, BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '../blocks/schemas';
import { getCommonSectionSettings } from '../helpers/sectionSettingsHelpers';
import { useScrollReveal } from '../hooks/useScrollReveal';

const heightMap: Record<string, string> = {
  small: 'min-h-[400px]',
  medium: 'min-h-[550px]',
  large: 'min-h-[700px]',
  full: 'min-h-screen',
};

const contentWidthMap: Record<string, string> = {
  narrow: 'max-w-md',
  medium: 'max-w-2xl',
  wide: 'max-w-4xl',
};

const alignmentMap: Record<string, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
};

const verticalAlignMap: Record<string, string> = {
  top: 'justify-start pt-24',
  center: 'justify-center',
  bottom: 'justify-end pb-16',
};

function resolveImage(img: any): string | undefined {
  if (!img) return undefined;
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img.url) return img.url;
  return undefined;
}

export default function Hero({ settings, blocks }: { settings: any; blocks: any[] }) {
  const { storeConfig } = useTheme();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 });
  const storeName = storeConfig?.name || 'Store';

  const processedBlocks = blocks.map((block) => {
    if (block.type === 'heading' && block.settings?.text) {
      return {
        ...block,
        settings: { ...block.settings, text: block.settings.text.replace(/\{\{store_name\}\}/g, storeName) },
      };
    }
    return block;
  });

  const layout = settings.layout || 'stacked';
  const height = settings.height || 'large';
  const alignment = settings.alignment || 'center';
  const verticalAlignment = settings.vertical_alignment || 'center';
  const overlayOpacity = settings.overlay_opacity ?? 40;
  const overlayColor = settings.overlay_color || '#000000';
  const contentMaxWidth = contentWidthMap[settings.content_max_width || 'medium'] || 'max-w-2xl';
  const bgImage = resolveImage(settings.bg_image);

  // Section style
  const sectionStyle: React.CSSProperties = {};
  if (bgImage) {
    sectionStyle.backgroundImage = `url("${bgImage}")`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }
  if (settings.section_bg_color) {
    sectionStyle.backgroundColor = settings.section_bg_color;
  }

  // Split layouts
  if (layout === 'split' || layout === 'split_reverse') {
    return (
      <div
        ref={ref}
        className={`relative w-full ${heightMap[height] || ''} flex flex-col md:flex-row`}
        style={settings.section_bg_color ? { backgroundColor: settings.section_bg_color } : undefined}
      >
        {/* Image side */}
        <div
          className={`relative w-full md:w-1/2 min-h-[300px] md:min-h-0 bg-gray-900 ${layout === 'split_reverse' ? 'md:order-2' : ''}`}
          style={bgImage ? { backgroundImage: `url("${bgImage}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
        >
          {bgImage && <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity / 100 }} />}
        </div>

        {/* Content side */}
        <div
          className={`relative w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-16 ${layout === 'split_reverse' ? 'md:order-1' : ''}`}
          style={{ backgroundColor: settings.section_bg_color || 'var(--color-background)', color: 'var(--color-text)' }}
        >
          <div className={`${contentMaxWidth} transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <BlockRenderer
              blocks={processedBlocks}
              sectionSettings={settings}
              className="flex flex-col items-start text-left gap-4"
            />
          </div>
        </div>
      </div>
    );
  }

  // Banner layout (narrow height, horizontal)
  if (layout === 'banner') {
    return (
      <div
        ref={ref}
        className="relative w-full py-12 md:py-16 bg-gray-900 text-white"
        style={sectionStyle}
      >
        {!settings.section_bg_color && (
          <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity / 100 }} />
        )}
        <div className={`relative z-10 container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <BlockRenderer
            blocks={processedBlocks}
            sectionSettings={settings}
            className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8"
          />
        </div>
      </div>
    );
  }

  // Stacked & Spread layouts (default)
  return (
    <div
      ref={ref}
      className={`relative flex flex-col items-center w-full bg-gray-900 text-white ${heightMap[height] || ''} ${verticalAlignMap[verticalAlignment] || 'justify-center'}`}
      style={sectionStyle}
    >
      {/* Overlay */}
      {!settings.section_bg_color && (
        <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity / 100 }} />
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className={`transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <BlockRenderer
            blocks={processedBlocks}
            sectionSettings={settings}
            className={
              layout === 'spread'
                ? 'w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6'
                : `w-full flex flex-col ${alignmentMap[alignment] || 'items-center text-center'} ${contentMaxWidth} ${alignment === 'center' ? 'mx-auto' : ''} gap-4`
            }
          />
        </div>
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
      type: 'select', id: 'layout', label: 'Layout',
      options: [
        { value: 'stacked', label: 'Stacked (Default)' },
        { value: 'spread', label: 'Spread (Split Bottom)' },
        { value: 'split', label: 'Split (Image Left)' },
        { value: 'split_reverse', label: 'Split (Image Right)' },
        { value: 'banner', label: 'Banner (Compact)' },
      ],
      default: 'stacked',
    },
    {
      type: 'select', id: 'height', label: 'Section Height',
      options: [
        { value: 'small', label: 'Small (400px)' },
        { value: 'medium', label: 'Medium (550px)' },
        { value: 'large', label: 'Large (700px)' },
        { value: 'full', label: 'Full Screen' },
      ],
      default: 'large',
    },
    {
      type: 'select', id: 'alignment', label: 'Text Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      default: 'center',
    },
    {
      type: 'select', id: 'vertical_alignment', label: 'Vertical Alignment',
      options: [
        { value: 'top', label: 'Top' },
        { value: 'center', label: 'Center' },
        { value: 'bottom', label: 'Bottom' },
      ],
      default: 'center',
    },
    {
      type: 'select', id: 'content_max_width', label: 'Content Width',
      options: [
        { value: 'narrow', label: 'Narrow' },
        { value: 'medium', label: 'Medium' },
        { value: 'wide', label: 'Wide' },
      ],
      default: 'medium',
    },
    { type: 'image', id: 'bg_image', label: 'Background Image' },
    { type: 'color', id: 'overlay_color', label: 'Overlay Color' },
    { type: 'range', id: 'overlay_opacity', label: 'Overlay Opacity', min: 0, max: 100, step: 5, default: 40 },
    { type: 'color', id: 'section_bg_color', label: 'Background Color Override' },
    ...getCommonSectionSettings().filter((s: any) => !['background_color', 'padding_top', 'padding_bottom'].includes(s.id)),
  ],
  blocks: getSharedBlocks([
    {
      type: 'heading',
      name: 'Heading',
      settings: [
        { type: 'text', id: 'text', label: 'Heading', default: 'Welcome to {{store_name}}' },
        {
          type: 'select', id: 'tag', label: 'HTML Tag',
          options: [{ value: 'h1', label: 'H1' }, { value: 'h2', label: 'H2' }],
          default: 'h1',
        },
        { type: 'color', id: 'color', label: 'Text Color' },
        { type: 'color', id: 'text_bg_color', label: 'Text Background' },
        { type: 'checkbox', id: 'enable_custom_alignment', label: 'Enable Custom Alignment', default: false },
        {
          type: 'select', id: 'alignment', label: 'Alignment',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ],
          default: 'center',
          show_if: 'enable_custom_alignment',
        },
      ],
    },
    {
      type: 'text',
      name: 'Description',
      settings: [
        { type: 'textarea', id: 'text', label: 'Text content', default: 'Discover our curated collection of premium products.' },
        { type: 'color', id: 'color', label: 'Text Color' },
        { type: 'color', id: 'text_bg_color', label: 'Text Background' },
        { type: 'checkbox', id: 'enable_custom_alignment', label: 'Enable Custom Alignment', default: false },
        {
          type: 'select', id: 'alignment', label: 'Alignment',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ],
          default: 'center',
          show_if: 'enable_custom_alignment',
        },
      ],
    },
    {
      type: 'button',
      name: 'Button',
      settings: [
        { type: 'text', id: 'text', label: 'Button text', default: 'Shop Now' },
        { type: 'text', id: 'link', label: 'Button link', default: '/collections/all' },
        { type: 'color', id: 'bg_color', label: 'Button Color' },
        { type: 'color', id: 'text_color', label: 'Button Text Color' },
      ],
    },
  ]),
  defaultBlocks: [
    { type: 'heading' },
    { type: 'text' },
    { type: 'button' },
  ],
};
