import { BlockRenderer } from '@zevcommerce/storefront-api';
import { AllBlockSchemas, withColumnSettings, getSharedBlocks } from '../blocks/schemas';

export default function Columns({ settings, blocks }: { settings: any, blocks: any[] }) {
  const {
    column_count = 2,
    gap = 8,
    padding_top = 64,
    padding_bottom = 64,
    background_color = 'transparent',
    background_image,
    full_width = false,
    mobile_stack = true
  } = settings;

  const containerStyle: React.CSSProperties = {
    paddingTop: `${padding_top}px`,
    paddingBottom: `${padding_bottom}px`,
    backgroundColor: background_color,
    backgroundImage: background_image ? `url(${background_image})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const gridStyles = {
    display: 'grid',
    gap: `${gap * 4}px`,
    gridTemplateColumns: `repeat(${column_count}, minmax(0, 1fr))`,
    alignItems: 'start' // Ensure columns don't stretch weirdly if content differs
  };

  return (
    <section style={containerStyle} className="relative overflow-hidden">
      <div className={`${full_width ? 'px-4' : 'container mx-auto px-4'}`}>
        <div
          className={`grid gap-8 ${mobile_stack ? 'grid-cols-1 md:grid-cols-' + column_count : ''}`}
          style={mobile_stack ? { gap: `${gap * 4}px` } : gridStyles}
        >
          {Array.from({ length: column_count }).map((_, idx) => (
            <div key={idx} className="flex flex-col min-w-0">
              <BlockRenderer blocks={blocks} columnIndex={idx} className="w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'columns',
  name: 'Columns',
  settings: [
    {
      type: 'range',
      id: 'column_count',
      label: 'Number of columns',
      min: 1,
      max: 4,
      step: 1,
      default: 2,
    },
    {
      type: 'range',
      id: 'gap',
      label: 'Column gap',
      min: 0,
      max: 12,
      step: 1,
      default: 8,
    },
    {
      type: 'checkbox',
      id: 'full_width',
      label: 'Full width section',
      default: false,
    },
    {
      type: 'checkbox',
      id: 'mobile_stack',
      label: 'Stack columns on mobile',
      default: true,
    },
    {
      type: 'header',
      content: 'Spacing'
    },
    {
      type: 'range',
      id: 'padding_top',
      label: 'Padding top',
      min: 0,
      max: 100,
      step: 4,
      default: 64,
    },
    {
      type: 'range',
      id: 'padding_bottom',
      label: 'Padding bottom',
      min: 0,
      max: 100,
      step: 4,
      default: 64,
    },
    {
      type: 'header',
      content: 'Style'
    },
    {
      type: 'color',
      id: 'background_color',
      label: 'Background color',
      default: 'transparent',
    },
    {
      type: 'image',
      id: 'background_image',
      label: 'Background image',
    }
  ],
  blocks: getSharedBlocks([], withColumnSettings)
};
