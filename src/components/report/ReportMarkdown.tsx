/**
 * ReportMarkdown
 * 
 * Markdown 리포트 렌더러
 * - GitHub Flavored Markdown 지원
 * - 스타일링
 * 
 * @version v1.1.0
 */

'use client';

interface ReportMarkdownProps {
  content: string;
}

export default function ReportMarkdown({ content }: ReportMarkdownProps) {
  // Simple markdown parser (for MVP - can upgrade to react-markdown later)
  const parseMarkdown = (md: string) => {
    let html = md;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-6">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li class="ml-6 mb-2">$1</li>');
    html = html.replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">$1</ul>');

    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">');
    html = '<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">' + html + '</p>';

    // Line breaks
    html = html.replace(/\n/g, '<br />');

    return html;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm">
      <div 
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
      />
    </div>
  );
}

