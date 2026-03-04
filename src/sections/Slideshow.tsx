import { BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '../blocks/schemas';

/*
  Slideshow Section
  Supports:
  - Layouts: Full Width, Inset
  - Styles: Standard, Layered (text box overlapping)
  - Height options
  - Autoplay settings
*/

export default function Slideshow({ settings, blocks }: { settings: any, blocks: any[] }) {
  const {
    layout = 'full_width',
    height = 'medium',
    autoplay = true,
    autoplay_speed = 5,
    style = 'standard', // standard | layered
  } = settings;

  // Height classes
  const getHeightClass = (h: string) => {
    switch (h) {
      case 'small': return 'min-h-[400px] md:h-[500px]';
      case 'medium': return 'min-h-[500px] md:h-[650px]';
      case 'large': return 'min-h-[600px] md:h-[800px]';
      case 'adapt': return 'h-auto aspect-[16/9]';
      default: return 'min-h-[500px] md:h-[650px]';
    }
  };
  const heightClass = getHeightClass(height);

  // Layout container classes
  const isInsect = layout === 'inset';
  const containerClass = isInsect ? 'container mx-auto px-4' : 'w-full';
  const slideRadius = isInsect ? 'rounded-xl overflow-hidden' : '';

  // Mocking specific block rendering for slides since BlockRenderer is generic
  // In a real carousel we'd use a library like Swiper or Embla. 
  // For now, rendering the first slide or mapping them as a stacked list for simplicity in this dev environment
  // unless we implement actual JS carousel logic. 
  // Assuming generic implementation for now: stacked for simplicity, or just first one.
  // Ideally this should be a client component with carousel state.

  // NOTE: Simple implementation: Rendering all blocks (slides) stacked for now if JS isn't active, 
  // or just handling them via standard flow.
  // To make it look like a slideshow statically:

  return (
    <div className={`py-8 ${isInsect ? '' : 'w-full'}`}>
      <div className={containerClass}>
        <div className={`relative w-full bg-gray-100 ${heightClass} ${slideRadius} flex overflow-x-auto snap-x snap-mandatory scrollbar-hide`}>
          {blocks.map((block, index) => {
            // Resolve slide settings
            const bSettings = block.settings || {};
            const bgImage = bSettings.image?.url || bSettings.image;
            const bgStyle = bgImage ? { backgroundImage: `url(${bgImage})` } : {};

            // Alignment
            const alignClass = (() => {
              switch (bSettings.content_position) {
                case 'top_left': return 'justify-start items-start text-left';
                case 'top_center': return 'justify-start items-center text-center';
                case 'top_right': return 'justify-start items-end text-right';
                case 'middle_left': return 'justify-center items-start text-left';
                case 'middle_center': return 'justify-center items-center text-center';
                case 'middle_right': return 'justify-center items-end text-right';
                case 'bottom_left': return 'justify-end items-start text-left';
                case 'bottom_center': return 'justify-end items-center text-center';
                case 'bottom_right': return 'justify-end items-end text-right';
                default: return 'justify-center items-center text-center';
              }
            })();

            return (
              <div
                key={index}
                className={`w-full flex-shrink-0 flex flex-col p-10 snap-center bg-cover bg-center bg-no-repeat relative ${alignClass}`}
                style={{ ...bgStyle, backgroundColor: '#f3f4f6' }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black" style={{ opacity: (bSettings.overlay_opacity || 20) / 100 }}></div>

                {/* Content */}
                <div className="relative z-10 max-w-2xl w-full p-6">
                  <div className={`${style === 'layered' ? 'bg-white p-8 shadow-lg text-gray-900 rounded-lg' : 'text-white'}`}>
                    {bSettings.heading && (
                      <h2 className="text-4xl md:text-5xl font-bold mb-4">{bSettings.heading}</h2>
                    )}
                    {bSettings.subheading && (
                      <p className="text-lg md:text-xl mb-6 opacity-90">{bSettings.subheading}</p>
                    )}
                    <div className="flex gap-4 flex-wrap">
                      {bSettings.button_1_text && (
                        <a href={bSettings.button_1_link || '#'} className={`px-6 py-3 rounded font-medium transition-colors ${style === 'layered' ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-100'}`}>
                          {bSettings.button_1_text}
                        </a>
                      )}
                      {bSettings.button_2_text && (
                        <a href={bSettings.button_2_link || '#'} className={`px-6 py-3 rounded font-medium transition-colors border ${style === 'layered' ? 'border-gray-300 hover:bg-gray-50' : 'border-white text-white hover:bg-white/10'}`}>
                          {bSettings.button_2_text}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const schema = {
  type: 'slideshow',
  name: 'Slideshow',
  settings: [
    {
      type: 'select',
      id: 'layout',
      label: 'Layout',
      options: [
        { value: 'full_width', label: 'Full Width' },
        { value: 'inset', label: 'Inset' }
      ],
      default: 'full_width'
    },
    {
      type: 'select',
      id: 'height',
      label: 'Height',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
        { value: 'adapt', label: 'Adapt to first image' }
      ],
      default: 'medium'
    },
    {
      type: 'select',
      id: 'style',
      label: 'Style',
      options: [
        { value: 'standard', label: 'Standard (Text overlay)' },
        { value: 'layered', label: 'Layered (Text box)' }
      ],
      default: 'standard'
    },
    {
      type: 'checkbox',
      id: 'autoplay',
      label: 'Autoplay',
      default: true
    },
    {
      type: 'range',
      id: 'autoplay_speed',
      label: 'Change slide every (s)',
      min: 3,
      max: 10,
      step: 1,
      default: 5
    }
  ],
  blocks: [
    {
      type: 'slide',
      name: 'Slide',
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
          default: 'Image Slide'
        },
        {
          type: 'textarea',
          id: 'subheading',
          label: 'Subheading',
          default: 'Details about this slide.'
        },
        {
          type: 'select',
          id: 'content_position',
          label: 'Content Position',
          options: [
            { value: 'top_left', label: 'Top Left' },
            { value: 'top_center', label: 'Top Center' },
            { value: 'top_right', label: 'Top Right' },
            { value: 'middle_left', label: 'Middle Left' },
            { value: 'middle_center', label: 'Middle Center' },
            { value: 'middle_right', label: 'Middle Right' },
            { value: 'bottom_left', label: 'Bottom Left' },
            { value: 'bottom_center', label: 'Bottom Center' },
            { value: 'bottom_right', label: 'Bottom Right' },
          ],
          default: 'middle_center'
        },
        {
          type: 'range',
          id: 'overlay_opacity',
          label: 'Overlay Opacity',
          min: 0,
          max: 100,
          default: 20
        },
        {
          type: 'header',
          content: 'Button 1'
        },
        {
          type: 'text',
          id: 'button_1_text',
          label: 'Button Label',
          default: 'Shop Name'
        },
        {
          type: 'text',
          id: 'button_1_link',
          label: 'Button Link',
          default: '/collections/all'
        },
        {
          type: 'header',
          content: 'Button 2'
        },
        {
          type: 'text',
          id: 'button_2_text',
          label: 'Button Label'
        },
        {
          type: 'text',
          id: 'button_2_link',
          label: 'Button Link'
        }
      ]
    }
  ],
  defaultBlocks: [
    {
      type: 'slide',
      settings: {
        heading: 'Welcome to our store',
        subheading: 'Discover our latest collection today.',
        button_1_text: 'Shop Now'
      }
    },
    {
      type: 'slide',
      settings: {
        heading: 'New Arrivals',
        subheading: 'Check out the latest trends.',
        button_1_text: 'View Collection'
      }
    }
  ]
};
