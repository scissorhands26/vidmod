import { GetIP } from "@/utils/GetIP";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();

  const ip = GetIP();
  const userAgent = request.headers.get("User-Agent");
  const referrer = request.headers.get("Referer");

  try {
    const response = await fetch(
      "https://genericbackendserverdomain.com/api/collections/vidmod_converts/records",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: body.fileName,
          from: body.action.from,
          to: body.action.to,
          size: body.size,
          failed: body.action.is_error,
          ip: ip,
          userAgent: userAgent,
          referrer: referrer,
          action: body.action,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to submit data");
    }
  } catch (error) {
    console.error("Failed to submit data", error);
    return new Response("Failed to submit data", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
