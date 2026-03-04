'use client';

import { useEffect, useState, useRef } from 'react';
import { SectionWrapper } from '../components/SectionWrapper';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getCommonSectionSettings } from '../helpers/sectionSettingsHelpers';
import {
  Package, Users, Star, Clock, Shield, Truck, Heart, Award,
  Globe, Zap, CheckCircle, TrendingUp,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  package: Package, users: Users, star: Star, clock: Clock,
  shield: Shield, truck: Truck, heart: Heart, award: Award,
  globe: Globe, zap: Zap, check: CheckCircle, trending: TrendingUp,
};

function AnimatedNumber({ target, animate, isVisible }: { target: string; animate: boolean; isVisible: boolean }) {
  const [display, setDisplay] = useState(target);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!animate || !isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    // Extract numeric portion
    const match = target.match(/^([^\d]*)(\d[\d,.]*)(.*)$/);
    if (!match) { setDisplay(target); return; }

    const prefix = match[1];
    const numStr = match[2].replace(/,/g, '');
    const suffix = match[3];
    const targetNum = parseFloat(numStr);

    if (isNaN(targetNum)) { setDisplay(target); return; }

    const duration = 1500;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(targetNum * eased);
      setDisplay(`${prefix}${current.toLocaleString()}${suffix}`);

      if (step >= steps) {
        clearInterval(timer);
        setDisplay(target);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [animate, isVisible, target]);

  return <>{display}</>;
}

export default function Stats({ settings, blocks }: { settings: any; blocks: any[] }) {
  const columns = settings.columns || 4;
  const numberSize = settings.number_size || 'large';
  const animateNumbers = settings.animate_numbers ?? true;
  const numberColor = settings.number_color || 'var(--color-heading)';
  const textColor = settings.text_color || 'var(--color-text)';
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  const stats = blocks.filter((b) => b.type === 'stat');

  const sizeClass: Record<string, string> = {
    medium: 'text-3xl md:text-4xl',
    large: 'text-4xl md:text-5xl',
    jumbo: 'text-5xl md:text-7xl',
  };

  if (stats.length === 0) {
    return (
      <SectionWrapper settings={settings} className="py-12 text-center opacity-40">
        <p>Add stat blocks to display numbers.</p>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper settings={settings}>
      <div className="container mx-auto px-4" ref={ref}>
        {settings.title && (
          <h2 className="text-center mb-12" style={{ color: 'var(--color-heading)', fontFamily: 'var(--font-heading)', fontSize: 'var(--h2-font-size)' }}>
            {settings.title}
          </h2>
        )}
        <div
          className="grid gap-8 md:gap-12"
          style={{ gridTemplateColumns: `repeat(${Math.min(columns, stats.length)}, minmax(0, 1fr))` }}
        >
          {stats.map((block, i) => {
            const s = block.settings || {};
            const IconComponent = s.icon ? iconMap[s.icon] : null;

            return (
              <div
                key={block._id || i}
                className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {IconComponent && (
                  <div className="flex justify-center mb-3">
                    <IconComponent className="h-6 w-6 opacity-40" style={{ color: numberColor }} />
                  </div>
                )}
                <div className={`font-bold tracking-tight ${sizeClass[numberSize] || sizeClass.large}`} style={{ color: numberColor, fontFamily: 'var(--font-heading)' }}>
                  <AnimatedNumber target={s.number || '0'} animate={animateNumbers} isVisible={isVisible} />
                </div>
                {s.label && (
                  <p className="mt-2 text-sm font-medium opacity-60" style={{ color: textColor }}>
                    {s.label}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}

export const schema = {
  type: 'stats',
  name: 'Stats / Numbers',
  max_blocks: 6,
  settings: [
    { type: 'text', id: 'title', label: 'Section Title' },
    { type: 'range', id: 'columns', label: 'Columns', min: 2, max: 5, step: 1, default: 4 },
    {
      type: 'select', id: 'number_size', label: 'Number Size',
      options: [
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
        { value: 'jumbo', label: 'Jumbo' },
      ],
      default: 'large',
    },
    { type: 'checkbox', id: 'animate_numbers', label: 'Animate Count Up', default: true },
    { type: 'color', id: 'number_color', label: 'Number Color' },
    { type: 'color', id: 'text_color', label: 'Label Color' },
    ...getCommonSectionSettings(),
  ],
  blocks: [
    {
      type: 'stat',
      name: 'Stat',
      settings: [
        { type: 'text', id: 'number', label: 'Number', default: '10,000+' },
        { type: 'text', id: 'label', label: 'Label', default: 'Happy Customers' },
        {
          type: 'select', id: 'icon', label: 'Icon (optional)',
          options: [
            { value: '', label: 'None' },
            { value: 'users', label: 'Users' },
            { value: 'package', label: 'Package' },
            { value: 'star', label: 'Star' },
            { value: 'clock', label: 'Clock' },
            { value: 'shield', label: 'Shield' },
            { value: 'truck', label: 'Truck' },
            { value: 'heart', label: 'Heart' },
            { value: 'award', label: 'Award' },
            { value: 'globe', label: 'Globe' },
            { value: 'zap', label: 'Zap' },
            { value: 'check', label: 'Check' },
            { value: 'trending', label: 'Trending' },
          ],
          default: '',
        },
      ],
    },
  ],
  defaultBlocks: [
    { type: 'stat', settings: { number: '10,000+', label: 'Happy Customers', icon: 'users' } },
    { type: 'stat', settings: { number: '500+', label: 'Products', icon: 'package' } },
    { type: 'stat', settings: { number: '4.9', label: 'Average Rating', icon: 'star' } },
    { type: 'stat', settings: { number: '24/7', label: 'Customer Support', icon: 'clock' } },
  ],
};
