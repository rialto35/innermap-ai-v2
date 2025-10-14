import { redirect } from "next/navigation";
export default function OldAnalyzeMode({ params }: { params: { mode: string } }) {
  redirect(`/test/${params.mode}`);
}
