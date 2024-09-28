"use client";

import React from "react";
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
      >
        {selectedBlocksHtml && selectedBlocksHtml.length > 0 ? (
          selectedBlocksHtml.map((blockHtml, index) => (
            <Box
              key={index}
              dangerouslySetInnerHTML={{ __html: blockHtml }}
              borderColor="none"
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
