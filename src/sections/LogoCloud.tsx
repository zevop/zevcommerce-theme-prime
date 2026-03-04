'use client';

import { SectionWrapper } from '../components/SectionWrapper';
import { getCommonSectionSettings } from '../helpers/sectionSettingsHelpers';

function resolveImage(img: any): string | undefined {
  if (!img) return undefined;
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img.url) return img.url;
  return undefined;
}

export default function LogoCloud({ settings, blocks }: { settings: any; blocks: any[] }) {
  const columns = settings.columns || 5;
  const grayscale = settings.grayscale ?? true;
  const logoHeight = settings.logo_height || 40;
  const title = settings.title;
  const logos = blocks.filter((b) => b.type === 'logo');

  if (logos.length === 0) {
    return (
      <SectionWrapper settings={settings} className="py-12 text-center text-gray-400">
        <p>Add logo blocks to display partner logos.</p>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper settings={settings}>
      <div className="container mx-auto px-4">
        {title && (
          <p className="text-center text-sm font-medium uppercase tracking-widest mb-8 opacity-50" style={{ color: 'var(--color-text)' }}>
            {title}
          </p>
        )}
        <div
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
          style={{ ['--cols' as any]: columns }}
        >
          {logos.map((block, i) => {
            const s = block.settings || {};
            const imgUrl = resolveImage(s.image);
            const alt = s.alt || `Partner ${i + 1}`;
            const link = s.link;

            const img = imgUrl ? (
              <img
                src={imgUrl}
                alt={alt}
                className={`object-contain transition-all duration-300 ${grayscale ? 'grayscale opacity-50 hover:grayscale-0 hover:opacity-100' : ''}`}
                style={{ height: `${logoHeight}px`, maxWidth: '160px' }}
              />
            ) : (
              <div
                className="flex items-center justify-center bg-gray-100 rounded-lg px-6"
                style={{ height: `${logoHeight}px`, minWidth: '100px' }}
              >
                <span className="text-xs text-gray-400 font-medium">{alt}</span>
              </div>
            );

            if (link) {
              return (
                <a key={block._id || i} href={link} target="_blank" rel="noopener noreferrer" className="inline-flex">
                  {img}
                </a>
              );
            }

            return <div key={block._id || i} className="inline-flex">{img}</div>;
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}

export const schema = {
  type: 'logo_cloud',
  name: 'Logo Cloud',
  max_blocks: 12,
  settings: [
    { type: 'text', id: 'title', label: 'Title', default: 'Trusted by leading brands' },
    { type: 'range', id: 'columns', label: 'Logos per Row', min: 3, max: 6, step: 1, default: 5 },
    { type: 'range', id: 'logo_height', label: 'Logo Height (px)', min: 24, max: 80, step: 4, default: 40 },
    { type: 'checkbox', id: 'grayscale', label: 'Grayscale (color on hover)', default: true },
    ...getCommonSectionSettings(),
  ],
  blocks: [
    {
      type: 'logo',
      name: 'Logo',
      settings: [
        { type: 'image', id: 'image', label: 'Logo Image' },
        { type: 'text', id: 'alt', label: 'Alt Text', default: 'Partner' },
        { type: 'text', id: 'link', label: 'Link (optional)' },
      ],
    },
  ],
  defaultBlocks: [
    { type: 'logo', settings: { alt: 'Brand One' } },
    { type: 'logo', settings: { alt: 'Brand Two' } },
    { type: 'logo', settings: { alt: 'Brand Three' } },
    { type: 'logo', settings: { alt: 'Brand Four' } },
    { type: 'logo', settings: { alt: 'Brand Five' } },
  ],
};
