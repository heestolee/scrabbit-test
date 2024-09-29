import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

export default async function takePartialSnapshot(notionUrl, fileName) {
  const browser = await puppeteer.launch({
    headless: true,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath:
      (await chromium.executablePath) || "/usr/bin/chromium-browser",
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  await page.goto(notionUrl, {
    waitUntil: "networkidle2",
  });

  const customCSS = `
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

  await page.evaluate((customCSS) => {
    const style = document.createElement("style");
    style.innerHTML = customCSS;
    document.head.appendChild(style);
  }, customCSS);

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

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  fs.writeFileSync(filePath, snapshotHtml);
  await browser.close();

  return filePath;
}
