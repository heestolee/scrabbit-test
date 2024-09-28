"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box } from "@chakra-ui/react";

export default function NotionPageRenderer({
  notionPageId,
  deployMode,
  onSnapshotReady,
  selectedBlocks,
  handleSelectBlock,
  setSelectedBlocksHtml,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const snapshotHtmlRef = useRef(null);
  const pageRef = useRef(null);

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
      snapshotHtmlRef.current = data.snapshotHtml;
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

  const handleBlockClick = useCallback(
    (blockId, event) => {
      event.preventDefault();
      if (deployMode === "partial") {
        handleSelectBlock(blockId);

        const blockElement = document.querySelector(
          `[data-block-id="${blockId}"]`,
        );

        if (blockElement) {
          const cleanBlock = blockElement.cloneNode(true);

          cleanBlock.style.zoom = "0.7";

          setSelectedBlocksHtml((prev) => {
            if (selectedBlocks[blockId]) {
              return prev.filter((block) => !block.includes(blockId));
            } else {
              const updatedBlocks = prev.filter(
                (block) => !block.includes(blockId),
              );
              return [...updatedBlocks, cleanBlock.outerHTML];
            }
          });
        }
      }
    },
    [handleSelectBlock, deployMode, selectedBlocks, setSelectedBlocksHtml],
  );

  useEffect(() => {
    if (deployMode !== "partial") return;

    const blockElements = document.querySelectorAll("[data-block-id]");

    blockElements.forEach((block) => {
      const blockId = block.getAttribute("data-block-id");

      block.addEventListener("click", (e) => handleBlockClick(blockId, e));

      if (selectedBlocks[blockId]) {
        block.style.border = "2px solid blue";
        block.style.backgroundColor = "blue.50";
      } else {
        block.style.border = "none";
        block.style.backgroundColor = "white";
      }

      block.addEventListener("mouseenter", () => {
        if (!selectedBlocks[blockId]) {
          block.style.border = "1px dashed lightgray";
        }
      });

      block.addEventListener("mouseleave", () => {
        if (!selectedBlocks[blockId]) {
          block.style.border = "none";
        }
      });
    });

    return () => {
      blockElements.forEach((block) => {
        block.removeEventListener("click", (e) => handleBlockClick(block, e));
      });
    };
  }, [selectedBlocks, handleBlockClick, deployMode]);

  if (isLoading) return null;
  if (!snapshotHtmlRef.current) return <div>No data available.</div>;

  return (
    <Box
      h="100%"
      overflowY="hidden"
      textAlign="left"
      ref={pageRef}
    >
      <div dangerouslySetInnerHTML={{ __html: snapshotHtmlRef.current }} />
    </Box>
  );
}
