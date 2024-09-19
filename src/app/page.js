"use client";

import Image from "next/image";
import React, { useState } from "react";
import DeployModeSelector from "@/components/DeployModeSelector";
import InputArea from "@/components/InputArea";

export default function Home() {
  const [deployMode, setDeployMode] = useState("url");
  const [url, setUrl] = useState("");
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
    </div>
  );
}
