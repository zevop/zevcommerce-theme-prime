'use client';

import ImageWithText from './ImageWithText';
import { getSharedBlocks } from '../blocks/schemas';

/*
  Editorial Section
  - Essentially an ImageWithText wrapper but with specific presets for "Editorial" look
  - Can restrict blocks or default to specific jumbo text configurations
*/

export default function Editorial(props: any) {
  // Re-use ImageWithText component as the logic is identical for layout
  return <ImageWithText {...props} />;
}


export const schema = {
  type: 'editorial',
  name: 'Editorial',
  settings: [
    {
      type: 'image',
      id: 'image',
      label: 'Image'
    },
    {
      type: 'select',
      id: 'image_position',
      label: 'Image Position',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' }
      ],
      default: 'right' // Editorial often has image on right
    },
    {
      type: 'select',
      id: 'image_width',
      label: 'Image Width',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' }
      ],
      default: 'medium'
    },
    {
      type: 'select',
      id: 'height',
      label: 'Section Height',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' }
      ],
      default: 'medium'
    },
    {
      type: 'color',
      id: 'background_color',
      label: 'Background Color',
      default: '#f3f4f6' // Slight gray for editorial feel
    },
    {
      type: 'color',
      id: 'text_color',
      label: 'Text Color',
      default: '#000000'
    },
  ],
  blocks: getSharedBlocks(),
  defaultBlocks: [
    { type: 'heading', settings: { text: 'Editorial Story', tag: 'h2', size: 'jumbo' } }, // Using new size prop
    { type: 'text', settings: { text: 'Share your brand story in a compelling way using this editorial layout.' } },
    { type: 'button', settings: { text: 'Read Story' } }
  ]
};

// Variation for Jumbo Text preset specifically if needed separate from defaults
// But typically handled via presets in registry or themes. 
// For now, this Schema default block sets the tone.
