import { schema as HeroSchema } from './sections/Hero';
import { schema as HeaderSchema } from './sections/Header';
import { schema as FooterSchema } from './sections/Footer';
import { schema as SlideshowSchema } from './sections/Slideshow';
import { schema as SplitShowcaseSchema } from './sections/SplitShowcase';
import { schema as SpacerSchema } from './sections/Spacer';
import { schema as DividerSchema } from './sections/Divider';
import { CollectionListSchema } from './sections/CollectionList';
import { schema as AuthSectionSchema } from './sections/AuthSection';
import { schema as AccountSectionSchema } from './sections/AccountSection';
import { schema as OrderDetailsSectionSchema } from './sections/OrderDetailsSection';

// Section components (lazy-loaded in storefrontend via dynamic import)
import Hero from './sections/Hero';
import Header from './sections/Header';
import Footer from './sections/Footer';
import Copyright from './sections/Copyright';
import Columns from './sections/Columns';
import ProductGrid from './sections/ProductGrid';
import ProductDetail from './sections/ProductDetail';
import ProductList from './sections/ProductList';
import FeaturedCollection from './sections/FeaturedCollection';
import FeaturedProduct from './sections/FeaturedProduct';
import ProductHighlight from './sections/ProductHighlight';
import ProductHotspots from './sections/ProductHotspots';
import RecommendedProducts from './sections/RecommendedProducts';
import FeaturedBlog from './sections/FeaturedBlog';
import Carousel from './sections/Carousel';
import ImageWithText from './sections/ImageWithText';
import Editorial from './sections/Editorial';
import ImageCompare from './sections/ImageCompare';
import FAQ from './sections/FAQ';
import IconsWithText from './sections/IconsWithText';
import Marquee from './sections/Marquee';
import Multicolumn from './sections/Multicolumn';
import PullQuote from './sections/PullQuote';
import RichText from './sections/RichText';
import Video from './sections/Video';
import SlideshowInset from './sections/SlideshowInset';
import CartSection from './sections/CartSection';
import Slideshow from './sections/Slideshow';
import SplitShowcase from './sections/SplitShowcase';
import CollectionList from './sections/CollectionList';
import Spacer from './sections/Spacer';
import Divider from './sections/Divider';
import Announcement from './sections/Announcement';
import CheckoutSection from './sections/CheckoutSection';
import ThankYouSection from './sections/ThankYouSection';
import AccountSection from './sections/AccountSection';
import OrderDetailsSection from './sections/OrderDetailsSection';
import AuthSection from './sections/AuthSection';
import SearchSection from './sections/SearchSection';
import NotFoundSection from './sections/NotFoundSection';
import Testimonials from './sections/Testimonials';
import Newsletter from './sections/Newsletter';
import LogoCloud from './sections/LogoCloud';
import Countdown from './sections/Countdown';
import Stats from './sections/Stats';
import TabsSection from './sections/Tabs';

import { schema as CopyrightSchema } from './sections/Copyright';
import { schema as ColumnsSchema } from './sections/Columns';
import { schema as ProductGridSchema } from './sections/ProductGrid';
import { schema as ProductDetailSchema } from './sections/ProductDetail';
import { schema as ProductListSchema } from './sections/ProductList';
import { schema as FeaturedCollectionSchema } from './sections/FeaturedCollection';
import { schema as FeaturedProductSchema } from './sections/FeaturedProduct';
import { schema as ProductHighlightSchema } from './sections/ProductHighlight';
import { schema as ProductHotspotsSchema } from './sections/ProductHotspots';
import { schema as RecommendedProductsSchema } from './sections/RecommendedProducts';
import { schema as FeaturedBlogSchema } from './sections/FeaturedBlog';
import { schema as CarouselSchema } from './sections/Carousel';
import { schema as ImageWithTextSchema } from './sections/ImageWithText';
import { schema as EditorialSchema } from './sections/Editorial';
import { schema as ImageCompareSchema } from './sections/ImageCompare';
import { schema as FAQSchema } from './sections/FAQ';
import { schema as IconsWithTextSchema } from './sections/IconsWithText';
import { schema as MarqueeSchema } from './sections/Marquee';
import { schema as MulticolumnSchema } from './sections/Multicolumn';
import { schema as PullQuoteSchema } from './sections/PullQuote';
import { schema as RichTextSchema } from './sections/RichText';
import { schema as VideoSchema } from './sections/Video';
import { schema as SlideshowInsetSchema } from './sections/SlideshowInset';
import { schema as CartSectionSchema } from './sections/CartSection';
import { schema as AnnouncementSchema } from './sections/Announcement';
import { schema as CheckoutSectionSchema } from './sections/CheckoutSection';
import { schema as ThankYouSectionSchema } from './sections/ThankYouSection';
import { schema as SearchSectionSchema } from './sections/SearchSection';
import { schema as NotFoundSectionSchema } from './sections/NotFoundSection';
import { schema as TestimonialsSchema } from './sections/Testimonials';
import { schema as NewsletterSchema } from './sections/Newsletter';
import { schema as LogoCloudSchema } from './sections/LogoCloud';
import { schema as CountdownSchema } from './sections/Countdown';
import { schema as StatsSchema } from './sections/Stats';
import { schema as TabsSchema } from './sections/Tabs';

