
// Base Schemas for Universal Blocks

export const BaseHeadingSchema = {
  type: 'heading',
  name: 'Heading',
  settings: [
    {
      type: 'text',
      id: 'text',
      label: 'Heading',
      default: 'Heading'
    },
    {
      type: 'select',
      id: 'tag',
      label: 'HTML Tag',
      options: [
        { value: 'h1', label: 'H1' },
        { value: 'h2', label: 'H2' },
        { value: 'h3', label: 'H3' },
        { value: 'p', label: 'Paragraph' }
      ],
      default: 'h2'
    },
    {
      type: 'select',
      id: 'size',
      label: 'Font Size',
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
        { value: 'jumbo', label: 'Jumbo' }
      ],
      default: 'md'
    },
    {
      type: 'color',
      id: 'color',
      label: 'Text Color',
    },
    {
      type: 'color',
      id: 'text_bg_color',
      label: 'Text Background',
    },
    {
      type: 'checkbox',
      id: 'enable_custom_alignment',
      label: 'Enable Custom Alignment',
      default: false
    },
    {
      type: 'select',
      id: 'alignment',
      label: 'Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      default: 'left',
      show_if: 'enable_custom_alignment'
    },
  ],
};

export const BaseTextSchema = {
  type: 'text',
  name: 'Text',
  settings: [
    {
      type: 'textarea',
      id: 'text',
      label: 'Content',
      default: 'Share information about your brand with your customers.'
    },
    {
      type: 'color',
      id: 'color',
      label: 'Text Color',
    },
    {
      type: 'color',
      id: 'text_bg_color',
      label: 'Text Background',
    },
    {
      type: 'checkbox',
      id: 'enable_custom_alignment',
      label: 'Enable Custom Alignment',
      default: false
    },
    {
      type: 'select',
      id: 'alignment',
      label: 'Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      default: 'left',
      show_if: 'enable_custom_alignment'
    },
  ],
};

export const BaseButtonSchema = {
  type: 'button',
  name: 'Button',
  settings: [
    {
      type: 'text',
      id: 'text',
      label: 'Label',
      default: 'Button'
    },
    {
      type: 'text', // Future: Link selector
      id: 'link',
      label: 'Link',
      default: '#'
    },
    {
      type: 'color',
      id: 'bg_color',
      label: 'Button Color',
    },
    {
      type: 'color',
      id: 'text_color',
      label: 'Button Text Color',
    },
    {
      type: 'checkbox',
      id: 'enable_custom_alignment',
      label: 'Enable Custom Alignment',
      default: false
    },
    {
      type: 'select',
      id: 'alignment',
      label: 'Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      default: 'left',
      show_if: 'enable_custom_alignment'
    }
  ],
};

export const BaseImageSchema = {
  type: 'image',
  name: 'Image',
  settings: [
    {
      type: 'image',
      id: 'image',
      label: 'Image'
    },
    {
      type: 'text',
      id: 'alt',
      label: 'Alt Text',
      default: 'Image description'
    },
    {
      type: 'select',
      id: 'aspect_ratio',
      label: 'Aspect Ratio',
      options: [
        { value: 'original', label: 'Original' },
        { value: 'square', label: 'Square (1:1)' },
        { value: 'portrait', label: 'Portrait (4:5)' },
        { value: 'landscape', label: 'Landscape (16:9)' },
        { value: 'wide', label: 'Wide (21:9)' }
      ],
      default: 'original'
    },
    {
      type: 'range',
      id: 'width_desktop',
      label: 'Desktop Width (%)',
      min: 10,
      max: 100,
      step: 10,
      default: 100
    },
    {
      type: 'range',
      id: 'width_mobile',
      label: 'Mobile Width (%)',
      min: 10,
      max: 100,
      step: 10,
      default: 100
    },
    {
      type: 'select',
      id: 'alignment',
      label: 'Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' }
      ],
      default: 'center'
    }
  ]
};

