import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

export default async function takeSnapshot(notionUrl, fileName) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  try {
    await page.goto(notionUrl, {
      waitUntil: "networkidle2",
      timeout: 120000,
    });

    await page.evaluateHandle("document.fonts.ready");

    await page.evaluate(() => {
      const style = document.createElement("style");
      style.innerHTML = `
        .notion-page {
          max-width: 100% !important;
          padding: 20px !important;
        }
        .notion-container {
          padding: 20px !important;
        }
        img {
          max-width: 100% !important;
        }
        body {
          margin: 0 !important;
          padding: 0 !important;
        }
      `;
      document.head.appendChild(style);
    });

    await page.evaluate(() => {
      const images = document.querySelectorAll("img");
      images.forEach((img) => {
        const src = img.getAttribute("src");
        if (src && src.startsWith("/")) {
          img.setAttribute("src", `https://www.notion.so${src}`);
        }
      });
    });

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
    console.error("Puppeteer 전체 스냅샷 오류 발생:", error.message);
    await browser.close();
    throw new Error("Puppeteer 전체 스냅샷 생성 실패");
  }
}
