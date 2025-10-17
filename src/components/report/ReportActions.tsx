/**
 * ReportActions
 * 
 * 리포트 액션 버튼들
 * - PDF 다운로드
 * - 공유 링크
 * - 대시보드로 돌아가기
 * 
 * @version v1.2.0
 */

'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';

// html2pdf.js 런타임 로더 (CDN 폴백)
let html2pdfPromise: Promise<any> | null = null;
async function getHtml2Pdf(): Promise<any> {
  if (typeof window === 'undefined') throw new Error('window undefined');
  // 이미 로드되어 있으면 반환
  const w = window as any;
  if (w.html2pdf) return w.html2pdf;
  if (html2pdfPromise) return html2pdfPromise;

  html2pdfPromise = (async () => {
    // CDN에서 직접 로드 (npm 패키지 없음)
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('html2pdf CDN load failed'));
      document.body.appendChild(s);
    });
    return (window as any).html2pdf;
  })();

  return html2pdfPromise;
}

interface ReportActionsProps {
  reportId: string;
  status: 'queued' | 'processing' | 'ready' | 'failed';
}

export default function ReportActions({ reportId, status }: ReportActionsProps) {
  const canDownload = status === 'ready';
  const canShare = status === 'ready';
  const [busy, setBusy] = useState(false);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/report/${reportId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'InnerMap AI 리포트', text: '내 성장 리포트', url });
        return;
      }
      await navigator.clipboard.writeText(url);
      alert('링크가 복사되었습니다.');
    } catch (e) {
      console.error('Share error:', e);
      alert('공유 중 오류가 발생했습니다. 링크를 수동으로 복사해주세요:\n' + url);
    }
  }, [reportId]);

  const handlePdf = useCallback(async () => {
    if (!canDownload || busy) return;
    setBusy(true);
    try {
      const html2pdf = await getHtml2Pdf();

      const target = document.querySelector('#report-root') as HTMLElement;
      if (!target) throw new Error('리포트 영역을 찾을 수 없습니다.');

      // 캡처 시작 전 맨 위로 스크롤(빈 페이지 방지)
      window.scrollTo(0, 0);

      // html2pdf로 생성 후, jsPDF 인스턴스에 접근하여 페이지 번호 추가
      const worker = html2pdf().set({
        margin: [16, 14, 24, 14], // top, left, bottom, right (페이지 번호 공간 확보)
        filename: `innermap-report-${reportId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollY: 0, scrollX: 0 },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy', 'avoid-all'] },
      }).from(target);

      // toPdf() 후 출력을 가로채 페이지 번호 삽입
      const pdf = await new Promise<any>((resolve) => worker.toPdf().get('pdf').then((p: any) => resolve(p)));

      const total = pdf.internal.getNumberOfPages();
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();

      // 페이지 번호 + 브랜딩 추가
      pdf.setFontSize(9);
      pdf.setTextColor(102); // #666
      for (let i = 1; i <= total; i++) {
        pdf.setPage(i);
        // 중앙 하단에 페이지 번호 + 브랜딩
        pdf.text(`Page ${i} / ${total}`, w / 2 - 20, h - 12, { align: 'center' });
        pdf.setFontSize(8);
        pdf.setTextColor(140); // 더 연한 회색
        pdf.text('© 2025 InnerMap AI by PromptCore', w / 2 + 40, h - 12, { align: 'center' });
        pdf.setFontSize(9);
        pdf.setTextColor(102);
      }

      pdf.save(`innermap-report-${reportId}.pdf`);
    } catch (e) {
      console.error('PDF export error:', e);
      alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setBusy(false);
    }
  }, [canDownload, busy, reportId]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        액션
      </h3>

      <div className="flex flex-wrap gap-3">
        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition"
        >
          ← 대시보드로
        </Link>

        {/* PDF Download */}
        <button
          disabled={!canDownload || busy}
          className={`px-6 py-3 rounded-lg transition ${
            canDownload && !busy
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
          onClick={handlePdf}
        >
          {busy ? '생성 중...' : '📄 PDF 다운로드'}
        </button>

        {/* Share Link */}
        <button
          disabled={!canShare}
          className={`px-6 py-3 rounded-lg transition ${
            canShare
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
          onClick={handleShare}
        >
          🔗 공유하기
        </button>
      </div>

      {!canDownload && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
          리포트 생성이 완료되면 PDF 다운로드 및 공유가 가능합니다.
        </p>
      )}
    </div>
  );
}