export const BaseVideoSchema = {
  type: 'video',
  name: 'Video',
  settings: [
    {
      type: 'select',
      id: 'source_type',
      label: 'Source Type',
      options: [
        { value: 'url', label: 'Video URL' },
        { value: 'upload', label: 'Upload Video' }
      ],
      default: 'url'
    },
    {
      type: 'text',
      id: 'video_url',
      label: 'Video URL (YouTube, Vimeo, MP4)',
      default: '',
      show_if: { id: 'source_type', value: 'url' }
    },
    {
      type: 'image', // Reusing MediaPicker which now supports video
      id: 'video_file',
      label: 'Upload Video',
      show_if: { id: 'source_type', value: 'upload' }
    },
    {
      type: 'select',
      id: 'aspect_ratio',
      label: 'Aspect Ratio',
      options: [
        { value: 'video', label: '16:9' },
        { value: 'square', label: '1:1' },
        { value: 'portrait', label: '9:16' }
      ],
      default: 'video'
    },
    {
      type: 'checkbox',
      id: 'autoplay',
      label: 'Autoplay (muted)',
      default: false
    }
  ]
};

export const BaseSpacerSchema = {
  type: 'spacer',
  name: 'Spacer',
  settings: [
    {
      type: 'range',
      id: 'height',
      label: 'Height (px)',
      min: 0,
      max: 100,
      step: 4,
      default: 20
    }
  ]
};

export const BaseCollectionItemSchema = {
  type: 'collection_item',
  name: 'Collection Item',
  settings: [
    {
      type: 'collection_picker',
      id: 'collection',
      label: 'Select Collection',
      default: ''
    },
    {
      type: 'image',
      id: 'image',
      label: 'Custom Image (Overrides Collection Image)'
    },
    {
      type: 'text',
      id: 'title',
      label: 'Custom Title',
      default: ''
    },
    {
      type: 'text',
      id: 'description',
      label: 'Custom Description',
      default: ''
    }
  ]
};

// --- Ecom Blocks --- //

export const BaseCollectionSchema = {
  type: 'collection',
  name: 'Collection',
  settings: [
    {
      type: 'collection_picker',
      id: 'collection_handle',
      label: 'Collection',
      default: ''
    },
    {
      type: 'text',
      id: 'title_override',
      label: 'Title Override',
      default: ''
    },
    {
      type: 'select',
      id: 'aspect_ratio',
      label: 'Image Aspect Ratio',
      options: [
        { value: 'square', label: 'Square' },
        { value: 'video', label: 'Video' }
      ],
      default: 'square'
    }
  ]
};

export const BaseProductSchema = {
  type: 'product',
  name: 'Product',
  settings: [
    {
      type: 'product_picker',
      id: 'product_handle',
      label: 'Product',
      default: ''
    },
    {
      type: 'checkbox',
      id: 'show_price',
      label: 'Show Price',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_vendor',
      label: 'Show Vendor',
      default: false
    }
  ]
};

export const BaseProductListSchema = {
  type: 'product_list',
  name: 'Product List',
  settings: [
    {
      type: 'header',
      label: 'Data Source'
    },
    {
      type: 'select',
      id: 'source_type',
      label: 'Source',
      options: [
        { value: 'collection', label: 'Collection' },
        // { value: 'manual', label: 'Selected Products' } // Future
      ],
      default: 'collection'
    },
    {
      type: 'collection_picker',
      id: 'collection',
      label: 'Select Collection',
      show_if: { id: 'source_type', value: 'collection' }
    },
    {
      type: 'header',
      label: 'Layout'
    },
    {
      type: 'range',
      id: 'limit',
      label: 'Number of Products',
      min: 1,
      max: 12,
      step: 1,
      default: 4
    },
    {
      type: 'range',
      id: 'columns',
      label: 'Columns',
      min: 2,
      max: 4,
      step: 1,
      default: 2
    },
    {
      type: 'checkbox',
      id: 'show_vendor',
      label: 'Show Vendor',
      default: false
    }
  ]
};

export const BaseLinkListSchema = {
  type: 'link_list',
  name: 'Link List',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Column Title',
      default: 'Quick Links'
    },
    {
      type: 'link_list',
      id: 'menu',
      label: 'Select Menu',
      default: 'footer'
    }
  ]
};

