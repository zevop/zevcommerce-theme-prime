'use client';

import { useState } from 'react';
import { SectionWrapper } from '../components/SectionWrapper';
import { getCommonSectionSettings } from '../helpers/sectionSettingsHelpers';

export default function Tabs({ settings, blocks }: { settings: any; blocks: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabStyle = settings.tab_style || 'underline';
  const alignment = settings.alignment || 'center';
  const activeColor = settings.active_color || 'var(--color-primary)';
  const textColor = settings.text_color || 'var(--color-text)';

  const tabs = blocks.filter((b) => b.type === 'tab');

  if (tabs.length === 0) {
    return (
      <SectionWrapper settings={settings} className="py-12 text-center text-gray-400">
        <p>Add tab blocks to create tabbed content.</p>
      </SectionWrapper>
    );
  }

  const alignClass = alignment === 'left' ? 'justify-start' : 'justify-center';

  return (
    <SectionWrapper settings={settings}>
      <div className="container mx-auto px-4">
        {settings.title && (
          <h2 className="text-center mb-8" style={{ color: 'var(--color-heading)', fontFamily: 'var(--font-heading)', fontSize: 'var(--h2-font-size)' }}>
            {settings.title}
          </h2>
        )}

        {/* Tab bar */}
        <div className={`flex ${alignClass} gap-1 mb-8 ${tabStyle === 'underline' ? 'border-b border-gray-200' : ''}`}>
          {tabs.map((block, i) => {
            const isActive = i === activeIndex;
            const s = block.settings || {};

            if (tabStyle === 'pills') {
              return (
                <button
                  key={block._id || i}
                  onClick={() => setActiveIndex(i)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${isActive ? 'text-white shadow-sm' : 'hover:bg-gray-100'}`}
                  style={isActive ? { backgroundColor: activeColor, color: '#fff' } : { color: textColor }}
                >
                  {s.title || `Tab ${i + 1}`}
                </button>
              );
            }

            if (tabStyle === 'boxed') {
              return (
                <button
                  key={block._id || i}
                  onClick={() => setActiveIndex(i)}
                  className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 border ${isActive ? 'border-b-transparent -mb-[1px] bg-white' : 'border-transparent hover:text-gray-900'} rounded-t-lg`}
                  style={isActive ? { color: activeColor, borderColor: 'var(--color-border)' } : { color: textColor }}
                >
                  {s.title || `Tab ${i + 1}`}
                </button>
              );
            }

            // Underline (default)
            return (
              <button
                key={block._id || i}
                onClick={() => setActiveIndex(i)}
                className={`px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-[1px] ${isActive ? '' : 'border-transparent hover:border-gray-300'}`}
                style={isActive ? { color: activeColor, borderColor: activeColor } : { color: textColor }}
              >
                {s.title || `Tab ${i + 1}`}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="min-h-[100px]">
          {tabs.map((block, i) => {
            if (i !== activeIndex) return null;
            const s = block.settings || {};
            return (
              <div key={block._id || i} className="animate-fadeIn">
                <div
                  className="prose max-w-none text-base leading-relaxed whitespace-pre-wrap"
                  style={{ color: textColor }}
                >
                  {s.content}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}

export const schema = {
  type: 'tabs',
  name: 'Tabs',
  max_blocks: 8,
  settings: [
    { type: 'text', id: 'title', label: 'Section Title' },
    {
      type: 'select', id: 'tab_style', label: 'Tab Style',
      options: [
        { value: 'underline', label: 'Underline' },
        { value: 'pills', label: 'Pills' },
        { value: 'boxed', label: 'Boxed' },
      ],
      default: 'underline',
    },
    {
      type: 'select', id: 'alignment', label: 'Tab Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
      ],
      default: 'center',
    },
    { type: 'color', id: 'active_color', label: 'Active Tab Color' },
    { type: 'color', id: 'text_color', label: 'Text Color' },
    ...getCommonSectionSettings(),
  ],
  blocks: [
    {
      type: 'tab',
      name: 'Tab',
      settings: [
        { type: 'text', id: 'title', label: 'Tab Title', default: 'Tab' },
        { type: 'textarea', id: 'content', label: 'Content', default: 'Add your content here.' },
      ],
    },
  ],
  defaultBlocks: [
    { type: 'tab', settings: { title: 'About', content: 'Tell your story here. Share information about your brand, values, and what makes you unique.' } },
    { type: 'tab', settings: { title: 'Shipping', content: 'We offer fast and reliable shipping to all locations. Orders are typically processed within 1-2 business days.' } },
    { type: 'tab', settings: { title: 'Returns', content: 'We accept returns within 30 days of purchase. Items must be in original condition with tags attached.' } },
  ],
};
