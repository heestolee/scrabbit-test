"use client";

import React, { useEffect } from "react";
import { Box, Center } from "@chakra-ui/react";

export default function DeployPreviewRenderer({
  deployMode,
  selectedBlocksHtml,
}) {

  return (
    <Center
      display="flex"
      h="40rem"
      w="full"
      alignItems="center"
      justifyContent="center"
      bg="gray.300"
    >
      <Box
        bg="white"
        p={4}
        w="90%"
        flexDirection="column"
        height="80%"
        overflowY="scroll"
        sx={{
          "&::-webkit-scrollbar": {
            width: "0.625rem",
            padding: "0.625rem",
            margin: "0.625rem",
          },
          "&::-webkit-scrollbar-track": {
            background: "var(--chakra-colors-gray-400)",
            borderRadius: "0.625rem",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "var(--chakra-colors-gray-500)",
            borderRadius: "0.625rem",
          },
        }}
        style={{ zoom: 0.6 }}
      >
        {selectedBlocksHtml && selectedBlocksHtml.length > 0 ? (
          selectedBlocksHtml
            .sort((a, b) => a.order - b.order)
            .map((block, order) => (
              <Box
                key={order}
                dangerouslySetInnerHTML={{ __html: block.html }}
                h="max-content"
              />
            ))
        ) : deployMode === "full" ? (
          <Center>전체배포 모드입니다.</Center>
        ) : (
          <Center>부분배포 모드입니다.</Center>
        )}
      </Box>
    </Center>
  );
}
