import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  if (request.nextUrl.pathname.startsWith("/chat")) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }
  return NextResponse.next();
}
