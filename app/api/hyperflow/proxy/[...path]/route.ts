import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
const HYPERFLOW_BASE = "https://hyperflow-ai.com/api";

function normalizePath(path: string[]): string[] {
  // SDK sends paths like "/api/flowgraph/control/start"
  // When caught by [...path], it becomes ["api", "flowgraph", "control", "start"]
  // Since HYPERFLOW_BASE already includes "/api", we remove the first "api" segment
  if (path.length > 0 && path[0] === "api") {
    return path.slice(1);
  }
  return path;
}

function buildTargetURL(req: NextRequest, path: string[]) {
  const normalized = normalizePath(path);
  // Build URL: https://hyperflow-ai.com/api/{normalized_path}
  const pathStr = normalized.length > 0 ? normalized.join("/") : "";
  const target = new URL(pathStr, `${HYPERFLOW_BASE}/`);
  
  // Copy query parameters from original request
  const reqUrl = new URL(req.url);
  reqUrl.searchParams.forEach((v, k) => target.searchParams.set(k, v));
  
  return target;
}

async function forward(req: NextRequest, path: string[]) {
  const apiKey = process.env.HYPERFLOW_API_KEY;
  if (!apiKey) {
    console.error("[PROXY ERROR] Missing HYPERFLOW_API_KEY");
    return NextResponse.json(
      { error: "Missing HYPERFLOW_API_KEY" },
      { status: 500 }
    );
  }

  const target = buildTargetURL(req, path);
  const method = req.method;
  
  // Build headers - preserve Content-Type and other important headers
  const headers = new Headers();
  
  // Copy allowed headers from original request
  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    // Preserve content-type and other important headers
    if (
      lowerKey === "content-type" ||
      lowerKey === "accept" ||
      lowerKey === "accept-language" ||
      lowerKey === "user-agent"
    ) {
      headers.set(key, value);
    }
  });
  
  // Set API key (most important)
  headers.set("X-API-Key", apiKey);
  
  // Remove headers that shouldn't be forwarded
  headers.delete("origin");
  headers.delete("host");
  headers.delete("referer");

  // Handle request body for POST/PUT/PATCH requests
  let body: BodyInit | undefined = undefined;
  if (method !== "GET" && method !== "HEAD") {
    try {
      // For Edge runtime, we need to clone the body stream
      const clonedReq = req.clone();
      body = await clonedReq.text();
    } catch (err) {
      console.error("[PROXY ERROR] Failed to read request body:", err);
      return NextResponse.json(
        { error: "Failed to read request body" },
        { status: 500 }
      );
    }
  }

  // Logging for debugging
  console.log(`[PROXY] ${method} ${req.url}`);
  console.log(`[PROXY] Path segments (raw):`, path);
  console.log(`[PROXY] Target URL:`, target.toString());
  console.log(`[PROXY] API Key present:`, !!apiKey);
  if (body) {
    console.log(`[PROXY] Body length: ${body.length} bytes`);
    try {
      const bodyJson = JSON.parse(body);
      console.log(`[PROXY] Body:`, JSON.stringify(bodyJson, null, 2));
    } catch {
      console.log(`[PROXY] Body preview:`, body.substring(0, 200));
    }
  }

  try {
    const resp = await fetch(target.toString(), {
      method,
      headers,
      body,
      redirect: "manual",
    });

    const resHeaders = new Headers(resp.headers);
    resHeaders.set("Cache-Control", "no-store");
    resHeaders.set("Access-Control-Allow-Origin", "*");
    resHeaders.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    resHeaders.set("Access-Control-Allow-Headers", "*");

    // Read response body
    const responseBody = await resp.text();

    // Log error responses for debugging
    if (!resp.ok) {
      console.error(`[PROXY ERROR] ${resp.status} ${resp.statusText}`);
      console.error(`[PROXY ERROR] Response:`, responseBody.substring(0, 500));
    }

    return new NextResponse(responseBody, {
      status: resp.status,
      statusText: resp.statusText,
      headers: resHeaders,
    });
  } catch (err) {
    console.error("[PROXY ERROR] Fetch failed:", err);
    return NextResponse.json(
      { 
        error: "Proxy request failed",
        message: err instanceof Error ? err.message : String(err)
      },
      { status: 500 }
    );
  }
}

// ✅ Next.js Edge 런타임에서는 context.params가 async로 제공됨
export async function GET(
  req: NextRequest,
  context: Promise<{ params: { path: string[] } }>
) {
  const { params } = await context;
  return forward(req, params.path || []);
}

export async function POST(
  req: NextRequest,
  context: Promise<{ params: { path: string[] } }>
) {
  const { params } = await context;
  return forward(req, params.path || []);
}

export async function PUT(
  req: NextRequest,
  context: Promise<{ params: { path: string[] } }>
) {
  const { params } = await context;
  return forward(req, params.path || []);
}

export async function PATCH(
  req: NextRequest,
  context: Promise<{ params: { path: string[] } }>
) {
  const { params } = await context;
  return forward(req, params.path || []);
}

export async function DELETE(
  req: NextRequest,
  context: Promise<{ params: { path: string[] } }>
) {
  const { params } = await context;
  return forward(req, params.path || []);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400",
    },
  });
}
