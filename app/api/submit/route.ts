import { GetIP } from "@/utils/GetIP";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const email = body.email;

  const ip = GetIP();
  const userAgent = request.headers.get("User-Agent");
  const referrer = request.headers.get("Referer");

  console.log("Email: ", email);

  try {
    const response = await fetch(
      "https://genericbackendserverdomain.com/api/collections/vidmod_signups/records",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          ip: ip,
          userAgent: userAgent,
          referrer: referrer,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to submit data");
    }
  } catch (error) {
    console.error("Failed to submit email", error);
    return new Response("Failed to submit email", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
