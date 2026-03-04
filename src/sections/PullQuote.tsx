'use client';

import { Quote } from 'lucide-react';

interface PullQuoteProps {
  settings: {
    quote: string;
    author: string;
    text_size: 'medium' | 'large' | 'jumbo';
    background_color: string;
    text_color: string;
    show_icon: boolean;
  };
}

export default function PullQuote({ settings }: PullQuoteProps) {
  const {
    quote = 'This is a quote that highlights something important.',
    author = 'Author Name',
    text_size = 'large',
    background_color = '#ffffff',
    text_color = '#000000',
    show_icon = true
  } = settings;

  let textSizeClass = 'text-2xl md:text-3xl';
  if (text_size === 'medium') textSizeClass = 'text-xl md:text-2xl';
  if (text_size === 'jumbo') textSizeClass = 'text-3xl md:text-5xl tracking-tight';

  return (
    <section className="py-16 md:py-24 px-4" style={{ backgroundColor: background_color, color: text_color }}>
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        {show_icon && (
          <div className="mb-6 opacity-30">
            <Quote size={48} />
          </div>
        )}
        <blockquote className={`font-serif leading-relaxed mb-8 ${textSizeClass}`}>
          &ldquo;{quote}&rdquo;
        </blockquote>
        {author && (
          <cite className="not-italic font-medium tracking-wide uppercase text-sm opacity-70">
            — {author}
          </cite>
        )}
      </div>
    </section>
  );
}

export const schema = {
  type: 'pull_quote',
  name: 'Pull quote',
  settings: [
    {
      type: 'textarea',
      id: 'quote',
      label: 'Quote',
      default: 'Add a quote to highlight important information or customer testimonials.'
    },
    {
      type: 'text',
      id: 'author',
      label: 'Author',
      default: ''
    },
    {
      type: 'select',
      id: 'text_size',
      label: 'Text Size',
      options: [
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
        { value: 'jumbo', label: 'Jumbo' }
      ],
      default: 'large'
    },
    {
      type: 'checkbox',
      id: 'show_icon',
      label: 'Show Quote Icon',
      default: true
    },
    {
      type: 'color',
      id: 'background_color',
      label: 'Background Color',
      default: '#ffffff'
    },
    {
      type: 'color',
      id: 'text_color',
      label: 'Text Color',
      default: '#000000'
    }
  ]
};
