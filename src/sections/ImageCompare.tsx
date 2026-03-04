'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface ImageCompareProps {
  settings: {
    before_image: any;
    after_image: any;
    height: 'small' | 'medium' | 'large';
    slider_color: string;
    show_labels: boolean;
    before_label: string;
    after_label: string;
  };
}

export default function ImageCompare({ settings }: ImageCompareProps) {
  const {
    before_image,
    after_image,
    height = 'medium',
    slider_color = '#ffffff',
    show_labels = true,
    before_label = 'Before',
    after_label = 'After'
  } = settings;

  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const beforeUrl = typeof before_image === 'string' ? before_image : before_image?.url;
  const afterUrl = typeof after_image === 'string' ? after_image : after_image?.url;

  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = () => setIsResizing(false);

  const handleMouseMove = (e: any) => {
    if (!isResizing || !containerRef.current) return;

    // Support Touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const position = clientX - left;
    const percentage = Math.min(Math.max((position / width) * 100, 0), 100);

    setSliderPosition(percentage);
  };

  // Global event listeners for drag
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isResizing]);


  const heightStyles = {
    small: 'h-[400px]',
    medium: 'h-[600px]',
    large: 'h-[800px]'
  };

  if (!beforeUrl || !afterUrl) {
    return (
      <div className={`w-full bg-gray-100 flex items-center justify-center border-dashed border-2 border-gray-300 ${heightStyles[height]}`}>
        <div className="text-center text-gray-500">
          <p>Select both Before and After images to see comparison.</p>
        </div>
      </div>
    )
  }

  return (
    <section
      className={`relative w-full overflow-hidden select-none cursor-ew-resize ${heightStyles[height]}`}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Background) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${afterUrl})` }}
      />

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 bg-cover bg-center border-r-2"
        style={{
          backgroundImage: `url(${beforeUrl})`,
          width: `${sliderPosition}%`,
          borderColor: slider_color
        }}
      />

      {/* Slider Handle */}
      <div
        className="absolute inset-y-0 w-10 -ml-5 flex items-center justify-center z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-1 h-full" style={{ backgroundColor: slider_color }} />
        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg absolute" style={{ backgroundColor: slider_color }}>
          <ArrowLeftRight className="w-5 h-5 text-black/70" />
        </div>
      </div>

      {/* Labels */}
      {show_labels && (
        <>
          <span className="absolute bottom-4 left-4 min-w-[80px] text-center bg-black/50 text-white px-3 py-1 rounded backdrop-blur-sm text-sm font-medium z-20 pointer-events-none">
            {before_label}
          </span>
          <span className="absolute bottom-4 right-4 min-w-[80px] text-center bg-black/50 text-white px-3 py-1 rounded backdrop-blur-sm text-sm font-medium z-20 pointer-events-none">
            {after_label}
          </span>
        </>
      )}
    </section>
  );
}

export const schema = {
  type: 'image_compare',
  name: 'Image Compare',
  settings: [
    {
      type: 'image',
      id: 'before_image',
      label: 'Before Image'
    },
    {
      type: 'image',
      id: 'after_image',
      label: 'After Image'
    },
    {
      type: 'select',
      id: 'height',
      label: 'Height',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' }
      ],
      default: 'medium'
    },
    {
      type: 'color',
      id: 'slider_color',
      label: 'Slider API Color',
      default: '#ffffff'
    },
    {
      type: 'checkbox',
      id: 'show_labels',
      label: 'Show Labels',
      default: true
    },
    {
      type: 'text',
      id: 'before_label',
      label: 'Before Label',
      default: 'Before',
      show_if: 'show_labels'
    },
    {
      type: 'text',
      id: 'after_label',
      label: 'After Label',
      default: 'After',
      show_if: 'show_labels'
    }
  ]
};
