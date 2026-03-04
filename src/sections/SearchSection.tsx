'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme, getProducts, ProductCard } from '@zevcommerce/storefront-api';
import { Search, X, Filter, ChevronDown } from 'lucide-react';

// Search Bar Block
function SearchBarBlock({ settings, onSearch }: { settings: any; onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" style={{ color: 'var(--color-text)' }} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={settings.placeholder || 'Search products...'}
          className="w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition text-lg"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-heading)' }}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); onSearch(''); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70"
            style={{ color: 'var(--color-text)' }}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
}

// Search Filters Block
function SearchFiltersBlock({ settings }: { settings: any }) {
  const [showFilters, setShowFilters] = useState(false);

  if (!settings.show_filters) return null;

  return (
    <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100"
        style={{ color: 'var(--color-heading)' }}
      >
        <Filter className="w-4 h-4" />
        Filters
        <ChevronDown className={`w-4 h-4 transition ${showFilters ? 'rotate-180' : ''}`} />
      </button>

      <div className="flex items-center gap-4">
        <select
          className="text-sm border rounded-lg px-3 py-2"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-heading)' }}
        >
          <option>Sort by: Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest</option>
        </select>
      </div>

      {showFilters && (
        <div className="absolute left-0 right-0 top-full border-t p-6 shadow-lg z-10" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium mb-3" style={{ color: 'var(--color-heading)' }}>Category</h4>
              <div className="space-y-2">
                {['All', 'Clothing', 'Shoes', 'Accessories'].map(cat => (
                  <label key={cat} className="flex items-center gap-2 text-sm opacity-70" style={{ color: 'var(--color-text)' }}>
                    <input type="checkbox" className="rounded" style={{ borderColor: 'var(--color-border)' }} />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3" style={{ color: 'var(--color-heading)' }}>Price</h4>
              <div className="space-y-2">
                {['Under ₦5,000', '₦5,000 - ₦20,000', '₦20,000 - ₦50,000', 'Over ₦50,000'].map(price => (
                  <label key={price} className="flex items-center gap-2 text-sm opacity-70" style={{ color: 'var(--color-text)' }}>
                    <input type="checkbox" className="rounded" style={{ borderColor: 'var(--color-border)' }} />
                    {price}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Search Results Block
function SearchResultsBlock({ settings, query, results, loading }: { settings: any; query: string; results: any[]; loading: boolean }) {
  const { storeConfig } = useTheme();
  const columns = settings.columns || 4;

  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-6`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square rounded-xl mb-4" style={{ backgroundColor: 'var(--color-border)' }} />
            <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: 'var(--color-border)' }} />
            <div className="h-4 rounded w-1/4" style={{ backgroundColor: 'var(--color-border)' }} />
          </div>
        ))}
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-16">
        <Search className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: 'var(--color-text)' }} />
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-heading)' }}>Search our store</h2>
        <p className="opacity-60" style={{ color: 'var(--color-text)' }}>Enter a search term to find products</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <Search className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: 'var(--color-text)' }} />
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-heading)' }}>No results found</h2>
        <p className="opacity-60 mb-6" style={{ color: 'var(--color-text)' }}>We couldn't find anything for &ldquo;{query}&rdquo;</p>
        <Link href="/collections" className="text-primary font-medium hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  return (
    <div>
      {settings.show_count && (
        <p className="text-sm opacity-60 mb-6" style={{ color: 'var(--color-text)' }}>{results.length} results for &ldquo;{query}&rdquo;</p>
      )}
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-x-6 gap-y-10`}>
        {results.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            currency={storeConfig?.currency || 'NGN'}
            domain={storeConfig?.handle || ''}
          />
        ))}
      </div>
    </div>
  );
}

// Block Registry
const SEARCH_BLOCKS: Record<string, React.FC<any>> = {
  search_bar: SearchBarBlock,
  search_filters: SearchFiltersBlock,
  search_results: SearchResultsBlock,
};

// Main Search Section
export default function SearchSection({ settings, blocks }: { settings: any; blocks?: any[] }) {
  const { storeConfig } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const domain = storeConfig?.handle || '';

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      // TODO: Implement proper search endpoint
      const response = await getProducts(domain, 1, 20);
      // Filter by query for now (should use backend search)
      const filtered = response.data.filter((p: any) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultBlocks = [
    { type: 'search_bar', settings: { placeholder: 'Search products...' } },
    { type: 'search_filters', settings: { show_filters: false } },
    { type: 'search_results', settings: { columns: 4, show_count: true } },
  ];

  const activeBlocks = blocks && blocks.length > 0 ? blocks : defaultBlocks;

  return (
    <section className="py-12 min-h-[60vh]" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto px-4">
        {settings.show_title && (
          <h1 className="text-3xl font-bold text-center mb-8" style={{ color: settings.title_color || 'var(--color-heading)', fontFamily: 'var(--font-heading)' }}>
            {settings.title || 'Search'}
          </h1>
        )}

        <div className="space-y-8">
          {activeBlocks.map((block, idx) => {
            const BlockComponent = SEARCH_BLOCKS[block.type];
            if (!BlockComponent) return null;

            // Pass additional props based on block type
            const extraProps: any = {};
            if (block.type === 'search_bar') extraProps.onSearch = handleSearch;
            if (block.type === 'search_results') {
              extraProps.query = query;
              extraProps.results = results;
              extraProps.loading = loading;
            }

            return <BlockComponent key={idx} settings={block.settings || {}} {...extraProps} />;
          })}
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'search-section',
  name: 'Search Section',
  settings: [
    { type: 'checkbox', id: 'show_title', label: 'Show Title', default: true },
    { type: 'text', id: 'title', label: 'Title', default: 'Search' },
    { type: 'color', id: 'title_color', label: 'Title Color' }
  ],
  blocks: [
    {
      type: 'search_bar',
      name: 'Search Bar',
      settings: [
        { type: 'text', id: 'placeholder', label: 'Placeholder', default: 'Search products...' }
      ]
    },
    {
      type: 'search_filters',
      name: 'Filters',
      settings: [
        { type: 'checkbox', id: 'show_filters', label: 'Show Filters', default: false }
      ]
    },
    {
      type: 'search_results',
      name: 'Results Grid',
      settings: [
        { type: 'range', id: 'columns', label: 'Columns', min: 2, max: 5, step: 1, default: 4 },
        { type: 'checkbox', id: 'show_count', label: 'Show Result Count', default: true }
      ]
    }
  ]
};
