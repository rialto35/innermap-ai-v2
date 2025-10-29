"use client";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  // 응답이 HTML인지 확인 (에러 페이지)
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response received:', { url, status: response.status, contentType, text: text.substring(0, 200) });
    throw new Error(`Expected JSON response but got ${contentType}`);
  }
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

export function useLatestResult(userId?: string) {
  const key = userId ? [`/api/results/latest`, userId] : null;
  const { data, error, isLoading } = useSWR(key, () => fetcher("/api/results/latest"), {
    revalidateOnFocus: false,
  });

  const assessmentId = data?.data?.assessment_id || null;

  return {
    result: data?.data ?? null,
    assessmentId,
    isLoading,
    isError: !!error || (data && data.error),
  };
}