export const BaseSocialLinkSchema = {
  type: 'social_link',
  name: 'Social Link',
  settings: [
    {
      type: 'select',
      id: 'platform',
      label: 'Platform',
      options: [
        { value: 'facebook', label: 'Facebook' },
        { value: 'twitter', label: 'Twitter' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'tiktok', label: 'TikTok' }
      ],
      default: 'instagram'
    },
    {
      type: 'text',
      id: 'url',
      label: 'Link URL',
      default: 'https://instagram.com'
    },
    {
      type: 'color',
      id: 'icon_color',
      label: 'Icon Color',
      default: '#9CA3AF'
    },
    {
      type: 'checkbox',
      id: 'show_label',
      label: 'Show Platform Label',
      default: false
    }
  ]
};

export const BaseIconSchema = {
  type: 'icon',
  name: 'Icon',
  settings: [
    {
      type: 'text',
      id: 'icon',
      label: 'Icon Name (Lucide)',
      default: 'Star'
    },
    {
      type: 'color',
      id: 'color',
      label: 'Color',
      default: '#000000'
    },
    {
      type: 'range',
      id: 'size',
      label: 'Size',
      min: 12,
      max: 120,
      step: 4,
      default: 24
    }
  ]
};

export const BaseContactFormSchema = {
  type: 'contact_form',
  name: 'Contact Form',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Title',
      default: 'Contact Us'
    },
    {
      type: 'text',
      id: 'button_text',
      label: 'Button Text',
      default: 'Send Message'
    },
    {
      type: 'checkbox',
      id: 'show_phone',
      label: 'Show Phone Field',
      default: false
    }
  ]
};

export const BaseEmailSignupSchema = {
  type: 'email_signup',
  name: 'Email Signup',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Title',
      default: 'Subscribe to our newsletter'
    },
    {
      type: 'text',
      id: 'placeholder',
      label: 'Placeholder',
      default: 'Enter your email'
    },
    {
      type: 'text',
      id: 'button_text',
      label: 'Button Text',
      default: 'Join'
    }
  ]
};

export const BaseAccordionSchema = {
  type: 'accordion',
  name: 'Accordion (FAQ)',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Question',
      default: 'How long does shipping take?'
    },
    {
      type: 'textarea',
      id: 'content',
      label: 'Answer',
      default: 'Shipping usually takes 3-5 business days.'
    },
    {
      type: 'checkbox',
      id: 'open_by_default',
      label: 'Open by Default',
      default: false
    }
  ]
};

export const BaseCardSchema = {
  type: 'card',
  name: 'Card (Grid/List)',
  settings: [
    {
      type: 'image',
      id: 'image',
      label: 'Image'
    },
    {
      type: 'text',
      id: 'title',
      label: 'Title',
      default: 'Card Title'
    },
    {
      type: 'textarea',
      id: 'description',
      label: 'Description',
      default: 'Short description for this card.'
    },
    {
      type: 'text',
      id: 'link',
      label: 'Link',
      default: '#'
    },
    {
      type: 'text',
      id: 'link_text',
      label: 'Link Label',
      default: 'Learn More'
    },
    {
      type: 'select',
      id: 'style',
      label: 'Style',
      options: [
        { value: 'grid', label: 'Grid Item' },
        { value: 'list', label: 'List Item' }
      ],
      default: 'grid'
    }
  ]
};

export const BaseMenuSchema = {
  type: 'menu',
  name: 'Menu Picker',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Title',
      default: 'Main Menu'
    },
    {
      type: 'link_list',
      id: 'menu',
      label: 'Select Menu',
      default: 'main-menu'
    }
  ]
};

// --- Product Detail Page Blocks --- //

export const BaseProductImagesSchema = {
  type: 'product_images',
  name: 'Product Images',
  settings: [
    {
      type: 'select',
      id: 'layout',
      label: 'Gallery Layout',
      options: [
        { value: 'stacked', label: 'Stacked (Desktop)' },
        { value: 'carousel', label: 'Carousel' },
        { value: 'grid', label: 'Grid (2x2)' }
      ],
      default: 'stacked'
    },
    {
      type: 'checkbox',
      id: 'enable_zoom',
      label: 'Enable Zoom on Hover',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_thumbnails',
      label: 'Show Thumbnails',
      default: true
    }
  ]
};

