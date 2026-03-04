'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { SectionWrapper } from '../components/SectionWrapper';
import { getCommonSectionSettings } from '../helpers/sectionSettingsHelpers';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

function resolveImage(img: any): string | undefined {
  if (!img) return undefined;
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img.url) return img.url;
  return undefined;
}

export default function Testimonials({ settings, blocks }: { settings: any; blocks: any[] }) {
  const layout = settings.layout || 'carousel';
  const autoplay = settings.autoplay ?? true;
  const autoplaySpeed = (settings.autoplay_speed || 5) * 1000;
  const showStars = settings.show_stars ?? true;
  const showQuoteMark = settings.show_quote_mark ?? true;
  const accentColor = settings.accent_color || 'var(--color-accent)';
  const textColor = settings.text_color || 'var(--color-text)';
  const headingColor = settings.heading_color || 'var(--color-heading)';

  const testimonials = blocks.filter((b) => b.type === 'testimonial');

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsVisible(true);
      }, 300);
    },
    []
  );

  const goNext = useCallback(() => {
    if (testimonials.length === 0) return;
    goTo((currentIndex + 1) % testimonials.length);
  }, [currentIndex, testimonials.length, goTo]);

  const goPrev = useCallback(() => {
    if (testimonials.length === 0) return;
    goTo((currentIndex - 1 + testimonials.length) % testimonials.length);
  }, [currentIndex, testimonials.length, goTo]);

  // Autoplay
  useEffect(() => {
    if (layout !== 'carousel' || !autoplay || testimonials.length <= 1) return;
    intervalRef.current = setInterval(goNext, autoplaySpeed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [layout, autoplay, autoplaySpeed, goNext, testimonials.length]);

  if (testimonials.length === 0) {
    return (
      <SectionWrapper settings={settings} className="py-16 text-center text-gray-400">
        <p>Add testimonial blocks to display customer reviews.</p>
      </SectionWrapper>
    );
  }

  // Grid layout
  if (layout === 'grid') {
    return (
      <SectionWrapper settings={settings}>
        <div className="container mx-auto px-4">
          {settings.title && (
            <h2 className="text-center mb-12" style={{ color: headingColor, fontFamily: 'var(--font-heading)', fontSize: 'var(--h2-font-size)' }}>
              {settings.title}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((block, i) => {
              const s = block.settings || {};
              const avatar = resolveImage(s.avatar);
              return (
                <div key={block._id || i} className="rounded-xl p-8 border border-gray-100" style={{ backgroundColor: 'var(--color-background)' }}>
                  {showQuoteMark && (
                    <Quote className="h-8 w-8 mb-4 opacity-20" style={{ color: accentColor }} />
                  )}
                  {showStars && s.rating && <StarRating rating={Number(s.rating)} />}
                  <p className="mt-4 text-base leading-relaxed" style={{ color: textColor }}>
                    {s.quote}
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    {avatar && (
                      <img src={avatar} alt={s.author || ''} className="h-10 w-10 rounded-full object-cover" />
                    )}
                    <div>
                      <p className="font-semibold text-sm" style={{ color: headingColor }}>{s.author}</p>
                      {s.title && <p className="text-xs opacity-60" style={{ color: textColor }}>{s.title}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>
    );
  }

  // Carousel layout (default)
  const current = testimonials[currentIndex]?.settings || {};
  const currentAvatar = resolveImage(current.avatar);

  return (
    <SectionWrapper settings={settings}>
      <div className="container mx-auto px-4">
        {settings.title && (
          <h2 className="text-center mb-12" style={{ color: headingColor, fontFamily: 'var(--font-heading)', fontSize: 'var(--h2-font-size)' }}>
            {settings.title}
          </h2>
        )}

        <div className="max-w-3xl mx-auto text-center relative">
          {/* Quote mark */}
          {showQuoteMark && (
            <Quote className="h-12 w-12 mx-auto mb-6 opacity-15" style={{ color: accentColor }} />
          )}

          {/* Testimonial content with fade transition */}
          <div className={`transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {showStars && current.rating && (
              <div className="flex justify-center mb-4">
                <StarRating rating={Number(current.rating)} />
              </div>
            )}
            <blockquote className="text-xl md:text-2xl leading-relaxed font-light" style={{ color: textColor }}>
              &ldquo;{current.quote}&rdquo;
            </blockquote>
            <div className="mt-8 flex items-center justify-center gap-3">
              {currentAvatar && (
                <img src={currentAvatar} alt={current.author || ''} className="h-12 w-12 rounded-full object-cover" />
              )}
              <div className="text-left">
                <p className="font-semibold" style={{ color: headingColor }}>{current.author}</p>
                {current.title && <p className="text-sm opacity-60" style={{ color: textColor }}>{current.title}</p>}
              </div>
            </div>
          </div>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 rounded-full border border-gray-200 bg-white/80 hover:bg-white transition-colors shadow-sm hidden md:block"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 rounded-full border border-gray-200 bg-white/80 hover:bg-white transition-colors shadow-sm hidden md:block"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                    style={i === currentIndex ? { backgroundColor: accentColor } : undefined}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}

export const schema = {
  type: 'testimonials',
  name: 'Testimonials',
  max_blocks: 12,
  settings: [
    { type: 'text', id: 'title', label: 'Section Title', default: 'What Our Customers Say' },
    {
      type: 'select', id: 'layout', label: 'Layout',
      options: [
        { value: 'carousel', label: 'Carousel' },
        { value: 'grid', label: 'Grid' },
      ],
      default: 'carousel',
    },
    { type: 'checkbox', id: 'autoplay', label: 'Autoplay', default: true },
    { type: 'range', id: 'autoplay_speed', label: 'Autoplay Speed (seconds)', min: 3, max: 10, step: 1, default: 5 },
    { type: 'checkbox', id: 'show_stars', label: 'Show Star Rating', default: true },
    { type: 'checkbox', id: 'show_quote_mark', label: 'Show Quote Mark', default: true },
    { type: 'color', id: 'accent_color', label: 'Accent Color' },
    { type: 'color', id: 'text_color', label: 'Text Color' },
    { type: 'color', id: 'heading_color', label: 'Heading Color' },
    ...getCommonSectionSettings(),
  ],
  blocks: [
    {
      type: 'testimonial',
      name: 'Testimonial',
      settings: [
        { type: 'textarea', id: 'quote', label: 'Quote', default: 'This is the best store I have ever shopped at. Highly recommended!' },
        { type: 'text', id: 'author', label: 'Author', default: 'Jane Doe' },
        { type: 'text', id: 'title', label: 'Title / Role', default: 'Verified Customer' },
        { type: 'image', id: 'avatar', label: 'Avatar' },
        { type: 'range', id: 'rating', label: 'Star Rating', min: 1, max: 5, step: 1, default: 5 },
      ],
    },
  ],
  defaultBlocks: [
    { type: 'testimonial', settings: { quote: 'Amazing quality and fast shipping. Will definitely order again!', author: 'Sarah M.', title: 'Verified Customer', rating: 5 } },
    { type: 'testimonial', settings: { quote: 'The customer service is exceptional. They went above and beyond to help me.', author: 'James K.', title: 'Repeat Customer', rating: 5 } },
    { type: 'testimonial', settings: { quote: 'Beautiful products and great value for money. My new favourite store!', author: 'Amara O.', title: 'Verified Customer', rating: 5 } },
  ],
};
