import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'next',
    'next/link',
    'next/dynamic',
    'next/navigation',
    '@zevcommerce/storefront-api',
    '@zevcommerce/theme-sdk',
    '@tanstack/react-query',
    'lucide-react',
    'sonner',
  ],
  jsx: 'automatic',
});
