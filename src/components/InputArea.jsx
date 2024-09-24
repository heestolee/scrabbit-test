import React from "react";
import { Box, Input, Button } from "@chakra-ui/react";

export default function InputArea({ url, setUrl, handleFetch, isLoading }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4} w="100%" maxW="md">
      <Input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter Notion page URL"
      />
      <Button
        onClick={handleFetch}
        colorScheme="blue"
        width="full"
        mt={4}
        isLoading={isLoading}
      >
        Get Notion Data
      </Button>
    </Box>
  );
}
