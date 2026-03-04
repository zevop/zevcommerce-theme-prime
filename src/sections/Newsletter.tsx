'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { SectionWrapper } from '../components/SectionWrapper';
import { getCommonSectionSettings } from '../helpers/sectionSettingsHelpers';

function resolveImage(img: any): string | undefined {
  if (!img) return undefined;
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img.url) return img.url;
  return undefined;
}

export default function Newsletter({ settings }: { settings: any }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const layout = settings.layout || 'stacked';
  const bgImage = resolveImage(settings.bg_image);
  const overlayOpacity = settings.overlay_opacity ?? 60;
  const bgColor = settings.section_bg_color || settings.background_color || '#111827';
  const textColor = settings.section_text_color || settings.text_color || '#ffffff';
  const accentColor = settings.accent_color || 'var(--color-accent)';

  // Determine button text color based on accent color luminance
  const getButtonTextColor = (bg: string) => {
    if (!bg || bg.startsWith('var(')) return '#ffffff';
    const c = bg.replace('#', '');
    if (c.length !== 6) return '#ffffff';
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 150 ? '#111827' : '#ffffff';
  };
  const buttonTextColor = getButtonTextColor(accentColor);
  const heading = settings.heading || 'Stay in the loop';
  const description = settings.description || 'Subscribe to our newsletter for the latest updates, exclusive offers, and new arrivals.';
  const buttonText = settings.button_text || 'Subscribe';
  const placeholder = settings.placeholder || 'Enter your email';
  const successMessage = settings.success_message || 'Thanks for subscribing!';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // In a real implementation, this would call an API
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setEmail('');
  };

  const sectionStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    color: textColor,
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <SectionWrapper settings={settings} className="relative" animation={settings.animation}>
      <div style={sectionStyle}>
        {/* Background image */}
        {bgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${bgImage}")` }}
          >
            <div className="absolute inset-0" style={{ backgroundColor: bgColor, opacity: overlayOpacity / 100 }} />
          </div>
        )}

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-24">
          {layout === 'inline' ? (
            // Inline layout: heading left, form right
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 max-w-5xl mx-auto">
              <div className="md:flex-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {heading}
                </h2>
                <p className="opacity-70 text-sm md:text-base">{description}</p>
              </div>
              <div className="md:flex-1 md:max-w-md">
                {submitted ? (
                  <p className="text-center py-3 font-medium" style={{ color: accentColor }}>{successMessage}</p>
                ) : (
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={placeholder}
                      required
                      className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-inherit placeholder:text-white/40 outline-none focus:border-white/50 transition-colors text-sm"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-lg font-medium text-sm transition-all hover:opacity-90 shrink-0 flex items-center gap-2"
                      style={{ backgroundColor: accentColor, color: buttonTextColor }}
                    >
                      <Send className="h-4 w-4" />
                      {buttonText}
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            // Stacked layout: centered
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                {heading}
              </h2>
              <p className="opacity-70 mb-8 text-sm md:text-base">{description}</p>
              {submitted ? (
                <p className="py-3 font-medium" style={{ color: accentColor }}>{successMessage}</p>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    required
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-inherit placeholder:text-white/40 outline-none focus:border-white/50 transition-colors text-sm"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg font-medium text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ backgroundColor: accentColor, color: buttonTextColor }}
                  >
                    <Send className="h-4 w-4" />
                    {buttonText}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}

export const schema = {
  type: 'newsletter',
  name: 'Newsletter',
  settings: [
    { type: 'text', id: 'heading', label: 'Heading', default: 'Stay in the loop' },
    { type: 'textarea', id: 'description', label: 'Description', default: 'Subscribe to our newsletter for the latest updates, exclusive offers, and new arrivals.' },
    {
      type: 'select', id: 'layout', label: 'Layout',
      options: [
        { value: 'stacked', label: 'Stacked (Centered)' },
        { value: 'inline', label: 'Inline (Side by Side)' },
      ],
      default: 'stacked',
    },
    { type: 'text', id: 'button_text', label: 'Button Text', default: 'Subscribe' },
    { type: 'text', id: 'placeholder', label: 'Input Placeholder', default: 'Enter your email' },
    { type: 'text', id: 'success_message', label: 'Success Message', default: 'Thanks for subscribing!' },
    { type: 'image', id: 'bg_image', label: 'Background Image' },
    { type: 'range', id: 'overlay_opacity', label: 'Image Overlay', min: 0, max: 100, step: 5, default: 60 },
    { type: 'color', id: 'section_bg_color', label: 'Background Color' },
    { type: 'color', id: 'section_text_color', label: 'Text Color' },
    { type: 'color', id: 'accent_color', label: 'Button Color' },
    ...getCommonSectionSettings().filter((s: any) => !['background_color'].includes(s.id)),
  ],
  blocks: [],
};
