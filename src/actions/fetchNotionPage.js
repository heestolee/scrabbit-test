"use server";

export async function fetchNotionPage(notionUrl) {
  const pageId = notionUrl.split("/").pop();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/puppeteer-preview-snapshot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notionUrl }),
    });
    if (!response.ok) throw new Error("노션 페이지 페칭 실패");

    const data = await response.json();
    return { pageId, snapshotHtml: data.snapshotHtml };
  } catch (error) {
    console.error("노션 페이지 페칭 에러:", error);
    return { error: "페칭 실패" };
  }
}
