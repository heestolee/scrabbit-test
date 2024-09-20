"use client";

import Image from "next/image";
import React, { useState } from "react";
import DeployModeSelector from "@/components/DeployModeSelector";
import InputArea from "@/components/InputArea";
import NotionPageRenderer from "@/components/NotionPageRenderer";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [deployMode, setDeployMode] = useState("url");
  const [url, setUrl] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [pageId, setPageId] = useState(null);

  const handleFetch = () => {
    if (deployMode === "url") {
      const id = url.split("/").pop();
      setPageId(id);
    }
    setPreviewMode(true);
  };

  const handleDeploy = async () => {
    if (!subdomain || (!url && deployMode === "url") || (!customContent && deployMode === "custom")) {
      alert("Enter your subdomain");
      return;
    }

    try {
      let response;
      if (deployMode === "url") {
        response = await fetch("/api/deploy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pageId, subdomain, notionUrl: url }),
        });
      } else if (deployMode === "custom") {
        response = await fetch("/api/deploy-custom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customContent, subdomain }),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to deploy.");
      }

      const data = await response.json();
      alert(`배포 완료! 배포된 사이트: ${data.url}`);
    } catch (error) {
      console.error("배포 중 오류 발생:", error);
      alert("배포에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="mb-6">
        <Image
          src="/notiondrop.png"
          alt="notiondrop logo"
          width={800}
          height={400}
        />
      </div>
      <DeployModeSelector
        deployMode={deployMode}
        setDeployMode={setDeployMode}
      />
      <InputArea
        deployMode={deployMode}
        url={url}
        setUrl={setUrl}
        customContent={customContent}
        setCustomContent={setCustomContent}
        handleFetch={handleFetch}
      />
      {previewMode && (
        <div className="flex flex-col items-center p-4 w-full">
          {deployMode === "url" && pageId ? (
            <NotionPageRenderer notionPageId={pageId} />
          ) : (
            <div className="markdown-content p-4 bg-white border rounded w-full max-w-xl">
              <ReactMarkdown>{customContent}</ReactMarkdown>
            </div>
          )}
          <div>
            <div className="flex mt-4 w-full max-w-md">
              <input
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                placeholder="custom domain"
                className="border rounded w-full text-xs mr-2"
              />
              <span>.notiondrop.site</span>
            </div>
            <button onClick={handleDeploy} className="bg-green-500 text-white p-2 rounded hover:bg-green-600 w-full mt-4">
              Deploy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
