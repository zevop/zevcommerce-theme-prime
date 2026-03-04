'use client';

import { Play } from 'lucide-react';
import { useState } from 'react';

interface VideoProps {
  settings: {
    video_url: string;
    cover_image: any;
    description: string;
    full_width: boolean;
    height: 'small' | 'medium' | 'large';
  };
}

export default function VideoSection({ settings }: VideoProps) {
  const {
    video_url,
    cover_image,
    description = 'Video player',
    full_width = true,
    height = 'medium'
  } = settings;

  const [isPlaying, setIsPlaying] = useState(false);

  const containerClass = full_width ? 'w-full' : 'max-w-7xl mx-auto px-4 md:px-8 py-8';

  const heightClass = {
    small: 'aspect-video md:h-[400px]',
    medium: 'aspect-video md:h-[600px]',
    large: 'aspect-video md:h-[800px]'
  }[height];

  const imageUrl = typeof cover_image === 'string' ? cover_image : cover_image?.url;

  const handlePlay = () => {
    setIsPlaying(true);
  }

  // Simple video ID extraction (very basic for demo, would need robust regex for production)
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('vimeo')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    return url;
  }

  const embedUrl = getEmbedUrl(video_url);
  const isDirectVideo = !embedUrl.includes('youtube') && !embedUrl.includes('vimeo');

  return (
    <section className={containerClass}>
      <div className={`relative w-full overflow-hidden ${!full_width ? 'rounded-xl' : ''} ${heightClass}`} style={{ backgroundColor: 'var(--color-border)' }}>

        {(!isPlaying && imageUrl) && (
          <div className="absolute inset-0 z-10 w-full h-full">
            <img
              src={imageUrl}
              alt={description}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group cursor-pointer" onClick={handlePlay}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: 'var(--color-background)' }}>
                <Play className="w-8 h-8 ml-1" style={{ color: 'var(--color-text)', fill: 'var(--color-text)' }} />
              </div>
            </div>
          </div>
        )}

        {(isPlaying || !imageUrl) && (
          <div className="w-full h-full">
            {isDirectVideo ? (
              <video
                src={video_url}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={description}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export const schema = {
  type: 'video',
  name: 'Video',
  settings: [
    {
      type: 'image',
      id: 'cover_image',
      label: 'Cover Image'
    },
    {
      type: 'text',
      id: 'video_url',
      label: 'Video URL (YouTube, Vimeo, or MP4)',
      info: 'Supports YouTube, Vimeo, or direct MP4 links.'
    },
    {
      type: 'text',
      id: 'description',
      label: 'Video Description (Alt text)',
      default: 'Brand video'
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
      type: 'checkbox',
      id: 'full_width',
      label: 'Full Width',
      default: true
    }
  ]
};
