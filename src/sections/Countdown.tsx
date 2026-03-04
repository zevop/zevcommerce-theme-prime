'use client';

import { useState, useEffect } from 'react';
import { BlockRenderer } from '@zevcommerce/storefront-api';
import { SectionWrapper } from '../components/SectionWrapper';
import { getSharedBlocks } from '../blocks/schemas';
import { getCommonSectionSettings } from '../helpers/sectionSettingsHelpers';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft | null {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownUnit({ value, label, style, digitColor }: { value: number; label: string; style: string; digitColor?: string }) {
  const display = String(value).padStart(2, '0');

  if (style === 'cards') {
    return (
      <div className="flex flex-col items-center">
        <div
          className="w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center text-3xl md:text-4xl font-bold shadow-sm"
          style={{ backgroundColor: 'var(--color-background)', color: digitColor || 'var(--color-heading)' }}
        >
          {display}
        </div>
        <span className="mt-2 text-xs uppercase tracking-widest opacity-60">{label}</span>
      </div>
    );
  }

  if (style === 'flip') {
    return (
      <div className="flex flex-col items-center">
        <div
          className="w-20 h-20 md:w-24 md:h-24 rounded-lg flex items-center justify-center text-3xl md:text-4xl font-bold border"
          style={{ borderColor: digitColor || 'currentColor', color: digitColor || 'var(--color-heading)', opacity: 0.9 }}
        >
          {display}
        </div>
        <span className="mt-2 text-xs uppercase tracking-widest opacity-60">{label}</span>
      </div>
    );
  }

  // Minimal
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl md:text-6xl font-bold tabular-nums" style={{ color: digitColor || 'var(--color-heading)' }}>
        {display}
      </span>
      <span className="mt-1 text-xs uppercase tracking-widest opacity-60">{label}</span>
    </div>
  );
}

export default function Countdown({ settings, blocks }: { settings: any; blocks: any[] }) {
  const targetDate = settings.target_date || '';
  const digitStyle = settings.digit_style || 'cards';
  const showLabels = settings.show_labels ?? true;
  const expiredMessage = settings.expired_message || 'This offer has ended.';
  const digitColor = settings.digit_color;
  const textColor = settings.text_color || 'var(--color-text)';

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft(targetDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!targetDate) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!targetDate) {
    return (
      <SectionWrapper settings={settings} className="py-12 text-center opacity-40">
        <p>Set a target date to start the countdown.</p>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper settings={settings}>
      <div className="container mx-auto px-4 text-center" style={{ color: textColor }}>
        {/* Heading blocks */}
        {blocks.length > 0 && (
          <div className="mb-8">
            <BlockRenderer blocks={blocks} sectionSettings={settings} className="flex flex-col items-center text-center gap-3" />
          </div>
        )}

        {/* Countdown display */}
        {mounted && !timeLeft ? (
          <p className="text-lg opacity-70">{expiredMessage}</p>
        ) : (
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <CountdownUnit value={timeLeft?.days ?? 0} label={showLabels ? 'Days' : ''} style={digitStyle} digitColor={digitColor} />
            <span className="text-2xl md:text-4xl font-light opacity-30 -mt-6">:</span>
            <CountdownUnit value={timeLeft?.hours ?? 0} label={showLabels ? 'Hours' : ''} style={digitStyle} digitColor={digitColor} />
            <span className="text-2xl md:text-4xl font-light opacity-30 -mt-6">:</span>
            <CountdownUnit value={timeLeft?.minutes ?? 0} label={showLabels ? 'Minutes' : ''} style={digitStyle} digitColor={digitColor} />
            <span className="text-2xl md:text-4xl font-light opacity-30 -mt-6">:</span>
            <CountdownUnit value={timeLeft?.seconds ?? 0} label={showLabels ? 'Seconds' : ''} style={digitStyle} digitColor={digitColor} />
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export const schema = {
  type: 'countdown',
  name: 'Countdown Timer',
  max_blocks: 3,
  settings: [
    { type: 'text', id: 'target_date', label: 'Target Date (YYYY-MM-DD)', default: '' },
    {
      type: 'select', id: 'digit_style', label: 'Digit Style',
      options: [
        { value: 'cards', label: 'Cards' },
        { value: 'minimal', label: 'Minimal' },
        { value: 'flip', label: 'Bordered' },
      ],
      default: 'cards',
    },
    { type: 'checkbox', id: 'show_labels', label: 'Show Labels', default: true },
    { type: 'text', id: 'expired_message', label: 'Expired Message', default: 'This offer has ended.' },
    { type: 'color', id: 'digit_color', label: 'Digit Color' },
    { type: 'color', id: 'text_color', label: 'Text Color' },
    ...getCommonSectionSettings(),
  ],
  blocks: getSharedBlocks([
    {
      type: 'heading',
      name: 'Heading',
      settings: [
        { type: 'text', id: 'text', label: 'Heading', default: 'Sale Ends In' },
        { type: 'select', id: 'tag', label: 'Tag', options: [{ value: 'h2', label: 'H2' }, { value: 'h3', label: 'H3' }], default: 'h2' },
        { type: 'color', id: 'color', label: 'Color' },
      ],
    },
    {
      type: 'text',
      name: 'Description',
      settings: [
        { type: 'textarea', id: 'text', label: 'Text', default: 'Don\'t miss our biggest sale of the year!' },
        { type: 'color', id: 'color', label: 'Color' },
      ],
    },
  ]),
};
