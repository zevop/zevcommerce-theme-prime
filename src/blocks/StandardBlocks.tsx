'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Music2, Globe, ShoppingBag, Loader2, ChevronDown, ChevronRight, Mail, Phone, MapPin, Star, Heart, Info, AlertCircle, CheckCircle, ArrowRight, Plus, Minus, Megaphone, Tag, Truck, Gift, Sparkles, ThumbsUp, X, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  getProduct, getCollection, getProducts, getOrder,
  ProductCard, CheckoutForm,
  useTheme, useProduct, useCollection, useCartStore, useEditor,
  resolveMenuUrl, cn, getStorePermalink,
  API_ORIGIN,
} from '@zevcommerce/storefront-api';
import { formatPrice } from '../helpers/format-price';
import { useRouter, useSearchParams } from 'next/navigation';

// Helper to resolve alignment classes
const getAlignmentClass = (align: string) => {
  switch (align) {
    case 'center': return 'text-center';
    case 'right': return 'text-right';
    default: return 'text-left';
  }
};

const getFlexAlignmentClass = (align: string) => {
  switch (align) {
    case 'center': return 'justify-center';
    case 'right': return 'justify-end';
    default: return 'justify-start';
  }
};

export function HeadingBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const Tag = (settings.tag || 'h2') as any;
  const size = settings.size || 'md';

  // Resolve Alignment (Block > Section > Global)
  let align = settings.enable_custom_alignment ? settings.alignment : (sectionSettings?.alignment || 'left');
  if (!settings.enable_custom_alignment && sectionSettings?.alignment === undefined) {
    // If not enabled in block AND not set in section, default to left
    align = 'left';
  }
  const alignClass = getAlignmentClass(align);

  const style: React.CSSProperties = {
    color: settings.color || sectionSettings?.text_color || 'inherit'
  };

  if (settings.text_bg_color && settings.text_bg_color !== 'rgba(0,0,0,0)') {
    style.backgroundColor = settings.text_bg_color;
    style.padding = '0.5rem 1rem';
    style.borderRadius = '0.25rem';
    style.display = 'inline-block';
  }

  // Size classes
  let sizeClass = '';
  switch (size) {
    case 'sm': sizeClass = 'text-lg md:text-xl'; break;
    case 'lg': sizeClass = 'text-3xl md:text-4xl'; break;
    case 'xl': sizeClass = 'text-4xl md:text-5xl'; break;
    case 'jumbo': sizeClass = 'text-5xl md:text-7xl tracking-tighter'; break;
    case 'md':
    default: sizeClass = 'text-2xl md:text-3xl'; break;
  }

  const className = `font-bold mb-4 leading-tight ${alignClass} ${sizeClass}`;

  // Wrapper for alignment if display is inline-block
  if (style.display === 'inline-block') {
    return (
      <div className={`mb-4 ${alignClass}`}>
        <Tag className={`font-bold ${sizeClass}`} style={style}>
          {settings.text || 'Heading'}
        </Tag>
      </div>
    );
  }

  return (
    <Tag
      className={className}
      style={style}
    >
      {settings.text || 'Heading'}
    </Tag>
  );
}

export function TextBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const align = settings.enable_custom_alignment ? settings.alignment : (sectionSettings?.alignment || 'left');
  const alignClass = getAlignmentClass(align);

  const style: React.CSSProperties = {
    color: settings.color || sectionSettings?.text_color || 'inherit'
  };

  if (settings.text_bg_color && settings.text_bg_color !== 'rgba(0,0,0,0)') {
    style.backgroundColor = settings.text_bg_color;
    style.padding = '0.5rem 1rem';
    style.borderRadius = '0.25rem';
    style.display = 'inline-block';
  }

  if (style.display === 'inline-block') {
    return (
      <div className={`mb-4 ${alignClass}`}>
        <div className="whitespace-pre-wrap opacity-70" style={{ color: 'var(--color-text)', ...style }}>
          {settings.text || 'Add your text here.'}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mb-4 whitespace-pre-wrap opacity-70 ${alignClass}`}
      style={{ color: 'var(--color-text)', ...style }}
    >
      {settings.text || 'Add your text here.'}
    </div>
  );
}

export function ButtonBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const align = settings.enable_custom_alignment ? settings.alignment : (sectionSettings?.alignment || 'left');
  const flexAlignKey = getFlexAlignmentClass(align);
  const style = settings.style || 'primary';

  const bgColor = settings.bg_color || (style === 'primary' ? sectionSettings?.button_bg : sectionSettings?.secondary_button_bg);
  const textColor = settings.text_color || (style === 'primary' ? sectionSettings?.button_text : sectionSettings?.secondary_button_text);

  return (
    <div className={`mb-4 flex ${flexAlignKey}`}>
      <Link
        href={settings.link || '#'}
        className={`px-8 py-3 transition-colors inline-block font-medium ${style === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
        style={{
          backgroundColor: bgColor,
          color: textColor
        }}
      >
        {settings.text || 'Button'}
      </Link>
    </div>
  );
}

export function ImageBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  if (!settings.image) return <div className="aspect-video flex items-center justify-center opacity-40 mb-4 rounded" style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text)' }}>No image selected</div>;

  const aspectRatio = settings.aspect_ratio || 'original';
  const widthDesktop = settings.width_desktop || 100;
  const widthMobile = settings.width_mobile || 100;
  const alignment = settings.alignment || 'center';

  let aspectClass = '';
  switch (aspectRatio) {
    case 'square': aspectClass = 'aspect-square'; break;
    case 'portrait': aspectClass = 'aspect-[4/5]'; break;
    case 'landscape': aspectClass = 'aspect-[16/9]'; break;
    case 'wide': aspectClass = 'aspect-[21/9]'; break;
  }

  const containerStyle = {
    width: 'var(--w-custom)',
  } as React.CSSProperties;

  return (
    <div className={`mb-4 flex ${getFlexAlignmentClass(alignment)}`}>
      <div
        className={`overflow-hidden rounded shadow-sm ${aspectClass}`}
        style={{
          ...containerStyle,
          '--w-custom': widthMobile === 100 ? '100%' : `${widthMobile}%`
        } as any}
      >
        <div className="hidden md:block" style={{ width: widthDesktop === 100 ? '100%' : `${widthDesktop}%` }}>
          <img src={settings.image} alt={settings.alt || ''} className="w-full h-full object-cover" />
        </div>
        <div className="md:hidden">
          <img src={settings.image} alt={settings.alt || ''} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}

