'use client';

import Link from 'next/link';
import { Search, User, ShoppingBag, ChevronDown, X } from 'lucide-react';
import {
  useTheme,
  resolveMenuUrl,
  getStorePermalink,
  useCartStore,
} from '@zevcommerce/storefront-api';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

function NavDropdown({ item, domain }: { item: any, domain: string }) {
  const itemUrl = resolveMenuUrl(item, domain);

  if (!item.children || item.children.length === 0) {
    return (
      <Link
        href={itemUrl}
        className="text-sm font-medium text-gray-600 hover:text-black transition-colors whitespace-nowrap"
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div className="relative group/menu">
      <button className="flex items-center gap-1 text-sm font-medium text-gray-600 group-hover/menu:text-black transition-colors whitespace-nowrap py-4">
        {item.title}
        <ChevronDown className="h-3 w-3 transition-transform group-hover/menu:rotate-180" />
      </button>

      {/* Dropdown Menu */}
      <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 invisible group-hover/menu:opacity-100 group-hover/menu:translate-y-0 group-hover/menu:visible transition-all duration-200 z-[100]">
        <div className="bg-white border border-gray-100 shadow-xl rounded-lg py-2 min-w-[200px]">
          {item.children.map((child: any) => (
            <Link
              key={child.id}
              href={resolveMenuUrl(child, domain)}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
            >
              {child.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header({ settings }: { settings: any }) {
  const { storeConfig, menus } = useTheme();
  const { openCart, items } = useCartStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const params = useParams();

  // Get domain from window if browser, or from context if we add it there. 
  // We use params.domain to respect the current route segment.
  const domain = (params?.domain as string) || storeConfig?.handle || '';
  const { logo: themeLogo, menuHandle, showSearch = true, showCart = true, showAccount = true } = settings;

  // Logo logic: Theme settings -> Store Branding -> Store Name (text)
  const logoSrc = themeLogo || storeConfig?.storeLogo;
  const storeName = storeConfig?.name || 'Intech Store';

  // Navigation Logic: Use handle -> Use store default -> Use first available -> Empty
  const availableMenus = Object.values(menus || {});
  const defaultMenu = availableMenus.find((m: any) => m.isDefault);
  const activeMenu = (menuHandle && menus?.[menuHandle]) || defaultMenu || availableMenus[0];
  const menuItems = activeMenu?.items || [];

  // Check if customer accounts are enabled
  const accountsEnabled = !!storeConfig?.accountConfig?.loginEnabled;

  /* eslint-disable react-hooks/exhaustive-deps */
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounce search suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          // Dynamically import API to avoid server-side issues if needed, or just use it.
          // Since this is client component, direct import is fine if api is isomorphic or client-safe.
          // Assuming getProducts handles the fetch.
          const { getProducts } = await import('@zevcommerce/storefront-api');
          const { data } = await getProducts(domain, 1, 5, searchQuery);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, domain]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (!searchQuery.trim()) return;
    router.push(getStorePermalink(domain, `/search?q=${encodeURIComponent(searchQuery)}`));
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between relative">
        {/* Logo */}
        <div className={`flex-1 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}>
          <Link href={getStorePermalink(domain, '/')} className="text-xl font-bold tracking-tight inline-block shrink-0">
            {logoSrc ? (
              <img src={logoSrc} alt={storeName} className="h-8 md:h-10 w-auto object-contain" />
            ) : (
              <span className="whitespace-nowrap">{storeName}</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`hidden md:flex items-center gap-8 h-full mx-8 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {menuItems.map((item: any) => (
            <NavDropdown key={item.id} item={item} domain={domain} />
          ))}
        </nav>

        {/* Search Overlay (Mobile & Desktop) */}
        <div className={`absolute inset-0 z-10 bg-white flex items-center px-4 transition-all duration-300 ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="w-full max-w-2xl mx-auto relative">
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
              <Search className="absolute left-0 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search our store..."
                className="w-full pl-8 pr-12 py-2 text-lg border-b-2 border-gray-100 focus:border-black outline-none bg-transparent placeholder:text-gray-300 transition-colors"
                autoFocus={isSearchOpen}
              />
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSuggestions([]);
                }}
                className="absolute right-0 p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="py-2">
                  <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Products</h3>
                  {suggestions.map((product) => (
                    <Link
                      key={product.id}
                      href={getStorePermalink(domain, `/products/${product.slug}`)}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSuggestions([]);
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden relative shrink-0">
                        {product.media?.[0]?.url ? (
                          <img src={product.media[0].url} alt={product.title} className="object-cover w-full h-full" />
                        ) : (
                          <ShoppingBag className="h-5 w-5 text-gray-400 m-auto mt-2.5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.title}</p>
                        <p className="text-xs text-gray-500">₦{parseFloat(product.variants?.[0]?.price || '0').toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={handleSearch}
                    className="w-full text-left px-4 py-3 text-sm text-[#3A86FF] font-medium hover:bg-gray-50 transition-colors border-t border-gray-100"
                  >
                    View all results for &quot;{searchQuery}&quot;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Icons */}
        <div className="flex-1 flex items-center justify-end gap-3 md:gap-5">
          {showSearch && (
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`text-gray-500 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-50 ${isSearchOpen ? 'invisible' : ''}`}
            >
              <Search className="h-5 w-5" />
            </button>
          )}

          {showAccount && accountsEnabled && (
            <Link
              href={getStorePermalink(domain, '/account')}
              className="text-gray-500 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-50"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          {showCart && (
            <button
              onClick={openCart}
              className="text-gray-500 hover:text-black transition-colors relative p-2 rounded-full hover:bg-gray-50 group"
            >
              <ShoppingBag className="h-5 w-5" />
              {items.length > 0 && (
                <span
                  className="absolute top-1 right-0.5 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 border-2 border-white group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {items.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export const schema = {
  type: 'header',
  name: 'Header',
  settings: [
    {
      type: 'image',
      id: 'logo',
      label: 'Logo Image',
    },
    {
      type: 'image',
      id: 'favicon',
      label: 'Favicon Image',
    },
    {
      type: 'link_list',
      id: 'menuHandle',
      label: 'Main Menu',
      default: 'main-menu',
    },
    {
      type: 'checkbox',
      id: 'showSearch',
      label: 'Show Search icon',
      default: true,
    },
    {
      type: 'checkbox',
      id: 'showAccount',
      label: 'Show Account icon',
      default: true,
    },
    {
      type: 'checkbox',
      id: 'showCart',
      label: 'Show Cart icon',
      default: true,
    },
  ],
};
