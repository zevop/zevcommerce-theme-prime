'use client';

import { useScrollReveal } from '../hooks/useScrollReveal';

interface SectionWrapperProps {
  settings: Record<string, any>;
  className?: string;
  children: React.ReactNode;
  as?: 'section' | 'div' | 'footer' | 'header' | 'nav';
  /** Override the animation style for this section */
  animation?: string;
  /** Skip scroll-reveal (useful for above-the-fold sections like Hero) */
  noReveal?: boolean;
}

const animationClassMap: Record<string, { hidden: string; visible: string }> = {
  'fade-up': {
    hidden: 'opacity-0 translate-y-6',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-in': {
    hidden: 'opacity-0',
    visible: 'opacity-100',
  },
  'slide-left': {
    hidden: 'opacity-0 -translate-x-8',
    visible: 'opacity-100 translate-x-0',
  },
  'slide-right': {
    hidden: 'opacity-0 translate-x-8',
    visible: 'opacity-100 translate-x-0',
  },
};

const gradientDirectionMap: Record<string, string> = {
  'to-b': 'to bottom',
  'to-r': 'to right',
  'to-br': 'to bottom right',
  'to-t': 'to top',
  'to-l': 'to left',
};

export function SectionWrapper({
  settings,
  className = '',
  children,
  as: Tag = 'section',
  animation,
  noReveal = false,
}: SectionWrapperProps) {
  const animStyle = animation || settings.animation || 'fade-up';
  const shouldAnimate = !noReveal && animStyle !== 'none';
  const { ref, isVisible } = useScrollReveal({ once: true });

  // Build background style
  const style: React.CSSProperties = {};

  if (settings.padding_top !== undefined) {
    style.paddingTop = `${settings.padding_top}px`;
  }
  if (settings.padding_bottom !== undefined) {
    style.paddingBottom = `${settings.padding_bottom}px`;
  }

  // Gradient takes priority over solid color
  if (settings.gradient_start && settings.gradient_end) {
    const dir = gradientDirectionMap[settings.gradient_direction || 'to-b'] || 'to bottom';
    style.background = `linear-gradient(${dir}, ${settings.gradient_start}, ${settings.gradient_end})`;
  } else if (settings.background_color) {
    style.backgroundColor = settings.background_color;
  }

  // Background image
  if (settings.bg_image) {
    const imgUrl = typeof settings.bg_image === 'string' ? settings.bg_image : settings.bg_image?.url;
    if (imgUrl) {
      style.backgroundImage = `url("${imgUrl}")`;
      style.backgroundSize = 'cover';
      style.backgroundPosition = 'center';
    }
  }

  // Animation classes
  const anim = animationClassMap[animStyle];
  let animClass = '';
  if (shouldAnimate && anim) {
    animClass = isVisible ? anim.visible : anim.hidden;
  }

  return (
    <Tag
      ref={shouldAnimate ? ref : undefined}
      className={`transition-all duration-700 ease-out ${animClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}
