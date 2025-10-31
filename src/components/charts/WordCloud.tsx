'use client';

import { useEffect, useRef } from 'react';

type WordCloudItem = { name: string; value: number };

interface WordCloudProps {
  data: WordCloudItem[];
  height?: number;
  maskSrc?: string | null; // ex) '/masks/heart.png' (없으면 cardioid 사용)
  title?: string;
}

export default function WordCloud({ data, height = 420, maskSrc = null, title }: WordCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let chart: any;
    let disposed = false;

    async function init() {
      // Use full ECharts build + side-effect wordcloud registration
      const echartsModule: any = await import('echarts');
      const echarts = echartsModule.default || echartsModule;
      await import('echarts-wordcloud');

      if (!containerRef.current) return;
      chart = echarts.init(containerRef.current, undefined, { renderer: 'canvas' });

      const cw = containerRef.current?.clientWidth || 800;
      // 비율 유지 + 과도한 확대/축소 방지 (dev/prod 시각 일치)
      const base = 1280; // 기준 폭
      const scale = Math.max(0.85, Math.min(1.25, cw / base));
      const sizeMin = Math.round(18 * scale);
      const sizeMax = Math.round(90 * scale);

      const option: any = {
        title: title ? { text: title, left: 'center', textStyle: { color: '#fff', fontSize: 14 } } : undefined,
        tooltip: { formatter: (p: any) => `${p.name} · ${p.value}` },
        series: [
          {
            type: 'wordCloud',
            left: '0%',
            right: '0%',
            top: '-12%',
            bottom: '-2%',
            width: '100%',
            height: '100%',
            shape: 'cardioid',
            gridSize: 4,
            sizeRange: [sizeMin, sizeMax],
            rotationRange: [0, 0],
            drawOutOfBound: false,
            textPadding: 0,
            textStyle: {
              color: () => {
                const palette = [
                  '#a78bfa', '#22d3ee', '#34d399', '#f59e0b',
                  '#f472b6', '#60a5fa', '#10b981', '#f97316',
                  '#ef4444', '#eab308'
                ];
                return palette[Math.floor(Math.random() * palette.length)];
              },
              fontWeight: 700,
            },
            emphasis: { textStyle: { shadowBlur: 12, shadowColor: 'rgba(139,92,246,.45)' } },
            data,
          },
        ],
        backgroundColor: 'transparent',
      };

      if (maskSrc) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = maskSrc;
        img.onload = () => {
          if (disposed) return;
          option.series[0].maskImage = img;
          chart.setOption(option as any);
        };
        img.onerror = () => {
          chart.setOption(option as any);
        };
      } else {
        chart.setOption(option as any);
      }

      const onResize = () => chart?.resize();
      window.addEventListener('resize', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
        if (!disposed) {
          chart?.dispose?.();
          disposed = true;
        }
      };
    }

    init();
    return () => {
      if (!disposed) {
        chart?.dispose?.();
        disposed = true;
      }
    };
  }, [data, maskSrc, title]);

  return <div ref={containerRef} style={{ height }} className="w-full rounded-2xl border border-white/10 bg-transparent" />;
}