export const BaseProductTitleSchema = {
  type: 'product_title',
  name: 'Product Title',
  settings: [
    {
      type: 'checkbox',
      id: 'show_vendor',
      label: 'Show Vendor',
      default: true
    },
    {
      type: 'color',
      id: 'title_color',
      label: 'Title Color'
    }
  ]
};

export const BaseProductPriceSchema = {
  type: 'product_price',
  name: 'Product Price',
  settings: [
    {
      type: 'checkbox',
      id: 'show_compare_at',
      label: 'Show Compare-at Price',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_tax_info',
      label: 'Show Tax Info',
      default: false
    },
    {
      type: 'color',
      id: 'price_color',
      label: 'Price Color'
    },
    {
      type: 'color',
      id: 'sale_color',
      label: 'Sale Price Color',
      default: '#EF4444'
    }
  ]
};

export const BaseProductDescriptionSchema = {
  type: 'product_description',
  name: 'Product Description',
  settings: [
    {
      type: 'checkbox',
      id: 'enable_collapsible',
      label: 'Collapsible (Read More)',
      default: false
    },
    {
      type: 'range',
      id: 'max_lines',
      label: 'Max Lines (before collapse)',
      min: 3,
      max: 20,
      step: 1,
      default: 6,
      show_if: 'enable_collapsible'
    }
  ]
};

export const BaseProductVariantsSchema = {
  type: 'product_variants',
  name: 'Variant Selector',
  settings: [
    {
      type: 'select',
      id: 'style',
      label: 'Selector Style',
      options: [
        { value: 'buttons', label: 'Buttons' },
        { value: 'dropdown', label: 'Dropdown' }
      ],
      default: 'buttons'
    },
    {
      type: 'checkbox',
      id: 'show_color_swatches',
      label: 'Show Color Swatches',
      default: true
    }
  ]
};

export const BaseAddToCartSchema = {
  type: 'add_to_cart',
  name: 'Add to Cart',
  settings: [
    {
      type: 'text',
      id: 'button_text',
      label: 'Button Text',
      default: 'Add to Cart'
    },
    {
      type: 'text',
      id: 'sold_out_text',
      label: 'Sold Out Text',
      default: 'Sold Out'
    },
    {
      type: 'checkbox',
      id: 'show_quantity',
      label: 'Show Quantity Selector',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_buy_now',
      label: 'Show Buy Now Button',
      default: false
    },
    {
      type: 'color',
      id: 'button_color',
      label: 'Button Color'
    }
  ]
};

// --- Announcement Block --- //

export const BaseAnnouncementSchema = {
  type: 'announcement',
  name: 'Announcement',
  settings: [
    {
      type: 'header',
      label: 'Content'
    },
    {
      type: 'text',
      id: 'text',
      label: 'Message',
      default: '🎉 Free shipping on orders over $50!'
    },
    {
      type: 'text',
      id: 'link',
      label: 'Link URL (optional)',
      default: ''
    },
    {
      type: 'text',
      id: 'link_text',
      label: 'Link Text (optional)',
      default: ''
    },
    {
      type: 'header',
      label: 'Appearance'
    },
    {
      type: 'color',
      id: 'background_color',
      label: 'Background Color',
      default: '#1F2937'
    },
    {
      type: 'range',
      id: 'background_opacity',
      label: 'Background Opacity',
      min: 0,
      max: 100,
      step: 5,
      default: 100
    },
    {
      type: 'color',
      id: 'text_color',
      label: 'Text Color',
      default: '#FFFFFF'
    },
    {
      type: 'select',
      id: 'icon',
      label: 'Icon',
      options: [
        { value: 'none', label: 'None' },
        { value: 'megaphone', label: 'Megaphone' },
        { value: 'tag', label: 'Tag / Sale' },
        { value: 'truck', label: 'Shipping' },
        { value: 'gift', label: 'Gift' },
        { value: 'sparkles', label: 'Sparkles' },
        { value: 'info', label: 'Info' }
      ],
      default: 'none'
    },
    {
      type: 'header',
      label: 'Marquee / Scrolling'
    },
    {
      type: 'checkbox',
      id: 'enable_marquee',
      label: 'Enable Scrolling Text',
      default: false
    },
    {
      type: 'range',
      id: 'marquee_speed',
      label: 'Scroll Speed (seconds)',
      min: 5,
      max: 30,
      step: 1,
      default: 15,
      show_if: 'enable_marquee'
    },
    {
      type: 'select',
      id: 'marquee_direction',
      label: 'Scroll Direction',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' }
      ],
      default: 'left',
      show_if: 'enable_marquee'
    },
    {
      type: 'header',
      label: 'Behavior'
    },
    {
      type: 'checkbox',
      id: 'sticky',
      label: 'Sticky (stays on top)',
      default: false
    },
    {
      type: 'checkbox',
      id: 'closable',
      label: 'Allow Dismiss',
      default: true
    }
  ]
};