export function VideoBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const aspectRatio = settings.aspect_ratio || 'video';
  let aspectClass = 'aspect-video';
  if (aspectRatio === 'square') aspectClass = 'aspect-square';
  if (aspectRatio === 'portrait') aspectClass = 'aspect-[9/16]';

  const isUpload = settings.source_type === 'upload';
  const url = isUpload ? settings.video_file : settings.video_url;

  if (!url) {
    return (
      <div className={`${aspectClass} flex items-center justify-center opacity-40 mb-4 rounded`} style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text)' }}>
        Select a video source
      </div>
    );
  }

  if (isUpload) {
    return (
      <div className={`mb-4 overflow-hidden rounded shadow-sm relative ${aspectClass}`}>
        <video
          src={url}
          className="w-full h-full object-cover"
          controls
          autoPlay={settings.autoplay}
          muted={settings.autoplay}
          loop
          playsInline
        />
      </div>
    );
  }

  // Robust URL handling for YouTube/Vimeo
  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = url.includes('vimeo.com');

  if (isYoutube) {
    const videoId = url.split('v=')[1] || url.split('/').pop()?.split('?')[0];
    return (
      <div className={`mb-4 overflow-hidden rounded shadow-sm relative ${aspectClass}`}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${settings.autoplay ? 1 : 0}&mute=${settings.autoplay ? 1 : 0}&loop=1&playlist=${videoId}`}
          className="w-full h-full absolute inset-0"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  if (isVimeo) {
    const videoId = url.split('/').pop()?.split('?')[0];
    return (
      <div className={`mb-4 overflow-hidden rounded shadow-sm relative ${aspectClass}`}>
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?autoplay=${settings.autoplay ? 1 : 0}&muted=${settings.autoplay ? 1 : 0}&loop=1`}
          className="w-full h-full absolute inset-0"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return (
    <div className={`mb-4 overflow-hidden rounded shadow-sm relative ${aspectClass}`}>
      <video
        src={url}
        className="w-full h-full object-cover"
        controls
        autoPlay={settings.autoplay}
        muted={settings.autoplay}
        loop
        playsInline
      />
    </div>
  );
}

