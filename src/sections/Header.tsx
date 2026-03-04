'use client';

import Link from 'next/link';
import { Search, User, ShoppingBag, ChevronDown, X, Menu } from 'lucide-react';
import {
  useTheme,
  resolveMenuUrl,
  getStorePermalink,
  useCartStore,
} from '@zevcommerce/storefront-api';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';

// ─── Desktop Nav Dropdown ───────────────────────────────────────
function NavDropdown({ item, domain, textColor }: { item: any; domain: string; textColor?: string }) {
  const itemUrl = resolveMenuUrl(item, domain);
  const color = textColor || 'var(--color-text)';

  if (!item.children || item.children.length === 0) {
    return (
      <Link
        href={itemUrl}
        className="relative text-sm font-medium transition-colors whitespace-nowrap py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:transition-all after:duration-300 hover:after:w-full"
        style={{ color, ['--tw-after-bg' as any]: 'currentColor' } as React.CSSProperties}
      >
        {item.title}
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-full" />
      </Link>
    );
  }

  return (
    <div className="relative group/menu">
      <button
        className="flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap py-4"
        style={{ color }}
      >
        {item.title}
        <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover/menu:rotate-180" />
      </button>

      <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 invisible group-hover/menu:opacity-100 group-hover/menu:translate-y-0 group-hover/menu:visible transition-all duration-200 z-[100]">
        <div className="bg-white border border-gray-100 shadow-xl rounded-lg py-2 min-w-[200px]">
          {item.children.map((child: any) => (
            <Link
              key={child.id}
              href={resolveMenuUrl(child, domain)}
              className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              {child.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Menu Drawer ─────────────────────────────────────────
function MobileMenu({
  isOpen,
  onClose,
  menuItems,
  domain,
  accountsEnabled,
  showAccount,
}: {
  isOpen: boolean;
  onClose: () => void;
  menuItems: any[];
  domain: string;
  accountsEnabled: boolean;
  showAccount: boolean;
}) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-[200] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white z-[201] shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">Menu</span>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="overflow-y-auto h-[calc(100%-65px)] py-2">
          {menuItems.map((item: any) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItem === item.id;

            return (
              <div key={item.id}>
                <div className="flex items-center">
                  <Link
                    href={resolveMenuUrl(item, domain)}
                    onClick={onClose}
                    className="flex-1 px-6 py-3.5 text-[15px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    {item.title}
                  </Link>
                  {hasChildren && (
                    <button
                      onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                      className="px-4 py-3.5 text-gray-400 hover:text-gray-800 transition-colors"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                {hasChildren && isExpanded && (
                  <div className="bg-gray-50">
                    {item.children.map((child: any) => (
                      <Link
                        key={child.id}
                        href={resolveMenuUrl(child, domain)}
                        onClick={onClose}
                        className="block px-10 py-3 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Account link in mobile */}
          {showAccount && accountsEnabled && (
            <Link
              href={getStorePermalink(domain, '/account')}
              onClick={onClose}
              className="flex items-center gap-3 px-6 py-3.5 mt-2 border-t border-gray-100 text-[15px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <User className="h-4 w-4" />
              My Account
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}

// ─── Header Component ───────────────────────────────────────────
export default function Header({ settings }: { settings: any }) {
  const { storeConfig, menus } = useTheme();
  const { openCart, items } = useCartStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const params = useParams();

  const domain = (params?.domain as string) || storeConfig?.handle || '';
  const {
    logo: themeLogo,
    menuHandle,
    showSearch = true,
    showCart = true,
    showAccount = true,
    layout: headerLayout = 'standard',
    sticky = true,
    transparent_on_hero = false,
    backgroundColor,
    textColor,
    borderStyle = 'shadow',
    logoHeight = 40,
  } = settings;

  const logoSrc = themeLogo || storeConfig?.storeLogo;
  const storeName = storeConfig?.name || 'Store';

  const availableMenus = Object.values(menus || {});
  const defaultMenu = availableMenus.find((m: any) => m.isDefault);
  const activeMenu = (menuHandle && menus?.[menuHandle]) || defaultMenu || availableMenus[0];
  const menuItems = (activeMenu as any)?.items || [];
  const accountsEnabled = !!storeConfig?.accountConfig?.loginEnabled;

  // Scroll listener for transparent mode
  useEffect(() => {
    if (!transparent_on_hero) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [transparent_on_hero]);

  // Search suggestions
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
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

  const handleSearch = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      setShowSuggestions(false);
      if (!searchQuery.trim()) return;
      router.push(getStorePermalink(domain, `/search?q=${encodeURIComponent(searchQuery)}`));
      setIsSearchOpen(false);
    },
    [searchQuery, domain, router]
  );

  // Transparent mode logic
  const isTransparent = transparent_on_hero && !isScrolled && !isSearchOpen;
  const headerBg = isTransparent ? 'transparent' : (backgroundColor || '#ffffff');
  const headerText = isTransparent ? '#ffffff' : (textColor || 'var(--color-text)');

  // Border style
  const borderClass = isTransparent
    ? ''
    : borderStyle === 'solid'
      ? 'border-b border-gray-200'
      : borderStyle === 'shadow'
        ? 'shadow-sm'
        : '';

  return (
    <>
      <header
        className={`${sticky ? 'sticky top-0' : 'relative'} z-50 w-full transition-all duration-300 ${borderClass}`}
        style={{ backgroundColor: headerBg, color: headerText }}
      >
        {/* Centered layout: logo on top */}
        {headerLayout === 'centered' ? (
          <div className="container mx-auto px-4">
            {/* Logo row */}
            <div className="flex items-center justify-center py-4 border-b border-gray-100/20">
              <Link href={getStorePermalink(domain, '/')} className="inline-block">
                {logoSrc ? (
                  <img src={logoSrc} alt={storeName} className="w-auto object-contain" style={{ height: `${logoHeight}px` }} />
                ) : (
                  <span className="text-2xl font-bold tracking-tight">{storeName}</span>
                )}
              </Link>
            </div>
            {/* Nav row */}
            <div className="flex items-center justify-between h-12">
              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>

              <nav className="hidden md:flex items-center gap-8 mx-auto h-full">
                {menuItems.map((item: any) => (
                  <NavDropdown key={item.id} item={item} domain={domain} textColor={headerText} />
                ))}
              </nav>

              {/* Icons */}
              <div className="flex items-center gap-3">
                {showSearch && (
                  <button onClick={() => setIsSearchOpen(true)} className="p-2 rounded-full hover:bg-black/5 transition-colors">
                    <Search className="h-5 w-5" />
                  </button>
                )}
                {showCart && (
                  <button onClick={openCart} className="relative p-2 rounded-full hover:bg-black/5 transition-colors">
                    <ShoppingBag className="h-5 w-5" />
                    {items.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 leading-none shadow-sm" style={{ backgroundColor: 'var(--color-accent)' }}>
                        {items.length}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Standard & Minimal layouts */
          <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between relative">
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <div className={`flex-1 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}>
              <Link href={getStorePermalink(domain, '/')} className="text-xl font-bold tracking-tight inline-block shrink-0">
                {logoSrc ? (
                  <img src={logoSrc} alt={storeName} className="w-auto object-contain" style={{ height: `${logoHeight}px` }} />
                ) : (
                  <span className="whitespace-nowrap">{storeName}</span>
                )}
              </Link>
            </div>

            {/* Navigation (hidden in minimal layout) */}
            {headerLayout !== 'minimal' && (
              <nav className={`hidden md:flex items-center gap-8 h-full mx-8 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {menuItems.map((item: any) => (
                  <NavDropdown key={item.id} item={item} domain={domain} textColor={headerText} />
                ))}
              </nav>
            )}

            {/* Search Overlay */}
            <div className={`absolute inset-0 z-10 flex items-center px-4 transition-all duration-300 ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} style={{ backgroundColor: backgroundColor || '#ffffff' }}>
              <div className="w-full max-w-2xl mx-auto relative">
                <form onSubmit={handleSearch} className="relative flex items-center w-full">
                  <Search className="absolute left-0 h-5 w-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search our store..."
                    className="w-full pl-8 pr-12 py-2 text-lg border-b-2 border-gray-200 focus:border-gray-900 outline-none bg-transparent placeholder:text-gray-300 transition-colors"
                    autoFocus={isSearchOpen}
                  />
                  <button
                    type="button"
                    onClick={() => { setIsSearchOpen(false); setSuggestions([]); }}
                    className="absolute right-0 p-2 text-gray-400 hover:text-black transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </form>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="py-2">
                      <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Products</h3>
                      {suggestions.map((product) => (
                        <Link
                          key={product.id}
                          href={getStorePermalink(domain, `/products/${product.slug}`)}
                          onClick={() => { setIsSearchOpen(false); setSuggestions([]); }}
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
                            <p className="text-xs text-gray-500">{storeConfig?.currency || '₦'}{parseFloat(product.variants?.[0]?.price || '0').toLocaleString()}</p>
                          </div>
                        </Link>
                      ))}
                      <button
                        onClick={() => handleSearch()}
                        className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors border-t border-gray-100"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        View all results for &quot;{searchQuery}&quot;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Icons */}
            <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
              {showSearch && (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`p-2 rounded-full hover:bg-black/5 transition-colors ${isSearchOpen ? 'invisible' : ''}`}
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              {showAccount && accountsEnabled && (
                <Link
                  href={getStorePermalink(domain, '/account')}
                  className="hidden md:flex p-2 rounded-full hover:bg-black/5 transition-colors"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}

              {showCart && (
                <button
                  onClick={openCart}
                  className="relative p-2 rounded-full hover:bg-black/5 transition-colors"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {items.length > 0 && (
                    <span
                      className="absolute top-0.5 right-0 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 border-2 transition-transform"
                      style={{ backgroundColor: 'var(--color-accent)', borderColor: headerBg }}
                    >
                      {items.length}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={menuItems}
        domain={domain}
        accountsEnabled={accountsEnabled}
        showAccount={showAccount}
      />
    </>
  );
}

export const schema = {
  type: 'header',
  name: 'Header',
  settings: [
    {
      type: 'select', id: 'layout', label: 'Layout',
      options: [
        { value: 'standard', label: 'Standard' },
        { value: 'centered', label: 'Centered' },
        { value: 'minimal', label: 'Minimal (Logo + Menu)' },
      ],
      default: 'standard',
    },
    { type: 'image', id: 'logo', label: 'Logo Image' },
    { type: 'image', id: 'favicon', label: 'Favicon Image' },
    { type: 'range', id: 'logoHeight', label: 'Logo Height', min: 24, max: 80, step: 2, default: 40 },
    {
      type: 'link_list', id: 'menuHandle', label: 'Main Menu', default: 'main-menu',
    },
    { type: 'checkbox', id: 'sticky', label: 'Sticky Header', default: true },
    { type: 'checkbox', id: 'transparent_on_hero', label: 'Transparent over Hero', default: false },
    { type: 'color', id: 'backgroundColor', label: 'Background Color' },
    { type: 'color', id: 'textColor', label: 'Text Color' },
    {
      type: 'select', id: 'borderStyle', label: 'Border Style',
      options: [
        { value: 'none', label: 'None' },
        { value: 'solid', label: 'Line' },
        { value: 'shadow', label: 'Shadow' },
      ],
      default: 'shadow',
    },
    { type: 'checkbox', id: 'showSearch', label: 'Show Search', default: true },
    { type: 'checkbox', id: 'showAccount', label: 'Show Account', default: true },
    { type: 'checkbox', id: 'showCart', label: 'Show Cart', default: true },
  ],
};
