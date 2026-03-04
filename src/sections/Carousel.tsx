'use client';

import { BlockRenderer } from '@zevcommerce/storefront-api';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  settings: {
    height: 'small' | 'medium' | 'large' | 'full';
    autoplay: boolean;
    slide_speed: number;
    show_arrows: boolean;
    show_dots: boolean;
  };
  blocks: any[];
}

export default function Carousel({ settings, blocks }: CarouselProps) {
  const {
    height = 'medium',
    show_arrows = true,
    show_dots = true,
  } = settings;

  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      // Scroll by the width of the container
      const scrollAmount = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getHeightClass = () => {
    switch (height) {
      case 'small': return 'h-[400px]';
      case 'large': return 'h-[700px]';
      case 'full': return 'h-screen';
      case 'medium':
      default: return 'h-[550px]';
    }
  };

  // Helper to ensure valid Color string
  const getOverlayStyle = (opacity: number) => {
    // opacity is 0-100
    return { backgroundColor: `rgba(0,0,0, ${opacity / 100})` }
  }


  return (
    <section className={`relative w-full group overflow-hidden ${getHeightClass()}`}>
      {/* Slides Container */}
      <div
        ref={carouselRef}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {blocks.map((block: any, index: number) => {
          if (block.type !== 'slide') return null;

          const {
            image,
            mobile_image,
            overlay_opacity = 20,
            content_position = 'center',
            text_color = '#ffffff'
          } = block.settings;

          // Resolve position classes
          let positionClasses = 'items-center justify-center text-center'; // default center
          switch (content_position) {
            case 'top_left': positionClasses = 'items-start justify-start text-left'; break;
            case 'top_center': positionClasses = 'items-start justify-center text-center'; break;
            case 'top_right': positionClasses = 'items-start justify-end text-right'; break;
            case 'middle_left': positionClasses = 'items-center justify-start text-left'; break;
            case 'middle_right': positionClasses = 'items-center justify-end text-right'; break;
            case 'bottom_left': positionClasses = 'items-end justify-start text-left'; break;
            case 'bottom_center': positionClasses = 'items-end justify-center text-center'; break;
            case 'bottom_right': positionClasses = 'items-end justify-end text-right'; break;
          }

          const bgImage = image?.url || image;

          return (
            <div key={block.id || index} className="w-full h-full flex-shrink-0 snap-center relative">
              {/* Background Image */}
              {bgImage ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${bgImage})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Add Image</span>
                </div>
              )}

              {/* Overlay */}
              <div
                className="absolute inset-0 z-10"
                style={getOverlayStyle(overlay_opacity)}
              />

              {/* Content */}
              <div className={`absolute inset-0 z-20 p-8 md:p-16 flex ${positionClasses}`}>
                <div className="max-w-2xl" style={{ color: text_color }}>
                  {/* Using BlockRenderer would require passing blocks down, but slide usually has specific fields. 
                               However, to support generic blocks inside a slide we can use BlockRenderer if the structure allows nesting.
                               The standard engine structure usually is Section -> Blocks.
                               The current request implies a 'slide' block which itself has settings like Title/Text. 
                               Let's render title/text/button manually from settings or use a mini-renderer if 'blocks' matches.
                               Usually slides are blocks themselves with settings.
                           */}
                  {block.settings.heading && <h2 className="text-4xl md:text-5xl font-bold mb-4">{block.settings.heading}</h2>}
                  {block.settings.subheading && <p className="text-lg md:text-xl mb-8">{block.settings.subheading}</p>}

                  {/* Quick Button Implementation for Slide */}
                  {block.settings.button_text && (
                    <a
                      href={block.settings.button_link || '#'}
                      className="inline-block px-8 py-3 bg-white text-black font-medium text-sm hover:bg-gray-100 transition-colors"
                    >
                      {block.settings.button_text}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation */}
      {show_arrows && (
        <>
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots - visual only primarily for now as we use native scroll. 
          Real implementation would track scroll intersection. */}
      {show_dots && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {blocks.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-white/50" />
          ))}
        </div>
      )}
    </section>
  );
}

export const schema = {
  type: 'carousel',
  name: 'Carousel',
  settings: [
    {
      type: 'select',
      id: 'height',
      label: 'Height',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
        { value: 'full', label: 'Full Screen' }
      ],
      default: 'medium'
    },
    {
      type: 'checkbox',
      id: 'show_arrows',
      label: 'Show Arrows',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_dots',
      label: 'Show Dots',
      default: true
    },
    // Autoplay implementation requires state & interval, keeping simple for native scroll consistency first
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
          type: 'range',
          id: 'overlay_opacity',
          label: 'Overlay Opacity',
          min: 0,
          max: 90,
          step: 10,
          default: 20
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
            { value: 'center', label: 'Center' },
            { value: 'middle_right', label: 'Middle Right' },
            { value: 'bottom_left', label: 'Bottom Left' },
            { value: 'bottom_center', label: 'Bottom Center' },
            { value: 'bottom_right', label: 'Bottom Right' }
          ],
          default: 'center'
        },
        {
          type: 'color',
          id: 'text_color',
          label: 'Text Color',
          default: '#ffffff'
        },
        {
          type: 'text',
          id: 'heading',
          label: 'Heading',
          default: 'Slide Heading'
        },
        {
          type: 'text',
          id: 'subheading',
          label: 'Subheading',
          default: 'Slide description goes here'
        },
        {
          type: 'text',
          id: 'button_text',
          label: 'Button Label',
          default: 'Shop Now'
        },
        {
          type: 'text',
          id: 'button_link',
          label: 'Button Link',
          default: '#'
        }
      ]
    }
  ],
  defaultBlocks: [
    { type: 'slide' },
    { type: 'slide' }
  ]
};
