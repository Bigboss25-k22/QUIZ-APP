import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const accessCookie = "quiz_access_token";
const refreshCookie = "quiz_refresh_token";
const accessMaxAge = 15 * 60;
const refreshMaxAge = 7 * 24 * 60 * 60;

type RouteContext = { params: Promise<{ path: string[] }> };
type TokenResponse = { accessToken: string; refreshToken: string; user?: unknown };

function isMutation(method: string) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method);
}

function originAllowed(request: NextRequest) {
  const origin = request.headers.get("origin");
  return !origin || origin === (process.env.APP_ORIGIN ?? request.nextUrl.origin);
}

function applySessionCookies(response: NextResponse, tokens: TokenResponse) {
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set(accessCookie, tokens.accessToken, {
    httpOnly: true,
    maxAge: accessMaxAge,
    path: "/api",
    sameSite: "strict",
    secure,
  });
  response.cookies.set(refreshCookie, tokens.refreshToken, {
    httpOnly: true,
    maxAge: refreshMaxAge,
    path: "/api/auth",
    sameSite: "strict",
    secure,
  });
}

function clearSessionCookies(response: NextResponse) {
  response.cookies.set(accessCookie, "", { httpOnly: true, maxAge: 0, path: "/api", sameSite: "strict" });
  response.cookies.set(refreshCookie, "", { httpOnly: true, maxAge: 0, path: "/api/auth", sameSite: "strict" });
}

function forbidden() {
  return NextResponse.json({ status: 403, message: "Cross-site request blocked" }, { status: 403 });
}

function apiHeaders(request: NextRequest, accessToken?: string) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");
  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);
  return headers;
}

async function callApi(request: NextRequest, path: string[], body?: ArrayBuffer, accessToken?: string) {
  const apiOrigin = process.env.API_ORIGIN ?? "http://localhost:8082";
  const destination = new URL(`/api/${path.join("/")}${request.nextUrl.search}`, apiOrigin);
  return fetch(destination, {
    body,
    headers: apiHeaders(request, accessToken),
    method: request.method,
    redirect: "manual",
  });
}

async function errorFromApi(response: Response) {
  return new NextResponse(await response.text(), {
    headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
    status: response.status,
  });
}

function isTokenResponse(value: unknown): value is TokenResponse {
  return typeof value === "object" && value !== null
    && typeof (value as TokenResponse).accessToken === "string"
    && typeof (value as TokenResponse).refreshToken === "string";
}

async function authenticate(request: NextRequest, path: string[]) {
  const body = await request.arrayBuffer();
  const apiResponse = await callApi(request, path, body);
  if (!apiResponse.ok) return errorFromApi(apiResponse);

  const payload: unknown = await apiResponse.json();
  if (!isTokenResponse(payload) || !payload.user) {
    return NextResponse.json({ status: 502, message: "Invalid authentication response" }, { status: 502 });
  }

  const response = NextResponse.json({ user: payload.user }, { status: path[1] === "signup" ? 201 : 200 });
  applySessionCookies(response, payload);
  return response;
}

async function refresh(request: NextRequest, path: string[]) {
  const refreshToken = request.cookies.get(refreshCookie)?.value;
  if (!refreshToken) {
    const response = NextResponse.json({ status: 401, message: "Unauthenticated" }, { status: 401 });
    clearSessionCookies(response);
    return response;
  }

  const upstreamRequest = new NextRequest(request.url, {
    body: JSON.stringify({ refreshToken }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  const apiResponse = await callApi(upstreamRequest, path, await upstreamRequest.arrayBuffer());
  if (!apiResponse.ok) {
    const response = await errorFromApi(apiResponse);
    clearSessionCookies(response);
    return response;
  }

  const payload: unknown = await apiResponse.json();
  if (!isTokenResponse(payload)) {
    return NextResponse.json({ status: 502, message: "Invalid refresh response" }, { status: 502 });
  }
  const response = new NextResponse(null, { status: 204 });
  applySessionCookies(response, payload);
  return response;
}

async function logout(request: NextRequest, path: string[]) {
  const refreshToken = request.cookies.get(refreshCookie)?.value;
  if (refreshToken) {
    const upstreamRequest = new NextRequest(request.url, {
      body: JSON.stringify({ refreshToken }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    await callApi(upstreamRequest, path, await upstreamRequest.arrayBuffer());
  }
  const response = new NextResponse(null, { status: 204 });
  clearSessionCookies(response);
  return response;
}

async function forward(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  if (isMutation(request.method) && !originAllowed(request)) return forbidden();

  try {
    if (request.method === "POST" && path[0] === "auth" && ["login", "signup"].includes(path[1] ?? "")) {
      return authenticate(request, path);
    }
    if (request.method === "POST" && path[0] === "auth" && path[1] === "refresh") return refresh(request, path);
    if (request.method === "POST" && path[0] === "auth" && path[1] === "logout") return logout(request, path);

    const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer();
    const apiResponse = await callApi(request, path, body, request.cookies.get(accessCookie)?.value);
    return new NextResponse(apiResponse.body, {
      headers: { "content-type": apiResponse.headers.get("content-type") ?? "application/json" },
      status: apiResponse.status,
    });
  } catch {
    return NextResponse.json({ status: 502, message: "Unable to reach the API" }, { status: 502 });
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
export const OPTIONS = forward;
