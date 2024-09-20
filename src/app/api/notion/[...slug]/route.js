import { NextResponse } from "next/server";
import fetchPageFromNotionClient from "@/lib/notion";

export async function GET(request, { params }) {
  const notionPageId = params.slug[0];

  try {
    const recordMap = await fetchPageFromNotionClient(notionPageId);

    if (!recordMap) {
      throw new Error("노션 데이터 페칭 실패");
    }

    const response = NextResponse.json({ recordMap });

    return response;
  } catch (error) {
    console.error("노션 데이터 페칭 실패:", error);
    const response = NextResponse.json(
      { error: "노션 데이터 페칭 실패." },
      { status: 500 },
    );

    return response;
  }
}
