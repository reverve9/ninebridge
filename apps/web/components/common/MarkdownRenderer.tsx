'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 이미지
          img: ({ node, ...props }) => (
            <img
              {...props}
              className="max-w-full h-auto rounded-[8px] my-4"
              loading="lazy"
            />
          ),
          // 링크
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-[#3071a5] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          // 제목
          h1: ({ node, ...props }) => (
            <h1 {...props} className="text-[24px] font-bold text-[#1f2937] mt-6 mb-3" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="text-[20px] font-bold text-[#1f2937] mt-5 mb-2" />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="text-[18px] font-semibold text-[#1f2937] mt-4 mb-2" />
          ),
          // 문단
          p: ({ node, ...props }) => (
            <p {...props} className="text-[15px] text-[#374151] leading-relaxed mb-3" />
          ),
          // 목록
          ul: ({ node, ...props }) => (
            <ul {...props} className="list-disc list-inside text-[15px] text-[#374151] mb-3 space-y-1" />
          ),
          ol: ({ node, ...props }) => (
            <ol {...props} className="list-decimal list-inside text-[15px] text-[#374151] mb-3 space-y-1" />
          ),
          // 코드
          code: ({ node, className, children, ...props }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-[#f3f4f6] px-1.5 py-0.5 rounded text-[13px] text-[#e11d48]" {...props}>
                {children}
              </code>
            ) : (
              <code className="block bg-[#1f2937] text-[#e5e7eb] p-4 rounded-[8px] text-[13px] overflow-x-auto" {...props}>
                {children}
              </code>
            );
          },
          // 인용
          blockquote: ({ node, ...props }) => (
            <blockquote {...props} className="border-l-4 border-[#3071a5] pl-4 my-4 text-[#6b7280] italic" />
          ),
          // 구분선
          hr: ({ node, ...props }) => (
            <hr {...props} className="border-[#e5e7eb] my-6" />
          ),
          // 굵게/기울임
          strong: ({ node, ...props }) => (
            <strong {...props} className="font-semibold text-[#1f2937]" />
          ),
          em: ({ node, ...props }) => (
            <em {...props} className="italic" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
