/**
 * Common per-section settings that can be spread into any section's schema.
 * Provides animation, background, and padding controls.
 */
export function getCommonSectionSettings() {
  return [
    { type: 'header', id: '_section_style_header', label: 'Section Style' },
    {
      type: 'select',
      id: 'animation',
      label: 'Entrance Animation',
      options: [
        { value: 'fade-up', label: 'Fade Up' },
        { value: 'fade-in', label: 'Fade In' },
        { value: 'slide-left', label: 'Slide from Left' },
        { value: 'slide-right', label: 'Slide from Right' },
        { value: 'none', label: 'None' },
      ],
      default: 'fade-up',
    },
    {
      type: 'color',
      id: 'background_color',
      label: 'Background Color',
    },
    {
      type: 'color',
      id: 'gradient_start',
      label: 'Gradient Start',
    },
    {
      type: 'color',
      id: 'gradient_end',
      label: 'Gradient End',
    },
    {
      type: 'select',
      id: 'gradient_direction',
      label: 'Gradient Direction',
      options: [
        { value: 'to-b', label: 'Top to Bottom' },
        { value: 'to-r', label: 'Left to Right' },
        { value: 'to-br', label: 'Diagonal' },
      ],
      default: 'to-b',
      show_if: 'gradient_start',
    },
    {
      type: 'range',
      id: 'padding_top',
      label: 'Padding Top',
      min: 0,
      max: 160,
      step: 8,
      default: 80,
    },
    {
      type: 'range',
      id: 'padding_bottom',
      label: 'Padding Bottom',
      min: 0,
      max: 160,
      step: 8,
      default: 80,
    },
  ];
}
