'use client';

import { BlockRenderer } from '@zevcommerce/storefront-api';

export default function Announcement({ settings, blocks }: { settings: any, blocks: any[] }) {
  return (
    <section className="w-full">
      <BlockRenderer blocks={blocks} sectionSettings={settings} />
    </section>
  );
}

export const schema = {
  type: 'announcement',
  name: 'Announcement Bar',
  max_blocks: 3,
  settings: [],
  blocks: [
    {
      type: 'announcement',
      name: 'Announcement',
      settings: [
        {
          type: 'text',
          id: 'text',
          label: 'Text',
          default: 'Welcome to our store',
        },
        {
          type: 'color',
          id: 'background_color',
          label: 'Background color',
          default: '#000000',
        },
        {
          type: 'color',
          id: 'text_color',
          label: 'Text color',
          default: '#ffffff',
        },
        {
          type: 'checkbox',
          id: 'sticky',
          label: 'Sticky',
          default: false,
        },
        {
          type: 'checkbox',
          id: 'closable',
          label: 'Closable',
          default: true,
        },
        {
          type: 'checkbox',
          id: 'enable_marquee',
          label: 'Enable animation',
          default: false,
        }
      ]
    }
  ],
  defaultBlocks: [
    {
      type: 'announcement',
      settings: {
        text: 'Welcome to our store'
      }
    }
  ]
};
