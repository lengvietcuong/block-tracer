import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// Create a new ratelimiter, that allows 30 requests per 60 seconds
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(30, "60 s"),
});

// Define which routes to protect with the rate limiter
export const config = {
  matcher: "/api/:path*",
};

export default async function middleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  // Do not apply rate limiting for localhost
  if (ip === "127.0.0.1" || ip === "::1") {
    return NextResponse.next();
  }

  const { success, limit, reset, remaining } = await ratelimit.limit(
    `ratelimit_${ip}`,
  );
  if (!success) {
    return NextResponse.json(
      { error: "Too Many Requests" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      },
    );
  }

  return NextResponse.next();
}
