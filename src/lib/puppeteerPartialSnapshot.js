import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

export default async function takePartialSnapshot(notionUrl, fileName) {
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

        body {
          margin: 0 !important;
          padding: 0 !important;
        }

        .notion-page-content {
          max-width: 900px;
          margin: 0 auto;
          transform: zoom(0.9);
          transform-origin: top center;
        }

        .pseudoSelection {
          display: none !important;
        }

        .layout {
          padding: 0 0 0 2rem;
        }

        .notion-topbar {
          display: none;
        }

        .notion-bulleted_list-block {
          list-style-type: disc;
          margin-left: 20px;
          display: list-item;
        }

        .notion-numbered_list-block {
          list-style-type: decimal;
          margin-left: 20px;
          display: list-item;
        }

        ol {
          list-style-type: none;
          counter-reset: list-counter;
          padding-left: 30px;
        }

        ol li {
          counter-increment: list-counter;
          margin-bottom: 10px;
        }

        ol li::before {
          content: counter(list-counter) ". ";
          margin-right: 5px;
        }

        ul {
          list-style-type: disc;
          padding-left: 30px;
        }

        ul li {
          margin-bottom: 10px;
        }

        @media (max-width: 1200px) {
          .notion-page-content {
            padding: 10px;
            max-width: 95%;
          }
        }

        @media (max-width: 768px) {
          .notion-page-content {
            padding: 5px;
            max-width: 90%;
          }
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
    console.error("Puppeteer 부분 스냅샷 오류 발생:", error.message);
    await browser.close();
    throw new Error("Puppeteer 부분 스냅샷 생성 실패");
  }
}
