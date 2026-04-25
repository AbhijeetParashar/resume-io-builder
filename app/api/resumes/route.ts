import { NextRequest, NextResponse } from "next/server";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/136.0.0.0 Safari/537.36";

export async function GET(request: NextRequest) {
  const authToken = request.headers.get("x-auth-token");

  if (!authToken?.trim()) {
    return NextResponse.json({ error: "Auth token is required" }, { status: 401 });
  }

  try {
    const res = await fetch("https://resume.io/api/app/resumes", {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Cookie: `authToken=${authToken}`,
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Resume.io returned ${res.status}: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
