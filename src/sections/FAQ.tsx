'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { BlockRenderer } from '@zevcommerce/storefront-api';

interface FAQProps {
  settings: {
    title: string;
    description: string;
    width: 'narrow' | 'medium' | 'wide';
    background_color: string;
    text_color: string;
  };
  blocks: any[];
}

function QuestionItem({ block, isOpen, onClick }: { block: any, isOpen: boolean, onClick: () => void }) {
  const { question, answer } = block.settings;

  return (
    <div className="border-b last:border-0 transition-colors duration-200" style={{ borderColor: 'var(--color-border)' }}>
      <button
        onClick={onClick}
        className="w-full py-6 px-5 flex items-center justify-between text-left group"
      >
        <span className="font-semibold text-lg pr-4" style={{ color: 'var(--color-heading)' }}>{question}</span>
        <span className="shrink-0 opacity-40 transition-transform duration-300" style={{ color: 'var(--color-text)' }}>
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-6 leading-relaxed whitespace-pre-wrap opacity-70" style={{ color: 'var(--color-text)' }}>
            {answer}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FAQ({ settings, blocks }: FAQProps) {
  const {
    title,
    description,
    width = 'medium',
    background_color = 'var(--color-background)',
    text_color = 'var(--color-text)'
  } = settings;

  const widthClasses = {
    narrow: 'max-w-2xl',
    medium: 'max-w-4xl',
    wide: 'max-w-6xl'
  };

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: background_color, color: text_color }}>
      <div className={`mx-auto px-4 md:px-8 ${widthClasses[width]}`}>
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            {title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>}
            {description && <p className="text-lg opacity-70" style={{ color: 'var(--color-text)' }}>{description}</p>}
          </div>
        )}

        {/* List */}
        <div className="rounded-2xl shadow-sm border overflow-hidden" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
          {blocks.map((block: any, index: number) => {
            if (block.type !== 'question') return null;
            return (
              <QuestionItem
                key={block.id || index}
                block={block}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            );
          })}
          {blocks.length === 0 && (
            <div className="p-8 text-center opacity-40" style={{ color: 'var(--color-text)' }}>Add questions to this section</div>
          )}
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'faq',
  name: 'FAQ',
  settings: [
    {
      type: 'text',
      id: 'title',
      label: 'Heading',
      default: 'Frequently asked questions'
    },
    {
      type: 'textarea',
      id: 'description',
      label: 'Description',
      default: ''
    },
    {
      type: 'select',
      id: 'width',
      label: 'Content Width',
      options: [
        { value: 'narrow', label: 'Narrow' },
        { value: 'medium', label: 'Medium' },
        { value: 'wide', label: 'Wide' }
      ],
      default: 'medium'
    },
    {
      type: 'color',
      id: 'background_color',
      label: 'Background Color',
      default: '#f9fafb'
    },
    {
      type: 'color',
      id: 'text_color',
      label: 'Text Color',
      default: '#000000'
    }
  ],
  blocks: [
    {
      type: 'question',
      name: 'Question',
      settings: [
        {
          type: 'text',
          id: 'question',
          label: 'Question',
          default: 'Question text'
        },
        {
          type: 'textarea',
          id: 'answer',
          label: 'Answer',
          default: 'Answer text goes here.'
        }
      ]
    }
  ],
  defaultBlocks: [
    {
      type: 'question',
      settings: {
        question: 'What is the return policy?',
        answer: 'We offer a 30-day return policy for all unused items in their original packaging. Please contact support to initiate a return.'
      }
    },
    {
      type: 'question',
      settings: {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times will be calculated at checkout.'
      }
    },
    {
      type: 'question',
      settings: {
        question: 'How can I track my order?',
        answer: 'Once your order ships, you will receive an email with a tracking number and link to track your package.'
      }
    }
  ]
};
