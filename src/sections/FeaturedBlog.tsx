'use client';

import { getBlog, ArticleCard } from '@zevcommerce/storefront-api';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FeaturedBlogProps {
  settings: {
    title: string;
    blog_handle: string;
    layout: 'grid' | 'carousel' | 'editorial';
    limit: number;
    columns: number; // 2, 3, 4
    aspect_ratio: 'square' | 'portrait' | 'landscape' | 'wide';
    show_date: boolean;
    show_author: boolean;
    show_excerpt: boolean;
    view_all_label: string;
    section_padding: 'none' | 'small' | 'medium' | 'large';
  };
}

export default function FeaturedBlog({ settings }: FeaturedBlogProps) {
  const {
    title,
    blog_handle,
    layout = 'grid',
    limit = 3,
    columns = 3,
    aspect_ratio = 'landscape',
    show_date = true,
    show_author = true,
    show_excerpt = true,
    view_all_label = 'View all posts',
    section_padding = 'medium'
  } = settings;

  // Domain context - in a real app this might come from a context provider
  // For now using window.location.hostname logic or default from api util
  // But ArticleCard expects domain prop directly. 
  // We'll rely on a hardcoded active domain or fetch it.
  // Ideally, useTheme() hook should provide this.
  // Retained demo.intechcommerce.com for legacy routing (rebranded to ZevCommerce)
  const domain = typeof window !== 'undefined' ? window.location.hostname : 'demo.intechcommerce.com';

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', blog_handle, domain],
    queryFn: () => getBlog(domain, blog_handle || 'news'),
    enabled: !!blog_handle,
  });

  const posts = blog?.posts?.slice(0, limit) || [];
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const paddingClasses = {
    none: 'py-0',
    small: 'py-8',
    medium: 'py-16',
    large: 'py-24'
  };

  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4'
  };

  if (!blog_handle) {
    return (
      <div className={`text-center border-2 border-dashed rounded-lg p-12 ${paddingClasses[section_padding]}`} style={{ backgroundColor: 'var(--color-border)', borderColor: 'var(--color-border)' }}>
        <p className="opacity-50">Select a blog to display posts.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className={`h-96 w-full animate-pulse ${paddingClasses[section_padding]}`} style={{ backgroundColor: 'var(--color-border)' }} />;
  }

  // Layout Renderers
  const renderGrid = () => (
    <div className={`grid grid-cols-1 gap-8 ${gridCols[columns as 2 | 3 | 4]}`}>
      {posts.map((post: any) => (
        <ArticleCard
          key={post.id}
          article={post}
          domain={domain}
          aspectRatio={aspect_ratio}
          showDate={show_date}
          showAuthor={show_author}
          showExcerpt={show_excerpt}
        />
      ))}
    </div>
  );

  const renderCarousel = () => (
    <div className="relative group">
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {posts.map((post: any) => (
          <div key={post.id} className="min-w-[280px] sm:min-w-[350px] md:min-w-[400px] snap-center">
            <ArticleCard
              article={post}
              domain={domain}
              aspectRatio={aspect_ratio}
              showDate={show_date}
              showAuthor={show_author}
              showExcerpt={show_excerpt}
            />
          </div>
        ))}
      </div>
      {/* Navigation Arrows */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/3 -translate-y-1/2 -ml-4 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden sm:block"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-background) 90%, transparent)' }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/3 -translate-y-1/2 -mr-4 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-background) 90%, transparent)' }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );

  const renderEditorial = () => {
    const [featuredPost, ...otherPosts] = posts;
    if (!featuredPost) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-7">
          <ArticleCard
            article={featuredPost}
            domain={domain}
            aspectRatio="landscape"
            showDate={show_date}
            showAuthor={show_author}
            showExcerpt={true} // Always show excerpt for featured
            className="text-lg"
          />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-8">
          {otherPosts.slice(0, 3).map((post: any) => (
            <div key={post.id} className="flex gap-4 items-start group">
              <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden relative" style={{ backgroundColor: 'var(--color-border)' }}>
                {post.image && <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={post.title} />}
              </div>
              <div>
                <h4 className="font-bold group-hover:text-blue-600 transition-colors line-clamp-2" style={{ color: 'var(--color-heading)' }}>
                  <Link href={`/blogs/${post.blog?.handle}/${post.slug}`}>{post.title}</Link>
                </h4>
                {show_date && (
                  <span className="text-xs opacity-50 mt-1 block">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className={`w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${paddingClasses[section_padding]}`}>
      <div className="flex justify-between items-end mb-8 sm:mb-12">
        {title && <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-heading)' }}>{title}</h2>}
        {view_all_label && (
          <Link href={`/blogs/${blog_handle}`} className="hidden sm:flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500">
            {view_all_label} <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        )}
      </div>

      {layout === 'grid' && renderGrid()}
      {layout === 'carousel' && renderCarousel()}
      {layout === 'editorial' && renderEditorial()}

      {view_all_label && (
        <div className="mt-8 sm:hidden">
          <Link href={`/blogs/${blog_handle}`} className="flex items-center justify-center text-sm font-semibold text-blue-600 hover:text-blue-500">
            {view_all_label} <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
}

export const schema = {
  type: 'featured_blog',
  name: 'Featured Blog',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Heading',
      default: 'Latest News'
    },
    {
      type: 'text', // In a real implementation this would be a blog picker
      id: 'blog_handle',
      label: 'Blog Handle',
      default: 'news'
    },
    {
      type: 'select',
      id: 'layout',
      label: 'Layout',
      options: [
        { value: 'grid', label: 'Grid' },
        { value: 'carousel', label: 'Carousel' },
        { value: 'editorial', label: 'Editorial' }
      ],
      default: 'grid'
    },
    {
      type: 'range',
      id: 'limit',
      label: 'Number of posts',
      min: 2,
      max: 12,
      step: 1,
      default: 4
    },
    {
      type: 'range',
      id: 'columns',
      label: 'Columns (Grid only)',
      min: 2,
      max: 4,
      step: 1,
      default: 3,
      show_if: { id: 'layout', value: 'grid' }
    },
    {
      type: 'select',
      id: 'aspect_ratio',
      label: 'Image Aspect Ratio',
      options: [
        { value: 'square', label: 'Square' },
        { value: 'portrait', label: 'Portrait' },
        { value: 'landscape', label: 'Landscape' },
        { value: 'wide', label: 'Wide' }
      ],
      default: 'landscape'
    },
    {
      type: 'checkbox',
      id: 'show_date',
      label: 'Show Date',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_author',
      label: 'Show Author',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_excerpt',
      label: 'Show Excerpt',
      default: true
    },
    {
      type: 'text',
      id: 'view_all_label',
      label: 'View All Label',
      default: 'View all posts'
    },
    {
      type: 'select',
      id: 'section_padding',
      label: 'Section Padding',
      options: [
        { value: 'none', label: 'None' },
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' }
      ],
      default: 'medium'
    }
  ]
};