export function CollectionBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const params = useParams();
  const domain = params?.domain as string;
  const collectionSlug = settings.collection_handle;

  const { data: collection, isLoading } = useQuery({
    queryKey: ['collection', domain, collectionSlug],
    queryFn: () => domain && collectionSlug ? getCollection(domain, collectionSlug) : null,
    enabled: !!domain && !!collectionSlug
  });

  if (!collectionSlug) {
    return (
      <div className="mb-4 p-4 border border-dashed rounded text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
        <span className="text-xs font-semibold uppercase tracking-wider block mb-1 opacity-50" style={{ color: 'var(--color-text)' }}>Collection</span>
        <h3 className="text-lg font-medium opacity-40" style={{ color: 'var(--color-text)' }}>Select Collection</h3>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mb-4 p-8 flex items-center justify-center border rounded" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
        <Loader2 className="animate-spin opacity-30" style={{ color: 'var(--color-text)' }} />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider opacity-40" style={{ color: 'var(--color-text)' }}>Collection</span>
        <h3 className="text-xl font-bold">{settings.title_override || collection?.title || 'Collection'}</h3>
      </div>

      {collection?.products && (
        <div className="grid grid-cols-2 gap-4">
          {collection.products.slice(0, 4).map(({ product }: any) => (
            <ProductCard
              key={product.id}
              product={product}
              domain={domain}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// --- Product Detail Blocks ---

const resolveImageUrl = (url: string | null | undefined) => {
  if (!url) return '/placeholder-product.jpg';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const apiBase = API_ORIGIN;
  try {
    const urlObj = new URL(apiBase);
    return `${urlObj.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  } catch (e) {
    return url;
  }
};

export function ProductImagesBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { product, loading } = useProduct();
  const [activeIndex, setActiveIndex] = useState(0);

  if (loading || !product) {
    return (
      <div className="space-y-4">
        <div className="aspect-square rounded-xl animate-pulse" style={{ backgroundColor: 'var(--color-border)' }} />
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-16 h-16 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--color-border)' }} />
          ))}
        </div>
      </div>
    );
  }

  const images = product.media || [];
  const mainImage = resolveImageUrl(images[activeIndex]?.url);

  return (
    <div className="space-y-4 mb-8">
      <div className={`relative overflow-hidden rounded-xl ${(settings.enable_zoom ?? true) ? 'cursor-zoom-in hover:scale-105 transition-transform' : ''}`} style={{ backgroundColor: 'var(--color-border)' }}>
        <img
          src={mainImage}
          alt={product.title}
          className="w-full aspect-square object-cover"
        />
      </div>

      {(settings.show_thumbnails ?? true) && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${idx === activeIndex ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:opacity-70'
                }`}
              style={{ borderColor: idx === activeIndex ? 'var(--color-primary)' : undefined }}
            >
              <img src={resolveImageUrl(img.url)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductTitleBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { product, loading } = useProduct();

  if (loading || !product) {
    return (
      <div className="space-y-2 mb-4">
        <div className="h-4 w-24 rounded animate-pulse" style={{ backgroundColor: 'var(--color-border)' }} />
        <div className="h-8 w-3/4 rounded animate-pulse" style={{ backgroundColor: 'var(--color-border)' }} />
      </div>
    );
  }

  const showVendor = settings.show_vendor ?? true;
  const alignment = settings.enable_custom_alignment ? settings.alignment : (sectionSettings?.alignment || 'left');
  const alignClass = getAlignmentClass(alignment);

  return (
    <div className={`space-y-1 mb-4 ${alignClass}`}>
      {showVendor && product.vendor && (
        <p className="text-sm uppercase tracking-widest font-medium opacity-40">{product.vendor}</p>
      )}
      <h1
        className="text-2xl md:text-3xl font-bold tracking-tight"
        style={{ color: settings.title_color || sectionSettings?.text_color || 'var(--color-heading)' }}
      >
        {product.title}
      </h1>
    </div>
  );
}

export function ProductPriceBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { product, selectedVariant, loading } = useProduct();
  const { storeConfig } = useTheme();

  if (loading || !product) {
    return <div className="h-8 w-32 rounded animate-pulse mb-6" style={{ backgroundColor: 'var(--color-border)' }} />;
  }

  const variant = selectedVariant || product.variants?.[0];
  const price = variant?.price || product.price;
  const compareAt = variant?.compareAtPrice || product.compareAtPrice;
  const currency = storeConfig?.currency || 'NGN';
  const alignment = settings.enable_custom_alignment ? settings.alignment : (sectionSettings?.alignment || 'left');
  const flexAlign = getFlexAlignmentClass(alignment);

  return (
    <div className={`flex items-baseline gap-3 mb-6 ${flexAlign}`}>
      <span
        className="text-2xl font-bold"
        style={{ color: (compareAt && compareAt > price) ? (settings.sale_color || '#EF4444') : (settings.price_color || sectionSettings?.text_color || 'var(--color-heading)') }}
      >
        {formatPrice(price, currency)}
      </span>
      {(settings.show_compare_at ?? true) && compareAt && compareAt > price && (
        <span className="text-lg line-through font-medium opacity-40">{formatPrice(compareAt, currency)}</span>
      )}
    </div>
  );
}

export function ProductVariantsBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { product, selectedVariant, setSelectedVariant, loading } = useProduct();

  if (loading || !product) {
    return (
      <div className="space-y-3 mb-6">
        <div className="h-4 w-20 rounded animate-pulse" style={{ backgroundColor: 'var(--color-border)' }} />
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-12 h-10 rounded animate-pulse" style={{ backgroundColor: 'var(--color-border)' }} />
          ))}
        </div>
      </div>
    );
  }

  const variants = product.variants || [];
  if (variants.length <= 1) return null;

  return (
    <div className="space-y-6 mb-8">
      {product.options?.map((option: any, optIdx: number) => (
        <div key={optIdx} className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider opacity-50">{option.name}</label>
          {settings.style === 'dropdown' ? (
            <select
              className="w-full px-4 py-3 border rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-current/20 outline-none transition-all"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
              value={selectedVariant?.id || variants[0]?.id}
              onChange={(e) => {
                const v = variants.find((v: any) => v.id === e.target.value);
                if (v) setSelectedVariant(v);
              }}
            >
              {variants.map((v: any) => (
                <option key={v.id} value={v.id}>{v.title}</option>
              ))}
            </select>
          ) : (
            <div className="flex flex-wrap gap-2">
              {option.values?.map((value: string, valIdx: number) => {
                const matchingVariant = variants.find((v: any) =>
                  v.options?.some((o: string) => o === value)
                );
                const isSelected = selectedVariant?.options?.includes(value);
                return (
                  <button
                    key={valIdx}
                    onClick={() => matchingVariant && setSelectedVariant(matchingVariant)}
                    className={`px-5 py-2.5 text-sm font-semibold rounded-lg border transition-all ${isSelected
                      ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                      : 'hover:opacity-80'
                      }`}
                    style={!isSelected ? { borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' } : undefined}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function AddToCartBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { product, selectedVariant, quantity, setQuantity, loading } = useProduct();
  const { storeConfig } = useTheme();
  const { addItem, openCart } = useCartStore();
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  if (loading || !product) {
    return <div className="h-14 w-full rounded-xl animate-pulse mb-8" style={{ backgroundColor: 'var(--color-border)' }} />;
  }

  const variant = selectedVariant || product.variants?.[0];
  const totalStock = variant?.inventoryLevels?.reduce((sum: number, level: any) => sum + (level.available || 0), 0) ?? 0;
  const inStock = totalStock > 0;

  const handleAddToCart = async () => {
    if (!variant) return;
    setAdding(true);

    addItem({
      productId: product.id,
      variantId: variant.id,
      quantity: quantity,
      title: product.title,
      variantTitle: variant.title,
      slug: product.handle,
      price: variant.price || product.price,
      image: resolveImageUrl(product.media?.[0]?.url || null)
    });

    setAdding(false);

    const cartType = storeConfig?.theme?.settings?.cart?.type || 'drawer';
    const autoOpen = storeConfig?.theme?.settings?.cart?.autoOpenDrawer !== false;

    if (cartType === 'page') {
      router.push(getStorePermalink(storeConfig?.handle, '/cart'));
    } else if (autoOpen) {
      openCart();
    }
  };

  return (
    <div className="space-y-4 mb-8">
      {(settings.show_quantity ?? true) && (
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold uppercase tracking-wider opacity-50">Quantity</label>
          <div className="flex items-center border rounded-xl p-1" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-border)' }}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center opacity-40 hover:opacity-100 rounded-lg transition-all"
              style={{ ['--hover-bg' as any]: 'var(--color-background)' }}
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-bold text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center opacity-40 hover:opacity-100 rounded-lg transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={!inStock || adding}
        className={`w-full py-4 px-8 rounded-xl font-bold text-white transition-all shadow-lg shadow-primary/10 active:scale-[0.98] ${inStock ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
          }`}
        style={{ backgroundColor: settings.button_color || 'var(--color-primary)' }}
      >
        {adding ? <Loader2 className="animate-spin mx-auto h-5 w-5" /> : inStock ? (settings.button_text || 'Add to Cart') : (settings.sold_out_text || 'Sold Out')}
      </button>

      {settings.show_buy_now && inStock && (
        <button className="w-full py-4 px-8 rounded-xl font-bold border hover:opacity-80 transition-all active:scale-[0.98]" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
          Buy Now
        </button>
      )}
    </div>
  );
}

export function ProductDescriptionBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { product, loading } = useProduct();
  const [expanded, setExpanded] = useState(false);

  if (loading || !product) {
    return (
      <div className="space-y-3 mb-6">
        <div className="h-4 w-full rounded animate-pulse" style={{ backgroundColor: 'var(--color-border)' }} />
        <div className="h-4 w-5/6 rounded animate-pulse" style={{ backgroundColor: 'var(--color-border)' }} />
        <div className="h-4 w-4/6 rounded animate-pulse" style={{ backgroundColor: 'var(--color-border)' }} />
      </div>
    );
  }

  if (!product.description) return null;

  return (
    <div className="mb-8">
      <div
        className={`prose prose-sm max-w-none leading-relaxed opacity-60 ${settings.enable_collapsible && !expanded ? `line-clamp-${settings.max_lines || 6}` : ''}`}
        dangerouslySetInnerHTML={{ __html: product.description }}
      />
      {settings.enable_collapsible && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-bold text-primary mt-4 hover:underline"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}

// --- Collection Template Blocks ---

export function CollectionHeadingBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { collection, loading } = useCollection();
  if (loading || !collection) return <div className="h-12 w-1/3 rounded animate-pulse mb-4" style={{ backgroundColor: 'var(--color-border)' }} />;

  const alignment = settings.enable_custom_alignment ? settings.alignment : (sectionSettings?.alignment || 'center');
  const alignClass = getAlignmentClass(alignment);

  return (
    <div className={`mb-8 ${alignClass}`}>
      <h1 className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: sectionSettings?.text_color || 'var(--color-heading)' }}>
        {collection.title}
      </h1>
    </div>
  );
}

export function CollectionDescriptionBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { collection, loading } = useCollection();
  if (loading || !collection || !collection.description) return null;

  const alignment = settings.enable_custom_alignment ? settings.alignment : (sectionSettings?.alignment || 'center');
  const alignClass = getAlignmentClass(alignment);

  return (
    <div className={`mb-12 max-w-3xl mx-auto ${alignClass}`}>
      <p className="text-lg leading-relaxed opacity-60" style={{ color: sectionSettings?.text_color || 'var(--color-text)' }}>
        {collection.description}
      </p>
    </div>
  );
}

export function ProductGridBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { collection, loading } = useCollection();
  const { storeConfig } = useTheme();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/5] rounded-2xl mb-4" style={{ backgroundColor: 'var(--color-border)' }} />
            <div className="h-4 w-3/4 rounded" style={{ backgroundColor: 'var(--color-border)' }} />
          </div>
        ))}
      </div>
    );
  }

  const columns = parseInt(settings.columns || '4');
  const products = collection?.products || [];

  if (products.length === 0) {
    return (
      <div className="text-center py-20 rounded-3xl border border-dashed mb-16 px-4" style={{ backgroundColor: 'var(--color-border)', borderColor: 'var(--color-border)' }}>
        <ShoppingBag className="mx-auto h-12 w-12 opacity-20 mb-4" />
        <h3 className="text-lg font-bold" style={{ color: 'var(--color-heading)' }}>No products found</h3>
        <p className="opacity-40 mt-2">Try selecting a different collection or adjusting your filters.</p>
      </div>
    );
  }

  const gridColsClass = {
    '2': 'grid-cols-2 lg:grid-cols-2',
    '3': 'grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-2 lg:grid-cols-4',
    '5': 'grid-cols-2 lg:grid-cols-5'
  }[columns.toString()] || 'grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-16 mb-16`}>
      {products.map(({ product }: any) => (
        <ProductCard
          key={product.id}
          product={product}
          domain={storeConfig?.handle || ''}
          currency={storeConfig?.currency || 'NGN'}
          aspectRatio={settings.aspect_ratio || 'portrait'}
        />
      ))}
    </div>
  );
}

// --- Cart Blocks ---

export function CartItemsBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { items, removeItem, updateQuantity } = useCartStore();
  const { storeConfig } = useTheme();
  const currency = storeConfig?.currency || 'NGN';

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-6">
      {items.map(item => (
        <div key={item.variantId} className="flex gap-6 py-6 border-b last:border-0 group" style={{ borderColor: 'var(--color-border)' }}>
          <div
            className="h-24 w-24 md:h-32 md:w-32 flex-shrink-0 overflow-hidden border rounded-xl"
            style={{
              backgroundColor: 'var(--color-border)',
              borderColor: 'var(--color-border)',
              border: 'var(--cart-media-border)',
              borderRadius: 'var(--cart-media-radius)'
            }}
          >
            <img
              src={item.image || '/placeholder.jpg'}
              alt={item.title}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-bold leading-tight" style={{ color: 'var(--color-heading)' }}>
                  <Link
                    href={`/products/${item.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {item.title}
                  </Link>
                </h3>
                {item.variantTitle !== 'Default Title' && (
                  <p className="text-xs md:text-sm font-medium opacity-40">{item.variantTitle}</p>
                )}
              </div>
              <p className="text-base md:text-lg font-black" style={{ color: 'var(--color-heading)' }}>
                {currency} {item.price.toLocaleString()}
              </p>
            </div>

            <div className="flex items-end justify-between mt-4">
              <div className="flex items-center gap-1 border rounded-xl p-1 shadow-sm" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                <button
                  onClick={() => updateQuantity(item.variantId, Math.max(0, item.quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg opacity-40 hover:opacity-100 transition-all"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg opacity-40 hover:opacity-100 transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.variantId)}
                className="text-xs font-bold opacity-40 hover:text-red-500 hover:opacity-100 flex items-center gap-1.5 transition-colors p-2 -mr-2"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CartSummaryBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { totalPrice } = useCartStore();
  const subtotal = totalPrice();
  const { storeConfig } = useTheme();
  const currency = storeConfig?.currency || 'NGN';

  return (
    <div className="sticky top-24">
      <div className="rounded-3xl p-6 md:p-8 border backdrop-blur-sm" style={{ backgroundColor: 'var(--color-border)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-lg font-black mb-6 uppercase tracking-wider" style={{ color: 'var(--color-heading)' }}>Order Summary</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold opacity-40 uppercase tracking-wide">Subtotal</span>
            <span className="font-black" style={{ color: 'var(--color-heading)' }}>{currency} {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="opacity-40 font-medium">Shipping</span>
            <span className="opacity-50">Calculated at checkout</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="opacity-40 font-medium">Taxes</span>
            <span className="opacity-50">Calculated at checkout</span>
          </div>

          <div className="pt-6 border-t mt-6" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-heading)' }}>Total</span>
              <span className="text-3xl font-black" style={{ color: 'var(--color-heading)' }}>
                {currency} {subtotal.toLocaleString()}
              </span>
            </div>

            <button className="w-full btn-primary px-8 py-4 font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]">
              Checkout
              <ArrowRight size={18} />
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
              <div className="h-4 w-8 rounded-sm opacity-40" style={{ backgroundColor: 'var(--color-text)' }}></div>
              <div className="h-4 w-8 rounded-sm opacity-40" style={{ backgroundColor: 'var(--color-text)' }}></div>
              <div className="h-4 w-8 rounded-sm opacity-40" style={{ backgroundColor: 'var(--color-text)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export function CollectionItemBlock({ settings, className }: { settings: any, className?: string }) {
  const params = useParams();
  const domain = params?.domain as string;
  const collectionSlug = settings.collection;
  const { theme } = useTheme();

  const { data: collection, isLoading } = useQuery({
    queryKey: ['collection', domain, collectionSlug],
    queryFn: () => domain && collectionSlug ? getCollection(domain, collectionSlug) : null,
    enabled: !!domain && !!collectionSlug
  });

  const title = settings.title || collection?.title || 'Collection';
  const image = settings.image || collection?.image;
  const description = settings.description || collection?.description;

  // Visual Settings
  const aspectRatio = settings.image_aspect_ratio || 'square';
  const objectFit = settings.image_object_fit || 'cover';
  const overlayOpacity = settings.image_overlay_opacity !== undefined ? settings.image_overlay_opacity : 20;
  const contentPosition = settings.content_position || 'bottom_left';

  // Theme settings
  const themeSettings = theme?.settings || {}
  const cardHoverEffect = themeSettings.animations?.cardHoverEffect || 'lift'

  // Hover class mapping
  const hoverClass = cardHoverEffect === 'lift' ? 'hover-lift' : (cardHoverEffect === 'scale' ? 'hover-scale' : '');
  const imageHoverClass = cardHoverEffect === 'zoom' ? 'hover-zoom' : '';

  // Resolve aspect ratio class
  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'portrait': return 'aspect-[3/4]';
      case 'landscape': return 'aspect-[16/9]';
      case 'circle': return 'aspect-square rounded-full';
      case 'auto': return ''; // Height auto? Usually needs explicit height or aspect
      default: return 'aspect-square'; // Square default
    }
  };

  const getOverlayClass = () => {
    switch (contentPosition) {
      case 'center': return 'justify-center items-center text-center';
      case 'bottom_center': return 'justify-end items-center text-center';
      case 'below': return 'hidden'; // No overlay content for 'below'
      default: return 'justify-end items-start text-left'; // bottom_left
    }
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse rounded-xl ${getAspectClass()} ${className || ''}`} style={{ backgroundColor: 'var(--color-border)' }} />
    );
  }

  // Fallback if no collection selected and no custom content
  if (!collectionSlug && !settings.image && !settings.title) {
    return (
      <div className={`border border-dashed rounded-xl flex items-center justify-center p-6 text-center ${getAspectClass()} ${className || ''}`} style={{ backgroundColor: 'var(--color-border)', borderColor: 'var(--color-border)' }}>
        <div className="opacity-40">
          <ShoppingBag className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <span className="text-xs font-semibold uppercase tracking-wider">Select Collection</span>
        </div>
      </div>
    );
  }

  const isContentBelow = contentPosition === 'below';

  return (
    <Link
      href={collection ? `/search/${collection.slug}` : '#'}
      className={`group block relative ${hoverClass} ${className || ''}`}
    >
      <div className={`
        overflow-hidden relative
        ${imageHoverClass}
        ${getAspectClass()}
        ${aspectRatio === 'circle' ? 'rounded-full' : 'rounded-xl'}
        ${isContentBelow ? 'mb-3' : ''}
      `} style={{ backgroundColor: 'var(--color-border)' }}>
        {image ? (
          <img
            src={image}
            alt={title}
            className={`
              h-full w-full transition-transform duration-700
              ${cardHoverEffect === 'lift' || cardHoverEffect === 'scale' ? 'group-hover:scale-105' : ''}
              ${objectFit === 'contain' ? 'object-contain p-4' : 'object-cover'}
            `}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center opacity-40" style={{ backgroundColor: 'var(--color-border)' }}>
            <ShoppingBag size={32} />
          </div>
        )}

        {/* Overlay (only if content is NOT below) */}
        {!isContentBelow && (
          <div
            className={`absolute inset-0 transition-opacity bg-black`}
            style={{ opacity: overlayOpacity / 100 }}
          />
        )}

        {/* Content over Image */}
        {!isContentBelow && (
          <div className={`absolute inset-0 flex flex-col p-6 text-white ${getOverlayClass()}`}>
            <h3 className="text-xl font-bold mb-1 drop-shadow-sm">{title}</h3>
            {description && <p className="text-sm text-white/90 line-clamp-2 drop-shadow-sm">{description}</p>}
          </div>
        )}
      </div>

      {/* Content Below Image */}
      {isContentBelow && (
        <div className="text-center">
          <h3 className="text-lg font-bold" style={{ color: 'var(--color-heading)' }}>{title}</h3>
          {description && <p className="text-sm opacity-50 mt-1 line-clamp-2">{description}</p>}
        </div>
      )}
    </Link>
  );
}

export function ProductBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const params = useParams();
  const domain = params?.domain as string;
  const productSlug = settings.product_handle;
  const { storeConfig } = useTheme();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', domain, productSlug],
    queryFn: () => domain && productSlug ? getProduct(domain, productSlug) : null,
    enabled: !!domain && !!productSlug
  });

  if (!productSlug) {
    return (
      <div className="mb-4 p-4 border rounded shadow-sm flex items-center gap-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
        <div className="w-16 h-16 rounded flex items-center justify-center opacity-30" style={{ backgroundColor: 'var(--color-border)' }}>
          <ShoppingBag size={24} />
        </div>
        <h3 className="font-medium opacity-40 italic">Select Product</h3>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mb-4 p-4 border rounded shadow-sm flex items-center gap-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
        <div className="w-16 h-16 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--color-border)' }}>
          <Loader2 className="animate-spin h-5 w-5 opacity-30" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded w-1/2" style={{ backgroundColor: 'var(--color-border)' }}></div>
          <div className="h-3 rounded w-1/4" style={{ backgroundColor: 'var(--color-border)' }}></div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="mb-4">
      <ProductCard
        product={product}
        domain={domain}
        currency={storeConfig?.currency}
      />
    </div>
  );
}

export function ProductListBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const params = useParams();
  const domain = params?.domain as string;
  const collectionSlug = settings.collection;
  const { storeConfig } = useTheme();

  const limit = Math.min(settings.limit || 4, 12);
  const cols = settings.columns || 2;
  const gridClass = cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-4';

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['product-list', domain, collectionSlug, limit],
    queryFn: async () => {
      if (!domain) return null;
      if (collectionSlug && collectionSlug !== 'all') {
        const collection = await getCollection(domain, collectionSlug);
        return { data: collection.products.map(p => p.product) };
      } else {
        return getProducts(domain, 1, limit);
      }
    },
    enabled: !!domain
  });

  if (isLoading) {
    return (
      <div className={`grid ${gridClass} gap-4 mb-8`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/5] rounded-xl mb-3" style={{ backgroundColor: 'var(--color-border)' }}></div>
            <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: 'var(--color-border)' }}></div>
            <div className="h-4 rounded w-1/4" style={{ backgroundColor: 'var(--color-border)' }}></div>
          </div>
        ))}
      </div>
    );
  }

  const products = productsData?.data?.slice(0, limit) || [];

  return (
    <div className="mb-8">
      {settings.collection && (
        <div className="text-center mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-40" style={{ color: 'var(--color-text)' }}>Collection</span>
          <h3 className="text-xl font-bold">{settings.collection}</h3>
        </div>
      )}

      {products.length > 0 ? (
        <div className={`grid ${gridClass} gap-4`}>
          {products.map((p: any) => (
            <ProductCard
              key={p.id}
              product={p}
              domain={domain}
              currency={storeConfig?.currency}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 border border-dashed rounded-xl text-center" style={{ borderColor: 'var(--color-border)' }}>
          <ShoppingBag className="mx-auto h-12 w-12 opacity-20 mb-4" />
          <p className="opacity-40 text-sm">No products found</p>
        </div>
      )}
    </div>
  );
}



const SOCIAL_ICONS: Record<string, any> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Music2,
};

export function LinkListBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { menus, storeConfig } = useTheme();
  const menu = menus?.[settings.menu];
  const items = menu?.items || [];
  const domain = storeConfig?.handle || '';

  return (
    <div className="mb-4">
      {settings.title && (
        <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
          {settings.title}
        </h4>
      )}
      <ul className="space-y-2">
        {items.map((item: any) => (
          <li key={item.id}>
            <Link
              href={resolveMenuUrl(item, domain)}
              className="text-sm opacity-60 hover:opacity-100 hover:underline transition-colors"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SocialLinksBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  // Use manual platform/url from settings for individual blocks
  const Icon = SOCIAL_ICONS[settings.platform] || Globe;

  return (
    <div className="mb-4 inline-block mr-4">
      <a
        href={settings.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-80 flex items-center gap-2"
        style={{ color: settings.icon_color || 'inherit' }}
      >
        <Icon className="h-5 w-5" />
        {settings.show_label && <span className="text-sm font-medium">{settings.platform}</span>}
      </a>
    </div>
  );
}

export function SpacerBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  return <div style={{ height: `${settings.height || 20}px` }} />;
}

const ICON_MAP: Record<string, any> = {
  Star, Heart, Info, AlertCircle, CheckCircle,
  ArrowRight, Phone, Mail, MapPin, Plus, Minus,
  ShoppingBag, Globe
};

export function IconBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const Icon = ICON_MAP[settings.icon] || Star;
  const alignment = settings.alignment || 'left';

  return (
    <div className={`mb-4 flex ${getFlexAlignmentClass(alignment)}`}>
      <Icon
        size={settings.size || 24}
        style={{ color: settings.color || 'currentColor' }}
        strokeWidth={1.5}
      />
    </div>
  );
}

export function ContactFormBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  return (
    <div className="mb-6 p-6 border rounded-xl shadow-sm" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-border)' }}>
      {settings.title && <h3 className="text-lg font-bold mb-4">{settings.title}</h3>}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-medium opacity-50 mb-1 uppercase tracking-wider">Full Name</label>
          <input type="text" className="w-full px-4 py-2 border focus:ring-2 focus:ring-current outline-none transition-shadow text-sm" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }} placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-xs font-medium opacity-50 mb-1 uppercase tracking-wider">Email Address</label>
          <input type="email" className="w-full px-4 py-2 border focus:ring-2 focus:ring-current outline-none transition-shadow text-sm" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }} placeholder="john@example.com" />
        </div>
        {settings.show_phone && (
          <div>
            <label className="block text-xs font-medium opacity-50 mb-1 uppercase tracking-wider">Phone Number</label>
            <input type="tel" className="w-full px-4 py-2 border focus:ring-2 focus:ring-current outline-none transition-shadow text-sm" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }} placeholder="+1 (555) 000-0000" />
          </div>
        )}
        <div>
          <label className="block text-xs font-medium opacity-50 mb-1 uppercase tracking-wider">Message</label>
          <textarea className="w-full px-4 py-2 border focus:ring-2 focus:ring-current outline-none transition-shadow text-sm min-h-[100px]" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }} placeholder="How can we help you?"></textarea>
        </div>
        <button type="submit" className="w-full btn-primary font-bold py-3 transition-colors">
          {settings.button_text || 'Send Message'}
        </button>
      </form>
    </div>
  );
}

