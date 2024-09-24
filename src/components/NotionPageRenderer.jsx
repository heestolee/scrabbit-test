"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

export default function NotionPageRenderer({ notionPageId }) {
  const [recordMap, setRecordMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPageContent = async (pageId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/notion/${pageId}`);
      if (!response.ok) throw new Error('노션 페이지 페칭 실패');
      const data = await response.json();
      setRecordMap(data.recordMap);
    } catch (error) {
      console.error("노션 페이지 페칭 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (notionPageId) fetchPageContent(notionPageId);
  }, [notionPageId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!recordMap) {
    return <div>노션 데이터 가져오기 실패</div>;
  }

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
