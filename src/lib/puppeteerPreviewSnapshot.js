import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default async function takePreviewSnapshot(notionUrl) {
  console.log("Puppeteer 시작:", notionUrl);

  const executablePath =
    process.env.NODE_ENV === "production"
      ? await chrome.executablePath
      : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath || "/usr/bin/chromium-browser",
    args: [
      ...chrome.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
      "--disable-software-rasterizer",
      "--no-zygote",
    ],
    defaultViewport: chrome.defaultViewport,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  try {
    console.log("Puppeteer 페이지 이동 중:", notionUrl);

    // 페이지 이동 중 타임아웃 2분 설정
    await page.goto(notionUrl, {
      waitUntil: "networkidle2", // 모든 네트워크 요청이 완료된 시점
      timeout: 120000, // 120초 타임아웃
    });

    console.log("Puppeteer 페이지 이동 완료");

    // 폰트 및 이미지 로드 완료 대기
    await page.evaluateHandle("document.fonts.ready");
    console.log("폰트 로드 완료");

    // 페이지 내부 이미지가 올바르게 로드되었는지 확인
    await page.evaluate(() => {
      const images = document.querySelectorAll("img");
      images.forEach((img) => {
        const src = img.getAttribute("src");
        if (src && src.startsWith("/")) {
          img.setAttribute("src", `https://www.notion.so${src}`);
        }
      });
    });

    // 페이지의 기본 스타일 수정
    await page.evaluate(() => {
      const style = document.createElement("style");
      style.innerHTML = `
        body {
          margin: 0;
          box-sizing: border-box;
        }
        .notion-page-content {
          max-width: 900px;
          margin: 0 auto;
          transform: zoom(0.9);
          transform-origin: top center;
        }
        .notion-cursor-listener {
          width: 100% !important;
        }
        .layout {
          padding: 0 0 0 2rem;
        }
        .notion-topbar {
          display: none;
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

    const snapshotHtml = await page.content();

    console.log("Puppeteer 스냅샷 성공");

    await browser.close();

    return snapshotHtml;
  } catch (error) {
    console.error("Puppeteer 스냅샷 오류 발생:", error.message);
    await browser.close();
    throw new Error("Puppeteer 스냅샷 생성 실패");
  }
}
