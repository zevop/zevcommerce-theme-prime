import { defineTheme } from '@zevcommerce/theme-sdk';
import { settingsSchema } from './settings';
import { primeSectionRegistry } from './registry';
import { primeBlockRegistry } from './blocks';
import preset from './preset.json';

const theme = defineTheme({
  handle: 'prime',
  name: 'Prime',
  version: '2.0.0',
  author: {
    name: 'ZevCommerce',
    url: 'https://zevcommerce.com',
  },
  description: 'Clean, modern, and feature-rich — the default ZevCommerce theme.',
  tags: ['modern', 'clean', 'multipurpose', 'responsive'],

  settingsSchema,

  defaultPreset: preset as any,

  registry: {
    sections: primeSectionRegistry,
    blocks: primeBlockRegistry,
  },
});

export default theme;

// Re-export for granular access
export { settingsSchema } from './settings';
export { primeSectionRegistry } from './registry';
export { primeBlockRegistry } from './blocks';
