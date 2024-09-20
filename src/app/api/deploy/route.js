import { NextResponse } from "next/server";
import takeSnapshot from "@/lib/puppeteerSnapshot";
import fs from "fs";

export async function POST(request) {
  const { pageId, subdomain, notionUrl } = await request.json();

  try {
    const snapshotFilePath = await takeSnapshot(
      notionUrl,
      `snapshot-${pageId}`,
    );

    const snapshotHtml = fs.readFileSync(snapshotFilePath, "utf8");

    const vercelResponse = await fetch(
      "https://api.vercel.com/v13/deployments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "notion-snapshot",
          files: [
            {
              file: "index.html",
              data: snapshotHtml,
            },
          ],
          target: "production",
          projectSettings: {
            buildCommand: null,
            installCommand: null,
            outputDirectory: "",
          },
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
