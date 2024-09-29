import { NextResponse } from "next/server";

export default function corsMiddleware(handler) {
  return async (req) => {
    const response = NextResponse.next();

    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    );

    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 200 });
    }

    return handler(req, response);
  };
}
