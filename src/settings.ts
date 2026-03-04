import { defineSettings } from '@zevcommerce/theme-sdk';

export const settingsSchema = defineSettings([
  // ============================================================
  // COLORS
  // ============================================================
  {
    name: 'Colors',
    icon: 'palette',
    settings: [
      { type: 'header', id: 'colors._header_base', label: 'Base Colors' },
      { type: 'color', id: 'colors.background', label: 'Background', default: '#ffffff' },
      { type: 'color', id: 'colors.text', label: 'Text', default: '#374151' },
      { type: 'color', id: 'colors.heading', label: 'Heading', default: '#111827' },
      { type: 'color', id: 'colors.border', label: 'Border', default: '#e5e7eb' },
      { type: 'color', id: 'colors.primary', label: 'Primary', default: '#000000' },
      { type: 'color', id: 'colors.secondary', label: 'Secondary', default: '#4B5563' },
      { type: 'color', id: 'colors.accent', label: 'Accent', default: '#3B82F6' },
      { type: 'color', id: 'colors.link', label: 'Link', default: '#2563EB' },
      { type: 'color', id: 'colors.linkHover', label: 'Link Hover', default: '#1d4ed8' },
      { type: 'color', id: 'colors.shadow', label: 'Shadow', default: 'rgba(0,0,0,0.1)' },

      { type: 'header', id: 'colors._header_primary_btn', label: 'Primary Buttons' },
      { type: 'color', id: 'colors.buttonBg', label: 'Background', default: '#000000' },
      { type: 'color', id: 'colors.buttonText', label: 'Text', default: '#ffffff' },
      { type: 'color', id: 'colors.buttonBorder', label: 'Border', default: '#000000' },
      { type: 'color', id: 'colors.buttonHoverBg', label: 'Hover Background', default: '#333333' },
      { type: 'color', id: 'colors.buttonHoverText', label: 'Hover Text', default: '#ffffff' },
      { type: 'color', id: 'colors.buttonHoverBorder', label: 'Hover Border', default: '#333333' },

      { type: 'header', id: 'colors._header_secondary_btn', label: 'Secondary Buttons' },
      { type: 'color', id: 'colors.secondaryButtonBg', label: 'Background', default: '#ffffff' },
      { type: 'color', id: 'colors.secondaryButtonText', label: 'Text', default: '#374151' },
      { type: 'color', id: 'colors.secondaryButtonBorder', label: 'Border', default: '#d1d5db' },
      { type: 'color', id: 'colors.secondaryButtonHoverBg', label: 'Hover Background', default: '#f3f4f6' },
      { type: 'color', id: 'colors.secondaryButtonHoverText', label: 'Hover Text', default: '#111827' },
      { type: 'color', id: 'colors.secondaryButtonHoverBorder', label: 'Hover Border', default: '#9ca3af' },

      { type: 'header', id: 'colors._header_inputs', label: 'Inputs' },
      { type: 'color', id: 'colors.inputBg', label: 'Background', default: '#ffffff' },
      { type: 'color', id: 'colors.inputText', label: 'Text', default: '#374151' },
      { type: 'color', id: 'colors.inputBorder', label: 'Border', default: '#d1d5db' },
      { type: 'color', id: 'colors.inputHoverBg', label: 'Hover Background', default: '#f9fafb' },

      { type: 'header', id: 'colors._header_variants', label: 'Product Variants' },
      { type: 'color', id: 'colors.variantBg', label: 'Background', default: '#ffffff' },
      { type: 'color', id: 'colors.variantText', label: 'Text', default: '#374151' },
      { type: 'color', id: 'colors.variantBorder', label: 'Border', default: '#e5e7eb' },
      { type: 'color', id: 'colors.variantSelectedBg', label: 'Selected Background', default: '#111827' },
      { type: 'color', id: 'colors.variantSelectedText', label: 'Selected Text', default: '#ffffff' },
      { type: 'color', id: 'colors.variantSelectedBorder', label: 'Selected Border', default: '#111827' },
    ],
  },

  // ============================================================
  // TYPOGRAPHY
  // ============================================================
  {
    name: 'Typography',
    icon: 'type',
    settings: [
      { type: 'header', id: 'typography._header_fonts', label: 'Font Families' },
      {
        type: 'select', id: 'typography.headingFont', label: 'Heading Font', default: 'Outfit',
        options: [
          { value: 'Inter', label: 'Inter' },
          { value: 'Roboto', label: 'Roboto' },
          { value: 'Poppins', label: 'Poppins' },
          { value: 'Outfit', label: 'Outfit' },
          { value: 'Playfair Display', label: 'Playfair Display' },
          { value: 'Montserrat', label: 'Montserrat' },
        ],
      },
      {
        type: 'select', id: 'typography.bodyFont', label: 'Body Font', default: 'Inter',
        options: [
          { value: 'Inter', label: 'Inter' },
          { value: 'Roboto', label: 'Roboto' },
          { value: 'Open Sans', label: 'Open Sans' },
          { value: 'Lato', label: 'Lato' },
          { value: 'Source Sans Pro', label: 'Source Sans Pro' },
        ],
      },
      {
        type: 'select', id: 'typography.subheadingFont', label: 'Subheading Font', default: 'Inter',
        options: [
          { value: 'Inter', label: 'Inter' },
          { value: 'Roboto', label: 'Roboto' },
          { value: 'Poppins', label: 'Poppins' },
          { value: 'Montserrat', label: 'Montserrat' },
        ],
      },
      {
        type: 'select', id: 'typography.accentFont', label: 'Accent Font', default: 'Playfair Display',
        options: [
          { value: 'Playfair Display', label: 'Playfair Display' },
          { value: 'Dancing Script', label: 'Dancing Script' },
          { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
          { value: 'Pacifico', label: 'Pacifico' },
          { value: 'Inter', label: 'Inter' },
        ],
      },

      { type: 'header', id: 'typography._header_p', label: 'Paragraph' },
      { type: 'range', id: 'typography.p.size', label: 'Size', default: '16px', min: 12, max: 24 },
      {
        type: 'select', id: 'typography.p.lineHeight', label: 'Line Height', default: 'normal',
        options: [
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'loose', label: 'Loose' },
        ],
      },
      {
        type: 'select', id: 'typography.p.letterSpacing', label: 'Letter Spacing', default: 'normal',
        options: [
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'loose', label: 'Loose' },
        ],
      },

      { type: 'header', id: 'typography._header_h1', label: 'Heading 1' },
      {
        type: 'select', id: 'typography.h1.font', label: 'Font', default: 'heading',
        options: [
          { value: 'heading', label: 'Heading' },
          { value: 'body', label: 'Body' },
          { value: 'subheading', label: 'Subheading' },
          { value: 'accent', label: 'Accent' },
        ],
      },
      {
        type: 'select', id: 'typography.h1.case', label: 'Case', default: 'default',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'uppercase', label: 'Uppercase' },
        ],
      },
      { type: 'range', id: 'typography.h1.size', label: 'Size', default: '48px', min: 24, max: 120 },
      {
        type: 'select', id: 'typography.h1.lineHeight', label: 'Line Height', default: 'normal',
        options: [
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'loose', label: 'Loose' },
        ],
      },
      {
        type: 'select', id: 'typography.h1.letterSpacing', label: 'Letter Spacing', default: 'normal',
        options: [
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'loose', label: 'Loose' },
        ],
      },

      { type: 'header', id: 'typography._header_h2', label: 'Heading 2' },
      {
        type: 'select', id: 'typography.h2.font', label: 'Font', default: 'heading',
        options: [
          { value: 'heading', label: 'Heading' },
          { value: 'body', label: 'Body' },
          { value: 'subheading', label: 'Subheading' },
          { value: 'accent', label: 'Accent' },
        ],
      },
      {
        type: 'select', id: 'typography.h2.case', label: 'Case', default: 'default',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'uppercase', label: 'Uppercase' },
        ],
      },
      { type: 'range', id: 'typography.h2.size', label: 'Size', default: '36px', min: 20, max: 80 },
      {
        type: 'select', id: 'typography.h2.lineHeight', label: 'Line Height', default: 'normal',
        options: [
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'loose', label: 'Loose' },
        ],
      },
      {
        type: 'select', id: 'typography.h2.letterSpacing', label: 'Letter Spacing', default: 'normal',
        options: [
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'loose', label: 'Loose' },
        ],
      },

      { type: 'header', id: 'typography._header_h3', label: 'Heading 3' },
      {
        type: 'select', id: 'typography.h3.font', label: 'Font', default: 'heading',
        options: [
          { value: 'heading', label: 'Heading' },
          { value: 'body', label: 'Body' },
          { value: 'subheading', label: 'Subheading' },
          { value: 'accent', label: 'Accent' },
        ],
      },
      {
        type: 'select', id: 'typography.h3.case', label: 'Case', default: 'default',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'uppercase', label: 'Uppercase' },
        ],
      },
      { type: 'range', id: 'typography.h3.size', label: 'Size', default: '30px', min: 18, max: 60 },
      {
        type: 'select', id: 'typography.h3.lineHeight', label: 'Line Height', default: 'normal',
        options: [
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'loose', label: 'Loose' },
        ],
      },
      {
        type: 'select', id: 'typography.h3.letterSpacing', label: 'Letter Spacing', default: 'normal',
        options: [
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'loose', label: 'Loose' },
        ],
      },

      { type: 'header', id: 'typography._header_h4', label: 'Heading 4' },
      {
        type: 'select', id: 'typography.h4.font', label: 'Font', default: 'heading',
        options: [
          { value: 'heading', label: 'Heading' },
          { value: 'body', label: 'Body' },
          { value: 'subheading', label: 'Subheading' },
          { value: 'accent', label: 'Accent' },
        ],
      },
      {
        type: 'select', id: 'typography.h4.case', label: 'Case', default: 'default',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'uppercase', label: 'Uppercase' },
        ],
      },
      { type: 'range', id: 'typography.h4.size', label: 'Size', default: '24px', min: 16, max: 48 },
      {
        type: 'select', id: 'typography.h4.lineHeight', label: 'Line Height', default: 'normal',
        options: [
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'loose', label: 'Loose' },
        ],
      },
      {
        type: 'select', id: 'typography.h4.letterSpacing', label: 'Letter Spacing', default: 'normal',
        options: [
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'loose', label: 'Loose' },
        ],
      },

      { type: 'header', id: 'typography._header_h5', label: 'Heading 5' },
      {
        type: 'select', id: 'typography.h5.font', label: 'Font', default: 'heading',
        options: [
          { value: 'heading', label: 'Heading' },
          { value: 'body', label: 'Body' },
          { value: 'subheading', label: 'Subheading' },
          { value: 'accent', label: 'Accent' },
        ],
      },
      {
        type: 'select', id: 'typography.h5.case', label: 'Case', default: 'default',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'uppercase', label: 'Uppercase' },
        ],
      },
      { type: 'range', id: 'typography.h5.size', label: 'Size', default: '20px', min: 14, max: 36 },
      {
        type: 'select', id: 'typography.h5.lineHeight', label: 'Line Height', default: 'normal',
        options: [
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'loose', label: 'Loose' },
        ],
      },
      {
        type: 'select', id: 'typography.h5.letterSpacing', label: 'Letter Spacing', default: 'normal',
        options: [
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'loose', label: 'Loose' },
        ],
      },

      { type: 'header', id: 'typography._header_h6', label: 'Heading 6' },
      {
        type: 'select', id: 'typography.h6.font', label: 'Font', default: 'heading',
        options: [
          { value: 'heading', label: 'Heading' },
          { value: 'body', label: 'Body' },
          { value: 'subheading', label: 'Subheading' },
          { value: 'accent', label: 'Accent' },
        ],
      },
      {
        type: 'select', id: 'typography.h6.case', label: 'Case', default: 'default',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'uppercase', label: 'Uppercase' },
        ],
      },
      { type: 'range', id: 'typography.h6.size', label: 'Size', default: '16px', min: 12, max: 28 },
      {
        type: 'select', id: 'typography.h6.lineHeight', label: 'Line Height', default: 'normal',
        options: [
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'loose', label: 'Loose' },
        ],
      },
      {
        type: 'select', id: 'typography.h6.letterSpacing', label: 'Letter Spacing', default: 'normal',
        options: [
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'loose', label: 'Loose' },
        ],
      },
    ],
  },

  // ============================================================
  // LAYOUT
  // ============================================================
  {
    name: 'Layout',
    icon: 'layout',
    settings: [
      {
        type: 'select', id: 'layout.containerWidth', label: 'Container Width', default: '1280px',
        options: [
          { value: '1024px', label: 'Narrow (1024px)' },
          { value: '1280px', label: 'Standard (1280px)' },
          { value: '1440px', label: 'Wide (1440px)' },
          { value: '1600px', label: 'Extra Wide (1600px)' },
          { value: '100%', label: 'Full Width' },
        ],
      },
      { type: 'range', id: 'layout.sectionSpacing', label: 'Section Spacing', default: '80px', min: 0, max: 160, step: 8 },
      { type: 'range', id: 'layout.sectionSpacingMobile', label: 'Section Spacing (Mobile)', default: '40px', min: 0, max: 80, step: 4 },
      { type: 'range', id: 'layout.gridGap', label: 'Grid Gap', default: '24px', min: 0, max: 60, step: 4 },
    ],
  },

  // ============================================================
  // ANIMATIONS
  // ============================================================
  {
    name: 'Animations',
    icon: 'sparkles',
    settings: [
      {
        type: 'select', id: 'animations.pageTransition', label: 'Page Transition', default: 'fade',
        options: [
          { value: 'none', label: 'None' },
          { value: 'fade', label: 'Fade' },
          { value: 'slide', label: 'Slide' },
        ],
      },
      {
        type: 'select', id: 'animations.cardHoverEffect', label: 'Card Hover Effect', default: 'lift',
        options: [
          { value: 'none', label: 'None' },
          { value: 'lift', label: 'Lift' },
          { value: 'scale', label: 'Scale' },
          { value: 'zoom', label: 'Zoom' },
        ],
      },

      { type: 'header', id: 'animations._header_scroll', label: 'Scroll Animations' },
      {
        type: 'select', id: 'animations.scrollReveal', label: 'Section Entrance', default: 'fade-up',
        options: [
          { value: 'none', label: 'None' },
          { value: 'fade-up', label: 'Fade Up' },
          { value: 'fade-in', label: 'Fade In' },
          { value: 'slide-left', label: 'Slide from Left' },
        ],
      },
      { type: 'range', id: 'animations.scrollRevealDuration', label: 'Animation Duration (ms)', default: '600', min: 200, max: 1200, step: 100 },
      { type: 'checkbox', id: 'animations.staggerChildren', label: 'Stagger grid item animations', default: true },
    ],
  },

  // ============================================================
  // BUTTONS
  // ============================================================
  {
    name: 'Buttons',
    icon: 'rectangle-horizontal',
    settings: [
      { type: 'header', id: 'buttons._header_primary', label: 'Primary Button' },
      { type: 'range', id: 'buttons.primaryBorderThickness', label: 'Border Thickness', default: '0px', min: 0, max: 4, step: 1 },
      { type: 'range', id: 'buttons.primaryRadius', label: 'Border Radius', default: '4px', min: 0, max: 40, step: 2 },
      {
        type: 'select', id: 'buttons.primaryFont', label: 'Font', default: 'body',
        options: [
          { value: 'body', label: 'Body' },
          { value: 'accent', label: 'Accent' },
          { value: 'heading', label: 'Heading' },
        ],
      },
      {
        type: 'select', id: 'buttons.primaryCase', label: 'Case', default: 'default',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'uppercase', label: 'Uppercase' },
        ],
      },

      { type: 'header', id: 'buttons._header_secondary', label: 'Secondary Button' },
      { type: 'range', id: 'buttons.secondaryBorderThickness', label: 'Border Thickness', default: '1px', min: 0, max: 4, step: 1 },
      { type: 'range', id: 'buttons.secondaryRadius', label: 'Border Radius', default: '4px', min: 0, max: 40, step: 2 },
      {
        type: 'select', id: 'buttons.secondaryFont', label: 'Font', default: 'body',
        options: [
          { value: 'body', label: 'Body' },
          { value: 'accent', label: 'Accent' },
          { value: 'heading', label: 'Heading' },
        ],
      },
      {
        type: 'select', id: 'buttons.secondaryCase', label: 'Case', default: 'default',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'uppercase', label: 'Uppercase' },
        ],
      },

      { type: 'header', id: 'buttons._header_pills', label: 'Pills' },
      { type: 'range', id: 'buttons.pillsRadius', label: 'Border Radius', default: '100px', min: 0, max: 100, step: 4 },
    ],
  },

  // ============================================================
  // BADGES
  // ============================================================
  {
    name: 'Badges',
    icon: 'tag',
    settings: [
      {
        type: 'select', id: 'badges.position', label: 'Position', default: 'top_left',
        options: [
          { value: 'top_left', label: 'Top Left' },
          { value: 'top_right', label: 'Top Right' },
          { value: 'bottom_left', label: 'Bottom Left' },
          { value: 'bottom_right', label: 'Bottom Right' },
        ],
      },
      { type: 'range', id: 'badges.radius', label: 'Border Radius', default: '4px', min: 0, max: 24, step: 2 },
      { type: 'color', id: 'badges.saleBg', label: 'Sale Background', default: '#ef4444' },
      { type: 'color', id: 'badges.saleText', label: 'Sale Text', default: '#ffffff' },
      { type: 'color', id: 'badges.soldOutBg', label: 'Sold Out Background', default: '#9ca3af' },
      { type: 'color', id: 'badges.soldOutText', label: 'Sold Out Text', default: '#ffffff' },
      {
        type: 'select', id: 'badges.font', label: 'Font', default: 'body',
        options: [
          { value: 'body', label: 'Body' },
          { value: 'accent', label: 'Accent' },
          { value: 'heading', label: 'Heading' },
        ],
      },
      {
        type: 'select', id: 'badges.case', label: 'Case', default: 'uppercase',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'uppercase', label: 'Uppercase' },
        ],
      },
    ],
  },

  // ============================================================
  // CART
  // ============================================================
  {
    name: 'Cart',
    icon: 'shopping-cart',
    settings: [
      {
        type: 'select', id: 'cart.type', label: 'Cart Type', default: 'drawer',
        options: [
          { value: 'page', label: 'Page' },
          { value: 'drawer', label: 'Drawer' },
        ],
      },
      {
        type: 'select', id: 'cart.titleCase', label: 'Title Case', default: 'default',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'uppercase', label: 'Uppercase' },
        ],
      },
      {
        type: 'select', id: 'cart.priceFont', label: 'Price Font', default: 'body',
        options: [
          { value: 'body', label: 'Body' },
          { value: 'heading', label: 'Heading' },
          { value: 'subheading', label: 'Subheading' },
          { value: 'accent', label: 'Accent' },
        ],
      },
      { type: 'checkbox', id: 'cart.autoOpenDrawer', label: 'Auto-open drawer on add to cart', default: true },
      { type: 'text', id: 'cart.emptyCartLink', label: 'Empty Cart Link', default: '/products' },
      { type: 'checkbox', id: 'cart.enableNotes', label: 'Enable order notes', default: false },
      { type: 'checkbox', id: 'cart.openNoteByDefault', label: 'Open note by default', default: false },
      { type: 'checkbox', id: 'cart.enableDiscounts', label: 'Enable discount codes', default: true },
      {
        type: 'select', id: 'cart.mediaBorder', label: 'Media Border', default: 'none',
        options: [
          { value: 'none', label: 'None' },
          { value: 'solid', label: 'Solid' },
        ],
      },
      { type: 'range', id: 'cart.mediaRadius', label: 'Media Radius', default: '4px', min: 0, max: 24, step: 2 },
      { type: 'range', id: 'cart.freeShippingThreshold', label: 'Free Shipping Threshold', default: '0', min: 0, max: 100000, step: 1000, info: 'Set to 0 to hide the progress bar' },
      { type: 'text', id: 'cart.checkoutButtonText', label: 'Checkout Button Text', default: 'Checkout' },
      { type: 'checkbox', id: 'cart.showTrustBadges', label: 'Show Trust Badges', default: true },
    ],
  },

  // ============================================================
  // DRAWERS
  // ============================================================
  {
    name: 'Drawers',
    icon: 'panel-right',
    settings: [
      {
        type: 'select', id: 'drawers.colorScheme', label: 'Color Scheme', default: 'light',
        options: [
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'accent', label: 'Accent' },
        ],
      },
      {
        type: 'select', id: 'drawers.borders', label: 'Borders', default: 'none',
        options: [
          { value: 'none', label: 'None' },
          { value: 'solid', label: 'Solid' },
        ],
      },
      {
        type: 'select', id: 'drawers.shadow', label: 'Shadow', default: 'md',
        options: [
          { value: 'none', label: 'None' },
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
          { value: 'xl', label: 'Extra Large' },
        ],
      },
    ],
  },

  // ============================================================
  // ICONS
  // ============================================================
  {
    name: 'Icons',
    icon: 'star',
    settings: [
      {
        type: 'select', id: 'icons.stroke', label: 'Stroke Width', default: 'default',
        options: [
          { value: 'thin', label: 'Thin (1px)' },
          { value: 'default', label: 'Default (1.5px)' },
          { value: 'heavy', label: 'Heavy (2px)' },
        ],
      },
    ],
  },

  // ============================================================
  // INPUT FIELDS
  // ============================================================
  {
    name: 'Input Fields',
    icon: 'text-cursor-input',
    settings: [
      { type: 'range', id: 'inputs.borderThickness', label: 'Border Thickness', default: '1px', min: 0, max: 4, step: 1 },
      { type: 'range', id: 'inputs.radius', label: 'Border Radius', default: '4px', min: 0, max: 24, step: 2 },
      {
        type: 'select', id: 'inputs.textPreset', label: 'Text Preset', default: 'p',
        options: [
          { value: 'p', label: 'Paragraph' },
          { value: 'h1', label: 'Heading 1' },
          { value: 'h2', label: 'Heading 2' },
          { value: 'h3', label: 'Heading 3' },
          { value: 'h4', label: 'Heading 4' },
          { value: 'h5', label: 'Heading 5' },
          { value: 'h6', label: 'Heading 6' },
        ],
      },
    ],
  },

  // ============================================================
  // POPOVERS & MODALS
  // ============================================================
  {
    name: 'Popovers & Modals',
    icon: 'square',
    settings: [
      {
        type: 'select', id: 'modals.colorScheme', label: 'Color Scheme', default: 'light',
        options: [
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ],
      },
      { type: 'range', id: 'modals.radius', label: 'Border Radius', default: '12px', min: 0, max: 40, step: 4 },
      {
        type: 'select', id: 'modals.borders', label: 'Borders', default: 'none',
        options: [
          { value: 'none', label: 'None' },
          { value: 'solid', label: 'Solid' },
        ],
      },
      {
        type: 'select', id: 'modals.shadow', label: 'Shadow', default: 'xl',
        options: [
          { value: 'none', label: 'None' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
          { value: 'xl', label: 'Extra Large' },
          { value: '2xl', label: '2XL' },
        ],
      },
    ],
  },

  // ============================================================
  // PRODUCT CARDS
  // ============================================================
  {
    name: 'Product Cards',
    icon: 'credit-card',
    settings: [
      { type: 'checkbox', id: 'productCards.quickAdd', label: 'Show Quick Add button', default: true },
      { type: 'checkbox', id: 'productCards.mobileQuickAdd', label: 'Show Quick Add on mobile', default: true },
      {
        type: 'select', id: 'productCards.quickAddScheme', label: 'Quick Add Color Scheme', default: 'white',
        options: [
          { value: 'white', label: 'White' },
          { value: 'black', label: 'Black' },
          { value: 'primary', label: 'Primary' },
        ],
      },
      { type: 'checkbox', id: 'productCards.showSecondImage', label: 'Show second image on hover', default: false },
      { type: 'checkbox', id: 'productCards.showCarousel', label: 'Show image carousel', default: false },
      { type: 'select', id: 'productCards.imageRatio', label: 'Image Aspect Ratio', default: 'portrait',
        options: [
          { value: 'auto', label: 'Auto' },
          { value: 'square', label: 'Square' },
          { value: 'portrait', label: 'Portrait' },
          { value: 'landscape', label: 'Landscape' },
        ],
      },
      { type: 'select', id: 'productCards.objectFit', label: 'Image Fit', default: 'cover',
        options: [
          { value: 'cover', label: 'Cover' },
          { value: 'contain', label: 'Contain' },
        ],
      },
      { type: 'select', id: 'productCards.borderRadius', label: 'Card Corners', default: 'lg',
        options: [
          { value: 'none', label: 'None' },
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
          { value: 'full', label: 'Round' },
        ],
      },
      { type: 'checkbox', id: 'productCards.showVendor', label: 'Show Vendor/Brand', default: false },
      { type: 'text', id: 'productCards.quickAddText', label: 'Quick Add Button Text', default: 'Quick Add' },
      { type: 'range', id: 'productCards.mobileColumns', label: 'Mobile Columns', default: '2', min: 1, max: 3, step: 1 },
    ],
  },
]);
