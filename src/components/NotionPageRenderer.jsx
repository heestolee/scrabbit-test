"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

export default function NotionPageRenderer({
  notionPageId,
  deployMode,
  onSnapshotReady,
  selectedBlocks,
  handleSelectBlock,
}) {
  const [snapshotHtml, setSnapshotHtml] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchPreviewContent(pageId) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/puppeteer-preview-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notionUrl: `https://www.notion.so/${pageId}` }),
      });
      if (!response.ok) throw new Error("노션 페이지 페칭 실패");
      const data = await response.json();
      setSnapshotHtml(data.snapshotHtml);
      onSnapshotReady();
    } catch (error) {
      console.error("노션 페이지 페칭 에러:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (notionPageId) fetchPreviewContent(notionPageId);
  }, [notionPageId]);

  if (isLoading) return null;
  if (!snapshotHtml) return <div>No data available.</div>;

  const blocks =
    snapshotHtml?.match(/<div[^>]*data-block-id[^>]*>.*?<\/div>/g) || [];
  return (
    <Box maxW="80%" mx="auto" p={8} bg="white" textAlign="left">
      {deployMode === "partial" ? (
        <>
          {blocks.length > 0 ? (
            blocks.map((blockHtml) => {
              const blockId = blockHtml.match(/data-block-id="([^"]+)"/)[1];
              return (
                <Box
                  key={blockId}
                  onClick={() => handleSelectBlock(blockId)}
                  bg={selectedBlocks[blockId] ? "blue.50" : "white"}
                  border={selectedBlocks[blockId] ? "2px solid blue" : "none"}
                  p={4}
                  mb={4}
                  cursor="pointer"
                  dangerouslySetInnerHTML={{ __html: blockHtml }}
                />
              );
            })
          ) : (
            <Box>No blocks found.</Box>
          )}
        </>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: snapshotHtml }} />
      )}
    </Box>
  );
}
