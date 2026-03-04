import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useTheme,
  getProduct,
  ProductDataProvider,
  useProduct,
  useCartStore,
  BlockRenderer,
  API_ORIGIN,
} from '@zevcommerce/storefront-api';

// Helper to resolve image URL
const resolveImageUrl = (url: string | null | undefined) => {
  if (!url) return '/placeholder-product.jpg';
  if (url.startsWith('http') || url.startsWith('data:')) return url;

  // Resolve relative paths against backend URL
  // We assume NEXT_PUBLIC_API_URL includes /api/v1/storefront suffix, which we need to strip
  const apiBase = API_ORIGIN;
  // Remove path suffix to get origin (simple approximation or URL parsing)
  try {
    const urlObj = new URL(apiBase);
    return `${urlObj.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  } catch (e) {
    return url;
  }
};

// Product blocks migrated to StandardBlocks.tsx

// Main ProductDetail Section
function ProductDetailContent({ settings, blocks }: { settings: any; blocks?: any[] }) {
  const { product } = useProduct();
  // Default blocks if none provided
  const defaultBlocks = [
    { type: 'product_images', settings: { layout: 'stacked', enable_zoom: true, show_thumbnails: true } },
    { type: 'product_title', settings: { show_vendor: true } },
    { type: 'product_price', settings: { show_compare_at: true } },
    { type: 'product_variants', settings: { style: 'buttons' } },
    { type: 'add_to_cart', settings: { show_quantity: true, button_text: 'Add to Cart' } },
    { type: 'product_description', settings: {} },
  ];

  const activeBlocks = blocks && blocks.length > 0 ? blocks : defaultBlocks;
  const mediaBlocks = activeBlocks.filter(b => ['product_images'].includes(b.type));
  const infoBlocks = activeBlocks.filter(b => !['product_images'].includes(b.type));

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <BlockRenderer blocks={mediaBlocks} sectionSettings={settings} />
          </div>
          <div className="space-y-6">
            <BlockRenderer blocks={infoBlocks} sectionSettings={settings} />
          </div>
        </div>
      </div>
    </section>
  );
}

// Inner component to handle data fetching if needed
function ProductDetailWithValues({ settings, blocks, productSlug }: { settings: any; blocks?: any[]; productSlug?: string }) {
  const { storeConfig } = useTheme();
  const { product: contextProduct, loading: contextLoading } = useProduct(); // Renamed to avoid conflict
  const [localProduct, setLocalProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Determine if we should use the product from the context or fetch locally
  // We fetch locally if a specific product_handle is set in settings (Legacy support removed but logic kept for slug prop), 
  // or if no product is available from context
  const shouldFetchLocally = (!contextProduct && !contextLoading) && !!productSlug; // Removed settings.product_handle check

  useEffect(() => {
    if (!shouldFetchLocally) return;

    async function fetchProduct() {
      const domain = storeConfig?.handle;
      const slug = productSlug;

      if (!domain || !slug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getProduct(domain, slug);
        setLocalProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [storeConfig?.handle, productSlug, shouldFetchLocally]);

  // If fetching locally, provide the local product via a new ProductDataProvider
  if (shouldFetchLocally) {
    return (
      <ProductDataProvider product={localProduct} loading={loading}>
        <ProductDetailContent settings={settings} blocks={blocks} />
      </ProductDataProvider>
    );
  }

  // Otherwise, use the product from the parent context
  return <ProductDetailContent settings={settings} blocks={blocks} />;
}

export default function ProductDetail(props: any) {
  return <ProductDetailWithValues {...props} />;
}

export const schema = {
  type: 'product-detail',
  name: 'Product Detail',
  settings: [
    {
      type: 'select',
      id: 'layout',
      label: 'Layout',
      options: [
        { value: '2-col', label: 'Two Columns' },
        { value: 'full', label: 'Full Width' }
      ],
      default: '2-col'
    }
  ],
  blocks: [
    {
      type: 'product_images',

      name: 'Product Images',
      settings: [
        { type: 'select', id: 'layout', label: 'Gallery Layout', options: [{ value: 'stacked', label: 'Stacked' }, { value: 'carousel', label: 'Carousel' }], default: 'stacked' },
        { type: 'checkbox', id: 'enable_zoom', label: 'Enable Zoom', default: true },
        { type: 'checkbox', id: 'show_thumbnails', label: 'Show Thumbnails', default: true }
      ]
    },
    {
      type: 'product_title',
      name: 'Product Title',
      settings: [
        { type: 'checkbox', id: 'show_vendor', label: 'Show Vendor', default: true },
        { type: 'color', id: 'title_color', label: 'Title Color' }
      ]
    },
    {
      type: 'product_price',
      name: 'Product Price',
      settings: [
        { type: 'checkbox', id: 'show_compare_at', label: 'Show Compare-at Price', default: true },
        { type: 'color', id: 'price_color', label: 'Price Color' },
        { type: 'color', id: 'sale_color', label: 'Sale Color', default: '#EF4444' }
      ]
    },
    {
      type: 'product_variants',
      name: 'Variant Selector',
      settings: [
        { type: 'select', id: 'style', label: 'Style', options: [{ value: 'buttons', label: 'Buttons' }, { value: 'dropdown', label: 'Dropdown' }], default: 'buttons' }
      ]
    },
    {
      type: 'add_to_cart',
      name: 'Add to Cart',
      settings: [
        { type: 'text', id: 'button_text', label: 'Button Text', default: 'Add to Cart' },
        { type: 'checkbox', id: 'show_quantity', label: 'Show Quantity', default: true },
        { type: 'checkbox', id: 'show_buy_now', label: 'Show Buy Now', default: false },
        { type: 'color', id: 'button_color', label: 'Button Color' }
      ]
    },
    {
      type: 'product_description',
      name: 'Product Description',
      settings: [
        { type: 'checkbox', id: 'enable_collapsible', label: 'Collapsible', default: false }
      ]
    }
  ]
};
