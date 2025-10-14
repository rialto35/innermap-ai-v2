import { redirect } from "next/navigation";
export default async function OldAnalyzeMode({ params }: { params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  redirect(`/test/${mode}`);
}
