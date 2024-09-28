import puppeteer from "puppeteer";

export default async function takePreviewSnapshot(notionUrl) {
  console.log("Puppeteer 시작:", notionUrl);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 800 });

  try {
    console.log("Puppeteer 페이지 이동 중:", notionUrl);

    await page.goto(notionUrl, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    console.log("Puppeteer 페이지 이동 완료");

    await page.evaluateHandle("document.fonts.ready");

    console.log("폰트 로드 완료");

    await page.evaluate(() => {
      const images = document.querySelectorAll("img");
      images.forEach((img) => {
        const src = img.getAttribute("src");
        if (src && src.startsWith("/")) {
          img.setAttribute("src", `https://www.notion.so${src}`);
        }
      });
    });

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
          padding: 20px;
          transform: scale(0.9);
          transform-origin: top center;
        }

        .notion-cursor-listener {
          width: 100% !important;
          padding
        }

        .layout {
          padding: 0 0 0 2rem;
        }

        .notion-topbar {
        display: none
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
