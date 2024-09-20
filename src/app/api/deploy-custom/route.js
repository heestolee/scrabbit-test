import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { marked } from "marked";

export async function POST(request) {
  const { customContent, subdomain } = await request.json();

  try {
    const renderedHtmlContent = marked(customContent);

    const htmlTemplate = `
      <html>
        <head>
          <title>NotionDrop</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .content { max-width: 800px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="content">
            ${renderedHtmlContent}
          </div>
        </body>
      </html>
    `;

    const directoryPath = path.resolve("snapshots");
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    const filePath = path.resolve(directoryPath, `custom-${subdomain}.html`);
    fs.writeFileSync(filePath, htmlTemplate);

    const vercelResponse = await fetch(
      "https://api.vercel.com/v13/deployments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "custom-content-page",
          files: [
            {
              file: "index.html",
              data: htmlTemplate,
            },
          ],
          projectSettings: {
            buildCommand: "",
            installCommand: "",
            outputDirectory: "",
            framework: "nextjs",
          },
          target: "production",
        }),
      },
    );

    if (!vercelResponse.ok) {
      const errorData = await vercelResponse.json();
      console.error("Vercel API Error:", errorData);
      throw new Error("Failed to deploy on Vercel.");
    }

    const vercelData = await vercelResponse.json();

    const domainResponse = await fetch(
      `https://api.vercel.com/v5/projects/${vercelData.projectId}/domains`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: `${subdomain}.notiondrop.site` }),
      },
    );

    if (!domainResponse.ok) {
      const errorData = await domainResponse.json();
      console.error("Failed to set custom domain:", errorData);
      throw new Error("Failed to set custom domain.");
    }

    return NextResponse.json({ url: `https://${subdomain}.notiondrop.site` });
  } catch (error) {
    console.error("Deploy error:", error);
    return NextResponse.json({ error: "Deploy failed" }, { status: 500 });
  }
}
