import { notFound } from "next/navigation";
import ModePage from "@/components/analysis/ModePage";

const valid = new Set(["quick","deep"]);

export default async function Page({ params }: { params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  
  if (!valid.has(mode)) {
    return notFound();
  }

  return <ModePage mode={mode as "quick" | "deep"} />;
}
