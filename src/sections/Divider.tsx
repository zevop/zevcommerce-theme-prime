import { DividerBlock } from '../blocks/StandardBlocks';
import { BaseDividerSchema } from '../blocks/schemas';

export default function Divider({ settings }: { settings: any }) {
  // Reuse the DividerBlock's rendering logic by passing section settings as block settings
  return (
    <div style={{ backgroundColor: settings.background_color || 'transparent' }}>
      <DividerBlock settings={settings} />
    </div>
  );
}

// Reuse BaseDividerSchema settings, plus background color
export const schema = {
  type: 'divider',
  name: 'Divider',
  settings: [
    ...BaseDividerSchema.settings,
    {
      type: 'color',
      id: 'background_color',
      label: 'Section Background',
      default: 'transparent'
    }
  ],
  blocks: []
};
