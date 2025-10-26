import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getSupabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const session = await getServerSession(authOptions as any);
  const userId = (session as any)?.user?.id;

  console.log("[LATEST][USER]", userId);

  if (!userId) {
    return new Response(JSON.stringify({ error: "UNAUTHENTICATED" }), { status: 401 });
  }

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("results")
    .select("id,user_id,created_at,big5,mbti,reti,inner9,analysis")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  console.log("[LATEST][ROW]", !!data, data?.id);

  if (error) {
    console.error("[RESULTS/LATEST][DB ERROR]", error);
    return new Response(JSON.stringify({ error: "DB_ERROR" }), { status: 500 });
  }

  return new Response(JSON.stringify({ data: data ?? null }), { status: 200 });
}
