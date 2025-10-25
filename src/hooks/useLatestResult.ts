"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useLatestResult(userId?: string) {
  const key = userId ? [`/api/results/latest`, userId] : null;
  const { data, error, isLoading } = useSWR(key, () => fetcher("/api/results/latest"), {
    revalidateOnFocus: false,
  });

  console.log("[UI][RESULT]", !!data?.data, Array.isArray(data?.data?.inner9) ? data.data.inner9.length : 0);

  return {
    result: data?.data ?? null,
    isLoading,
    isError: !!error || (data && data.error),
  };
}

