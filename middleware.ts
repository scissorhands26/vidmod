import { NextRequest, NextResponse, userAgent } from "next/server";

export function middleware(request: NextRequest) {
  //   const url = request.nextUrl;
  //   const { device } = userAgent(request);
  //   const viewport = device.type === "mobile" ? "mobile" : "desktop";
  //   url.searchParams.set("viewport", viewport);
  //   const ip = IP();
  //   //   console.log(request.headers);
  //   // send ip and user agent to the log server as json on localhost:1234
  //   const sendLogInfo = fetch("http://localhost:4000", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       ip,
  //       userAgent: request.headers.get("user-agent"),
  //     }),
  //   });
  //   sendLogInfo.then((res) => {
  //     // log just the json response
  //     res.json().then((data) => {
  //       console.log(data);
  //     });
  //   });
  //   return NextResponse.rewrite(url);
}

// Bun.serve({ port: 4000, fetch: req => new Response(JSON.stringify({ msg: "got it!" }), { headers: { 'Content-Type': 'application/json' } }) });
