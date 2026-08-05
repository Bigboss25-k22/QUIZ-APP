import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

async function forward(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const apiOrigin = process.env.API_ORIGIN ?? "http://localhost:8082";
  const destination = new URL(`/api/${path.join("/")}${request.nextUrl.search}`, apiOrigin);
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("connection");

  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer();
  const response = await fetch(destination, { method: request.method, headers, body, redirect: "manual" });
  return new Response(response.body, { status: response.status, headers: response.headers });
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
export const OPTIONS = forward;
