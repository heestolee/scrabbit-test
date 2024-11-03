"use client";

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { Box } from "@chakra-ui/react";

export default function NotionPageRenderer({
  snapshotHtml,
  deployMode,
  selectedBlocks,
  handleSelectBlock,
  setSelectedBlocksHtml,
}) {
  const pageRef = useRef(null);

  useEffect(() => {
    if (deployMode === "partial") {
      const style = document.createElement("style");
      style.innerHTML = PSEUDO_ELEMENTS_STYLE;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, [deployMode]);

  const selectedBlocksHtml = useMemo(() => {
    if (deployMode !== "partial") return [];

    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(snapshotHtml, "text/html");
    const blockElements = parsedHtml.querySelectorAll(".notion-page-content > *");

    return Array.from(blockElements).map((block, index) => ({
      id: block.getAttribute("data-block-id"),
      order: index,
      html: block.outerHTML,
    }));
  }, [snapshotHtml, deployMode]);

  const handleBlockClick = useCallback(
    (event) => {
      event.preventDefault();
      const blockElement = event.currentTarget;
      const closestTopBlock = blockElement.closest(".notion-page-content > *");
      const topBlockId = closestTopBlock?.getAttribute("data-block-id");
      const blockOrder = [...closestTopBlock.parentElement.children].indexOf(
        closestTopBlock,
      );

      if (deployMode === "partial" && topBlockId) {

        closestTopBlock.style.outline = "none";
        closestTopBlock.style.cursor = "none";

        handleSelectBlock(topBlockId);
        setSelectedBlocksHtml((prev) => {
          if (prev.some((block) => block.id === topBlockId)) {
            return prev.filter((block) => block.id !== topBlockId);
          }
          return [
            ...prev,
            {
              id: topBlockId,
              order: blockOrder,
              html: closestTopBlock.outerHTML,
            },
          ];
        });
      }
    },
    [handleSelectBlock, deployMode, setSelectedBlocksHtml],
  );

  useEffect(() => {
    if (deployMode !== "partial") return;
    const blockElements = document.querySelectorAll(".notion-page-content > *");
    blockElements.forEach((block) => {
      const topBlockId = block.getAttribute("data-block-id");

      block.addEventListener("click", handleBlockClick);

      if (selectedBlocks[topBlockId]) {
        block.style.outline = "2px solid #62aaff";
      } else {
        block.style.outline = "none";
        block.style.backgroundColor = "white";
      }

      block.addEventListener("mouseenter", () => {
        if (!selectedBlocks[topBlockId]) {
          block.style.outline = "1px dashed lightgray";
          block.style.cursor = "pointer";
        }
      });

      block.addEventListener("mouseleave", () => {
        if (!selectedBlocks[topBlockId]) {
          block.style.outline = "none";
        }
      });
    });

    return () => {
      blockElements.forEach((block) => {
        block.removeEventListener("click", handleBlockClick);
      });
    };
  }, [selectedBlocks, handleBlockClick, deployMode]);

  if (!snapshotHtml) return <div>No data available.</div>;

  return (
    <Box h="45rem" p={4} textAlign="left" ref={pageRef}>
      {deployMode === "partial" ? (
        selectedBlocksHtml.map((block) => (
            <Box
              key={block.id}
              data-block-id={block.id}
              dangerouslySetInnerHTML={{ __html: block.html }}
              onClick={(e) =>
                handleBlockClick(e, block.id, block.order, block.html)
              }
            />
          ))
      ) : (
      <Box dangerouslySetInnerHTML={{ __html: snapshotHtml }} />
      )}
    </Box>
  );
}
