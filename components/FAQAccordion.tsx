'use client';

import { useState } from 'react';

interface FAQAccordionProps {
  question: string;
  answer: React.ReactNode;
}

export default function FAQAccordion({ question, answer }: FAQAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden transition-shadow duration-200 ${isOpen ? 'shadow-md' : 'shadow-sm hover:shadow-md'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-blue-50 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <span className="text-blue-900 font-semibold text-base leading-snug">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-yellow-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="px-6 py-5 text-gray-600 leading-relaxed border-t border-gray-100 bg-white">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