export const primeSectionRegistry: Record<string, { component: any; schema: any }> = {
  'auth-section': { component: AuthSection as any, schema: AuthSectionSchema },
  'hero': { component: Hero as any, schema: HeroSchema },
  'header': { component: Header as any, schema: HeaderSchema },
  'footer': { component: Footer as any, schema: FooterSchema },
  'copyright': { component: Copyright as any, schema: CopyrightSchema },
  'columns': { component: Columns as any, schema: ColumnsSchema },
  'product-grid': { component: ProductGrid as any, schema: ProductGridSchema },
  'product-detail': { component: ProductDetail as any, schema: ProductDetailSchema },
  'product-list': { component: ProductList as any, schema: ProductListSchema },
  'featured_collection': { component: FeaturedCollection as any, schema: FeaturedCollectionSchema },
  'featured_product': { component: FeaturedProduct as any, schema: FeaturedProductSchema },
  'product_highlight': { component: ProductHighlight as any, schema: ProductHighlightSchema },
  'product_hotspots': { component: ProductHotspots as any, schema: ProductHotspotsSchema },
  'recommended_products': { component: RecommendedProducts as any, schema: RecommendedProductsSchema },
  'featured_blog': { component: FeaturedBlog as any, schema: FeaturedBlogSchema },
  'carousel': { component: Carousel as any, schema: CarouselSchema },
  'image_with_text': { component: ImageWithText as any, schema: ImageWithTextSchema },
  'editorial': { component: Editorial as any, schema: EditorialSchema },
  'image_compare': { component: ImageCompare as any, schema: ImageCompareSchema },
  'faq': { component: FAQ as any, schema: FAQSchema },
  'icons_with_text': { component: IconsWithText as any, schema: IconsWithTextSchema },
  'marquee': { component: Marquee as any, schema: MarqueeSchema },
  'multicolumn': { component: Multicolumn as any, schema: MulticolumnSchema },
  'pull_quote': { component: PullQuote as any, schema: PullQuoteSchema },
  'rich_text': { component: RichText as any, schema: RichTextSchema },
  'video': { component: Video as any, schema: VideoSchema },
  'slideshow_inset': { component: SlideshowInset as any, schema: SlideshowInsetSchema },
  'cart-page': { component: CartSection as any, schema: CartSectionSchema },
  'slideshow': { component: Slideshow as any, schema: SlideshowSchema },
  'split_showcase': { component: SplitShowcase as any, schema: SplitShowcaseSchema },
  'collection_list': { component: CollectionList as any, schema: CollectionListSchema },
  'spacer': { component: Spacer as any, schema: SpacerSchema },
  'divider': { component: Divider as any, schema: DividerSchema },
  'announcement': { component: Announcement as any, schema: AnnouncementSchema },
  'checkout-page': { component: CheckoutSection as any, schema: CheckoutSectionSchema },
  'thank-you-page': { component: ThankYouSection as any, schema: ThankYouSectionSchema },
  'account-section': { component: AccountSection as any, schema: AccountSectionSchema },
  'order-details-section': { component: OrderDetailsSection as any, schema: OrderDetailsSectionSchema },
  'search-section': { component: SearchSection as any, schema: SearchSectionSchema },
  'not-found-section': { component: NotFoundSection as any, schema: NotFoundSectionSchema },
  'testimonials': { component: Testimonials as any, schema: TestimonialsSchema },
  'newsletter': { component: Newsletter as any, schema: NewsletterSchema },
  'logo_cloud': { component: LogoCloud as any, schema: LogoCloudSchema },
  'countdown': { component: Countdown as any, schema: CountdownSchema },
  'stats': { component: Stats as any, schema: StatsSchema },
  'tabs': { component: TabsSection as any, schema: TabsSchema },
};