export const BaseDividerSchema = {
  type: 'divider',
  name: 'Divider',
  settings: [
    {
      type: 'color',
      id: 'color',
      label: 'Line Color',
      default: '#E5E7EB'
    },
    {
      type: 'range',
      id: 'width',
      label: 'Width (%)',
      min: 10,
      max: 100,
      step: 10,
      default: 100
    },
    {
      type: 'range',
      id: 'thickness',
      label: 'Thickness (px)',
      min: 1,
      max: 10,
      step: 1,
      default: 1
    },
    {
      type: 'select',
      id: 'style',
      label: 'Line Style',
      options: [
        { value: 'solid', label: 'Solid' },
        { value: 'dashed', label: 'Dashed' },
        { value: 'dotted', label: 'Dotted' }
      ],
      default: 'solid'
    },
    {
      type: 'range',
      id: 'padding_top',
      label: 'Padding Top',
      min: 0,
      max: 100,
      default: 20
    },
    {
      type: 'range',
      id: 'padding_bottom',
      label: 'Padding Bottom',
      min: 0,
      max: 100,
      default: 20
    },
    {
      type: 'select',
      id: 'alignment',
      label: 'Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' }
      ],
      default: 'center'
    }
  ]
};

// All Schemas List
export const AllBlockSchemas = [
  BaseHeadingSchema,
  BaseTextSchema,
  BaseButtonSchema,
  BaseImageSchema,
  BaseVideoSchema,
  BaseSpacerSchema,
  BaseCollectionSchema,
  BaseProductSchema,
  BaseProductListSchema,
  BaseLinkListSchema,
  BaseSocialLinkSchema,
  BaseIconSchema,
  BaseContactFormSchema,
  BaseEmailSignupSchema,
  BaseAccordionSchema,
  BaseCardSchema,
  BaseMenuSchema,
  BaseAnnouncementSchema,
  BaseDividerSchema,
  // Product Detail Blocks
  BaseProductImagesSchema,
  BaseProductTitleSchema,
  BaseProductPriceSchema,
  BaseProductDescriptionSchema,
  BaseProductVariantsSchema,
  BaseAddToCartSchema
];

/**
 * Helper to combine section-specific blocks with global reusable blocks.
 * Sections can pass their custom-configured blocks first, and this utility 
 * will append the remaining global blocks.
 */
export const getSharedBlocks = (customBlocks: any[] = [], wrapper?: (block: any) => any) => {
  const customBlockTypes = new Set(customBlocks.map(b => b.type));
  const genericBlocks = AllBlockSchemas.filter(b => !customBlockTypes.has(b.type));
  const combined = [...customBlocks, ...genericBlocks];
  return wrapper ? combined.map(wrapper) : combined;
};

// Helper to inject Column Index setting
export const withColumnSettings = (schema: any) => {
  return {
    ...schema,
    settings: [
      ...schema.settings,
      {
        type: 'range',
        id: 'column_index',
        label: 'Column Index',
        min: 0,
        max: 3, // Supports up to 4 columns (0-3)
        step: 1,
        default: 0
      }
    ]
  };
};
