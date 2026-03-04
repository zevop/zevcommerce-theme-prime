'use client'

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

// 404 Message Block
function NotFoundMessageBlock({ settings }: { settings: any }) {
  return (
    <div className="text-center">
      <h1
        className="text-8xl md:text-9xl font-bold mb-4"
        style={{ color: settings.code_color || '#E5E7EB' }}
      >
        404
      </h1>
      <h2
        className="text-2xl md:text-3xl font-bold mb-4"
        style={{ color: settings.title_color || 'var(--color-text)' }}
      >
        {settings.title || 'Page not found'}
      </h2>
      <p className="opacity-50 max-w-md mx-auto">
        {settings.description || "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted."}
      </p>
    </div>
  );
}

// 404 Actions Block
function NotFoundActionsBlock({ settings }: { settings: any }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
        style={{ backgroundColor: settings.primary_button_color || 'var(--color-primary)' }}
      >
        <Home className="w-4 h-4" />
        {settings.home_button_text || 'Go Home'}
      </Link>

      {settings.show_back_button && (
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border hover:opacity-80 transition"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      )}
    </div>
  );
}

// 404 Search Block
function NotFoundSearchBlock({ settings }: { settings: any }) {
  if (!settings.show_search) return null;

  return (
    <div className="mt-8 max-w-md mx-auto">
      <form action="/search" className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
        <input
          type="search"
          name="q"
          placeholder={settings.search_placeholder || 'Try searching...'}
          className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-current/20 focus:border-current outline-none transition"
          style={{ borderColor: 'var(--color-border)' }}
        />
      </form>
    </div>
  );
}

// 404 Suggested Links Block
function NotFoundLinksBlock({ settings }: { settings: any }) {
  const links = settings.links || [
    { label: 'Shop All', url: '/collections' },
    { label: 'New Arrivals', url: '/collections/new-arrivals' },
    { label: 'Contact Us', url: '/pages/contact' },
  ];

  if (!settings.show_links) return null;

  return (
    <div className="mt-12 text-center">
      <p className="text-sm opacity-50 mb-4">Or check out these popular pages:</p>
      <div className="flex flex-wrap justify-center gap-3">
        {links.map((link: any, idx: number) => (
          <Link
            key={idx}
            href={link.url}
            className="px-4 py-2 rounded-full border text-sm font-medium hover:opacity-80 transition"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Block Registry
const NOT_FOUND_BLOCKS: Record<string, React.FC<{ settings: any }>> = {
  not_found_message: NotFoundMessageBlock,
  not_found_actions: NotFoundActionsBlock,
  not_found_search: NotFoundSearchBlock,
  not_found_links: NotFoundLinksBlock,
};

// Main 404 Section
export default function NotFoundSection({ settings, blocks }: { settings: any; blocks?: any[] }) {
  const defaultBlocks = [
    { type: 'not_found_message', settings: { title: 'Page not found' } },
    { type: 'not_found_actions', settings: { show_back_button: true } },
    { type: 'not_found_search', settings: { show_search: true } },
    { type: 'not_found_links', settings: { show_links: true } },
  ];

  const activeBlocks = blocks && blocks.length > 0 ? blocks : defaultBlocks;

  return (
    <section
      className="min-h-[70vh] flex items-center justify-center py-16"
      style={{ backgroundColor: settings.bg_color || 'var(--color-background)' }}
    >
      <div className="container mx-auto px-4">
        {activeBlocks.map((block, idx) => {
          const BlockComponent = NOT_FOUND_BLOCKS[block.type];
          if (!BlockComponent) return null;
          return <BlockComponent key={idx} settings={block.settings || {}} />;
        })}
      </div>
    </section>
  );
}

export const schema = {
  type: 'not-found-section',
  name: '404 Page',
  settings: [
    { type: 'color', id: 'bg_color', label: 'Background Color', default: '#ffffff' }
  ],
  blocks: [
    {
      type: 'not_found_message',
      name: '404 Message',
      settings: [
        { type: 'text', id: 'title', label: 'Title', default: 'Page not found' },
        { type: 'textarea', id: 'description', label: 'Description', default: "Sorry, we couldn't find the page you're looking for." },
        { type: 'color', id: 'code_color', label: '404 Code Color', default: '#E5E7EB' },
        { type: 'color', id: 'title_color', label: 'Title Color' }
      ]
    },
    {
      type: 'not_found_actions',
      name: 'Action Buttons',
      settings: [
        { type: 'text', id: 'home_button_text', label: 'Home Button Text', default: 'Go Home' },
        { type: 'color', id: 'primary_button_color', label: 'Primary Button Color' },
        { type: 'checkbox', id: 'show_back_button', label: 'Show Back Button', default: true }
      ]
    },
    {
      type: 'not_found_search',
      name: 'Search Box',
      settings: [
        { type: 'checkbox', id: 'show_search', label: 'Show Search', default: true },
        { type: 'text', id: 'search_placeholder', label: 'Placeholder', default: 'Try searching...' }
      ]
    },
    {
      type: 'not_found_links',
      name: 'Suggested Links',
      settings: [
        { type: 'checkbox', id: 'show_links', label: 'Show Links', default: true }
      ]
    }
  ]
};
