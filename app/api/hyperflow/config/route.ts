// /app/api/hyperflow/config/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge"; // edge 런타임 권장(선택)

export async function GET() {
  const flowGraphID =
    process.env.NEXT_PUBLIC_HYPERFLOW_FLOWGRAPH_ID ??
    process.env.HYPERFLOW_FLOWGRAPH_ID; // 둘 중 하나 사용
  if (!flowGraphID) {
    return NextResponse.json(
      { error: "Missing flowGraphID env" },
      { status: 500 }
    );
  }

  // 👇 중요: 프록시 경로를 baseURL로 내려준다
  return NextResponse.json({
    baseURL: "/api/hyperflow/proxy/",
    flowGraphID,
  });
}
