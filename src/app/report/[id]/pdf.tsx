'use client';

import { Document, Page, Text, View, Image, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

// 폰트 등록(실제 파일은 추후 /public/fonts 에 추가)
try {
  Font.register({ family: 'Pretendard', src: '/fonts/Pretendard-Regular.ttf' });
  Font.register({ family: 'Pretendard-Bold', src: '/fonts/Pretendard-Bold.ttf' });
} catch {}

const styles = StyleSheet.create({
  page: { padding: 36, fontFamily: 'Pretendard', color: '#2B2B2B' },
  h1: { fontSize: 22, marginBottom: 8, fontFamily: 'Pretendard-Bold' },
  h2: { fontSize: 16, marginVertical: 6, fontFamily: 'Pretendard-Bold', color: '#2A7DE1' },
  small: { fontSize: 10, color: '#666' },
  divider: { marginVertical: 8, height: 1, backgroundColor: '#F6F8FB' },
  footer: { position: 'absolute', bottom: 20, left: 36, right: 36, fontSize: 9, color: '#666', textAlign: 'center' }
});

const getThemeColor = (tribe?: string) => {
  const map: Record<string, string> = {
    Fire: '#E0574F', Water: '#2A7DE1', Earth: '#5E7A57', Air: '#5B7C99'
  };
  return map[tribe ?? 'Water'] || '#2A7DE1';
};

async function fetchReportData(reportId: string) {
  const res = await fetch(`/api/report/${reportId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('failed to load report');
  return res.json();
}

function makeSummaryBlocks(md: string) {
  const blocks = md.split(/\n##\s+/).map((b, i) => (i === 0 ? b : '## ' + b));
  return blocks.slice(0, 6);
}

const ReportPDF = ({ data }: { data: any }) => {
  const theme = getThemeColor(data?.hero?.tribe);
  return (
    <Document>
      <Page size="A4" style={[styles.page, { backgroundColor: '#FFFFFF' }]}> 
        <View>
          <Text style={[styles.h1, { color: theme }]}>InnerMap AI Report</Text>
          <View style={styles.divider} />
          <Text>이름: {data?.user?.name ?? 'User'}</Text>
          <Text>영웅: {data?.hero?.name ?? '-'}</Text>
          <Text>검사일: {new Date(data?.created_at ?? Date.now()).toLocaleDateString('ko-KR')}</Text>
          <View style={{ marginTop: 16 }}>
            {data?.visuals_json?.coverImageUrl && (
              <Image src={data.visuals_json.coverImageUrl} style={{ width: '100%', height: 200 }} />
            )}
          </View>
        </View>
        <Text style={styles.footer}>InnerMap AI © 2025 PromptCore</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.h2}>요약</Text>
        {data?.visuals_json?.big5RadarUrl && (
          <Image src={data.visuals_json.big5RadarUrl} style={{ width: '100%', height: 220 }} />
        )}
        {data?.visuals_json?.auxBarsUrl && (
          <Image src={data.visuals_json.auxBarsUrl} style={{ width: '100%', height: 160, marginTop: 8 }} />
        )}
        <Text style={styles.footer}>Page 2</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.h2}>심층 해석</Text>
        <View style={{ marginTop: 6 }}>
          {makeSummaryBlocks(data?.summary_md ?? '').map((block: string, idx: number) => (
            <Text key={idx} style={{ fontSize: 11, lineHeight: 1.6, marginBottom: 6 }}>{block}</Text>
          ))}
        </View>
        <Text style={styles.footer}>Page 3</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.h2}>성장 벡터</Text>
        {data?.visuals_json?.growthVectorUrl && (
          <Image src={data.visuals_json.growthVectorUrl} style={{ width: '100%', height: 200 }} />
        )}
        <Text style={styles.small}>이전 검사 대비 중심 이동(오른쪽/위로 이동할수록 활성화)</Text>
        <Text style={styles.footer}>Page 4</Text>
      </Page>
    </Document>
  );
};

export default function PDFExportPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetchReportData(params.id).then(setData).catch(console.error); }, [params.id]);
  if (!data) return null;
  return (
    <PDFDownloadLink document={<ReportPDF data={data} />} fileName={`innermap-report-${params.id}.pdf`}>
      {({ loading }) => loading ? 'PDF 준비 중…' : 'PDF 다운로드'}
    </PDFDownloadLink>
  );
}
