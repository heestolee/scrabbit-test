import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

export default async function takePartialSnapshot(
  notionUrl,
  selectedBlocks,
  fileName,
) {
  if (!notionUrl) {
    throw new Error("Invalid Notion URL");
  }

  const encodedUrl = encodeURI(notionUrl);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1800, height: 1080 });

  try {
    await page.goto(encodedUrl, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.evaluate((selectedBlocks) => {
      const allBlocks = document.querySelectorAll("[data-block-id]");

      allBlocks.forEach((block) => {
        const blockId = block.getAttribute("data-block-id");
        if (selectedBlocks.includes(blockId)) {
          console.log(`Selected block with ID: ${blockId} remains on the page`);
        } else {
          block.remove();
        }
      });
    }, selectedBlocks);

    const snapshotHtml = await page.content();

    const cleanFileName = fileName.replace(/\?.*$/, "");
    const filePath = path.resolve(
      ".next/server/app/api/deploy-partial",
      `${cleanFileName}.html`,
    );

    fs.writeFileSync(filePath, snapshotHtml);
    await browser.close();
    return filePath;
  } catch (error) {
    await browser.close();
    throw new Error("Puppeteer 부분 스냅샷 생성 실패");
  }
}
