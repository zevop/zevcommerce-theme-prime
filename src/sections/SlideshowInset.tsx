'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SlideshowInsetProps {
  settings: {
    height: 'small' | 'medium' | 'large' | 'adapt';
    auto_rotate: boolean;
    change_slides_every: number;
    show_dots: boolean;
    show_arrows: boolean;
    section_padding: boolean;
  };
  blocks: any[];
}

export default function SlideshowInset({ settings, blocks }: SlideshowInsetProps) {
  const {
    height = 'medium',
    auto_rotate = false,
    change_slides_every = 5,
    show_dots = true,
    show_arrows = true,
    section_padding = true
  } = settings;

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = blocks.length;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    if (auto_rotate && totalSlides > 1) {
      timeoutRef.current = setTimeout(
        () => setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1)),
        change_slides_every * 1000
      );
    }
    return () => resetTimeout();
  }, [currentSlide, auto_rotate, change_slides_every, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
  }

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
  }

  const heightClasses = {
    small: 'h-[400px]',
    medium: 'h-[500px]',
    large: 'h-[600px]',
    adapt: 'aspect-[2/1] md:aspect-[2.4/1]'
  }[height] || 'h-[500px]';

  const containerClass = section_padding ? 'max-w-7xl mx-auto px-4 md:px-8 py-8' : 'w-full';
  const radiusClass = section_padding ? 'rounded-2xl' : '';

  return (
    <section className={containerClass}>
      <div className={`relative w-full overflow-hidden group ${radiusClass} ${heightClasses}`} style={{ backgroundColor: 'var(--color-border)' }}>
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {blocks.map((block: any, index: number) => {
            const { image, mobile_image, heading, subheading, button_label, button_link, text_position, text_color, overlay_opacity } = block.settings;
            const imageUrl = typeof image === 'string' ? image : image?.url;

            // Position classes
            let posClass = 'items-center justify-center text-center';
            if (text_position === 'top-left') posClass = 'items-start justify-start text-left';
            if (text_position === 'top-center') posClass = 'items-start justify-center text-center';
            if (text_position === 'top-right') posClass = 'items-start justify-end text-right';
            if (text_position === 'middle-left') posClass = 'items-center justify-start text-left';
            if (text_position === 'middle-right') posClass = 'items-center justify-end text-right';
            if (text_position === 'bottom-left') posClass = 'items-end justify-start text-left';
            if (text_position === 'bottom-center') posClass = 'items-end justify-center text-center';
            if (text_position === 'bottom-right') posClass = 'items-end justify-end text-right';

            return (
              <div key={block.id || index} className="w-full h-full flex-shrink-0 relative">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={heading || 'Slide image'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-50 text-lg" style={{ backgroundColor: 'var(--color-border)' }}>
                    Select an image for slide {index + 1}
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black" style={{ opacity: (overlay_opacity || 0) / 100 }} />

                {/* Content */}
                <div className={`absolute inset-0 p-8 md:p-16 flex ${posClass}`}>
                  <div className="max-w-xl" style={{ color: text_color || '#ffffff' }}>
                    {heading && <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{heading}</h2>}
                    {subheading && <p className="text-lg md:text-xl mb-8 opacity-90">{subheading}</p>}
                    {button_label && button_link && (
                      <Link
                        href={button_link}
                        className="inline-block px-8 py-3 font-bold rounded-lg hover:opacity-80 transition-colors"
                        style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
                      >
                        {button_label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation */}
        {show_arrows && totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center hover:bg-white/50 transition-colors z-10 opacity-0 group-hover:opacity-100"
            >
              <ArrowLeft className="w-6 h-6" style={{ color: 'var(--color-text)' }} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center hover:bg-white/50 transition-colors z-10 opacity-0 group-hover:opacity-100"
            >
              <ArrowRight className="w-6 h-6" style={{ color: 'var(--color-text)' }} />
            </button>
          </>
        )}

        {/* Dots */}
        {show_dots && totalSlides > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {blocks.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export const schema = {
  type: 'slideshow_inset',
  name: 'Slideshow: Inset',
  settings: [
    {
      type: 'select',
      id: 'height',
      label: 'Slide Height',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
        { value: 'adapt', label: 'Adapt to image' }
      ],
      default: 'medium'
    },
    {
      type: 'checkbox',
      id: 'auto_rotate',
      label: 'Auto-rotate slides',
      default: false
    },
    {
      type: 'range',
      id: 'change_slides_every',
      label: 'Change slides every',
      min: 3,
      max: 10,
      step: 1,
      default: 5,
      unit: 's'
    },
    {
      type: 'checkbox',
      id: 'show_dots',
      label: 'Show pagination dots',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_arrows',
      label: 'Show navigation arrows',
      default: true
    },
    {
      type: 'checkbox',
      id: 'section_padding',
      label: 'Add side padding (Container)',
      default: true
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
          type: 'text',
          id: 'subheading',
          label: 'Subheading',
          default: 'Tell your brand story through images'
        },
        {
          type: 'text',
          id: 'button_label',
          label: 'Button Label'
        },
        {
          type: 'text',
          id: 'button_link',
          label: 'Button Link'
        },
        {
          type: 'select',
          id: 'text_position',
          label: 'Content Position',
          options: [
            { value: 'top-left', label: 'Top Left' },
            { value: 'top-center', label: 'Top Center' },
            { value: 'top-right', label: 'Top Right' },
            { value: 'middle-left', label: 'Middle Left' },
            { value: 'middle-center', label: 'Middle Center' },
            { value: 'middle-right', label: 'Middle Right' },
            { value: 'bottom-left', label: 'Bottom Left' },
            { value: 'bottom-center', label: 'Bottom Center' },
            { value: 'bottom-right', label: 'Bottom Right' }
          ],
          default: 'middle-center'
        },
        {
          type: 'color',
          id: 'text_color',
          label: 'Text Color',
          default: '#ffffff'
        },
        {
          type: 'range',
          id: 'overlay_opacity',
          label: 'Overlay Opacity',
          min: 0,
          max: 90,
          step: 10,
          default: 20
        }
      ]
    }
  ],
  defaultBlocks: [
    { type: 'slide' },
    { type: 'slide' }
  ]
};
