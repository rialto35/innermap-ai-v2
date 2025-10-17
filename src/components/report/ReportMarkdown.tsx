/**
 * ReportMarkdown
 * 
 * Markdown 리포트 렌더러
 * - GitHub Flavored Markdown 지원
 * - 이미지 태그 제거(보안/불필요한 네트워크 요청 방지)
 * - 섹션 카드화 및 PDF 페이지 나눔 보조
 * 
 * @version v1.2.0
 */

'use client';

import { useEffect, useRef } from 'react';

interface ReportMarkdownProps {
  content: string;
}

export default function ReportMarkdown({ content }: ReportMarkdownProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  // 간단한 사전 정리: 이미지 마크다운/HTML 제거
  const sanitize = (md: string) => {
    let out = md;
    // Markdown 이미지 ![alt](url)
    out = out.replace(/!\[[^\]]*\]\([^\)]+\)/gim, '');
    // HTML 이미지 <img ...>
    out = out.replace(/<img[^>]*>/gi, '');
    // 잠재적인 background:url() 패턴 제거(간단 방어)
    out = out.replace(/url\([^\)]+\)/gi, '');
    return out;
  };

  // Simple markdown parser (for MVP - can upgrade to react-markdown later)
  const parseMarkdown = (md: string) => {
    let html = sanitize(md);

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">$1<\/h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="section-heading text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">$1<\/h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="section-heading text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-6">$1<\/h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1<\/strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1<\/em>');

    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li class="ml-6 mb-2">$1<\/li>');
    html = html.replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">$1<\/ul>');

    // Paragraphs
    html = html.replace(/\n\n/g, '<\/p><p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">');
    html = '<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">' + html + '<\/p>';

    // Line breaks
    html = html.replace(/\n/g, '<br \/>');

    return html;
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const scope = (el.querySelector(':scope > div') as HTMLElement) || el; // inner content div

    const isHeading = (n: Node | null) => {
      const e = n as HTMLElement | null;
      return !!(e && e.classList && e.classList.contains('section-heading'));
    };

    const headings = Array.from(scope.querySelectorAll('.section-heading')) as HTMLElement[];
    headings.forEach((h, idx) => {
      if (!h.parentElement) return;
      if (h.closest('.section-card')) return;

      const parent = h.parentElement;
      const wrap = document.createElement('div');
      wrap.className = 'section-card bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100/60 dark:border-white/10 p-6 md:p-8 mb-6 pdf-avoid-break';
      if (idx > 0) wrap.classList.add('pdf-page-break');

      // parent 기준으로 안전하게 삽입 후 노드 이동
      parent.insertBefore(wrap, h);
      wrap.appendChild(h);

      let sib: ChildNode | null = wrap.nextSibling; // 원래 h 다음이었던 노드
      while (sib && !isHeading(sib)) {
        const next = sib.nextSibling;
        wrap.appendChild(sib);
        sib = next;
      }
    });
  }, [content]);

  return (
    <div ref={ref} className="prose prose-lg dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} />
      <style jsx global>{`
        .prose li { break-inside: avoid; page-break-inside: avoid; }
      `}</style>
    </div>
  );
}

