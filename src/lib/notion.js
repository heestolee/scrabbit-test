import { NotionAPI } from "notion-client";

const notionClient = new NotionAPI();

export default async function fetchPageFromNotionClient(pageId) {
  try {
    const recordMap = await notionClient.getPage(pageId);
    return recordMap;
  } catch (error) {
    console.error("노션클라이언트 데이터 페칭 실패:", error);
    throw error;
  }
}
