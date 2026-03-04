'use client';

import { useTheme } from '@zevcommerce/storefront-api';

export default function Copyright({ settings }: { settings: any }) {
  const { storeConfig } = useTheme();
  const {
    copyrightText,
    backgroundColor = '#F9FAFB',
    text_color = '#9ca3af',
    alignment = 'center',
    showBorder = true,
  } = settings;

  const storeName = storeConfig?.name || 'Store';
  const finalCopyright = copyrightText || `© ${new Date().getFullYear()} ${storeName}`;

  const alignmentClasses: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div
      className={`py-6 ${showBorder ? 'border-t' : ''}`}
      style={{ backgroundColor, borderColor: 'var(--color-border)' }}
    >
      <div className={`container mx-auto px-4 ${alignmentClasses[alignment] || 'text-center'}`}>
        <p className="text-[11px]" style={{ color: text_color }}>{finalCopyright}</p>
      </div>
    </div>
  );
}

export const schema = {
  type: 'copyright',
  name: 'Copyright Bar',
  settings: [
    { type: 'text', id: 'copyrightText', label: 'Copyright Override', default: '' },
    { type: 'color', id: 'backgroundColor', label: 'Background Color', default: '#F9FAFB' },
    { type: 'color', id: 'text_color', label: 'Text Color', default: '#9ca3af' },
    {
      type: 'select', id: 'alignment', label: 'Alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      default: 'center',
    },
    { type: 'checkbox', id: 'showBorder', label: 'Show Top Border', default: true },
  ],
};
