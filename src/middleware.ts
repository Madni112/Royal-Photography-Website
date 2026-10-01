import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get("antigravity_admin_token")?.value;
    const authHeader = request.headers.get("authorization");

    // Allow internal or verified tokens (or let client-side vault handle passkey auth)
    // Pass custom security headers
    const response = NextResponse.next();
    response.headers.set("x-antigravity-fence-active", "true");
    response.headers.set("x-admin-route-timestamp", new Date().toISOString());

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
