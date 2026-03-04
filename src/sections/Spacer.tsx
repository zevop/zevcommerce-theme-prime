
export default function Spacer({ settings }: { settings: any }) {
  return (
    <div style={{
      height: `${settings.height || 50}px`,
      backgroundColor: settings.background_color || 'transparent'
    }} />
  );
}

export const schema = {
  type: 'spacer',
  name: 'Spacer',
  settings: [
    {
      type: 'range',
      id: 'height',
      label: 'Height (px)',
      min: 10,
      max: 200,
      step: 5,
      default: 50
    },
    {
      type: 'color',
      id: 'background_color',
      label: 'Background Color',
      default: 'transparent'
    }
  ],
  blocks: []
};