export function EmailSignupBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  return (
    <div className="mb-6">
      {settings.title && <h4 className="text-sm font-bold mb-3">{settings.title}</h4>}
      <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder={settings.placeholder || 'Enter your email'}
          className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-current outline-none transition-shadow text-sm"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
          required
        />
        <button type="submit" className="btn-primary px-6 py-2 font-bold transition-colors text-sm">
          {settings.button_text || 'Join'}
        </button>
      </form>
    </div>
  );
}

export function AccordionBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const [isOpen, setIsOpen] = useState(settings.open_by_default || false);

  return (
    <div className="mb-2 border rounded-lg overflow-hidden shadow-sm" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:opacity-80 transition-colors"
      >
        <span className="font-semibold text-sm">{settings.title || 'Accordion Question'}</span>
        {isOpen ? <Minus className="h-4 w-4 opacity-40" /> : <Plus className="h-4 w-4 opacity-40" />}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-sm opacity-60 leading-relaxed border-t animate-in slide-in-from-top-1 duration-200" style={{ borderColor: 'var(--color-border)' }}>
          {settings.content || 'Accordion content goes here.'}
        </div>
      )}
    </div>
  );
}

export function CardBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const isList = settings.style === 'list';

  return (
    <div className={`mb-4 overflow-hidden rounded-xl border shadow-sm transition-transform hover:scale-[1.01] ${isList ? 'flex gap-4 p-2' : ''}`} style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
      {settings.image && (
        <div className={`${isList ? 'w-24 h-24 shrink-0' : 'aspect-video'} overflow-hidden rounded-lg`}>
          <img src={settings.image} alt={settings.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className={`p-4 ${isList ? 'flex-1 py-1 px-0 flex flex-col justify-center' : ''}`}>
        <h4 className="font-bold text-base mb-1">{settings.title || 'Card Title'}</h4>
        <p className="text-sm opacity-50 mb-4 line-clamp-2">{settings.description || 'Add a description for your card.'}</p>
        {settings.link && (
          <Link href={settings.link} className="text-sm font-bold hover:underline flex items-center gap-1" style={{ color: 'var(--color-heading)' }}>
            {settings.link_text || 'Learn More'} <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}

export function MenuBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { menus, storeConfig } = useTheme();
  const menu = menus?.[settings.menu];
  const items = menu?.items || [];
  const domain = storeConfig?.handle || '';

  return (
    <div className="mb-6">
      {settings.title && <h3 className="text-lg font-bold mb-4">{settings.title}</h3>}
      <nav>
        <ul className="space-y-3">
          {items.map((item: any) => (
            <li key={item.id}>
              <Link
                href={resolveMenuUrl(item, domain)}
                className="group flex items-center justify-between p-3 rounded-lg border hover:opacity-80 transition-all shadow-sm hover:shadow-md"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
              >
                <span className="font-medium text-sm">{item.title}</span>
                <ChevronRight className="h-4 w-4 opacity-30 group-hover:opacity-100 transition-colors" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

// Icon map for announcement block
const ANNOUNCEMENT_ICONS: Record<string, any> = {
  megaphone: Megaphone,
  tag: Tag,
  truck: Truck,
  gift: Gift,
  sparkles: Sparkles,
  info: Info,
};

export function AnnouncementBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const bgColor = settings.background_color || '#1F2937';
  const bgOpacity = (settings.background_opacity ?? 100) / 100;
  const textColor = settings.text_color || '#FFFFFF';
  const enableMarquee = settings.enable_marquee || false;
  const marqueeSpeed = settings.marquee_speed || 15;
  const marqueeDirection = settings.marquee_direction || 'left';
  const isSticky = settings.sticky || false;
  const isClosable = settings.closable !== false; // Default true
  const icon = settings.icon || 'none';
  const link = settings.link;
  const linkText = settings.link_text;

  const IconComponent = icon !== 'none' ? ANNOUNCEMENT_ICONS[icon] : null;

  // Convert hex to rgba for opacity
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const content = (
    <div className="flex items-center justify-center gap-2 text-sm font-medium">
      {IconComponent && <IconComponent className="h-4 w-4 shrink-0" />}
      <span>{settings.text || 'Announcement message'}</span>
      {link && linkText && (
        <Link href={link} className="underline hover:no-underline ml-1">
          {linkText}
        </Link>
      )}
    </div>
  );

  const wrapperClasses = `w-full py-2.5 px-4 ${isSticky ? 'sticky top-0 z-50' : ''}`;
  const wrapperStyle = {
    backgroundColor: hexToRgba(bgColor, bgOpacity),
    color: textColor,
  };

  // Marquee animation keyframes injected inline
  const marqueeKeyframes = `
    @keyframes announcement-marquee {
      0% { transform: translateX(${marqueeDirection === 'left' ? '100%' : '-100%'}); }
      100% { transform: translateX(${marqueeDirection === 'left' ? '-100%' : '100%'}); }
    }
  `;

  const innerContent = enableMarquee ? (
    <>
      <style>{marqueeKeyframes}</style>
      <div className="overflow-hidden whitespace-nowrap relative">
        <div
          className="inline-block"
          style={{
            animation: `announcement-marquee ${marqueeSpeed}s linear infinite`,
          }}
        >
          {content}
        </div>
      </div>
    </>
  ) : (
    content
  );

  // If clickable (has link but no linkText), wrap everything in Link
  if (link && !linkText) {
    return (
      <Link
        href={link}
        className={`block ${wrapperClasses} hover:opacity-90 transition-opacity`}
        style={wrapperStyle}
      >
        <div className="relative">
          {innerContent}
          {isClosable && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDismissed(true);
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </Link>
    );
  }

  return (
    <div className={wrapperClasses} style={wrapperStyle}>
      <div className="relative">
        {innerContent}
        {isClosable && (
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function DividerBlock({ settings }: { settings: any }) {
  const {
    color = '#e5e7eb',
    width = 100,
    thickness = 1,
    style = 'solid',
    padding_top = 20,
    padding_bottom = 20,
    alignment = 'center'
  } = settings;

  return (
    <div
      className={`w-full flex ${getFlexAlignmentClass(alignment)}`}
      style={{ paddingTop: `${padding_top}px`, paddingBottom: `${padding_bottom}px` }}
    >
      <div
        style={{
          width: `${width}%`,
          borderTopWidth: `${thickness}px`,
          borderTopStyle: style,
          borderTopColor: color,
          height: 0
        }}
      />
    </div>
  );
}

export function ProductGridItemsBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const params = useParams();
  const domain = params?.domain as string;
  const { storeConfig } = useTheme();

  // Settings with Fallbacks (Block > Section > Global)
  const collectionSlug = settings.collection || sectionSettings?.collection;
  const limit = settings.limit || sectionSettings?.limit || 8;
  const columnsDesktop = settings.columns_desktop || sectionSettings?.columns || 4;
  const columnsMobile = settings.columns_mobile || sectionSettings?.columns_mobile || 2;
  const aspectRatio = settings.image_ratio || sectionSettings?.image_ratio || 'portrait';
  const objectFit = settings.image_fit || sectionSettings?.image_fit || 'cover';
  const showVendor = settings.show_vendor ?? sectionSettings?.show_vendor ?? false;

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['product-grid-items', domain, collectionSlug, limit],
    queryFn: async () => {
      if (!domain) return null;
      if (collectionSlug && collectionSlug !== 'all') {
        const collection = await getCollection(domain, collectionSlug);
        return { data: collection.products.map(p => p.product) };
      } else {
        return getProducts(domain, 1, limit);
      }
    },
    enabled: !!domain
  });

  if (isLoading) {
    return (
      <div className={`grid grid-cols-${columnsMobile} md:grid-cols-${columnsDesktop} gap-6`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className={`rounded-xl mb-4 ${aspectRatio === 'square' ? 'aspect-square' :
              aspectRatio === 'portrait' ? 'aspect-[3/4]' :
                aspectRatio === 'landscape' ? 'aspect-[16/9]' : 'aspect-video'
              }`} style={{ backgroundColor: 'var(--color-border)' }}></div>
            <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: 'var(--color-border)' }}></div>
            <div className="h-4 rounded w-1/4" style={{ backgroundColor: 'var(--color-border)' }}></div>
          </div>
        ))}
      </div>
    );
  }

  const products = productsData?.data?.slice(0, limit) || [];

  if (products.length === 0) {
    return (
      <div className="py-12 rounded-lg border border-dashed text-center" style={{ backgroundColor: 'var(--color-border)', borderColor: 'var(--color-border)' }}>
        <ShoppingBag className="mx-auto h-12 w-12 mb-4 opacity-20" />
        <p className="opacity-50">No products found in this collection.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-${columnsMobile} md:grid-cols-${columnsDesktop} gap-x-6 gap-y-10`}>
      {products.map((product: any) => (
        <ProductCard
          key={product.id}
          product={product}
          currency={storeConfig?.currency || 'NGN'}
          domain={domain}
          aspectRatio={aspectRatio}
          objectFit={objectFit}
          showVendor={showVendor}
        />
      ))}
    </div>
  );
}

// --- Checkout & Thank You Blocks ---

export function CheckoutPageTitleBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  if (settings.show_title === false) return null;

  const alignClass = getAlignmentClass(settings.alignment || 'left');

  return (
    <div className={`mb-8 ${alignClass}`}>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: settings.color || 'var(--color-heading)' }}>
        {settings.title || 'Checkout'}
      </h1>
    </div>
  );
}

export function CheckoutFormBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { storeConfig } = useTheme();
  const { isEditorMode } = useEditor();

  if (!storeConfig) return null;

  // For now, CheckoutForm handles its own empty state which is accurate.
  // But to be helpful, we can allow the user to know it's there.
  return <CheckoutForm domain={storeConfig.domain} store={storeConfig} />;
}

const THANK_YOU_ICONS: Record<string, any> = {
  check: CheckCircle,
  heart: Heart,
  thumbs_up: ThumbsUp,
  party: Sparkles,
  gift: Gift,
  bag: ShoppingBag
};

export function ThankYouIconBlock({ settings }: { settings: any, sectionSettings?: any }) {
  const alignClass = getAlignmentClass(settings.alignment || 'center');
  const size = settings.size || 80;
  const color = settings.color || '#16a34a'; // green-600
  const bgColor = settings.background_color || '#f0fdf4'; // green-50

  if (settings.mode === 'image' && settings.image) {
    return (
      <div className={`mb-8 ${alignClass}`}>
        <img
          src={settings.image}
          alt="Success"
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            borderRadius: settings.image_radius || 9999
          }}
        />
      </div>
    );
  }

  const Icon = THANK_YOU_ICONS[settings.icon] || CheckCircle;

  return (
    <div className={`mb-8 ${alignClass}`}>
      <div
        className="inline-flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: bgColor,
          color: color
        }}
      >
        <Icon
          style={{ width: size * 0.5, height: size * 0.5 }}
          strokeWidth={settings.stroke_width || 2}
        />
      </div>
    </div>
  );
}

export function ThankYouHeaderBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  if (settings.show_title === false) return null;

  const alignClass = getAlignmentClass(settings.alignment || 'center');

  return (
    <div className={`mb-12 ${alignClass}`}>
      <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight" style={{ color: settings.title_color || 'var(--color-heading)' }}>
        {settings.title || 'Order Placed!'}
      </h1>
      <p className="text-lg max-w-lg mx-auto leading-relaxed opacity-50" style={{ color: settings.subtitle_color }}>
        {settings.subtitle || 'Thank you for your purchase. Your order has been successfully placed.'}
      </p>
    </div>
  );
}

export function OrderDetailsBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const searchParams = useSearchParams();
  const { isEditorMode } = useEditor();
  const number = searchParams.get('number');

  if (!number && !isEditorMode) return null;

  const displayNum = number || (isEditorMode ? 'ORD-PREVIEW-123' : null);
  if (!displayNum) return null;

  const style = {
    backgroundColor: settings.background_color || 'var(--color-border)',
    borderColor: settings.border_color || 'var(--color-border)',
    borderWidth: settings.border_width !== undefined ? `${settings.border_width}px` : '1px',
    borderRadius: settings.border_radius !== undefined ? `${settings.border_radius}px` : '12px',
    padding: settings.padding !== undefined ? `${settings.padding}px` : '24px',
    maxWidth: settings.max_width !== undefined ? `${settings.max_width}px` : '400px',
  };

  return (
    <div className="mx-auto mb-10 text-center" style={{ maxWidth: style.maxWidth }}>
      <div className="rounded-xl" style={style}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-50" style={{ color: settings.label_color }}>
          {settings.label || 'Order Reference'}
        </p>
        <p className="text-2xl font-mono font-bold select-all" style={{ color: settings.number_color || 'var(--color-heading)' }}>
          #{displayNum}
        </p>
        {isEditorMode && !number && (
          <span className="block mt-2 text-[10px] opacity-40 uppercase tracking-wider font-medium">
            Preview Mode
          </span>
        )}
      </div>
    </div>
  );
}

export function PaymentInstructionsBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { storeConfig } = useTheme();
  const { isEditorMode } = useEditor();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-instructions', orderId],
    queryFn: () => (storeConfig && orderId) ? getOrder(storeConfig.domain, orderId) : null,
    enabled: !!storeConfig && !!orderId
  });

  if ((isLoading || !order?.paymentInstructions) && !isEditorMode) return null;

  // Mock data for editor
  const instructions = order?.paymentInstructions || (isEditorMode ? "To complete your payment, please transfer the total amount to:\n\nBank: Example Bank\nAccount: 1234567890\nName: Store Owner\n\nPlease use your Order Number as the reference." : null);

  if (!instructions) return null;

  const style = {
    backgroundColor: settings.background_color || 'var(--color-background)',
    color: settings.text_color || 'var(--color-text)',
    borderColor: settings.border_color || 'var(--color-border)',
    borderWidth: settings.border_width !== undefined ? `${settings.border_width}px` : '1px',
    borderRadius: settings.border_radius !== undefined ? `${settings.border_radius}px` : '12px',
    padding: settings.padding !== undefined ? `${settings.padding}px` : '32px'
  };

  return (
    <div
      className="mb-10 w-full max-w-2xl mx-auto overflow-hidden"
      style={style}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b pb-4 mb-2" style={{ borderColor: 'var(--color-border)' }}>
          <Info className="h-5 w-5 opacity-40" style={{ color: settings.icon_color }} />
          <h3 className="font-semibold text-sm" style={{ color: settings.heading_color || 'var(--color-heading)' }}>
            {settings.title || 'Payment Instructions'}
          </h3>
        </div>
        <div className="text-sm whitespace-pre-wrap leading-relaxed font-mono">
          {instructions}
        </div>
      </div>
    </div>
  );
}

export function GiftCardCodesBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { storeConfig } = useTheme();
  const searchParams = useSearchParams();
  const gcParam = searchParams.get('gc');

  if (!gcParam) return null;

  let codes: Array<{ code: string; denomination: number; expiresAt: string | null }> = [];
  try {
    codes = JSON.parse(gcParam);
  } catch {
    return null;
  }

  if (codes.length === 0) return null;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
  };

  return (
    <div className="mb-10 w-full max-w-2xl mx-auto">
      <div className="rounded-xl border p-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
        <div className="flex items-center gap-3 border-b pb-4 mb-4" style={{ borderColor: 'var(--color-border)' }}>
          <Gift className="h-5 w-5 opacity-50" />
          <h3 className="font-semibold text-sm" style={{ color: 'var(--color-heading)' }}>
            Your Gift Card{codes.length > 1 ? 's' : ''}
          </h3>
        </div>
        <p className="text-xs opacity-50 mb-4">
          Save these codes — they can be used for future purchases.
        </p>
        <div className="space-y-3">
          {codes.map((gc, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--color-border)' }}>
              <div>
                <p className="font-mono text-sm font-bold tracking-wider select-all" style={{ color: 'var(--color-heading)' }}>
                  {gc.code}
                </p>
                <p className="text-xs opacity-50 mt-0.5">
                  Value: {formatPrice(gc.denomination, storeConfig?.currency || 'NGN')}
                  {gc.expiresAt && ` · Expires ${new Date(gc.expiresAt).toLocaleDateString()}`}
                </p>
              </div>
              <button
                onClick={() => copyCode(gc.code)}
                className="text-xs opacity-60 hover:opacity-100 border px-3 py-1.5 rounded-md hover:opacity-80 transition-colors"
                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContinueShoppingBlock({ settings, sectionSettings }: { settings: any, sectionSettings?: any }) {
  const { storeConfig } = useTheme();

  return (
    <div className="text-center">
      <Link
        href={getStorePermalink(storeConfig?.handle, '/')}
        className="btn-primary px-10 py-4 font-bold uppercase tracking-widest text-sm transition-all shadow-xl shadow-black/10 active:scale-[0.98] inline-block"
      >
        {settings.button_text || 'Continue Shopping'}
      </Link>
    </div>
  );
}
